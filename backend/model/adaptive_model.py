import random
from typing import Optional, List, Dict, Tuple
from model.data_loader import load_hp_json, load_phenotype_hpoa, load_phenotype_to_genes, load_genes_to_disease

class AdaptiveQuestioningModel:
    def __init__(self):
        # Load data files from the data/ folder.
        self.hp_map = load_hp_json("data/hp.json")  # Mapping: HPO id -> {label, synonyms, definition}
        self.disease_to_hpo, self.disease_to_name = load_phenotype_hpoa("data/phenotype.hpoa")
        self.hpo_to_gene_info = load_phenotype_to_genes("data/phenotype_to_genes.txt")
        self.gene_to_disease = load_genes_to_disease("data/genes_to_disease.txt")
        
        # Build a question pool from all HPO terms mentioned in disease annotations.
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
                
    def initialize_state(self, sex: str, age: int, initial_symptoms: List[str]) -> dict:
        """
        Create a user state from the provided sex, age, and initial symptoms.
        Attempts to match textual symptoms to HPO terms (if the symptom is a substring of the HPO label).
        """
        user_state = {
            "sex": sex,
            "age": age,
            "answered_questions": {},       # hpo_id -> answer ("yes"/"no"/"unknown")
            "remaining_questions": list(self.questions_pool.keys()),
            "disease_prob": {dz: 1.0 / len(self.disease_to_hpo) for dz in self.disease_to_hpo},
            "max_questions": 40,
            "question_count": 0,
            "confidence_threshold": 0.9
        }
        # Process initial symptoms: try to map each provided symptom to an HPO term by checking the label.
        for symptom in initial_symptoms:
            for hpo_id, info in self.hp_map.items():
                if symptom.lower() in info["label"].lower():
                    if hpo_id in user_state["remaining_questions"]:
                        user_state["answered_questions"][hpo_id] = "yes"
                        user_state["remaining_questions"].remove(hpo_id)
        self._update_disease_probabilities(user_state)
        return user_state
    
    def get_next_question(self, user_state: dict) -> Tuple[Optional[str], Optional[str]]:
        remaining = user_state["remaining_questions"]
        if not remaining:
            return None, None
        # For demo purposes, select a random question.
        question_id = random.choice(remaining)
        user_state["remaining_questions"].remove(question_id)
        question_text = self.questions_pool[question_id]
        return question_id, question_text

    def process_answer(self, user_state: dict, question_id: str, answer: str) -> Tuple[bool, List[str]]:
        user_state["answered_questions"][question_id] = answer
        user_state["question_count"] += 1
        self._update_disease_probabilities(user_state)
        done = self._check_if_done(user_state)
        if done:
            top_diseases = self.get_current_top_diseases(user_state)
            return True, top_diseases
        else:
            return False, []

    def _update_disease_probabilities(self, user_state: dict):
        answers = user_state["answered_questions"]
        probs = user_state["disease_prob"]
        # A simplistic likelihood model: multiply probabilities for each answer.
        for dz, hpo_set in self.disease_to_hpo.items():
            likelihood = 1.0
            for (hpo_id, ans) in answers.items():
                if ans == "yes":
                    likelihood *= 0.8 if hpo_id in hpo_set else 0.2
                elif ans == "no":
                    likelihood *= 0.2 if hpo_id in hpo_set else 0.8
                # For "unknown", we do not update the likelihood.
            probs[dz] = likelihood
        # Normalize probabilities.
        total = sum(probs.values())
        if total > 0:
            for dz in probs:
                probs[dz] /= total
        else:
            n = len(probs)
            for dz in probs:
                probs[dz] = 1.0 / n

    def _check_if_done(self, user_state: dict) -> bool:
        if user_state["question_count"] >= user_state["max_questions"]:
            return True
        for p in user_state["disease_prob"].values():
            if p >= user_state["confidence_threshold"]:
                return True
        return False

    def get_current_top_diseases(self, user_state: dict, top_k: int = 5) -> List[str]:
        sorted_dz = sorted(user_state["disease_prob"].items(), key=lambda x: x[1], reverse=True)
        return [self.disease_to_name[dz] for dz, _ in sorted_dz[:top_k]]
