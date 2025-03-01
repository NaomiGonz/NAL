import json
import csv

def load_phenotype_hpoa(filepath: str):
    """
    Loads the phenotype.hpoa file.
    Returns:
        disease_to_hpo: dict mapping disease_id -> set of hpo_ids
        disease_to_name: dict mapping disease_id -> disease_name
    """
    disease_to_hpo = {}
    disease_to_name = {}
    with open(filepath, 'r') as f:
        reader = csv.reader(f, delimiter='\t')
        header = None
        for row in reader:
            # skip comment lines
            if row[0].startswith('#'):
                continue
            if not header:
                header = row
                continue
            # Expected columns (at least): 
            # database_id, disease_name, qualifier, hpo_id, reference, evidence, onset, frequency, sex, modifier, aspect, biocuration
            disease_id = row[0].strip()
            disease_name = row[1].strip()
            hpo_id = row[3].strip()
            if disease_id not in disease_to_hpo:
                disease_to_hpo[disease_id] = set()
                disease_to_name[disease_id] = disease_name
            disease_to_hpo[disease_id].add(hpo_id)
    return disease_to_hpo, disease_to_name

def load_phenotype_to_genes(filepath: str):
    """
    Loads the phenotype_to_genes.txt file.
    Returns:
        hpo_to_gene_info: dict mapping hpo_id -> list of tuples (ncbi_gene_id, gene_symbol, disease_id)
    """
    hpo_to_gene_info = {}
    with open(filepath, 'r') as f:
        reader = csv.DictReader(f, delimiter='\t')
        for row in reader:
            hpo_id = row['hpo_id'].strip()
            ncbi_gene_id = row['ncbi_gene_id'].strip()
            gene_symbol = row['gene_symbol'].strip()
            disease_id = row['disease_id'].strip()
            if hpo_id not in hpo_to_gene_info:
                hpo_to_gene_info[hpo_id] = []
            hpo_to_gene_info[hpo_id].append((ncbi_gene_id, gene_symbol, disease_id))
    return hpo_to_gene_info

def load_genes_to_disease(filepath: str):
    """
    Loads the genes_to_disease.txt file.
    Returns:
        gene_to_diseases: dict mapping gene_symbol -> list of dictionaries with disease_id, association_type, and source.
    """
    gene_to_diseases = {}
    with open(filepath, 'r') as f:
        reader = csv.DictReader(f, delimiter='\t')
        for row in reader:
            gene_symbol = row['gene_symbol'].strip()
            disease_id = row['disease_id'].strip()
            association_type = row['association_type'].strip()
            source = row['source'].strip()
            if gene_symbol not in gene_to_diseases:
                gene_to_diseases[gene_symbol] = []
            gene_to_diseases[gene_symbol].append({
                'disease_id': disease_id,
                'association_type': association_type,
                'source': source
            })
    return gene_to_diseases

def load_hp_json(filepath: str):
    """
    Loads the hp.json file from HPO.
    Returns:
        hp_mapping: dict mapping HPO ID (e.g., 'HP:0000001') to a dictionary with:
            - label: term label
            - synonyms: list of synonyms (if any)
            - definition: definition (if any)
    """
    with open(filepath, 'r') as f:
        data = json.load(f)
    hp_mapping = {}
    graphs = data.get("graphs", [])
    if graphs:
        nodes = graphs[0].get("nodes", [])
        for node in nodes:
            node_id_url = node.get("id", "")
            if node_id_url:
                # Convert URL "http://purl.obolibrary.org/obo/HP_0000001" to "HP:0000001"
                parts = node_id_url.split('/')
                last_part = parts[-1]
                hpo_id = last_part.replace('_', ':')
                label = node.get("lbl", "")
                synonyms = []
                if "meta" in node and "synonyms" in node["meta"]:
                    synonyms = [syn.get("val", "") for syn in node["meta"]["synonyms"] if "val" in syn]
                definition = ""
                if "meta" in node and "definition" in node["meta"]:
                    definition = node["meta"]["definition"].get("val", "")
                hp_mapping[hpo_id] = {
                    "label": label,
                    "synonyms": synonyms,
                    "definition": definition
                }
    return hp_mapping
