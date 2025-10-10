system_instruction = """
You are a recipe generator like the DUT Recipe Generator.
When the user provides a prompt or ingredient list, produce ONLY a single JSON object that follows the JSON schema provided to the response_format.
The user may not give any ingredient, if that happens, produce any recipe given the prompt.
The user may not give any amount for the ingredients too, if that happens, use any reasonable value from the provided ingredients.
Output must be pretty-printed JSON (with indentation / new lines) and there must be NO extra text outside the JSON.
"""

rules='''
Behavior rules:
- If user lists ingredients, you MAY add common supporting ingredients (oil, salt, pepper, broth, etc.) to make a complete, practical recipe.
- If the user explicitly says "only use these ingredients" or similar, then use exactly and only what the user provided (do not add extras).
- "prompt" should be an array of short tags/keywords extracted from the generated recipe (concise, 1-3 words each).
- "ingredients" must be a cookbook-style array of strings; DO NOT group them by section headers (e.g., "for the sauce:").
- "ingredients" must be simple and cookbook-style: use clear units like "1 cup", "2 tbsp", "200g", etc when possible.
- Ingredients must always follow this format:
  <grams/unit> <ingredient_name> <action>, <count or pieces>
- For discrete ingredients such as chicken breasts, eggs, cloves, or slices, the <count or pieces> MUST always be included.
- For bulk ingredients (flour, sugar, oil, rice), <count or pieces> is optional.
- Example for discrete ingredients:
    - "400g chicken breast, diced, 2 pieces"
    - "3 eggs, beaten, 3 pieces"
- Example for bulk ingredients:
    - "1 cup sugar"
    - "2 tbsp olive oil"
-  Always list a single clear amount per "ingredient". Do not add extra precision unless it is a standard cooking measurement.
- "method" must be an array of numbered step strings (clear, actionable).
- Make the recipe family-friendly and practical. Adapt for dietary restrictions if user specifies them.
- Always produce valid JSON that validates against the schema. No commentary, no markdown, no extra fields.
- If there is not enough information, return ONLY a single JSON object, {"error":<Reason>}
    * When the input is a list of ingredients/tags, such as ["butternut squash", "simple", "vegetarian"], go on with the given ingredients/tags 

If uncertain about units or quantities, make reasonable assumptions and include them (e.g., '1 tbsp', '1 cup').
'''

json_schema = {
    "name": "recipe_schema",
    "schema": {
        "type": "object",
        "required": ["prompt", "ingredients", "method"],
        "properties": {
            "prompt": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Concise tags/keywords extracted from the user's input"
            },
            "ingredients": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Cookbook-style ingredient lines, can include section headers"
            },
            "method": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Ordered instructional steps as strings"
            }
        },
        "additionalProperties": False
    }
}

user_input = """I've got some butternut squash and I want to make something simple with it.  
Maybe a puree or something smooth I can eat easily.  
Can you give me an easy recipe with just a few ingredients?"""


example_response='''
{
  "prompt": ["butternut squash", "puree", "simple", "healthy", "easy", "vegetarian"],
  ingredients": ["1 butternut squash, about 850g", "2 tablespoons olive oil", "1/4 teaspoon salt"],
  "method": ["Preheat the oven to 200c.", "Peel the butternut squash, remove the seeds, and cut it into 2 cm chunks.", "Toss the squash in 1 tablespoon of olive oil and 1/4 teaspoon of salt.", "Spread the squash on a baking sheet and roast for 30 minutes.", "Remove the squash from the oven and let it cool.", "Puree the cooled squash in a food processor or blender until smooth.", "Serve immediately or refrigerate for up to 3 days."]
}
'''

instructions =f'''
{{
  "instructions":{system_instruction},
  "rules":{rules},
  "json_schema":{json_schema},
  "user_input":{user_input},
  "example_response":{example_response}
}}
'''

edit_system_instruction = """
You are a recipe editor. Your job is to take an existing recipe JSON and apply the user's edits.
Always output ONLY a single valid JSON object that follows the schema. Do not return extra text.
"""

edit_rules = '''
Behavior rules:
- Input will include a valid recipe JSON object.
- User may request edits such as:
  * Adding or removing ingredients
  * Changing units or quantities
  * Modifying the cooking method (steps)
  * Renaming the recipe title
  * Adjusting for dietary restrictions (e.g., vegetarian, gluten-free, dairy-free)
- Preserve as much of the original recipe as possible, only changing what the user requests.
- "prompt" must stay consistent with the new edited recipe and describe the recipe.
- "ingredients" must remain a cookbook-style array of strings; update only where required.
- "ingredients" must be simple and cookbook-style: use clear units like "1 cup", "2 tbsp", "200g", etc when possible.
- Ingredients must always follow this format:
  <grams/unit> <ingredient_name> <action>, <count or pieces>
- For discrete ingredients such as chicken breasts, eggs, cloves, or slices, the <count or pieces> MUST always be included.
- For bulk ingredients (flour, sugar, oil, rice), <count or pieces> is optional.
- Example for discrete ingredients:
    - "400g chicken breast, diced, 2 pieces"
    - "3 eggs, beaten, 3 pieces"
- Example for bulk ingredients:
    - "1 cup sugar"
    - "2 tbsp olive oil"
- "method" should remain ordered and clear; update only steps impacted by the requested edit.
- If user's edit makes the recipe invalid or impossible (e.g., removing all ingredients), return ONLY {"error": <Reason>}.
- Always produce valid JSON that conforms to the schema.
'''

edit_json_schema = {
    "name": "recipe_schema",
    "schema": {
        "type": "object",
        "required": ["prompt", "ingredients", "method"],
        "properties": {
            "prompt": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Concise tags/keywords reflecting the recipe after edits"
            },
            "ingredients": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Cookbook-style ingredient lines, updated as needed"
            },
            "method": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Ordered instructional steps, updated as needed"
            }
        },
        "additionalProperties": False
    }
}

edit_user_request = "Make this recipe vegetarian by replacing chicken with tofu."

original_recipe = {
  "prompt": "A healthy chicken and quinoa bowl breakfast with seasonings",
  "title": "Family Friendly Chicken & Quinoa Bowl",
  "ingredients": [
    "200g chicken breast",
    "1 cup quinoa, rinsed and drained",
    "1 tablespoon olive oil",
    "1 cup diced sweet potato",
    "1 cup chopped spinach",
    "1/2 teaspoon salt",
    "1/4 teaspoon black pepper"
  ],
  "method": [
    "Cook quinoa in salted water until tender.",
    "Sauté diced sweet potato in olive oil for 5 minutes.",
    "Add spinach and cook until wilted.",
    "Grill or pan-fry chicken breast until golden.",
    "Mix everything together and season with salt and pepper."
  ]
}

edit_user_request=f'''{{
  "original_recipe":{original_recipe},
  "user_request":{edit_user_request}
}}
'''

edited_response = '''{
  "prompt": "A vegeterian quinoa bowl and tofu for breakfast with seasonings",
  "title": "Family Friendly Tofu & Quinoa Bowl",
  "ingredients": [
    "200g firm tofu, cubed",
    "1 cup quinoa, rinsed and drained",
    "1 tablespoon olive oil",
    "1 cup diced sweet potato",
    "1 cup chopped spinach",
    "1/2 teaspoon salt",
    "1/4 teaspoon black pepper"
  ],
  "method": [
    "Cook quinoa in salted water until tender.",
    "Sauté diced sweet potato in olive oil for 5 minutes.",
    "Add spinach and cook until wilted.",
    "Pan-fry cubed tofu in olive oil until golden on all sides.",
    "Mix everything together and season with salt and pepper."
  ]
}'''

edit_instructions =f'''
{{
  "instructions":{edit_system_instruction},
  "rules":{edit_rules},
  "json_schema":{edit_json_schema},
  "user_input":{edit_user_request},
  "example_response":{edited_response}
}}
'''


