import json

with open('documents/hp.json', 'r') as file:
    data = json.load(file)

# Iterate over all graphs
for i, graph in enumerate(data["graphs"]):
    print(f"Graph {i+1}:")
    nodes = graph.get("nodes", [])
    for entry in nodes:
        if isinstance(entry, dict) and "id" in entry and "lbl" in entry:
            hp_value = entry["id"].split("/")[-1]
            label = entry["lbl"]
            print(f"  {hp_value}: {label}")
