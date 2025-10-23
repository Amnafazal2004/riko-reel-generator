
import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    prompt:{
        type: Array,
        required:true,
    },
    userid:{
        type: String,
        required: true,

    },
    videos:{
        type:Array
    },
    audio:{
        type:Array
    },
   
   
   
})

const InputModel = mongoose.models.Input || mongoose.model('Input', Schema)

export default InputModel;
