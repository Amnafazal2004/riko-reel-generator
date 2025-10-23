import connectDB from "@/config/db"
import { NextResponse } from "next/server"
import InputModel from "@/models/InputModel"

export async function PUT(request) {
   await connectDB();

   const body = await request.json();
   const { videourl, id } = body
     
     await InputModel.findByIdAndUpdate(
      id,
      {
         $push: {
            videos: videourl
         }
      },
      { new: true }
   );

   return NextResponse.json({ success: true});
}

