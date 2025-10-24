"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { variantid } from "@/components/lemonsqueezyvariables";
import axios from "axios";
import { toast } from "sonner";
import { useReelContext } from "@/Context/ReelContext";
import { useRouter } from "next/navigation";
import { getSubscription } from "@lemonsqueezy/lemonsqueezy.js";
//we are uploading to cloud first and then sending the urls to backhend so it will reduce upload time

const Checker = () => {
  const [prompt, setprompt] = useState("");
  const [plan, setplan] = useState("Free tier");
  const [subscriptionstatus, setsubscriptionstatus] = useState("free");
  const [subscriptionId, setsubscriptionId] = useState("");
  const [endat, setendat] = useState("");
  const [freetierpopup, setfreetierpopup] = useState(false);
  const [freetierended, setfreetierended] = useState(false);
  const [proplanactive, setproplanactive] = useState(false);
  const [updateproplan, setupdateproplan] = useState(false);
  const [cancelproplan, setcancelproplan] = useState(false);
  const [freetier, setfreetier] = useState(false);

  const [thevideos, setthevideos] = useState([]);
  const {
    setshowlogin,
    userid,
    setreelData,
    setvideoUrls,
    setaudiourl,
    email,
    freetiercount,
    setfreetiercount,
  } = useReelContext();
  const router = useRouter();
  const [audio, setaudio] = useState();

  let uploadResults, getSubscription, openaireply;

  const fetchsubsdata = async () => {
    const { data } = await axios.get("/api/freetier");
    console.log("got it");
    //get subscription is an array because it the find method sends an array back
    getSubscription = data.subscription;
    console.log("getsub", getSubscription);
    console.log(data.subscription);
  };

  const getVideoDuration = (file) => {
    return new Promise((resolve) => {
      //We’re making an invisible <video> element purely for reading metadata. It’s not displayed — just exists in memory.
      const video = document.createElement("video");
      //This means the browser won’t load the full video (which could be huge) —it will only read header info, like:duration ,width/height, codec info
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        //We clean up (revokeObjectURL) the temporary file URL.Then we resolve(video.duration) which gives duration in seconds (e.g. 12.34).
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };

      video.onerror = () => {
        resolve(10); // Default to 10 seconds if can't read duration
      };
      //This line converts the File object (from <input type="file" />)into a temporary blob URL — so the browser can read it.
      video.src = URL.createObjectURL(file);
    });
  };

  //Every video file is passed to getVideoDuration.All are processed in parallel using Promise.all.You get an array like [5.43, 12.12, 7.89].
  //and then u just send the videodurations to formdata

  const openaihandler = async () => {
    try {
      const formData = new FormData();
      formData.append("prompt", prompt);

      // Get durations for all videos
      const videoDurations = await Promise.all(
        thevideos.map((video) => getVideoDuration(video))
      );
      // Add videos and their durations
      thevideos.forEach((video, index) => {
        formData.append("videos", video);
        formData.append(`duration_${index}`, videoDurations[index].toFixed(2));
      });

      const result = await axios.post("api/ai", formData);
      if (result.data.success) {
        console.log(result.data.text);
        openaireply = result.data.text;
        const cleanjsonRaw = openaireply
          .replace("```json", "")
          .replace("```", "");
        const openaireply2 = JSON.parse(cleanjsonRaw);
        setreelData(openaireply2);
        router.push("/reelediting");
      }
    } catch (error) {
      console.log("Response error: ", error.message);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    console.log("userid from context:", userid);

    if (!userid) {
      toast("User not logged in");
      return;
    }

    await fetchsubsdata();
    if (
      getSubscription[0].subscriptionstatus === "free" &&
      getSubscription[0].freetiercount < 3
    ) {
      console.log("free");
      console.log(getSubscription[0].freetiercount);
      setfreetiercount(getSubscription[0].freetiercount);
      setfreetier(true);
    } else if (
      getSubscription[0].subscriptionstatus === "free" &&
      getSubscription[0].freetiercount === 3
    ) {
      console.log("free ended");
      setfreetierended(true);
      return;
    }
    else if (
      getSubscription[0].subscriptionstatus === "active" ||
      getSubscription[0].subscriptionstatus === "on_trial"
    ) {
      console.log("pro");
      setproplanactive(true);
    }
    else if (
      getSubscription[0].subscriptionstatus === "expired" &&
      getSubscription[0].freetiercount === 3
    ) {
      console.log("pro ended");
      setupdateproplan(true);
      return;
    } else if (
      getSubscription[0].subscriptionstatus === "expired" &&
      getSubscription[0].freetiercount < 3
    ) {
      console.log("free started again");
      setfreetiercount(getSubscription[0].freetiercount);
      setfreetier(true);
    } else if (getSubscription[0].subscriptionstatus === "cancelled") {
      setcancelproplan(true);
      setendat(getSubscription[0].endat);
    }
    //jb cancel aye to bs reminder de do k apki subscription is time per band hojayegi

    //uploading videos on cloudinary
    uploadResults = await Promise.all(
      thevideos.map(async (file) => {
        const formData1 = new FormData();
        formData1.append("file", file);
        //the preset is used if uploading from "use client" , if we do in backhend then api secret key is used
        formData1.append("upload_preset", "reelsgenerator");
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dpzq24rxs/video/upload",
          formData1
        );
        return res.data.secure_url; // Get the video URL
        //the urls would be stored in uploadresults
      })
    );

    setvideoUrls(uploadResults);

    try {
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("userid", userid);
      formData.append("audio", audio);

      const { data } = await axios.post("/api/input", formData);
      console.log("here");
      if (data.success) {
        toast(" prompt added");
        console.log(data.audio);
        setaudiourl(data.audio);
        await openaihandler().catch((err) => console.error("AI Error:", err));
      }
    } catch (error) {
      toast("Not uploaded");
    }
    // }
  };

  //FormData for files, JSON for URLs/text!
  const handlefileselect = (e) => {
    const selectedfiles = Array.from(e.target.files);
    //now since multiple files can be selected so we change the slectedfiles we get into array and put it into slectedfiles array
    setthevideos((prevVideos) => {
      const remainingslots = 10 - prevVideos.length;
      return [...prevVideos, ...selectedfiles.slice(0, remainingslots)];
      //spreads the old array and the new array into one single array.
      //only max of 10 can be uploaded
    });
  };

  const handlePurchase = async () => {
    const { data } = await axios.post("/api/checkout", {
      variantid,
      email,
      plan,
      subscriptionId,
      subscriptionstatus,
      freetiercount,
      endat,
    });
    if (data.success) {
      console.log("bro");
      window.location.href = data.url; //for external redirect
    }
  };

  //will work only when it is live
  const handlerCustomerPortal = () => {
    window.location.href = " https://reelgenerator.lemonsqueezy.com/billing";
  };

  const handlefreetier = async () => {
    setfreetier(true);
    console.log("in free tier");
    const { data } = await axios.post("/api/freetier", {
      email,
      subscriptionId,
      subscriptionstatus,
      endat,
      freetiercount,
    });
    if (data.success) {
      console.log(data.message);
    }
  };

  return (
    <div>
      <Button onClick={() => setshowlogin(true)}>Profile</Button>
      <Button onClick={() => setfreetierpopup(true)}>Free Trial</Button>
      {freetierpopup ? (
        <Button onClick={handlefreetier}>Start Free trial Now</Button>
      ) : (
        <></>
      )}
      <Button onClick={handlePurchase}>Pro Plan</Button>
      <Button onClick={handlerCustomerPortal}>Customer Portal</Button>
      <h1 className="font-bold text-center text-4xl">Reels Generator</h1>
      <form onSubmit={submitHandler}>
        <h2>Prompts</h2>
        <Input
          value={prompt}
          onChange={(e) => setprompt(e.target.value)}
          placeholder="write the prompt"
          type="text"
        ></Input>
        <label className="block text-sm font-semibold text-[#3c5e78] mb-1">
          Upload videos{" "}
        </label>

        <div>
          <Input
            onChange={handlefileselect}
            accept="video/*"
            type="file"
            multiple
          />
          {thevideos.length < 10 && thevideos.length >= 1 ? (
            <>
              <label htmlFor="fileInput">Choose more files</label>
              <Input
                onChange={handlefileselect}
                accept="video/*"
                type="file"
                multiple
                id="fileInput"
                hidden
              ></Input>
            </>
          ) : (
            <></>
          )}

          {thevideos.map((files, index) => (
            <video
              key={index}
              src={URL.createObjectURL(files)}
              width={140}
              height={70}
              controls
              alt=""
            />
          ))}
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#3c5e78] mb-1">
            Upload a video to extract audio{" "}
          </label>
          <Input
            onChange={(e) => setaudio(e.target.files[0])}
            accept="video/*"
            type="file"
          />
          {audio && (
            <video
              src={URL.createObjectURL(audio)}
              width={140}
              height={70}
              controls
              alt=""
            />
          )}
        </div>

        <Button type="submit" size="lg" className="rounded-4xl">
          Click me
        </Button>
      </form>
      <div></div>
    </div>
  );
};
export default Checker;

// Cloudinary Upload (FormData needed):

// Input: Actual file objects from user's device
// Purpose: Upload binary file data
// Method: FormData (handles binary data)
// Output: Gets back URL strings

// Database Save (JSON better):

// Input: URL strings from Cloudinary
// Purpose: Save metadata and references
// Method: JSON (simple text data)
// Output: Database record created
