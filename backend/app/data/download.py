import urllib.request
import os
import zipfile

'''
Run this file to donwload the dataset for the nutrients, dataset is gitignored cuz big
'''

if(not os.path.isfile('ff.zip')):
    print('downloading 1/2...')
    urllib.request.urlretrieve("https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_foundation_food_json_2025-04-24.zip", "ff.zip") # Foundational food (Ingredients, etc)
    with zipfile.ZipFile('ff.zip', 'r') as zip_ref:
        zip_ref.extractall('.')
    os.remove('ff.zip')
    os.rename('FoodData_Central_foundation_food_json_2025-04-24.json','foundational.json')

if(not os.path.isfile('sr.zip')):
    print('downloading 2/2...')
    urllib.request.urlretrieve("https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_sr_legacy_food_json_2018-04.zip", "sr.zip") # SR Legacy Food
    with zipfile.ZipFile('sr.zip', 'r') as zip_ref:
        zip_ref.extractall('.')
    os.remove('sr.zip')
    os.rename('FoodData_Central_sr_legacy_food_json_2018-04.json','legacy.json')

print('done')

