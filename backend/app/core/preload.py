from .config import settings
from ..utils.normalize import normalize
import json

foundation_data = []
legacy_data = []

def load_json(path):
    with open(path,'r',encoding='utf-8') as f:
        return json.load(f)


def preload(load_data=False):
    global foundation_data,legacy_data
    if(load_data):
        # Normalize each food description
        foundation_data = load_json(settings.FOUNDATIONAL_PATH)['FoundationFoods']
        legacy_data = load_json(settings.SRLEGACY_PATH)["SRLegacyFoods"]
        for entry in foundation_data:
            entry["description"] = normalize(entry["description"])
        for entry in legacy_data:
            entry["description"] = normalize(entry["description"])

    print('preloaded')

