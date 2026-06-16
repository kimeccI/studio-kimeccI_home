/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ThemeSettings, SloganSettings } from '../types';
import { Sparkles, User, ShieldCheck, Youtube, Instagram } from 'lucide-react';

const Tiktok = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

interface AboutPageProps {
  theme: ThemeSettings;
  slogans: SloganSettings;
}

export default function AboutPage({ theme, slogans }: AboutPageProps) {
  const getFontClass = (style?: 'sans' | 'display' | 'mono') => {
    if (style === 'mono') return 'font-mono';
    if (style === 'display') return 'font-display font-medium tracking-tight';
    return 'font-sans';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-10 sm:pb-16 min-h-[80vh] relative">
      {/* Decorative Orbs */}
      <div 
        className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full blur-[180px] opacity-10 pointer-events-none"
        style={{ backgroundColor: theme.accentColor }}
      />
      <div 
        className="absolute top-1/3 left-10 w-72 h-72 rounded-full blur-[200px] opacity-10 pointer-events-none"
        style={{ backgroundColor: theme.accentColor }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="space-y-10"
      >
        {/* 1. 상단 브랜드 소개 텍스트 박스 (Section 1) */}
        <div className="w-full text-left">
          <p 
            className="text-base sm:text-lg leading-relaxed font-sans whitespace-pre-wrap"
            style={{ color: slogans.aboutTextColor || '#dddddd' }}
          >
            {slogans.aboutText || 'Founded in 2024, Studio kimecci is a small 2D animation studio creating music video, commercial or personal animated film.'}
          </p>
        </div>

        {/* 하단 단 구성 (Section 2 & 3) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
          {/* 2. 좌측 원형 프로필 이미지 + 프로필 하단 명 (Section 2) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-start text-center space-y-4 lg:w-[250px] shrink-0 mx-auto lg:mx-0 lg:ml-[1px] lg:mr-0 lg:mb-0 lg:mt-[9px]">
            <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-full overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center shrink-0">
              {slogans.aboutImage ? (
                <img 
                  src={slogans.aboutImage} 
                  alt="About Director Profile" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex flex-col items-center space-y-1.5">
                  <User className="w-12 h-12 text-zinc-600" />
                  <span className="text-[10px] text-zinc-500 font-mono">UPLOAD IMG</span>
                </div>
              )}
            </div>

            {/* 네임 소개를 위한 중앙 정렬 텍스트 박스 */}
            <div className="space-y-1 text-center w-full">
              <h3 
                className={`font-normal tracking-tight whitespace-pre-wrap ${getFontClass(slogans.aboutNameFont)}`}
                style={{ 
                  fontSize: slogans.aboutNameSize || '20px', 
                  color: slogans.aboutNameColor || theme.accentColor 
                }}
              >
                {slogans.aboutName || 'Studio Kimecci Team Launcher'}
              </h3>
              
              {/* SNS Links */}
              <div className="flex items-center justify-center space-x-3 pt-3">
                <a
                  href={slogans.youtubeUrl || 'https://youtube.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer group hover:border-zinc-700"
                >
                  <Youtube className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href={slogans.instagramUrl || 'https://instagram.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer group hover:border-zinc-700"
                >
                  <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href={slogans.vimeoUrl || 'https://tiktok.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer group hover:border-zinc-700"
                >
                  <Tiktok className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* 3. 우측 이력 및 핵심 연혁 (Section 3) */}
          <div className="lg:col-span-8 space-y-4 text-left w-full">
            <div 
              className="p-6 sm:p-8 lg:pt-[31px] lg:pb-[33px] lg:pr-[32px] lg:pl-8 lg:-ml-[120px] bg-zinc-950/70 border border-zinc-900 rounded-2xl relative shadow-2xl backdrop-blur-md space-y-6"
              style={{ 
                borderRadius: theme.borderRadius === 'none' ? '0px' : theme.borderRadius === 'sm' ? '4px' : theme.borderRadius === 'md' ? '8px' : theme.borderRadius === 'lg' ? '16px' : '24px' 
              }}
            >
              
              {/* 작가 이력 */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold tracking-wider text-zinc-200" style={{ color: theme.accentColor }}>
                  작가 이력
                </h4>
                <p 
                  className={`whitespace-pre-line leading-relaxed ${getFontClass(slogans.aboutHistoryFont)}`}
                  style={{ 
                    fontSize: slogans.aboutHistorySize || '14px', 
                    color: slogans.aboutHistoryColor || '#a1a1aa' 
                  }}
                >
                  {slogans.aboutCareer || slogans.aboutHistory || '등록된 작가 이력이 없습니다.'}
                </p>
              </div>

              {/* 참여 프로젝트 */}
              <div className="space-y-2 pt-6 border-t border-zinc-900/60">
                <h4 className="text-sm font-semibold tracking-wider text-zinc-200" style={{ color: theme.accentColor }}>
                  참여 프로젝트
                </h4>
                <p 
                  className={`whitespace-pre-line leading-relaxed ${getFontClass(slogans.aboutHistoryFont)}`}
                  style={{ 
                    fontSize: slogans.aboutHistorySize || '14px', 
                    color: slogans.aboutHistoryColor || '#a1a1aa' 
                  }}
                >
                  {slogans.aboutProjects || '등록된 참여 프로젝트가 없습니다.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
