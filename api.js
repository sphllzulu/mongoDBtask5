import express from 'express'
import mongoose from 'mongoose';
import "dotenv/config"
import Joi from 'joi';
import Recipe from './recipeSchema/recipes.js'


const app = express();
const router = express.Router();
const PORT = process.env.PORT || 8000


app.use(express.json());

// i am using joi to validate the schema
const recipeValidationSchema = Joi.object({
    name: Joi.string().trim().required(),
    ingredients: Joi.array().items(Joi.string().trim()).required(),
    instructions: Joi.string().required(),
    preparationTime: Joi.number().required(),
    cookTime: Joi.number().required(),
    servings: Joi.number().required(),
});

// Error handling middleware
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({ error: err.message || 'Internal Server Error' });
}

// POST /api/recipes - Create a new recipe
router.post('/recipes', async (req, res, next) => {
    try {
        // Validate input before its being sent to the database
        const { error } = recipeValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const newRecipe = new Recipe(req.body);
        await newRecipe.save();
        res.status(201).json(newRecipe);
    } catch (error) {
        next(error);  
    }
});

// GET /api/recipes - Get all recipes with pagination
router.get('/recipes', async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const recipes = await Recipe.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Recipe.countDocuments();

        res.json({
            recipes,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            totalItems: count
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/recipes/:id - Get a recipe by ID
router.get('/recipes/:id', async (req, res, next) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json(recipe);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/recipes/:id - Delete a recipe by ID
router.delete('/recipes/:id', async (req, res, next) => {
    try {
        const recipe = await Recipe.findByIdAndDelete(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json({ message: 'Recipe deleted' });
    } catch (error) {
        next(error);
    }
});

// PUT /api/recipes/:id - Update a recipe by ID
router.put('/recipes/:id', async (req, res, next) => {
    try {
        // Validate input
        const { error } = recipeValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRecipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json(updatedRecipe);
    } catch (error) {
        next(error);
    }
});

// Apply the routes to /api
app.use('/api', router);

// Global error handling middleware
app.use(errorHandler);

// MongoDB Connection
//this will ensure that the server runs only when when the database is connected
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        
        app.listen(PORT, () => {
            console.log('Server running on port 3000');
        });
    })
    .catch((error) => {
        console.log(error);
    });
