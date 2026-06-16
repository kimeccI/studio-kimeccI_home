/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { SloganSettings, ThemeSettings } from '../types';
import { getEmbedUrl } from '../utils';

interface ShowreelProps {
  slogans: SloganSettings;
  theme: ThemeSettings;
}

export default function Showreel({ slogans, theme }: ShowreelProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(60);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 450 });

  const embed = getEmbedUrl(slogans.showreelUrl);

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs === Infinity) return '0:00';
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 60);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, clickX / width));
    const targetTime = percentage * duration;
    
    if (embed.type === 'video' && videoRef.current) {
      videoRef.current.currentTime = targetTime;
    }
    setCurrentTime(targetTime);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
  }, [isMuted]);

  // Handle ResizeObserver for the canvas container as per instructions
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({
          width: Math.max(width, 320),
          height: Math.max(width * 0.5625, 180) // 16:9 aspect ratio
        });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Generative Canvas Animation representing a high-fidelity motion graphics simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      life: number;
    }> = [];

    // Seed particles
    const initParticles = () => {
      particles = [];
      const particleColors = [
        theme.accentColor,
        '#ffffff',
        '#ff4a4a',
        '#3b82f6',
        '#a855f7'
      ];
      for (let i = 0; i < 40; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 4 + 1,
          speedX: (Math.random() - 0.5) * 1.5,
          speedY: (Math.random() - 0.5) * 1.5,
          color: particleColors[Math.floor(Math.random() * particleColors.length)],
          life: Math.random() * 100
        });
      }
    };

    initParticles();

    let angle = 0;

    const render = () => {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw active motions if playing
      if (isPlaying) {
        angle += 0.015;
        if (embed.type === 'canvas') {
          setCurrentTime((prev) => (prev >= duration ? 0 : prev + 0.08));
        }
      }

      // Draw Center Orb / Kinetic Ring
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = Math.min(canvas.width, canvas.height) * 0.22;
      
      // Outer pulse ring
      ctx.strokeStyle = `${theme.accentColor}33`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius + Math.sin(angle * 2) * 20, 0, Math.PI * 2);
      ctx.stroke();

      // Golden Sine Waves
      ctx.strokeStyle = theme.accentColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        const value = isPlaying ? Math.sin(x * 0.01 + angle * 4) * Math.cos(x * 0.005 + angle) : Math.sin(x * 0.01) * Math.cos(x * 0.005);
        const y = centerY + value * (baseRadius * 0.6);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Orbiting particles or text overlays
      const pulseRadius = baseRadius + Math.cos(angle * 3) * 10;
      ctx.fillStyle = theme.accentColor;
      ctx.beginPath();
      ctx.arc(
        centerX + Math.cos(angle) * pulseRadius,
        centerY + Math.sin(angle) * pulseRadius,
        8,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Second complementary orb
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(
        centerX + Math.cos(angle + Math.PI) * (baseRadius - 10),
        centerY + Math.sin(angle + Math.PI) * (baseRadius - 10),
        4,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Manage background particles
      particles.forEach((p) => {
        if (isPlaying) {
          p.x += p.speedX;
          p.y += p.speedY;
          p.life -= 0.5;

          if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
          if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

          if (p.life <= 0) {
            p.x = Math.random() * canvas.width;
            p.y = Math.random() * canvas.height;
            p.life = Math.random() * 100 + 50;
          }
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.1, p.life / 150);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, theme.accentColor, currentTime]);

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section id="showreel" className="relative pt-0 pb-0 overflow-hidden group/showreel">
      {/* Pure Black Canvas Background with unified style */}

      <div className="w-full relative">
        <div className="relative rounded-none overflow-hidden bg-zinc-950 group/player">
          {/* Showreel Player Canvas Arena (Plays iframe/video if URL exists, otherwise falls back to generative canvas animation) */}
          <div 
            ref={containerRef}
            className="relative w-full aspect-video select-none bg-[#0a0a0a]"
          >
            {/* Invisible anchor for ABOUT navigation to target the upper-middle of showreel */}
            <div 
              id="about-anchor" 
              className="absolute top-[25%] left-0 w-full h-px pointer-events-none" 
            />

            {embed.type === 'canvas' ? (
              <>
                <canvas
                  ref={canvasRef}
                  width={dimensions.width}
                  height={dimensions.height}
                  className="w-full h-full block"
                />

                {/* Simulated Audio Visualizer overlay */}
                <div className="absolute left-6 bottom-6 flex items-end space-x-1 pointer-events-none h-12 z-20">
                  {[...Array(15)].map((_, i) => {
                    const activeHeight = isPlaying 
                      ? Math.max(8, Math.sin(currentTime * 3 + i) * 28 + 24)
                      : 6;
                    return (
                      <div
                        key={i}
                        className="w-1 rounded-t opacity-70"
                        style={{
                          height: `${activeHeight}px`,
                          backgroundColor: theme.accentColor,
                          transition: 'height 80ms ease'
                        }}
                      />
                    );
                  })}
                </div>

                {/* Interactive Big Play Overlay */}
                <AnimatePresence>
                  {!isPlaying && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsPlaying(true)}
                      className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center cursor-pointer group z-20"
                    >
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:scale-110"
                        style={{ backgroundColor: theme.accentColor }}
                      >
                        <Play className="w-8 h-8 text-black fill-current ml-1" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : embed.type === 'iframe' ? (
              <iframe
                src={embed.url}
                className="w-full h-full border-0 absolute inset-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen
                referrerPolicy="no-referrer"
                title={slogans.showreelTitle}
              />
            ) : (
              <video
                ref={videoRef}
                src={embed.url}
                className="w-full h-full object-cover absolute inset-0"
                controls={false}
                autoPlay={isPlaying}
                muted={isMuted}
                loop
                playsInline
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              />
            )}

            {/* Natural gradient blackout at the bottom of the video */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none z-10" />

            {/* Main Brand Slogan positioned in the blackout part of the video */}
            {slogans.sloganSubtitle && (
              <div id="main-brand-slogan" className="absolute inset-x-0 bottom-6 sm:bottom-10 md:bottom-14 lg:bottom-18 z-20 pointer-events-none select-none">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <p 
                    className="text-zinc-200 text-[19px] sm:text-[21px] md:text-[22px] lg:text-[23px] font-normal leading-relaxed opacity-95 select-none text-left whitespace-pre-wrap"
                    style={{ 
                      fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', 
                      letterSpacing: '-0.01em',
                      wordBreak: 'keep-all'
                    }}
                  >
                    {slogans.sloganSubtitle}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Player Controllers - Minimal Floating Controls row inside the bottom margin on hover */}
          <div className="absolute bottom-6 right-6 opacity-0 group-hover/player:opacity-100 transition-all duration-300 z-30 flex items-center space-x-1.5 pointer-events-auto bg-black/70 backdrop-blur-md border border-zinc-800/60 p-1.5 rounded-xl">
            
            {/* Play/Pause */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPlaying(!isPlaying);
              }}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-zinc-300 hover:text-white"
              title={isPlaying ? '일시정지' : '재생'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current" />
              )}
            </button>

            <div className="w-[1px] h-3 bg-zinc-800" />

            {/* Mute/Sound toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-zinc-300 hover:text-white"
              title={isMuted ? '음소거 해제' : '음소거'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-amber-500 fill-current" />
              ) : (
                <Volume2 className="w-4 h-4 fill-current" />
              )}
            </button>

          </div>

        </div>
      </div>
    </section>
  );
}
