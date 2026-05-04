"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function useYouTubePlayer({
  videoId,
  isMainPlayerActive,
}: {
  videoId: string | null;
  isMainPlayerActive: boolean;
}) {
  const playerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const player = playerRef.current;

  // ---- MUTE / UNMUTE ----
  const mute = () => {
    if (!player) return;
    player.mute();
    player.setVolume(0);
    setIsMuted(true);
  };

  const unmute = () => {
    if (!player) return;
    player.unMute();
    player.setVolume(100);
    setIsMuted(false);
  };

  const toggleMute = () => {
    if (isMuted) unmute();
    else mute();
  };

  // ---- PLAY / PAUSE ----
  const play = () => {
    if (!player) return;
    player.playVideo();
    setIsPlaying(true);
  };

  const pause = () => {
    if (!player) return;
    player.pauseVideo();
    setIsPlaying(false);
  };
  const stop = () => {
    if (!player) return;
    player.stopVideo();
    setIsPlaying(false);
  };
  const togglePlay = () => {
    if (isPlaying) pause();
    else play();
  };

  // ---- INIT PLAYER ----
  useEffect(() => {
    if (!videoId) return;

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);

      window.onYouTubeIframeAPIReady = initPlayer;
    }

    function initPlayer() {
      playerRef.current = new window.YT.Player(`yt-player-${videoId}`, {
        videoId,
        playerVars: {
          autoplay: 0, // controlled manually
          showinfo: 0,
          controls: 0,
          rel: 0,
        },
        events: {
          onReady: () => setIsReady(true),
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING)
              setIsPlaying(true);
            if (event.data === window.YT.PlayerState.PAUSED)
              setIsPlaying(false);
            if (event.data === window.YT.PlayerState.ENDED) setIsPlaying(false);
          },
          onError: (event: any) => {
            setIsReady(false);
            switch (event.data) {
              case 2:
                console.error("Invalid video ID");
                break;
              case 5:
                console.error("HTML5 player error");
                break;
              case 100:
                console.error("Video not found or removed/private");
                break;
              case 101:
              case 150:
                console.error("Embedding not allowed or age restricted");
                break;
              default:
                console.error("Unknown YouTube player error", event.data);
            }
          },
        },
      });
    }
  }, [videoId]);

  // ---- AUTO-PLAY TRAILER ON READY ----
  useEffect(() => {
    if (!player || !isReady) return;
    if (!isMainPlayerActive) {
      const timer = setTimeout(() => {
        play();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isReady, player, isMainPlayerActive]);

  useEffect(() => {
    if (!player || !isReady) return;

    if (isMainPlayerActive) {
      pause();
    }
  }, [isMainPlayerActive, isReady, player]);

  return {
    isReady,
    isMuted,
    isPlaying,
    player,
    play,
    pause,
    togglePlay,
    mute,
    unmute,
    toggleMute,
  };
}
