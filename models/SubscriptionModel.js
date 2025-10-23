
import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    email:{
        type: String,
    },
    plan:{
         type: String,      
    },
    subscriptionId:{
         type: String,      
    },
    subscriptionstatus:{
         type: String,      
    },
    customerid:{
         type: String,  
    },
     freetiercount:{
         type: Number,      
    },
    endat:{
         type: String,      
    }
   
   
})

const SubscriptionModel = mongoose.models.Subscription || mongoose.model('Subscription', Schema)

export default SubscriptionModel;
