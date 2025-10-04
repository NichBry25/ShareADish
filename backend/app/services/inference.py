from ..core.preload import preload
from ..core.instructions import instructions, edit_instructions
from ..utils.matching import match_ingredients
import json
from typing import Dict, Any


preload(load_data=True)


def parse_output(ai_output: str) -> Dict[str, Any]:
    try:
        output = json.loads(str(ai_output))
        if('error' in output.keys()):
            return output
        ingredients_nutrients=match_ingredients(output['ingredients'])
        output['ingredients']=ingredients_nutrients
        return output
    except Exception as e:
        return {'error': str(e)}

def generate(prompt:str):
    from ..core.preload import openai_client
    response = openai_client.responses.create(
        instructions=instructions,
        model="gpt-4o-mini",
        input=prompt
    )

    return parse_output(response.output_text)


def ai_edit(prompt:str):
    from ..core.preload import openai_client
    '''
    prompt should already be in the form of:
    {
        "original_recipe":json,
        "user_request":str
    }
    '''
    response = openai_client.responses.create(
        instructions=edit_instructions,
        model="gpt-4o-mini",
        input=prompt
    )

    return parse_output(response.output_text)



if __name__ == "__main__":
    print()
    print(json.dumps(generate("chicken, quick, healthy, simple, dinner, grains, veggies"),indent=4))

    test_edit='''{
        "original_recipe": {
            "prompt": ["butternut squash", "puree", "simple", "healthy"],
            "ingredients": [
            "1 butternut squash, about 850g",
            "2 tablespoons olive oil",
            "1/4 teaspoon salt"
            ],
            "method": [
            "Preheat the oven to 200°C.",
            "Peel the butternut squash, remove the seeds, and cut it into 2 cm chunks.",
            "Toss the squash in 1 tablespoon of olive oil and 1/4 teaspoon of salt.",
            "Spread the squash on a baking sheet and roast for 30 minutes.",
            "Remove the squash from the oven and let it cool.",
            "Puree the cooled squash in a food processor or blender until smooth.",
            "Serve immediately or refrigerate for up to 3 days."
            ]
        },
        "user_request": "Make this vegan and add some spices for flavor."
    }'''
    print()
    print()
    print(json.dumps(ai_edit(test_edit),indent=4))