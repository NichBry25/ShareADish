from typing import List
from rapidfuzz import fuzz, process
from ..core.preload import preload
from .normalize import normalize
import re

UNIT_MAP = {
    "teaspoon": 5, "teaspoons": 5, "tsp": 5,

    "tablespoon": 15, "tablespoons": 15, "tbsp": 15, "tblsp": 15,

    "cup": 240, "cups": 240,

    "fluid ounce": 30, "fluid ounces": 30,"fl oz": 30,

    "pint": 473, "pints": 473,

    "quart": 946, "quarts": 946,

    "gallon": 3785, "gallons": 3785,

    "liter": 1000, "liters": 1000, "l": 1000,

    "milliliter": 1, "milliliters": 1, "ml": 1,

    "gram": 1, "grams": 1, "g": 1,

    "kilogram": 1000, "kilograms": 1000, "kg": 1000,

    "ounce": 28.35, "ounces": 28.35, "oz": 28.35,

    "pound": 453.6,"pounds": 453.6, "lb": 453.6, "lbs": 453.6,

    "pinch": 0.36, "dash": 0.6, "drop": 0.05, "clove": 3, "slice": 15, "piece": 30, "a": 100       
}


FRACTION_MAP = {
    "\u00BC": 0.25,   
    "\u00BD": 0.5,    
    "\u00BE": 0.75,   
    "\u2150": 1/7,    
    "\u2151": 1/9,    
    "\u2152": 0.1,    
    "\u2153": 1/3,    
    "\u2154": 2/3,    
    "\u2155": 0.2,    
    "\u2156": 0.4,    
    "\u2157": 0.6,    
    "\u2158": 0.8,    
    "\u2159": 1/6,    
    "\u215A": 5/6,    
    "\u215B": 0.125,  
    "\u215C": 0.375,  
    "\u215D": 0.625,  
    "\u215E": 0.875   
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
}

# Words that dont affect ingredient identity
NOISE_WORDS = [
    "small", "medium", "large", "extra-large",
    "chopped", "diced", "sliced", "minced", "crushed", "grated", "peeled", "ground", "shredded",
    "fresh", "frozen", 
    "optional", "whole",
    "drained", "rinsed", "beaten", "divided",
    "about", "around", "approximately",
    "for", "serving", "taste", "cut", "into", "pieces", "bite-sized",
    "and"
]

IGNORE_FOR_NUTRIENTS = [
    "salt",
    "black pepper",
    "water",
    "vegetable broth",
    "herbs",
    "spices",
    "garlic powder",
    "onion powder",
    "vinegar",
    'oil'
]

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
    
def extract_main_nutrients(amount,nutrients):
    return_val = {
        'protein': 0,
        'carbs': 0,
        'fiber': 0,
        'energy': 0,
    }

    if amount <= -1:
        return return_val

    if not nutrients:
        return return_val

    if "Protein" in nutrients:
        return_val['protein'] = round((nutrients["Protein"][0]/100) * amount,3)

    if "Carbohydrate, by difference" in nutrients:
        return_val['carbs'] = round((nutrients["Carbohydrate, by difference"][0]/100) * amount,3)
    if "Fiber, total dietary" in nutrients:
        return_val['fiber'] = round((nutrients["Fiber, total dietary"][0]/100) * amount,3)

    if "Energy (Atwater General Factors)" in nutrients:
        return_val['energy'] = round((nutrients["Energy (Atwater General Factors)"][0]/100) * amount,3)
    elif "Energy (Atwater Specific Factors)" in nutrients:
        return_val['energy'] = round((nutrients["Energy (Atwater Specific Factors)"][0]/100) * amount,3)

    return return_val

def search_ingredients(amount,ingredient):
    from ..core.preload import legacy_data, foundation_data
    '''
    for searching ingredients in database, returns info of ingredients with nutrition
    '''
    ingredient = normalize(ingredient)
    for amb_word, _ in AMBIGUOUS_MAP.items():
        if fuzz.WRatio(ingredient,amb_word) > 70:
            ingredient = AMBIGUOUS_MAP[amb_word]

    results = []
    results.extend(get_result(foundation_data,ingredient))

    if not results or results[0]["score"] < 85:
        # Will prioritize getting results from foundational data first (most of it is raw ingredients) before legacy data (everything else)
        results.extend(get_result(legacy_data, ingredient))
    
    filtered = []
    for result in results:
        filtered.append(result) if result['score'] > 60 else None 
    if not filtered:
        return extract_main_nutrients(-1,{}) 
    
    sorted(filtered, key=lambda x: x["score"], reverse=True)[:10]

    nutrients = {
        n["nutrient"]["name"]: (n["amount"], n["nutrient"]["unitName"])
        for n in filtered[0]['match'].get("foodNutrients", [])
    }

    return extract_main_nutrients(amount,nutrients)


    
def extract_amount(ingredient: str):
    '''
    used to strip the amount and the ingredients itself, to be passed to match ingredients

    eg:
    extract_amount('2 tablespoons olive oil') -> (15,'olive oil') // 15 grams
    '''

    ingredients_no_space = re.sub(r"[\s]","",normalize(ingredient)) # No space because sometimes ingredients is 1 400ml smthsmth
    ingredients_words = ingredient.split()
    grams = 1
    word_removed = []

    # Change fraction and detect units
    for i,word in enumerate(ingredients_words):
        if word in FRACTION_MAP.keys():
            ingredients_words[i] = FRACTION_MAP[word]
        if word in UNIT_MAP.keys():
            grams = UNIT_MAP[word]
            word_removed.append(word)

    for word in word_removed:
        if word in ingredients_words:
            ingredients_words.remove(word)  

    # Get amount
    amount_match = re.search(r"(\d+\/\d+|\d+(\.\d+)?)", ingredients_no_space)
    if amount_match:
        fraction = amount_match.group(1)
        if "/" in fraction:
            num, denom = fraction.split("/")
            number = float(num) / float(denom)
        else:
            number = float(fraction)
        amount_word = str(amount_match.group(1))
        if amount_word in ingredients_words:
            ingredients_words.remove(amount_word)
    else:
        number = 1.0  # default if no amount
    
    grams *= number

    # Remove noise
    word_removed = []
    for word in ingredients_words:
        if word in NOISE_WORDS:
            word_removed.append(word)
    
    for word in word_removed:
        if word in ingredients_words:
            ingredients_words.remove(word)  
    print((grams,' '.join(ingredients_words)))
    return (grams,' '.join(ingredients_words))


def match_ingredients(ingredients_list: List[str]):
    '''
    Parse amounts + match each ingredient with nutrition info
    '''
    res_nutrients = {
        'protein':0,
        'carbs': 0,
        'fiber': 0,
        'energy': 0
    }

    for ing in ingredients_list:
        grams, cleaned_ing = extract_amount(ing)

        if any(fuzz.WRatio(cleaned_ing, ignore) > 80 for ignore in IGNORE_FOR_NUTRIENTS):
            nutrients = {
                'protein': 0,
                'carbs': 0,
                'fiber': 0,
                'energy': 0,
            }
        else:
            nutrients = search_ingredients(grams, cleaned_ing)

        res_nutrients['protein']+=nutrients['protein']
        res_nutrients['carbs']+=nutrients['carbs']
        res_nutrients['fiber']+=nutrients['fiber']
        res_nutrients['energy']+=nutrients['energy']
        
    return res_nutrients


if __name__ == '__main__':
    preload(load_data=True)
    import json


    print(json.dumps(match_ingredients([
    "400g chicken breast, diced, 2 pieces",
    "200g rice, uncooked, 1 cup",
    "250g mushrooms, sliced, 2 cups",
    "1 tablespoon olive oil",
    "600ml chicken broth",
    "1/2 teaspoon salt",
    "1/4 teaspoon black pepper"
  ]), 
        indent=4
    ))
    print(extract_amount('1/2 large cauliflower, cut into florets'))