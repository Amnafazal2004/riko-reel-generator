import { NextResponse } from "next/server"
import fs from "fs"; //This lets us read/write files on your computer.
import https from "https"; //built-in Node.js module that lets us make secure web requests (to download stuff from the internet).
import os from "os";
import path from "path";
// os.tmpdir() is a built-in Node.js function (from the os module) that returns the system’s temporary folder path.
// Every OS (Windows, macOS, Linux) has a special “temporary” directory:

export async function downloadvideo(url, savepath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(savepath) //tells Node: "Open a new file called video.mp4" ,"Get ready to write data into it (stream it piece by piece)."
        https.get(url, (response) => {
            response.pipe(file)
            file.on("finish", () => {
                file.close(resolve)
            })
        }).on("error", (err) => {
            fs.unlink(savePath, () => { }); // delete partial file if error
            reject(err);
        });
    })

}

// https.get → makes a GET request to the given URL.
// url → the video link we defined earlier.
// (response) => { ... } → a callback function.
// When the server replies with the video data, Node gives it to you as response.
// response → the video data coming in from the internet.
// .pipe(file) → instead of waiting for the whole thing, we pipe (send) the incoming data directly into file.
//  This means: "Take the video chunks you download and write them straight into video.mp4."

export async function POST(request) {
    try {

        const formData = await request.formData()
        const videosurl = formData.getAll("videosurl")
        console.log("videos in api", videosurl)

        let videono = 1;
        for (let i = 0; i < videosurl.length; i++) {
            // Step 1: Get system temp folder (e.g. /tmp or C:\Users\You\AppData\Temp)
            const tempDir = os.tmpdir();
            //Step 2: Create a full file path for each video safely
            const fileName = `video${videono}.mp4`;
            const tempFilePath = path.join(tempDir, fileName);

            //Step 3: Download video to temp folder
            await downloadvideo(videosurl[i], tempFilePath);

            console.log(`Downloaded video ${videono} → ${tempFilePath}`);
            //Step 5 (Optional): Delete after processing
            fs.unlinkSync(tempFilePath); // removes file manually if you want


            videono++;
        }

        return NextResponse.json({ success: true })
    }
    catch (error) {
        console.error("Full error:", error);
        return NextResponse.json({ success: false })
    }


}
