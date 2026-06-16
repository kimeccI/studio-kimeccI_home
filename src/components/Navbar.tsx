/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sliders, Eye, Compass, Film, MessageCircle, Menu, X } from 'lucide-react';
import { SloganSettings, ThemeSettings } from '../types';

interface NavbarProps {
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  slogans: SloganSettings;
  theme: ThemeSettings;
  scrollToSection: (id: string) => void;
}

export default function Navbar({
  isAdmin,
  setIsAdmin,
  slogans,
  theme,
  scrollToSection
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'ABOUT', id: 'about-anchor', icon: Film },
    { label: 'WORK', id: 'portfolio', icon: Compass },
    { label: 'CONTACT', id: 'inquiry', icon: MessageCircle },
  ];

  const handleNavClick = (id: string) => {
    scrollToSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav
      id="main-navbar"
      className="sticky top-0 z-50 transition-all duration-300 border-b"
      style={{
        backgroundColor: `${theme.backgroundColor}dd`,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('hero')} 
            className="flex items-center cursor-pointer group"
          >
            {(slogans.headerLogoUrl || slogans.logoUrl) ? (
              <img 
                src={slogans.headerLogoUrl || slogans.logoUrl} 
                alt="Logo" 
                className="h-[30px] w-auto rounded-md object-contain"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div 
                className="w-[30px] h-[30px] rounded-lg flex items-center justify-center font-display font-black text-base transition-transform duration-500 group-hover:rotate-[360deg]"
                style={{
                  backgroundColor: theme.accentColor,
                  color: theme.backgroundColor
                }}
              >
                G
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="text-sm tracking-widest transition-opacity duration-200 cursor-pointer text-white hover:opacity-80"
                  style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 600 }}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Admin toggle Button */}
            <button
              id="admin-toggle-btn"
              onClick={() => setIsAdmin(!isAdmin)}
              className="flex items-center space-x-2 px-4 h-10 rounded-full font-sans font-semibold text-xs border tracking-wider transition-all duration-300 cursor-pointer hover:scale-105"
              style={{
                borderColor: isAdmin ? theme.accentColor : 'rgba(255, 255, 255, 0.15)',
                color: isAdmin ? theme.backgroundColor : theme.textColor,
                backgroundColor: isAdmin ? theme.accentColor : 'transparent',
              }}
            >
              {isAdmin ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>메인 사이트 보기</span>
                </>
              ) : (
                <>
                  <Sliders className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                  <span>스튜디오 관리자</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Quick Admin switch icon on mobile */}
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className="p-2 rounded-full border border-zinc-800"
              style={{
                backgroundColor: isAdmin ? theme.accentColor : 'transparent',
                borderColor: isAdmin ? theme.accentColor : 'rgba(255, 255, 255, 0.1)'
              }}
              title="관리자 전환"
            >
              <Sliders 
                className="w-4 h-4" 
                style={{ color: isAdmin ? theme.backgroundColor : theme.accentColor }} 
              />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md hover:bg-zinc-900 focus:outline-none"
              style={{ color: theme.textColor }}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden border-t animate-fade-in"
          style={{ 
            backgroundColor: theme.backgroundColor,
            borderColor: 'rgba(255, 255, 255, 0.08)' 
          }}
        >
          <div className="px-2 pt-3 pb-6 space-y-2">
            {navItems.map((item) => {
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="w-full text-left px-4 py-3 rounded-lg text-base text-white hover:bg-zinc-900 transition-colors"
                  style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 600 }}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-4 border-t border-zinc-900 px-4">
              <button
                onClick={() => {
                  setIsAdmin(!isAdmin);
                  setMobileMenuOpen(false);
                }}
                className="w-full h-11 flex items-center justify-center space-x-2 rounded-lg font-sans font-bold text-sm transition-all"
                style={{
                  backgroundColor: isAdmin ? theme.accentColor : 'rgba(255, 255, 255, 0.05)',
                  color: isAdmin ? theme.backgroundColor : theme.textColor,
                  border: isAdmin ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {isAdmin ? (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>메인 사이트 보기</span>
                  </>
                ) : (
                  <>
                    <Sliders className="w-4 h-4" style={{ color: theme.accentColor }} />
                    <span>스튜디오 관리자 모드</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
