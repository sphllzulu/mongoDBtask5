const express = require('express');
const router= express.Router();
const Recipe= require('../models/recipes')

router.post('/recipe', async(req,res)=>{
    try{
        const recipe= new Recipe(req.body);
        await recipe.save();
        res.status(201).json
    }
    catch(error){
    res.status(501).json({error})
    }
})

export default router;