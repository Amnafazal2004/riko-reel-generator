import crypto from "node:crypto";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import SubscriptionModel from "@/models/SubscriptionModel";

export async function POST(request) {
  console.log("i am here")
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json("Required env secrets not set!", { status: 400 });
  }

  const rawBody = await request.text();
  const signature = Buffer.from(
    request.headers.get("X-Signature") ?? "",
    "hex"
  );

  if (signature.length === 0 || rawBody.length === 0) {
    return NextResponse.json("Invalid request", { status: 400 });
  }

  const hmac = Buffer.from(
    crypto.createHmac("sha256", secret).update(rawBody).digest("hex"),
    "hex"
  );

  if (!crypto.timingSafeEqual(hmac, signature)) {
    return NextResponse.json("Invalid request", { status: 400 });
  }

  // The request is valid, parse the data here
  // Webhook data parse karo
  const event = JSON.parse(rawBody.toString());
  console.log(event)
//  console.log("Webhook received:", event.meta.custom_data?.user_id, event.meta.event_name, event.data?.attributes?.product_name, event.data?.attributes?.status, event.data?.attributes?.ends_at);

  const email=  event.data?.user_email

  if (event.meta.test_mode) {
    console.log("ehehe")
  }
  await connectDB()
  switch (event.meta.event_name) {
    case "subscription_created":
    case "subscription_updated":
      
      await SubscriptionModel.findOneAndUpdate(
        email,
        {
          $set: {
            plan: event.data.attributes.product_name,
            subscriptionstatus: event.data.attributes.status,
            subscriptionId: event.data.id,
            customerid: event.data.attributes.customer_id,
            endat: event.data.attributes.ends_at
          }
        },
        { new: true }

      )
      break;
    case "subscription_canceled":
    case "subscription_expired":
      await SubscriptionModel.findOneAndUpdate(
       email,
        {
          $set: {
            subscriptionstatus: event.data.attributes.status,
            endat: event.data.attributes.ends_at
          }
        },
        { new: true }

      )
      break;
    default:
      // Ignore events you don’t handle
      console.log("Unhandled event:", event.meta.event_name);
      return NextResponse.json("Event ignored", { status: 200 });




  }
  return NextResponse.json("OK", { status: 200 });
}
