
import express from 'express';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import os from 'os';
import fs, { createReadStream } from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(cors());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

let bundleCache = null;


const uploadToCloudinary = (filePath, folder = 'reels') => {
  return new Promise((resolve, reject) => {
    const stream = createReadStream(filePath);
    const cloudStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'video',
        folder,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.pipe(cloudStream);
  });
};

app.post('/render', async (req, res) => {
  try {
    const { title, reelData, audiourl, videoUrls, width, height } = req.body;

    console.log(`[Render] Starting: ${title} - ${width}x${height}`);


    // Bundle only once (yeh pehli baar slow hoga, phir fast)
    if (!bundleCache) {
      console.log('[Bundle] Creating bundle...');
      const entry = path.join(process.cwd(), '../remotion/Root.jsx');
      bundleCache = await bundle(entry, () => { }, {
        webpackOverride: (config) => config,
      });
      console.log('[Bundle] Bundle created ✓');
    }

    const fps = 30;
    const durationInFrames = Math.round(reelData.metadata.duration * fps);


    const composition = await selectComposition({
      serveUrl: bundleCache,
      id: 'ReelVideo',
      inputProps: { reelData, audiourl, videoUrls, width, height },
    });

    const outputPath = path.join(os.tmpdir(), `${Date.now()}_${title}.mp4`);


    await renderMedia({
      composition,
      serveUrl: bundleCache,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: { reelData, audiourl, videoUrls, width, height },

      fps,
      durationInFrames,
      width,
      height,

      // QUALITY VS SPEED BALANCE
      // CRF: 23 = default quality (fast), 18 = high quality (slow)
      crf: 23, // Changed from 18 to 23 for FASTER rendering

      pixelFormat: 'yuv420p',
      audioCodec: 'aac',
      audioBitrate: '192k', // Reduced from 320k for speed

      // BROWSER SETTINGS - Optimized for speed
      chromiumOptions: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--single-process',
          '--disable-software-rasterizer',
        ],
      },

      timeoutInMilliseconds: 300000,

     concurrency: 1,


      enforceAudioTrack: true,
      muted: false,

      // IMAGE QUALITY - Lower = faster
      imageFormat: 'jpeg',
      jpegQuality: 80, // Reduced from 95 for speed (still good quality)
      offthreadVideoCacheSizeInBytes: 512 * 1024 * 1024, // 512MB cache


      // Progress tracking
      onProgress: ({ progress, renderedFrames, encodedFrames }) => {
        const percent = Math.round(progress * 100);
        if (percent % 10 === 0) { // Log every 10%
          console.log(`[Progress] ${percent}% - Frames: ${renderedFrames}/${durationInFrames}`);
        }
      },

      scale: 1, // Keep at 1, don't downscale
      everyNthFrame: 1, // Render every frame (don't skip)
      numberOfGifLoops: null,

      // Disable unnecessary features for speed
      proResProfile: undefined,
      x264Preset: 'fast',
    });


    const result = await uploadToCloudinary(outputPath);


    // Clean up temp file
    fs.unlinkSync(outputPath);

    res.json({
      success: true,
      reelurl: result.secure_url
    });

  } catch (error) {
    console.error('[Render error]', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Render server running on port ${PORT}`);
  console.log(`CPU Cores available: ${os.cpus().length}`);
});
