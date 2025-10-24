import SubscriptionModel from '@/models/SubscriptionModel';
import { NextResponse } from 'next/server';
import connectDB from "@/config/db"

export  async function POST(request) {
     const body = await request.json();
  const { freetiercount, email, plan, subscriptionId, subscriptionstatus, endat } = body

    await connectDB()
   await SubscriptionModel.findOneAndUpdate(
        { email },
        { $set: {
          plan: plan,
          subscriptionId: subscriptionId,
          subscriptionstatus: subscriptionstatus,
          endat: endat,
          freetiercount: freetiercount
        }
          
         },
        { new: true, upsert: true }
      );
  
  //so if it doesnt exist, then through upsert it will create the record
    return NextResponse.json({ success: true,  message: "subscription added"})

    
}

export async function PUT(request) {

     await connectDB()

     const body = await request.json()
     const  { freetiercount, email } = body
   await SubscriptionModel.findOneAndUpdate(
        {email},
        { $set: {
          freetiercount: freetiercount
        }
          
         },
        { new: true, upsert: true }
      );
    return NextResponse.json({ success: true,  message: "subscription added"})


    
}

export async function GET() {
   await connectDB();
   try {
      const subscription = await SubscriptionModel.find({});
      //the find method returns an array so we need to access it like that
      return NextResponse.json({ subscription })
   }
   catch (error) {
      console.log(error)
   }
}