import { useEffect, useRef } from 'react';

interface FadingVideoProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function FadingVideo({ src, className, style }: FadingVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rAFRef = useRef<number | null>(null);
  const fadeOutTriggeredRef = useRef(false);

  const FADE_MS = 500;
  const FADE_OUT_LEAD = 0.55;

  const fadeTo = (targetOpacity: number, duration: number) => {
    if (!videoRef.current) return;
    
    // Cancel any ongoing fade
    if (rAFRef.current) {
      cancelAnimationFrame(rAFRef.current);
    }

    const video = videoRef.current;
    const startOpacity = parseFloat(video.style.opacity || '0');
    const startTime = performance.now();

    const animateFade = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentOpacity = startOpacity + (targetOpacity - startOpacity) * progress;
      video.style.opacity = currentOpacity.toString();

      if (progress < 1) {
        rAFRef.current = requestAnimationFrame(animateFade);
      }
    };

    rAFRef.current = requestAnimationFrame(animateFade);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Initial state
    video.style.opacity = '0';

    const handleLoadedData = () => {
      video.style.opacity = '0';
      video.play().catch((err) => console.log('Autoplay blocked:', err));
      fadeTo(1, FADE_MS);
    };

    const handleTimeUpdate = () => {
      if (!video.duration || video.duration <= 0) return;
      
      const timeRemaining = video.duration - video.currentTime;
      if (!fadeOutTriggeredRef.current && timeRemaining <= FADE_OUT_LEAD && timeRemaining > 0) {
        fadeOutTriggeredRef.current = true;
        fadeTo(0, FADE_MS);
      }
    };

    const handleEnded = () => {
      video.style.opacity = '0';
      setTimeout(() => {
        if (!video) return;
        video.currentTime = 0;
        video.play().catch((err) => console.log('Replay blocked:', err));
        fadeOutTriggeredRef.current = false;
        fadeTo(1, FADE_MS);
      }, 100);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    // If source is changed or video is already ready
    if (video.readyState >= 2) {
      handleLoadedData();
    }

    return () => {
      if (rAFRef.current) {
        cancelAnimationFrame(rAFRef.current);
      }
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      muted
      playsInline
      preload="auto"
      className={className}
      style={{ ...style, opacity: 0 }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
