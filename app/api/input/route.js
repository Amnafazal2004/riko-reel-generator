
import connectDB from "@/config/db"
import { NextResponse } from "next/server"
import InputModel from "@/models/InputModel"
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { v2 as cloudinary } from "cloudinary"
const ffmpegPath = "ffmpeg";
//right now we are using ffmpeg that is installed locally in our computer
//so to use it in production we need to use install it in docker too
//make sure to add this command in docker RUN apt-get update && apt-get install -y ffmpeg


//configure cloudinary
cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,

})


export async function POST(request) {
   console.log('API route hit');
   try {
      const formData = await request.formData()

      const prompt = formData.get("prompt");
      const userid = formData.get("userid");
      const extractaudio = formData.get("audio");


      console.log(prompt, userid, extractaudio)


      const audio = await audioeditor(extractaudio)
      console.log("audiourl in post", audio)


      await connectDB()
      console.log("connected")
      await InputModel.findByIdAndUpdate(
         userid,
         {
            $push: {
               prompt: prompt,
               audio: audio
            },
            $setOnInsert: { userid: userid}
         },
         { new: true, upsert: true }
      );
      //console.log(newinput)
      return NextResponse.json({ success: true, message: "input added", audio: audio })
   }
   catch (error) {
      return NextResponse.json({ success: false, message: error.message })
   }
}

// export async function GET() {
//    await connectDB();
//    try {
//       const input = await InputModel.find({});
//       return NextResponse.json({ input })
//    }
//    catch (error) {
//       console.log(error)
//    }


// }
async function audioeditor(audio) {
   console.log("baaji")
   const arrayBuffer = await audio.arrayBuffer();
   const buffer = Buffer.from(arrayBuffer);
   //it creates a temp file 
   const inputPath = path.join(os.tmpdir(), `${Date.now()}_input.mp4`);
   const outputPath = path.join(os.tmpdir(), `${Date.now()}_output.mp3`);
   //the videofile of the audio is saved in the inputPath
   fs.writeFileSync(inputPath, buffer);

   //We wrap this in a Promise so it waits until FFmpeg finishes or errors.
   await new Promise((resolve, reject) => {
      const ff = spawn(ffmpegPath, [
         "-i", inputPath,       // input file
         "-vn",                 // no video
         "-acodec", "libmp3lame", // use mp3 encoder
         "-b:a", "192k",        // bitrate
         outputPath,            // output file
      ]);

      ff.on("error", reject);
      ff.on("close", (code) => (code === 0 ? resolve() : reject(new Error("FFmpeg failed"))));
   });

   const result = await cloudinary.uploader.upload(outputPath, {
      resource_type: "auto",
      type: "upload",
      format: "mp3"
   });


   //Deletes temporary input/output files to free up disk space.
   fs.unlinkSync(inputPath);
   fs.unlinkSync(outputPath);


   console.log("baaji going")
   console.log("url", result.secure_url)
   let theurl = result.secure_url
   return theurl
}



