/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Youtube, Instagram, Copyright } from 'lucide-react';
import { ThemeSettings, SloganSettings } from '../types';

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

interface FooterProps {
  theme: ThemeSettings;
  slogans: SloganSettings;
  scrollToSection: (id: string) => void;
}

export default function Footer({ theme, slogans, scrollToSection }: FooterProps) {
  return (
    <footer 
      id="main-footer"
      className="border-t transition-colors duration-300 relative"
      style={{ 
        backgroundColor: theme.backgroundColor,
        borderColor: 'rgba(255, 255, 255, 0.05)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={{ marginLeft: '233px', marginTop: '0px' }}>
        <div className="border-b border-zinc-900 pb-6">
          
          <div className="flex flex-col space-y-6 items-start text-left max-w-xl">
            {/* Dynamic Logo without title text */}
            <div className="flex items-center">
              {(slogans.footerLogoUrl || slogans.logoUrl) ? (
                <img 
                  src={slogans.footerLogoUrl || slogans.logoUrl} 
                  alt="Logo" 
                  className="h-16 w-auto rounded-md object-contain select-none"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div 
                  className="w-16 h-16 rounded-lg flex items-center justify-center font-display font-black text-3xl select-none"
                  style={{
                    backgroundColor: theme.accentColor,
                    color: theme.backgroundColor
                  }}
                >
                  G
                </div>
              )}
            </div>
            
            {/* Custom Footer Description / Body text */}
            {slogans.footerText && (
              <p className="text-zinc-500 text-xs md:text-[13px] leading-relaxed max-w-xl whitespace-pre-wrap -mt-2">
                {slogans.footerText}
              </p>
            )}
            
            {/* Information Desk Items (left-aligned, no title header) */}
            <div className="space-y-4 font-sans text-xs text-zinc-500 w-full pt-1">
              <div className="text-left leading-relaxed">
                <span className="text-zinc-650 font-bold block uppercase text-[9px] tracking-widest text-zinc-600 mb-1">BUSINESS ADDRESS</span>
                {slogans.footerAddress || '서울특별시 중구 다산로 210 스튜디오 키메찌 아틀리에 빌딩 4F'}
              </div>
              
              <div className="flex flex-col sm:flex-row sm:space-x-8 space-y-4 sm:space-y-0 w-full pt-1">
                <div className="text-left">
                  <span className="text-zinc-650 font-bold block uppercase text-[9px] tracking-widest text-zinc-600 mb-1">1:1 OPEN CHAT</span>
                  {slogans.footerPhone ? (
                    <a 
                      href={slogans.footerPhone.startsWith('http') ? slogans.footerPhone : `https://${slogans.footerPhone}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="hover:text-white transition-colors underline underline-offset-4 decoration-zinc-700 block break-all text-zinc-400"
                    >
                      {slogans.footerPhone}
                    </a>
                  ) : (
                    <span className="text-zinc-500">-</span>
                  )}
                </div>
                <div className="text-left">
                  <span className="text-zinc-650 font-bold block uppercase text-[9px] tracking-widest text-zinc-600 mb-1">EMAIL</span>
                  {slogans.footerEmail ? (
                    <a 
                      href={`mailto:${slogans.footerEmail}`}
                      className="hover:text-white transition-colors block text-zinc-400"
                    >
                      {slogans.footerEmail}
                    </a>
                  ) : (
                    <span className="text-zinc-500">-</span>
                  )}
                </div>
              </div>
            </div>

            {/* Dynamic Social links */}
            <div className="flex items-center space-x-3 pt-2">
              {(slogans.youtubeUrl || slogans.youtubeUrl === undefined) && (
                <a
                  href={slogans.youtubeUrl || 'https://youtube.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer group"
                >
                  <Youtube className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              )}
              {(slogans.instagramUrl || slogans.instagramUrl === undefined) && (
                <a
                  href={slogans.instagramUrl || 'https://instagram.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer group"
                >
                  <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              )}
              {(slogans.vimeoUrl || slogans.vimeoUrl === undefined) && (
                <a
                  href={slogans.vimeoUrl || 'https://tiktok.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer group"
                >
                  <Tiktok className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Copyright in font-sans matching body, updated to year 2026 */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 text-xs md:text-[13px] font-sans text-zinc-500 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-1.5">
            <span>ⓒ2026 studio kimeccI All rights reserved.</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="hover:text-zinc-400 transition-colors cursor-pointer">개인정보 처리방침</span>
            <span className="w-1 h-1 rounded-full bg-zinc-800" />
            <span className="hover:text-zinc-400 transition-colors cursor-pointer">이용 약관 및 리소스 저작권</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
