

import { NextResponse } from 'next/server';
import axios from 'axios';
import connectDB from "@/config/db";
import InputModel from "@/models/InputModel";

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Received render request:", body.title);
    console.log("w/h:", body.width, body.height);

    const renderServerUrl = process.env.RENDER_SERVER_URL || "http://localhost:4000";

    const { data } = await axios.post(`${renderServerUrl}/render`, body, {
      headers: { "Content-Type": "application/json" },
      timeout: 600000, // 10 minutes max
    });

    console.log("Render server responded:", data);

    const videourl = data.reelurl
    console.log("final url", videourl)
    const id = body.userid
    await connectDB();
    await InputModel.findByIdAndUpdate(
      id,
      { $push: { videos: videourl } },
      { new: true }
    );

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error rendering video:", err.message);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
