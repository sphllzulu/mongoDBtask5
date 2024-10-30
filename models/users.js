import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import validator from "validator";



const userSchema= new mongoose.Schema({
    username:{
        type:String, required:true,unique:true, validate: [validator.isEmail, "Please enter a valid email"]
    },
    // password: { type: String, required: true },
    password:{
        type:String,
        required:true,
        validate:{validator : function(value){
         return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)
        }}
       
    },
    role:{type:String, enum:['admin','user'], default:'user'}
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) 
        return next();
    this.password= await bcrypt.hash(this.password,12);
    next();
})

export default mongoose.model("Users", userSchema)