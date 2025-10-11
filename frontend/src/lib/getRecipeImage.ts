import { placeholder, RecipeDetail } from "@/data/recipes";
import { WithSections } from "@/data/recipes";

export default function getImage(recipe: RecipeDetail | null):string{
    let url = placeholder
    if(!recipe) return url
    if(recipe != null && recipe.comments.length > 0 ){
        recipe.comments.forEach(comment=>{
        if(comment.image_url){
            url = comment.image_url
        }
        })
    }
    return url;
}