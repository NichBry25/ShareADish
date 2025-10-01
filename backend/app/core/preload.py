from core.config import settings
import json

foundation_data = None
srlegacy_data = None

def load_json(path):
    with open(path,'r',encoding='utf-8') as f:
        return json.load(f)


def preload():
    global foundation_data, srlegacy_data
    
    foundation_data=load_json(settings.FOUNDATIONAL_PATH)
    srlegacy_data=load_json(settings.SRLEGACY_PATH)

    print('preloaded')