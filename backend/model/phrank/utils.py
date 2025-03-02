from collections import defaultdict
import json

def load_maps(human_phenotype_map_file):
    """
    Load HPO DAG from hp.json file.
    Returns:
        child_to_parent: dict mapping child HPO ID to list of parent HPO IDs
        parent_to_children: dict mapping parent HPO ID to list of child HPO IDs
    """
    child_to_parent = defaultdict(list)
    parent_to_children = defaultdict(list)
    
    with open(human_phenotype_map_file, 'r') as f:
        data = json.load(f)
    
    graphs = data.get("graphs", [])
    if not graphs:
        raise ValueError("No graphs found in hp.json")
    
    nodes = {n["id"]: n for n in graphs[0].get("nodes", [])}
    edges = graphs[0].get("edges", [])
    
    def normalize_id(url_id):
        return url_id.split('/')[-1].replace('_', ':')
    
    for edge in edges:
        if edge.get("pred") == "is_a":
            child_id = normalize_id(edge["sub"])
            parent_id = normalize_id(edge["obj"])
            child_to_parent[child_id].append(parent_id)
            parent_to_children[parent_id].append(child_id)
    
    return child_to_parent, parent_to_children

def load_term_hpo(term_to_hpo_file):
    term_hpo_file = open(term_to_hpo_file)
    term_pheno_map = defaultdict(list)
    for term_line in term_hpo_file:
        term_hpo_tokens = term_line.strip().split("\t")
        hpo = term_hpo_tokens[0]
        term = term_hpo_tokens[1]
        term_pheno_map[term].append(hpo)
    term_hpo_file.close()
    return term_pheno_map

def closure(phenos, child_to_parent):
    all_ancestors = set([])
    for pheno in phenos:
        all_ancestors = all_ancestors | set(get_all_ancestors(pheno, child_to_parent)) | set([pheno])
    return all_ancestors

def get_all_ancestors(hpo_term, child_to_parent_map):
    ancestors = []
    term = hpo_term
    parents = child_to_parent_map.get(term, [])[:]
    while parents:
        parent = parents.pop()
        ancestors.append(parent)
        parents = parents + child_to_parent_map.get(parent, [])
    return ancestors

def compute_gene_disease_pheno_map(disease_gene_map, disease_pheno_map):
    gene_pheno_map = defaultdict(set)    
    for disease, genes in disease_gene_map.items():
        phenos = disease_pheno_map.get(disease, set())  # Default to empty set if None
        if phenos is not None:  # Additional safety check
            for gene in genes:
                for pheno in phenos:
                    gene_pheno_map[gene].add(pheno)
    return gene_pheno_map

def load_disease_gene(disease_to_gene_filename):
    disease_to_gene = defaultdict(set)
    f = open(disease_to_gene_filename)
    for line in f:
        tokens = line.strip().split("\t")
        gene = tokens[0]
        disease = tokens[1]
        disease_to_gene[disease].add(gene)
    return disease_to_gene

def load_gene_symbol_map(GENE_TO_SYMBOL):
    gene_to_symbol_map = {}
    f = open(GENE_TO_SYMBOL)
    for line in f:
        gene_data = line.strip().split("\t")
        gene_to_symbol_map[gene_data[0]] = gene_data[1]
    return gene_to_symbol_map