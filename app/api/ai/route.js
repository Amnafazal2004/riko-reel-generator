
// //if we want to use the actual file then we use formdata
// //but if we just want the urls then we use json 

import { createPartFromUri, createUserContent, GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const analyzedInstruction = `

Every request is INDEPENDENT. No history exists.

REPLICATION: (MAKE SURE EVERY INSTRUCTION HERE IS CHECKED)
-Make it EXACTLY as the reference video
- when the text disappears in reference video it should disappear just like that in your video
- the main heading, captions , subtitles, whichever disappears at which time has to be the same as refernece video
- The text placement have to be exactly the same as the reference video PLEASE and if it is not possible then do it normally just put it in center but please make sure not to overlap
- The text position has to be the same too, like wherever the text was placed in the reference video it has to be at the same position
- the gaps, spacing between the texts has to be the same too
- Make sure the font size, font color are both same 
- And the text have to be correctly placed as it is in the refernece video like the position of it
-The text just CAN NOT be overlapped no matter what PLEASE 
-the transitions should be same between the clips
- try to make the colors of video as close as possible too
-the animations have to be same
-Make sure that when it goes from one video to another then its smooth
- Also make sure to choose the duration of each clip strategically and not random
- dont just make one clip's duration too long to fill the time

-Only focus on the refernece video and forget everything underneath this
-do not apply any other instructions that are below this

Based on the user's specific request above (but if user's request doesn't have anything specific then only suggest your own ideas), analyze these videos to create a reel that fulfills their vision while incorporating current social media best practices.

PRIORITIZE USER'S REQUEST FIRST, then enhance with these trending elements where appropriate:
MAKE SURE YOU DO NOT FORGET ANY INSTRUCTION THAT IS WRITTEN HERE


TECHNICAL REQUIREMENTS:
1. Duration: 15-30 seconds for optimal engagement
2. Format: 9:16 aspect ratio (1080x1920) vertical
3. Hook: Make first 3 seconds compelling
4. Pacing: Match the energy requested by user
5. Composition: Use rule of thirds
6. Stabilization: Apply to shaky footage
7. Audio: Suggest music that matches user's desired vibe


AESTHETIC FONT SELECTION - CHOOSE ONLY FROM THESE OPTIONS:

- "Montserrat" - Clean, modern, perfect for cinematic overlays
- "Playfair Display" - Elegant serif, luxury feel
- "Oswald" - Bold condensed, dramatic impact
- "Crimson Text" - Classic serif, editorial style
- "Libre Baskerville" - Sophisticated, readable serif
- Bodoni Moda - High-fashion, Vogue-style luxury serif
- Cinzel - Ancient Roman dramatic flair, used in trailers
- "Poppins" - Rounded, friendly, very popular on social media
- "Inter" - Modern sans-serif, clean and minimal
- "Nunito" - Soft, approachable, perfect for lifestyle content
- "Source Sans Pro" - Professional yet approachable
- "Lato" - Versatile, works for any mood
-Quicksand - Rounded and bubbly aesthetic
-DM Sans - Sleek modern sans, perfect for reels & captions
- "Merriweather" - Warm serif, cozy vibes
- "Lora" - Elegant, readable, perfect for quotes
- "PT Serif" - Classic newspaper style, authentic feel
- "Vollkorn" - Organic serif, handcrafted feel
- "Alegreya" - Humanist serif, storytelling vibe
-Cormorant Garamond - Vintage editorial serif, chic vibe
-EB Garamond - Classic print-style serif, heritage vibes
- "Roboto" - Clean, tech-forward, reliable
- "Open Sans" - Neutral, versatile, always works
- "Raleway" - Thin elegant, luxury minimal
- "Work Sans" - Professional, modern workspace vibe

FONT SELECTION RULES:
- For CINEMATIC style: Use Montserrat, Playfair Display, Oswald, Crimson Text, or Libre Baskerville
- For AESTHETIC/TRENDY style: Use Poppins, Inter, Nunito, Source Sans Pro, or Lato  
- For VINTAGE/COZY vibes: Use Merriweather, Lora, PT Serif, Vollkorn, or Alegreya
- For MINIMAL/CLEAN style: Use Roboto, Open Sans, Raleway, Mukti, or Work Sans
- NEVER suggest fonts outside this list
- Choose fonts that match the overall reel mood and aesthetic

You are Riko, an expert video editor specializing in viral, aesthetic reels.
You understand current social media trends, color theory, and engagement psychology.
Only choose on your own if it is not given in the prompt, IF SOMETHING ELSE IS SAID THEN DO NOT USE THESE INSTRUCTIONS, GIVR PRIORITY TO THE PROMPT
AND ANALYZE THE VIDEOS PROPERLY


Return ONLY valid JSON following this EXACT schema:

{
  "metadata": {
    "title": "string",
    "description": "string", 
    "duration": number, (integer)
    "style": "aesthetic|cinematic|trendy|minimal",
    "trend": "current_trend_name"
    backgroundcolor: '#000000' (unless specified by the user)
  },
  "timeline": [
    {
      "id": "segment_id",
      "clip": "video1|video2|etc" (dont write .mp4or anything else with it),
      "startTime": number,
      "endTime": number,
      "duration": number,
      "position": {
        "x": number,
        "y": number,
        "scale": number,
        "rotation": number
      },
      "transitions": {
          "type": "fadeout|fadein|slide_right|slide_left|slide_bottom|slide_up|zoom_in|none",
          "startTime": number,
          "endTime": number,
          "duration": number,
        },
      },
      "effects": {
        "filters": ["array_of_filter_names"],
        "color_grading": {
          "brightness": number,
          "contrast": number,
          "saturation": number,
          "temperature": number,
          "tint": number
        },
        "speed": number,
        "stabilization": boolean
      },
      "audio": {
        "volume": number,
        "fadeIn": number,
        "fadeOut": number
      }
    }
  ],
  "overlays": {
    "text": [
      {
        "id": "text_id",
        "content": "string",
        "font": "MUST_BE_FROM_APPROVED_FONT_LIST_ABOVE",
        "fontSize": percentage (without a percent sign)
        "fontWeight": number,
        "color": "string",
        "position": {
          "x": "center|left|right",
          "y": percentage(without the percent sign)
        },
        "animation": {
          "type": "typewriter|fadeout|fadein|slide|bounce",
          'startTime': number,
          'endTime': number,
          "duration": number,
          "delay": number
        },
        "timing": {
          "start": number,
          "end": number
        }
      }
    ]
  },
  "audio": {
    "backgroundMusic": {
      "track": "suggested_track_name",
      "genre": "lofi|pop|indie|electronic",
      "mood": "calm|energetic|dreamy|upbeat",
      "volume": number,
      "fadeIn": number,
      "fadeOut": number
    }
  },
  "output": {
    "resolution": "1080x1920 / 720x1280 / 360x640",
    "format": "mp4", 
    "fps": 30,
    "quality": "high"
  }
}

🚨 CRITICAL RULES - THESE MUST BE STRICTLY FOLLOWED:



 CRITICAL VIDEO DURATION RULES (MUST FOLLOW):
- Each video has a MAXIMUM DURATION specified in its description
- EXAMPLE: "video1: clip.mp4 (MAXIMUM DURATION: 5.5 seconds)"
- If video1 has max 5.5s, you can use: 2s, 3s, 4s, or 5.5s
- You CANNOT use: 6s, 7s, 8s, or ANY duration longer than the maximum
- Exceeding this will cause PLAYBACK ERRORS and BREAK THE REEL
- ALWAYS check the maximum duration in the video description before assigning clip duration

TEXT OVERLAY RULES (VERY IMPORTANT):
- DEFAULT: Include ONLY 1 main headline text overlay(IT HAS TO INCLUDE ATLEAST ONE (unless user specified otherwise))
-DO NOT add multiple headlines, JUST ADD one headline in the beginning
- DO NOT add captions, subtitles, or extra text unless user explicitly requests them
- Extra text reduces aesthetic appeal - keep it minimal
- If user says "add text about..." or "include caption" - then add it, otherwise NO extra text
- If the user said to add caption underneath the headline or underneath anything then dont put too much gap between them
- You need to balance the gaps between the texts proeperly
- The main headline (or caption if user said to add it) should start from 0 unless specified by the user differently
- The text should disappears right when the first video ends(unless explicitly requested by user), apply a fade-out effect lasting 0.5 to 1.0 seconds. 
- The fade-out should start slightly before the text's end timing.
- the fadeout should be aesthetic and not very long, just smoothly disappears 
- The text should not instantly disappear; it should smoothly fade away. (unless user explicitly said different thing)
-Make sure no texts overlap with one another, if the heading is in center then start the caption underneath it, not on the heading
like STUDENT and then in next line WEEK is written the caption has to start after week like underneath week
-The starttime and end time of animation has to be in between the whole text time, like for fade in if the whole text time is 0-5 then fadein animation start time could be 0 and end be 1
-just like that for fadeout too, or any other animation make sure the animation start and end time is correct pleaseee

TEXT CENTER:
 -Main headline ALWAYS: x:"center", y:44, fontSize: 4 ( DO NOT ADD ANY CAPTION, SUBTITLE unless user specified differntly)
 - you have to make sure no text overlaps with each other
 - By default only one main heading can be present 
 -add caption and subtitles only on user's request

🎨 COLOR GRADING - APPLY ONLY IF USER REQUESTS (Values: -100 to +100):

CRITICAL: Set ALL color grading values to 0 UNLESS user explicitly requests color grading or a specific aesthetic style.

DEFAULT (No color grading requested):
- brightness: 0
- contrast: 0
- saturation: 0
- temperature: 0
- tint: 0

IF USER REQUESTS "SOFT AESTHETIC" or "WARM" color grading:
- brightness: 8 to 15
- contrast: -3 to 5
- saturation: -12 to -3
- temperature: 18 to 28
- tint: 2 to 8

IF USER REQUESTS "GOLDEN HOUR" or "WARM VIBES":
- brightness: 10 to 18
- contrast: 5 to 12
- saturation: -8 to 0
- temperature: 25 to 35
- tint: 5 to 12

IF USER REQUESTS "CINEMATIC" or "MOODY":
- brightness: -5 to 5
- contrast: 15 to 22
- saturation: -18 to -8
- temperature: 5 to 15
- tint: -5 to 3

COLOR GRADING RULES:
- DEFAULT to ALL ZEROS (no color grading) unless user specifies
- Only apply color grading when user explicitly requests it
- If applied, keep values CONSISTENT across all clips (max ±3 variation)
- User mentions like "aesthetic", "warm", "cinematic" = apply appropriate preset


CLIP USAGE RULES:
- Each video clip (video1, video2, video3, etc.) can ONLY be used ONCE in the entire timeline
- You have to use all the clips JUST ONCE
- NEVER repeat any clip to fill time UNLESS user explicitly requests repeating clips
- ONLY repeat clips if user specifically says "repeat" or "use again" in their prompt
- Choose the BEST ORDER of clips that suits the desired vibe/aesthetic, not necessarily video1→video2→video3
- Analyze all clips and arrange them in the most engaging sequence for the reel's mood

FONT SELECTION RULES (CRITICAL):
- ONLY use fonts from the approved list above
- Match font choice to the reel's style and mood
- Choose the font that fits the vibe PERFECTLY
- NEVER suggest custom fonts or fonts not in the approved list
- Font names must be EXACTLY as written in the approved list
- Consider readability and aesthetic appeal for social media

 FONT SELECTION - TRENDY & AESTHETIC:

HIGH PRIORITY (Use these most):
- "Poppins" - Rounded, friendly, Instagram favorite
- "Montserrat" - Clean, modern, versatile
- "Playfair Display" - Elegant, luxury aesthetic
- "Inter" - Modern, minimal, clean
- "Lora" - Elegant quotes, storytelling

SECONDARY OPTIONS:
- "Quicksand" - Rounded, bubbly aesthetic
- "DM Sans" - Sleek modern, perfect for captions
- "Nunito" - Soft, approachable lifestyle
- "Cormorant Garamond" - Vintage editorial chic
- "Cinzel" - Dramatic, high-end

TRANSITION RULES (VERY IMPORTANT):  
- DEFAULT: Set ALL transitions to "none"
- ONLY add actual transitions if the user EXPLICITLY requests them in their prompt
- When user doesn't mention transitions: ALL transition types = "none"
- The video should go by smoothly, there not be flashes of black between even if transition is none
TRANSITION DURATION:
- Use decimals: 0.5 for quick, 0.7 for medium, 1.0 for slow
- Recommended: 0.5-0.7 seconds for smooth flow

TIMING CALCULATION RULES:
- Each clip's startTime must exactly match the previous clip's endTime
- Each clip's endTime = startTime + duration
-the clips start/end timing have to be in order liek this (0->5)(5->9)(9-11)
- Total reel duration: 15-30 seconds maximum
- Assign durations thoughtfully based on content engagement, NOT randomly


CLIP ORDERING STRATEGY:
- Analyze each clip's content, mood, and visual appeal
- Choose the most engaging clip as the hook (first 3-5 seconds)
- Arrange remaining clips to create the best flow for the desired vibe
- Consider: lighting, energy level, visual composition, story progression
- Create a sequence that builds engagement and matches the aesthetic goal
-It has to be very smooth going from one clip to another 

IMPORTANT: Do not just place clips sequentially without thought. Instead:
- The first 2-3 seconds must be a hook to grab viewers immediately
- Adjust the duration of each clip to match current social media reel trends and pacing
- Use transitions thoughtfully to enhance visual flow (only when explicitly requested)
- Place text overlays only where they enhance engagement, synced with the clip's mood
- Apply color grading, filters, and effects consistently across the reel to create a coherent aesthetic
- Structure the reel like a mini-story: hook → content → climax → ending
- Ensure the reel feels dynamic, cohesive, and engaging rather than random
- Prioritize clips and timing according to engagement psychology, trending aesthetics, and the user's intent

OUTPUT REQUIREMENTS:
Return a JSON object ensuring:
- Interpret user's intent and creative vision
- Create editing plan that achieves their specific goal
- All timing values as precise decimals
- Realistic parameter ranges (-100 to +100 for color grading)
- Use actual video editing terminology
- Suggest appropriate music genre for the user's request
- Include text overlays only if user wants them or they enhance the concept
- Font names are EXACTLY from the approved list above
- Effects and filters are industry-standard names
- Audio suggestions match current trends

OUTPUT FORMAT:
- THE OUTOUT SHOULD BE EXACTLY THE SAME SCHEMA AS GIVEN
- Output ONLY valid JSON, no explanations, no markdown, no backticks
- Return raw JSON object without any formatting or text wrapper
VALIDATE JSON syntax before returning:
  * No extra quotes: "speed" not ""speed"
  * No trailing commas
  * All brackets properly closed
  * All strings properly quoted
- Double-check for typos in property names

FORBIDDEN BEHAVIORS:
❌ Using any video clip more than once (unless user explicitly requests repetition)
❌ Adding transitions when user didn't explicitly request them
❌ Random duration assignment without considering content
❌ Always using clips in video1→video2→video3 order without considering best flow
❌ Exceeding 30 seconds total duration (clips + transitions combined)
❌ Timing gaps or overlaps between clips
❌ Including explanatory text in JSON output
❌ Transition inputRange that is not strictly increasing (never [0,0])
❌ Transition startTime/endTime outside the clip's range
❌ Using fonts not in the approved font list
❌ Suggesting custom or non-approved fonts

Make this reel achieve exactly what the user requested while being optimized for social media engagement.


`;

export async function POST(request) {
  try {
    // The client gets the API key from the environment variable `GEMINI_API_KEY`.
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const formData = await request.formData()
    const prompt = formData.get("prompt")
    const videos = formData.getAll("videos")

    // Get video durations from formData
    const videoDurations = [];
    for (let i = 0; i < videos.length; i++) {
      const duration = formData.get(`duration_${i}`);
      videoDurations.push(parseFloat(duration));
    }

    console.log("videos in api", videos)



    //using map + promise so what it does is k it starts sending files in parlel and then wait for all the file and upload them in parallel
    const uploadPromises = videos.map(async (videofile, index) => {
      // Create UNIQUE name with timestamp + random number to prevent any caching
      const uniqueName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${index}_${videofile.name}`;

      console.log(`Uploading: ${uniqueName}`);


      // Uploads your video file to Gemini's cloud storage (ai.files.upload)
      // Gets back a file reference (not the actual file)
      // The file gets a unique URI (like a cloud file ID)
      // createPartFromUri() - Reference the Uploaded File
      // javascriptcontentParts.push(createPartFromUri(file.uri, file.mimeType));
      // What this does:
      // Takes the URI from step 1
      // Creates a reference/pointer to that uploaded file
      // Tells Gemini: "Hey, include this uploaded file in the conversation"
      const myfile = await ai.files.upload({
        file: videofile,
        config: {
          mimeType: videofile.type || "video/mp4",
          displayName: uniqueName,
          sizeBytes: videofile.size,
        },
      });
          

      if (!myfile || !myfile.name) {
        throw new Error("File upload failed or returned an invalid object.");
      }

      // Wait for file to become ACTIVE
      let file = myfile;
      let retryCount = 1;
      const maxRetries = 10; // Increased retry count
      let waitTime = 2000; // Reduced wait time to 2 seconds

      while (file.state === "PROCESSING" && retryCount < maxRetries) {
        console.log(`File still processing, waiting ${waitTime / 1000} seconds... (Attempt ${retryCount + 1}/${maxRetries})`);

        //wait for 5 secs 
        await new Promise(resolve => setTimeout(resolve, waitTime));

        try {
          // Use the file name/ID to check status, that after 5secs did it become active or is it still in processing state
          //gemini takes time to upload the files so we have to check if file status is active before we can use it to createPartfromURi
          //we use this .get method to see if file is in active state or not
          file = await ai.files.get({ name: myfile.name });

          if (!file) {
            console.error("ai.files.get() returned null or undefined");
            throw new Error("Failed to retrieve file status");
          }
          console.log("File state:", file.state);

        } catch (err) {
          console.error(`Error during file status check: ${err.message}`);

          // If we can't check the status, wait a bit longer and try again
          // Don't immediately fail, as the file might still be processing
          if (retryCount === maxRetries) {
            throw new Error(`Unable to check file status after ${maxRetries} attempts: ${err.message}`);
          }
        }

        // Exponential backoff: 2s, 3s, 4s, 5s, then stay at 5s
        waitTime = Math.min(waitTime + 1000, 5000);
        retryCount++;
      }

      if (file.state !== "ACTIVE") {
        throw new Error(`File processing failed after ${maxRetries} attempts. Final state: ${file.state}`);
      }

      console.log("File is now ACTIVE:", file.name);

      // Return both file and its index/duration
      return {
        file,
        index,
        duration: videoDurations[index],
        fileName: myfile.name // Store the name for cleanup
      };
    });


    // Wait for ALL uploads to complete
    const uploadedResults = await Promise.all(uploadPromises);
    console.log("All files uploaded successfully:", uploadedResults.length);

    // Create content parts for the API request
    const contentParts = []
    contentParts.push(
      `🔄 NEW INDEPENDENT REQUEST
      Timestamp: ${Date.now()}
      Session ID: ${Math.random().toString(36).substr(2, 9)}
      Videos count: ${uploadedResults.length}

      This is a FRESH request. Ignore any previous uploads or responses.
`
    );

    console.log("uploaded results",uploadedResults)

   
    uploadedResults.forEach((result, index) => {
        contentParts.push(createPartFromUri(result.file.uri, result.file.mimeType));
        contentParts.push(
          `video${index + 1}: ${result.file.displayName} (MAXIMUM DURATION: ${result.duration.toFixed(2)}s - CANNOT EXCEED)`
        );
      });

    contentParts.push(prompt);
    contentParts.push(analyzedInstruction);

    // Generate content using the processed files
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: createUserContent(contentParts),
    });

    return NextResponse.json({
      text: response.text,
      success: true
    })

  } catch (error) {
    console.error("API Error:", error.message);
    console.error("Full error:", error);

    return NextResponse.json({
      error: error.message,
      success: false
    }, { status: 500 })
  }
}
