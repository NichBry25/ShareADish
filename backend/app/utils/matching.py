from typing import List
from rapidfuzz import fuzz, process
from ..core.preload import preload
from .normalize import normalize

'''
example AI output:

{
    "prompt": [], 
    "title": "garlic and herb roasted cauliflower", 
    "ingredients": [
        "2 tablespoons olive oil", 
        "1 large cauliflower, cut into florets", 
        "2 teaspoons minced garlic", 
        "\u00bd teaspoon salt", 
        "\u00bd teaspoon dried herbs", 
        "\u00bc cup water"
    ], 
    "method": [
        "preheat oven to 220c\u00b0. in a large bowl, toss cauliflower florets with olive oil, minced garlic, salt, and dried herbs.", 
        "spread the cauliflower in a single layer on a baking sheet and roast for 25 minutes, stirring halfway through.", 
        "drizzle with water and roast for an additional 5 minutes."
        ]
}
'''

unit_map = {
    # Volume
    "teaspoon": 5,
    "teaspoons": 5,
    "tsp": 5,

    "tablespoon": 15,
    "tablespoons": 15,
    "tbsp": 15,
    "tblsp": 15,

    "cup": 240, 
    "cups": 240,

    "fluid ounce": 30,
    "fluid ounces": 30,
    "fl oz": 30,

    "pint": 473,
    "pints": 473,

    "quart": 946,
    "quarts": 946,

    "gallon": 3785,
    "gallons": 3785,

    "liter": 1000,
    "liters": 1000,
    "l": 1000,

    "milliliter": 1,
    "milliliters": 1,
    "ml": 1,

    # Weight
    "gram": 1,
    "grams": 1,
    "g": 1,

    "kilogram": 1000,
    "kilograms": 1000,
    "kg": 1000,

    "ounce": 28.35,
    "ounces": 28.35,
    "oz": 28.35,

    "pound": 453.6,
    "pounds": 453.6,
    "lb": 453.6,
    "lbs": 453.6,

    # Misc
    "pinch": 0.36,    
    "dash": 0.6,      
    "drop": 0.05,     
    "clove": 3,       
    "slice": 15,      
    "piece": 30       
}


AMBIGUOUS_MAP = { # To remove ambigiouty
    "chicken": "chicken breast boneless skinless raw",
    "beef": "beef ground 75% lean raw / 25% fat raw",
    "pork": "pork ground raw",
    "mushroom": "mushrooms white raw",
    "onion": "onions raw",                              
    "potato": "potato russet raw",                      
    "pepper": "spices pepper black",
    "salt": "salt table",
    "milk": "milk whole",
    "cheese": "cheddar cheese",
    "butter": "butter salted",
    "rice": "rice white long-grain raw",
    "oats": "rolled oats raw",
    "oil": "oil vegetable"
}


def get_result(data,ingredient):
    choices = [entry['description'] for entry in data]
    
    matches = process.extract(
        ingredient,
        choices,
        scorer=fuzz.token_sort_ratio,
        limit=20
    )
    results = []
    for _, score, idx in matches:
        results.append({
            "match": data[idx],
            "score": score
        })
    return results
    
def search_ingredients(ingredient):
    ingredient = normalize(ingredient)
    for amb_word, _ in AMBIGUOUS_MAP.items():
        if fuzz.WRatio(ingredient,amb_word) > 70:
            ingredient = AMBIGUOUS_MAP[amb_word]


    results = []
    results.extend(get_result(foundation_data,ingredient))

    if not results or results[0]["score"] < 85:
        # Will prioritize getting results from foundational data first (most of it is raw ingredients) before legacy data (everything else)
        results.extend(get_result(legacy_data, ingredient))

    return sorted(results, key=lambda x: x["score"], reverse=True)[:20]
    

def extract_amount(ingredients: str):
    '''
    used to strip the amount and the ingredients itself, to be passed to match ingredients

    eg:
    extract_amount('2 tablespoons olive oil') -> (15,'olive oil') // 15 grams
    '''
    pass

def match_ingredients(ingredients_list: List[str]):
    '''
    uses extract_amount on each ingredients, and fuzzy matches the ingredients
    '''
    amount_ing = []
    for i in ingredients_list:
        amount_ing.append(extract_amount(i))

    for a,i in amount_ing:
        search_ingredients(i)
        pass


if __name__ == '__main__':
    preload(load_data=True)
    from ..core.preload import legacy_data, foundation_data # idfk, reload the variable, will probably cause me more problem down the line

    match = search_ingredients('pork')

    pork_match = match[0]['match']
    print("Description:", pork_match['description'])
    for nutrient in pork_match.get("foodNutrients", []):
        n = nutrient["nutrient"]
        print(f"{n['name']}: {nutrient.get('amount')} {n['unitName']}")

    

    


    
    
    
