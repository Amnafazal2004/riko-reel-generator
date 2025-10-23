


// Cinematic & Dramatic
import "@fontsource/montserrat";
import "@fontsource/playfair-display";
import "@fontsource/oswald";
import "@fontsource/crimson-text";
import "@fontsource/libre-baskerville";
import "@fontsource/bodoni-moda";
import "@fontsource/dm-sans";
import "@fontsource/cormorant-garamond";
import "@fontsource/montserrat-alternates";
import "@fontsource/cinzel";
import "@fontsource/eb-garamond";
import "@fontsource/quicksand";

// Trendy & Aesthetic
import "@fontsource/poppins";
import "@fontsource/inter";
import "@fontsource/nunito";
import "@fontsource/source-sans-pro";
import "@fontsource/lato";

// Vintage & Vibes
import "@fontsource/merriweather";
import "@fontsource/lora";
import "@fontsource/pt-serif";
import "@fontsource/vollkorn";
import "@fontsource/alegreya";

// Modern & Minimal
import "@fontsource/roboto";
import "@fontsource/open-sans";
import "@fontsource/raleway";
import "@fontsource/work-sans";

import { useCurrentFrame, Video, interpolate, Easing, useVideoConfig, Sequence, Audio , OffthreadVideo} from 'remotion';
import React from 'react';
import { spring } from 'remotion';

function getvideourls(clip, videourls) {
    const videono = parseInt(clip.replace('video', ''))
    return videourls[videono - 1]
}

// Yeh component JSON ke hisab se video banayega
export function ReelVideo({ reelData, audiourl, videoUrls, height }) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig()
    const currentTime = frame / fps; // 30 FPS

    // Current text find karo
    const currentTexts = reelData.overlays.text.filter(text =>
        currentTime >= text.timing.start && currentTime < text.timing.end
    );
    return (


        <div style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            backgroundColor: reelData.metadata.backgroundcolor
        }}>
            {
                videoUrls.map((url, i) => (
                    <Video
                        key={`preload-${i}`}
                        src={url}
                        style={{ display: "none" }} // invisible preload
                    />
                ))
            }
            {/* Video scenes */}
            {reelData.timeline.map((scene, index) => {
                const video = getvideourls(scene.clip, videoUrls)

                let sceneStyle = {
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    filter: `
                        brightness(${1 + (scene.effects.color_grading.brightness / 100)})
                        contrast(${1 + (scene.effects.color_grading.contrast / 100)})
                        saturate(${1 + (scene.effects.color_grading.saturation / 100)})
                    `,
                };

                // Zoom_in effect as transform
                if (scene.transitions?.type === "zoom_in") {
                    const startFrame = scene.transitions.startTime * fps;
                    const endFrame = scene.transitions.endTime * fps;
                    const scale = interpolate(frame, [startFrame, endFrame], [0.5, 1], { easing: Easing.easeOut, extrapolateRight: 'clamp' });
                    sceneStyle.transform = `scale(${scale})`;
                }
                if (scene.transitions?.type === "fadein") {
                    const startFrame = scene.transitions.startTime * fps;
                    const endFrame = scene.transitions.endTime * fps;
                    const opacity = interpolate(frame, [startFrame, endFrame], [0, 1], { easing: Easing.easeIn, extrapolateRight: "clamp" });
                    sceneStyle.opacity = opacity;
                }
                if (scene.transitions?.type === "fadeout") {
                    const startFrame = scene.transitions.startTime * fps;
                    const endFrame = scene.transitions.endTime * fps;
                    const opacity = interpolate(frame, [startFrame, endFrame], [1, 0], { easing: Easing.easeOut, extrapolateRight: "clamp" });
                    sceneStyle.opacity = opacity;
                }
                if (scene.transitions?.type === "slide_left") {
                    const startFrame = scene.transitions.startTime * fps;
                    const endFrame = scene.transitions.endTime * fps;
                    const translateX = interpolate(
                        frame,
                        [startFrame, endFrame],
                        [-1920, 0],
                        { easing: Easing.outExpo, extrapolateRight: "clamp" }
                    );
                    sceneStyle.transform = `translateX(${translateX}px)`;
                }
                if (scene.transitions?.type === "slide_right") {
                    const startFrame = scene.transitions.startTime * fps;
                    const endFrame = scene.transitions.endTime * fps;
                    const translateX = interpolate(
                        frame,
                        [startFrame, endFrame],
                        [1920, 0],
                        { easing: Easing.outExpo, extrapolateRight: "clamp" }
                    );
                    sceneStyle.transform = `translateX(${translateX}px)`;
                }
                if (scene.transitions?.type === "slide_bottom") {
                    const startFrame = scene.transitions.startTime * fps;
                    const endFrame = scene.transitions.endTime * fps;
                    const translateY = interpolate(
                        frame,
                        [startFrame, endFrame],
                        [1920, 0],
                        { easing: Easing.outExpo, extrapolateRight: "clamp" }
                    );
                    sceneStyle.transform = `translateY(${translateY}px)`;
                }
                if (scene.transitions?.type === "slide_up") {
                    const startFrame = scene.transitions.startTime * fps;
                    const endFrame = scene.transitions.endTime * fps;
                    const translateY = interpolate(
                        frame,
                        [startFrame, endFrame],
                        [-1920, 0],
                        { easing: Easing.outExpo, extrapolateRight: "clamp" }
                    );
                    sceneStyle.transform = `translateY(${translateY}px)`;
                }

                const overlapFrames = scene.transitions.type === 'none' ? 8 : 4
                const startFrame = index === 0 ? 0 : (scene.startTime * fps) - overlapFrames;
                const durationFrames = (scene.duration * fps) + (index === reelData.timeline.length - 1 ? 0 : overlapFrames);

                return (
                    <div key={index} style={sceneStyle}>
                        <Sequence
                            from={startFrame}
                            durationInFrames={durationFrames}
                        >
                            <OffthreadVideo
                                src={video}
                                style={sceneStyle}
                                preload="auto"
                                pauseWhenBuffering={false}     
                                muted
                            />
                        </Sequence>
                    </div>
                );
            })}
            {audiourl && (
                <Audio
                    src={audiourl}
                    volume={1}
                />
            )}

            {/* Text overlays */}
            {currentTexts.map((writing, index) => {
                let Textstyle = {
                    position: 'absolute',
                    left: writing.position.x === 'center' ? '50%' : writing.position.x,
                    top: Math.round((writing.position.y / 100) * height),
                    transform: writing.position.x === 'center' ? 'translateX(-50%)' : 'none',
                    fontFamily: writing.font,
                    fontSize: Math.round((writing.fontSize / 100) * height),
                    fontWeight: writing.fontWeight,
                    lineHeight: '1.3',
                    textAlign: 'center',
                    maxWidth: '85%',
                    color: writing.color,
                    textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.4)',
                    zIndex: 10,
                    wordWrap: 'break-word'
                };

                if (writing.animation?.type === "fadein") {
                    const opacity = interpolate(
                        frame,
                        [writing.animation.startTime * fps, (writing.animation.endTime) * fps],
                        [0, 1],
                        { easing: Easing.easeIn, extrapolateRight: "clamp" }
                    );
                    Textstyle.opacity = opacity;
                }
                if (writing.animation?.type === "fadeout") {
                    const opacity = interpolate(
                        frame,
                        [writing.animation.startTime * fps, (writing.animation.endTime) * fps],
                        [1, 0],
                        { easing: Easing.easeOut, extrapolateRight: "clamp" }
                    );
                    Textstyle.opacity = opacity;
                }
                if (writing.animation?.type === "bounce") {
                    const scale = spring({
                        fps,
                        frame: frame - writing.animation.startTime * fps,
                        config: {
                            damping: 6,
                            stiffness: 120,
                        },
                    });
                    Textstyle.transform += ` scale(${scale})`;
                }

                const textContent = writing.animation?.type === "typewriter"
                    ? writing.content.slice(0, Math.max(0, frame - writing.animation.startTime * fps))
                    : writing.content;

                return (
                    <div key={index} style={Textstyle}>
                        {textContent}
                    </div>
                );
            })}
        </div>
    );
}

