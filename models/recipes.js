const mongoose = require ('mongoose')

const recipeSchema= new mongoose.Schema({
    name:{
        type:String, required:true, trim:true
    },
    ingredients:[{
        type:String,required:true,trim:true
    }],
    instructions:{
        type:String,required:true
    },
    preparationTime:{
        type:Number,required:true
    },
    cookTime:{
        type:Number, required:true
    },
    servings:{
        type:Number, required:true
    },createdAt:{
        type:Date, default:Date.now()
    }
})
export default mongoose.model("Recipe", recipeSchema)
