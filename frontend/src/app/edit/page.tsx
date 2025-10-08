import RecipeEdit from './RecipeEdit';

const testRecipe = {
    id:"test",
    title:"test",
    description:"test desc",
    steps:["step 1","step 2","step 3"],
    ingredients:["rice","chicken","mushroom"],
    nutrition:{
        calories: "10g",
        carbohydrates: "10g",
        protein: "10g",
        fats: "10g",
        fiber: "10g"
    },
    tags:["tag 1","tag 2"]
}

export default function page(){
    return <RecipeEdit recipe={testRecipe}/>
}

