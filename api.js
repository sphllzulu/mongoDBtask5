import express from 'express';
import mongoose from 'mongoose';
import "dotenv/config";
import Joi from 'joi';
import Recipe from "./models/recipes.js"
import Users from "./models/users.js"
import session from "express-session"
import connectMongo from "connect-mongo"
import bcrypt from 'bcrypt'
import MongoStore from 'connect-mongo';
import validator from 'validator';


const app = express();
const router = express.Router();
const PORT = process.env.PORT || 8000;



app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI, 
            mongooseConnection: mongoose.connection,
        }),
        cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }, 
    })
);



app.use(express.json());

app.get('/',(req,res)=>{
    req.session.isAuth= true
    res.send("hey there i am connected")
})


// Joi schema for validation
const recipeValidationSchema = Joi.object({
    name: Joi.string().trim().required(),
    ingredients: Joi.array().items(Joi.string().trim()).required(),
    instructions: Joi.string().required(),
    preparationTime: Joi.number().required(),
    cookTime: Joi.number().required(),
    servings: Joi.number().required(),
});

//to create a new user
router.post('/register', async (req,res)=>{
    const { username, password,role}=req.body;
    if (!validator.isEmail(username)) {
        return res.status(400).json({
            message: 'Please enter a valid email address for username'
        });
    }
  
    const newUser= new Users ({username,password,role});
    await newUser.save();
    res.status(201).json({message: 'User registered'})
});

//to login
router.post('/login', async(req,res)=>{
    const {username,password}=req.body;
    const user = await Users.findOne({username});

    if(!user || !(await bcrypt.compare(password, user.password))){
       return res.status(401).json({message:'Invalid username or password'}) 
    }
    req.session.userId= user._id;
    req.session.role=user.role;

    res.json({message:'Login successful', userId:user._id,role:user.role })
});

//middleware to restrict access based on role
function requireRole(role){
    return (req,res,next)=>{
        if(!req.session.role || req.session.role !== role) {
             return res.status(403).json({message:'Access denied'})
        }
        next();
    }
}

// middleware to ensure users are logged in before posting
function requireAuth(req,res,next){
    if(!req.session.userId){
        return res.status(401).json({message:"You must be logged in to post"})
    }
    next();
}


// POST /api/recipes - Create a new recipe
router.post('/recipes', requireRole('admin'), async (req, res) => { 
    try {
        // Validate input before sending to the database
        const { error } = recipeValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const newRecipe = new Recipe(req.body);
        await newRecipe.save();
        res.status(201).json(newRecipe);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET /api/recipes - Get all recipes with pagination
router.get('/recipes', requireAuth, async (req, res) => {
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
            totalItems: count,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET /api/recipes/:id - Get a recipe by ID
router.get('/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// DELETE /api/recipes/:id - Delete a recipe by ID
router.delete('/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndDelete(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json({ message: 'Recipe deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// PUT /api/recipes/:id - Update a recipe by ID
router.put('/recipes/:id', async (req, res) => {
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
        res.status(500).json({ message: 'Server Error' });
    }
});

// Apply the routes to /api
app.use('/api', router);

// MongoDB Connection
// This will ensure that the server runs only when the database is connected
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });
