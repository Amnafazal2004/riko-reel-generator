import '@/lib/lemonsqueezysetup';
import SubscriptionModel from '@/models/SubscriptionModel';
import { NextResponse } from 'next/server';
import connectDB from "@/config/db"
import { createCheckout } from '@lemonsqueezy/lemonsqueezy.js';



export async function POST(request) {
  const body = await request.json();
  const { variantid, email, plan, subscriptionId, subscriptionstatus, endat } = body


  // Checkout session create karo
  const checkout = await createCheckout(
    process.env.LEMON_SQUEEZY_STORE_ID,
    variantid,
    {
      checkoutData: {
        custom: {
          email: email // Apna user ID
        }
      },
      productOptions: {
        redirectUrl: 'http://localhost:3000',
      },
    }
  );

  await connectDB()
 await SubscriptionModel.findOneAndUpdate(
     { email},
      { $set: {
        plan: plan,
        subscriptionId: subscriptionId,
        subscriptionstatus: subscriptionstatus,
        endat: endat,
      }
        
       },
      { new: true, upsert: true }
    );

//so if it doesnt exist, then through upsert it will create the record

  console.log("Checkout response:", (checkout));
  return NextResponse.json({ success: true, url: checkout.data.data.attributes.url , message: "subscription added"})

}

