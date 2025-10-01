from typing import List


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

unit_map={
    'tablespoons':15,
    'tablespoon':15,
    'tblsp':15,
    'tbsp':15,
    # ill add more later
}

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
    pass