from ..core.preload import preload
from ..core.instructions import instructions, edit_instructions
from ..utils.matching import match_ingredients
import json
from typing import Dict, Any
from openai import RateLimitError

def parse_output(ai_output: str) -> Dict[str, Any]:
    try:
        output = json.loads(ai_output)
        print(output)
        print(type(output['ingredients']))
        if('error' in output.keys()):
            return output
        ingredients_nutrients=match_ingredients(output['ingredients'])
        output['nutrients']=ingredients_nutrients
        return output
    except Exception as e:
        return {'error': str(e)}

def generate(prompt:str):
    from ..core.preload import openai_client
    try:
        response = openai_client.responses.create(
            instructions=instructions,
            model="gpt-4o-mini",
            input=prompt
        )
    except RateLimitError as e:
        return { 'error': 'rate limited'}

    return parse_output(response.output_text)


def ai_edit(recipe: Dict, prompt:str):
    '''
    prompt should already be in the form of:
    {
        "original_recipe":json,
        "user_request":str
    }
    '''
    
    from ..core.preload import openai_client

    # Clean ingredients, remove nutrients
    try:
        ing_list=[]
        prompt_dict = {
            'original_recipe':None,
            'prompt':prompt
        }

        for ingredient in recipe['ingredients']:
            ing_list.append(ingredient)
        recipe['ingredients'] = ing_list
        prompt_dict['original_recipe'] = recipe

        prompt = json.dumps(prompt_dict, indent=4)
        response = openai_client.responses.create(
            instructions=edit_instructions,
            model="gpt-4o-mini",
            input=prompt
        )
        return parse_output(response.output_text)
    except Exception as e:
        print(e)
        raise e

    



if __name__ == "__main__":
    print()
    print(json.dumps(generate(prompt="chicken, quick, healthy, simple, dinner, grains, veggies"),indent=4))

    test_edit='''{
        "original_recipe": {
            "prompt": ["butternut squash", "puree", "simple", "healthy"],
            "ingredients": [
                {
                    "name": "1 butternut squash, about 850g",
                    "nutrients": {
                        "Protein": 0,
                        "Carbs": 0,
                        "Fiber": 0,
                        "Energy": 0,
                        "Unit_name": {
                            "Protein": "",
                            "Carbs": "",
                            "Fiber": "",
                            "Energy": ""
                        }
                    }
                },
                {
                    "name": "2 tablespoons olive oil",
                    "nutrients": {
                        "Protein": 0,
                        "Carbs": 0,
                        "Fiber": 0,
                        "Energy": 0,
                        "Unit_name": {
                            "Protein": "",
                            "Carbs": "",
                            "Fiber": "",
                            "Energy": ""
                        }
                    }
                },
                {
                    "name": "1/4 teaspoon salt",
                    "nutrients": {
                        "Protein": 0,
                        "Carbs": 0,
                        "Fiber": 0,
                        "Energy": 0,
                        "Unit_name": {
                            "Protein": "",
                            "Carbs": "",
                            "Fiber": "",
                            "Energy": ""
                        }
                    }
                }
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
    # print(json.dumps(ai_edit(test_edit),indent=4))