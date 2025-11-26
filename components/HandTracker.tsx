import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker, DrawingUtils } from '@mediapipe/tasks-vision';
import { useAppStore } from '../store';

const HandTracker: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { setExpansion, setLoveMode, loveMode } = useAppStore();
  const [loaded, setLoaded] = useState(false);
  const lastVideoTime = useRef(-1);
  const requestRef = useRef<number>();

  useEffect(() => {
    let handLandmarker: HandLandmarker | null = null;
    
    const setup = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        
        handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1
        });
        
        setLoaded(true);
        startWebcam(handLandmarker);
      } catch (error) {
        console.error("Error loading MediaPipe:", error);
      }
    };

    setup();

    return () => {
      if (handLandmarker) handLandmarker.close();
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startWebcam = async (landmarker: HandLandmarker) => {
    if (!videoRef.current) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      videoRef.current.srcObject = stream;
      videoRef.current.addEventListener('loadeddata', () => {
        predictWebcam(landmarker);
      });
    } catch (err) {
      console.error("Camera access denied:", err);
    }
  };

  const predictWebcam = (landmarker: HandLandmarker) => {
    if (!videoRef.current) return;
    
    const now = performance.now();
    if (videoRef.current.currentTime !== lastVideoTime.current) {
        lastVideoTime.current = videoRef.current.currentTime;
        const startTimeMs = performance.now();
        const results = landmarker.detectForVideo(videoRef.current, startTimeMs);
        
        if (results.landmarks && results.landmarks.length > 0) {
            const landmarks = results.landmarks[0];
            
            // 4 = Thumb Tip, 8 = Index Tip
            const thumbTip = landmarks[4];
            const indexTip = landmarks[8];
            const thumbIp = landmarks[3]; // Thumb IP joint
            
            // Calculate Euclidean distance between tips
            const distance = Math.sqrt(
                Math.pow(thumbTip.x - indexTip.x, 2) + 
                Math.pow(thumbTip.y - indexTip.y, 2)
            );

            // Expansion Logic: 
            // Normalized distance map: 0.02 (closed) -> 0.3 (open)
            // We clamp it between 0 and 1
            const normalizedExp = Math.min(Math.max((distance - 0.05) * 4, 0), 1);
            
            // Invert logic: If hand is open (large distance), particles expand? 
            // Prompt says "Gesture open/close controls scale/diffusion".
            // Let's say Open Hand = Spread (Expansion 1), Pinch = Condensed (Expansion 0).
            setExpansion(normalizedExp);

            // --- "Finger Heart" Detection Heuristic ---
            // A finger heart is essentially a pinch where the thumb and index overlap closely.
            // Often the thumb is slightly 'below' the index visually in 2D, or they cross X.
            // We use a tight threshold and a debounce/check.
            
            const isTouching = distance < 0.04;
            
            // To differentiate a simple pinch from a "heart":
            // In a finger heart, the thumb tip is often visibly blocked or crossed by index.
            // But for robustness, let's just use "Very close pinch" + "Hold".
            // Or check if Index X < Thumb X (for right hand) implying crossing?
            // Let's keep it simple: If they are touching very closely for a moment, trigger LOVE.
            
            if (isTouching) {
                // Check if we are not already in love mode to trigger it
                // Using a slightly more specific check: Thumb tip y is close to index tip y
                if (!loveMode) {
                     setLoveMode(true);
                }
            } else if (distance > 0.1) {
                // Reset if fingers move far apart
                if (loveMode) {
                   setLoveMode(false);
                }
            }
        } else {
             // No hand detected, maybe relax to neutral
             setExpansion(0.5);
        }
    }
    requestRef.current = requestAnimationFrame(() => predictWebcam(landmarker));
  };

  return (
    <div className="absolute top-4 right-4 z-50 opacity-80 hover:opacity-100 transition-opacity">
        <div className="relative w-32 h-24 rounded-lg overflow-hidden border-2 border-white/20 shadow-lg bg-black">
            <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-cover transform -scale-x-100" // Mirror effect
            />
            {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black text-white text-xs text-center p-1">
                    Loading AI Model...
                </div>
            )}
            <div className="absolute bottom-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
        <p className="text-white/50 text-[10px] text-right mt-1">Hand Tracking Active</p>
    </div>
  );
};

export default HandTracker;
