
"use client"

import { useReelContext } from '@/Context/ReelContext';
import { Player } from '@remotion/player';
import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import axios from "axios"
import { ReelVideo } from './ReelVideo';


export default function VideoPlayer() {
    const { reelData, audiourl, videoUrls, userid, setfreetiercount,freetiercount , email} = useReelContext()
    const duration = Math.round(reelData.metadata.duration)
    const playerRef = useRef(null);
    const audioRef = useRef(null);
    const [width, setwidth] = React.useState(360);
    const [height, setheight] = React.useState(640);
    const title = reelData.metadata.title


    const choosequality = (num) => {
        if (num === 1080) {
            setwidth(1080);
            setheight(1920)
        }
        else if (num === 720) {
            setwidth(720);
            setheight(1280)
        }
        else {
            setwidth(360);
            setheight(640)
        }
    }

    const handleDownload = async () => {
        console.log("hi", width, height)
        const { data } = await axios.post(`/api/rendervideo`, {
            title,
            reelData,
            audiourl,
            videoUrls,
            width,
            height,
            userid,
        })

        if (data?.reelurl) {
            console.log("got the data 2", data)
            console.log("got the reel 2", data.reelurl)

            const response = await fetch(data.reelurl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `${title}.mp4`;
            document.body.appendChild(a);
            a.click();

            a.remove();
            window.URL.revokeObjectURL(url);
            console.log("downloaded")
            const newcount = freetiercount + 1
            setfreetiercount(newcount)
            console.log(newcount)
            await axios.put('/api/freetier', {freetiercount: newcount, email})
        }
    }

    // Audio sync with player
    useEffect(() => {
        if (!playerRef.current || !audioRef.current || !audiourl) return;

        const player = playerRef.current;
        const audio = audioRef.current;
        let animationFrameId;

        const syncAudio = () => {
            if (!player || !audio) return;

            try {
                const currentFrame = player.getCurrentFrame();
                const expectedTime = currentFrame / 30; // 30 FPS
                
                // Sync audio with video time
                if (Math.abs(audio.currentTime - expectedTime) > 0.15) {
                    audio.currentTime = expectedTime;
                }

                // Keep syncing while playing
                if (!audio.paused) {
                    animationFrameId = requestAnimationFrame(syncAudio); //Syncs with browser's refresh rate (~60 FPS)
                }
            } catch (error) {
                console.log('Sync error:', error);
            }
        };

        // Handle play/pause
        const handlePlay = () => {
            const currentFrame = player.getCurrentFrame();
            audio.currentTime = currentFrame / 30;
            
            audio.play()
                .then(() => {
                    syncAudio();
                })
                .catch(err => console.log('Audio play error:', err));
        };

        const handlePause = () => {
            audio.pause();
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };

        // Monitor player state changes
        const checkInterval = setInterval(() => {
            const isPlaying = player.isPlaying?.();
            
            if (isPlaying && audio.paused) {
                handlePlay();
            } else if (!isPlaying && !audio.paused) {
                handlePause();
            }
        }, 100);

        return () => {
            clearInterval(checkInterval);
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        };
    }, [audiourl]);

    return (
        <div>
            {/* Hidden audio for preview - ye preview mein chalega */}
            {audiourl && (
                <audio 
                    ref={audioRef} 
                    src={audiourl} 
                    style={{ display: 'none' }}
                />
            )}

            <Player
                ref={playerRef}
                component={ReelVideo}
                inputProps={{ 
                    reelData, 
                    audiourl: null, // Preview mein null, render mein original audiourl use hoga
                    videoUrls, 
                    width, 
                    height 
                }}
                durationInFrames={(duration * 30)}
                compositionWidth={width}      
                compositionHeight={height}
                fps={30}
                controls
                clickToPlay
                autoPlay={false}
                style={{
                    width: 300,
                    height: 500
                }}
            />
            
            <div className="mt-4 space-x-2">
                <Button onClick={() => choosequality(1080)}>1080p</Button>
                <Button onClick={() => choosequality(720)}>720p</Button>
                <Button onClick={() => choosequality(360)}>360p</Button>
                <Button onClick={handleDownload}>Download</Button>
            </div>
        </div>
    );
}


// What is ref?
// ref is like a sticky note that you attach to an element so you can find it and control it later.

// Normal variable - Gets reset on every render
//let myAudio = null;  //  This gets reset to null every time component re-renders

// useRef - Persists across renders
//const audioRef = useRef(null);  // ✅ =This keeps its value even when component re-renders

//const playerRef = useRef(null); 
// playerRef = null

// playerRef = { current: null }
// audioRef = { current: null }


//sab se pehlay audioref aur player-ref dono null hain
//wo jb return main ghussa to usne Html ka audio element dekha where ref={audioref} to ref ne sticky note lagadia audio element per
//so ab audioref.current=<audio> (ye useRef currently kia horaha ye batata hai through current)
//(aur audio components k saarey elements audioref use kersakta)
//jesay hi wo Player component main ayega ref={setPlayerref} hogaya to matlab ref ne sticky note lagadia Playercomponent per
//ab jo playerref=<Player>  (iska matlab <Player> ye component k ander jo bhi functionalities hain wo player-ref use kersakta)
//now kyun k player-ref change hua aur use effect player ref per depend kerta hai to ab useeffect chalay ga foran
//user click kareyga play per to handleplay() chalay ga 
//agar play hai to handleplay ka function chalayga us k ander play hotay hi syncAudio kareyingy
//chcak kareyingy k jo time hona chahiye aur jo time audio ka hai us main bht drift hai to audio=expected time kerdeingy
//aur ye baar baar kareingy through request animation frame kyun k wo sync kerta hai browser k refresh rate k saath
//ye ek tarhan ka loop hota hai hota rahay ga aesa unless pause ka button dabaya ho
//pause daba ker ye chalay ga k koi animation frame id ha to cancel kerday sync kerna 



//audio component k ander ye built in methods hotay hain

// // Ye sab methods HTML5 Audio API ke hain (browser provides)
// audio.play()           // Audio shuru karo
// audio.pause()          // Audio roko
// audio.load()           // Audio reload karo
// audio.fastSeek(time)   // Specific time pe jao (fast)

// // Aur properties bhi:
// audio.currentTime      // Current playback position (seconds me)
// audio.duration         // Total length (seconds me)
// audio.volume           // Volume (0.0 to 1.0)
// audio.playbackRate     // Speed (1.0 = normal, 2.0 = 2x speed)
// audio.paused           // true/false - paused hai ya nahi?
// audio.ended            // true/false - khatam hua ya nahi?