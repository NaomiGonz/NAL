import random
from typing import Optional, List, Dict, Tuple, Set
from model.data_loader import (
    load_hp_json,
    load_phenotype_hpoa,
    load_phenotype_to_genes,
    load_genes_to_disease
)
from model.phrank.__init__ import Phrank
from model.phrank.utils import compute_gene_disease_pheno_map

class AdaptiveQuestioningModel:
    def __init__(self):
        # Load existing data
        self.hp_map = load_hp_json("data/hp.json")  # HPO terms with labels and definitions
        self.disease_to_hpo, self.disease_to_name = load_phenotype_hpoa("data/phenotype.hpoa")
        self.hpo_to_gene_info = load_phenotype_to_genes("data/phenotype_to_genes.txt")
        self.gene_to_disease = load_genes_to_disease("data/genes_to_disease.txt")
        
        # Prepare questions pool
        self.questions_pool = {}
        all_hpo_ids = set()
        for hpo_set in self.disease_to_hpo.values():
            all_hpo_ids.update(hpo_set)
        for hpo_id in all_hpo_ids:
            if hpo_id in self.hp_map:
                label = self.hp_map[hpo_id]["label"]
                self.questions_pool[hpo_id] = f"Does the patient have {label.lower()}?"
            else:
                self.questions_pool[hpo_id] = f"Does the patient have {hpo_id}?"
        
        # Prepare data for Phrank
        # Build disease-to-gene map from gene_to_disease
        disease_gene_map = {}
        for gene, diseases in self.gene_to_disease.items():
            for disease_info in diseases:
                disease_id = disease_info["disease_id"]
                if disease_id not in disease_gene_map:
                    disease_gene_map[disease_id] = set()
                disease_gene_map[disease_id].add(gene)
        
        # Convert disease_to_hpo to set format and ensure all diseases are in both maps
        disease_pheno_map = {}
        for disease, hpos in self.disease_to_hpo.items():
            disease_pheno_map[disease] = set(hpos)
        
        # Ensure all diseases from disease_pheno_map are in disease_gene_map (default to empty set)
        for disease in disease_pheno_map:
            if disease not in disease_gene_map:
                disease_gene_map[disease] = set()
        # Also ensure all diseases from disease_gene_map are in disease_pheno_map
        for disease in disease_gene_map:
            if disease not in disease_pheno_map:
                disease_pheno_map[disease] = set()
        
        # Initialize Phrank with hp.json
        self.phrank = Phrank(
            dagfile="data/hp.json",  # Using JSON for HPO ontology
            diseaseannotationsfile=None,  # Using our own mappings
            diseasegenefile=None,  # Using our own mappings
            geneannotationsfile=None  # Not using direct gene annotations
        )
        self.phrank._disease_pheno_map = disease_pheno_map
        self.phrank._disease_gene_map = disease_gene_map
        self.phrank._gene_pheno_map = compute_gene_disease_pheno_map(
            disease_gene_map, disease_pheno_map
        )
        self.phrank._IC, self.phrank._marginal_IC = Phrank.compute_information_content(
            self.phrank._gene_pheno_map, self.phrank._child_to_parent
        )
        self.phrank._gene_and_disease = True

    def initialize_state(
        self,
        sex: str,
        age: int,
        initial_symptoms: List[str],
        previous_diagnosis: str = ""
    ) -> dict:
        user_state = {
            "sex": sex,
            "age": age,
            "answered_questions": {},  # hpo_id -> "yes"/"no"/"unknown"
            "remaining_questions": list(self.questions_pool.keys()),
            "patient_phenotypes": set(),  # HPO IDs from "yes" answers
            "patient_genes": set(),  # Genes inferred from HPO-to-gene mapping
            "max_questions": 40,
            "question_count": 0,
            "confidence_threshold": 0.9,
            "previous_diagnosis": previous_diagnosis,
        }
        # Map initial symptoms to HPO IDs
        for symptom in initial_symptoms:
            for hpo_id, info in self.hp_map.items():
                if symptom.lower() in info["label"].lower():
                    if hpo_id in user_state["remaining_questions"]:
                        user_state["answered_questions"][hpo_id] = "yes"
                        user_state["patient_phenotypes"].add(hpo_id)
                        user_state["remaining_questions"].remove(hpo_id)
                        # Infer genes
                        if hpo_id in self.hpo_to_gene_info:
                            for gene_info in self.hpo_to_gene_info[hpo_id]:
                                user_state["patient_genes"].add(gene_info[1])  # gene_symbol
        # Handle previous diagnosis
        if previous_diagnosis:
            for disease_id, disease_name in self.disease_to_name.items():
                if previous_diagnosis.lower() == disease_name.lower():
                    prev_dx_terms = self.disease_to_hpo.get(disease_id, set())
                    user_state["prev_dx_hpo"] = list(prev_dx_terms)
                    for hpo in prev_dx_terms:
                        if hpo not in user_state["answered_questions"] and hpo in user_state["remaining_questions"]:
                            user_state["patient_phenotypes"].add(hpo)
                            user_state["answered_questions"][hpo] = "yes"
                            user_state["remaining_questions"].remove(hpo)
                    break
        return user_state

    def get_next_question(self, user_state: dict) -> Tuple[Optional[str], Optional[str], Optional[str]]:
        remaining = user_state["remaining_questions"]
        if not remaining:
            return None, None, None
        
        # Use Phrank to select the most informative next question (random for now)
        question_id = random.choice(remaining)
        user_state["remaining_questions"].remove(question_id)
        
        question_text = self.questions_pool[question_id]
        definition_text = self.hp_map.get(question_id, {}).get("definition", "")
        
        return question_id, question_text, definition_text

    def process_answer(self, user_state: dict, question_id: str, answer: str) -> Tuple[bool, List[str]]:
        user_state["answered_questions"][question_id] = answer
        user_state["question_count"] += 1
        
        # Update patient phenotypes
        if answer == "yes":
            user_state["patient_phenotypes"].add(question_id)
            # Update patient genes
            if question_id in self.hpo_to_gene_info:
                for gene_info in self.hpo_to_gene_info[question_id]:
                    user_state["patient_genes"].add(gene_info[1])  # gene_symbol
        
        # Rank diseases using Phrank
        disease_scores = self.phrank.rank_diseases(
            patient_genes=user_state["patient_genes"],
            patient_phenotypes=user_state["patient_phenotypes"]
        )
        
        # Check if done
        done = self._check_if_done(user_state, disease_scores)
        if done:
            top_diseases = [self.disease_to_name[score[1]] for score in disease_scores[:5]]
            return True, top_diseases
        return False, []

    def _check_if_done(self, user_state: dict, disease_scores: List[Tuple[float, str]]) -> bool:
        if user_state["question_count"] >= user_state["max_questions"]:
            return True
        # Check if top disease score is significantly high
        if disease_scores and disease_scores[0][0] > 0:  # Phrank scores are non-negative
            max_possible_score = self.phrank.compute_maximal_match(user_state["patient_phenotypes"])
            if max_possible_score > 0 and (disease_scores[0][0] / max_possible_score) >= user_state["confidence_threshold"]:
                return True
        return False

    def get_current_top_diseases(self, user_state: dict, top_k: int = 5) -> List[str]:
        disease_scores = self.phrank.rank_diseases(
            patient_genes=user_state["patient_genes"],
            patient_phenotypes=user_state["patient_phenotypes"]
        )
        return [self.disease_to_name[score[1]] for score in disease_scores[:top_k]]