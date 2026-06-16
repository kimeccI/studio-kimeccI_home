/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Showreel from './components/Showreel';
import PortfolioGrid from './components/PortfolioGrid';
import InquiryForm from './components/InquiryForm';
import AboutPage from './components/AboutPage';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';

import { Project, ThemeSettings, SloganSettings, Inquiry } from './types';
import { INITIAL_PROJECTS, DEFAULT_THEME, DEFAULT_SLOGANS, INITIAL_INQUIRIES } from './data';
import { Sparkles, ArrowDownCircle, Info, Database, Eye } from 'lucide-react';

export default function App() {
  // Safe LocalStorage state hooks And Legacy Category Auto-Mapper
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('kimecci_projects') || 
                    localStorage.getItem('gimetti_projects') || 
                    localStorage.getItem('projects') ||
                    localStorage.getItem('kimecci_projects_backup');
      if (saved) {
        const parsed = JSON.parse(saved) as Project[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p) => {
            // If the category is invalid/legacy 'brand', map it to 'ad' (COMMERCIAL) so it renders and saves correctly
            if ((p.category as string) === 'brand') {
              return { ...p, category: 'ad' };
            }
            if ((p.category as string) === 'motion') {
              return { ...p, category: 'design' };
            }
            return p;
          });
        }
      }
      return INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  const [theme, setTheme] = useState<ThemeSettings>(() => {
    try {
      const saved = localStorage.getItem('kimecci_theme') || 
                    localStorage.getItem('gimetti_theme') || 
                    localStorage.getItem('theme');
      return saved ? { ...DEFAULT_THEME, ...JSON.parse(saved) } : DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  });

  const [slogans, setSlogans] = useState<SloganSettings>(() => {
    try {
      const saved = localStorage.getItem('kimecci_slogans') || 
                    localStorage.getItem('gimetti_slogans') || 
                    localStorage.getItem('slogans');
      if (saved) {
        const parsed = JSON.parse(saved) as SloganSettings;
        if (!parsed.contactTitle || parsed.contactTitle.includes('PROJECT PROPOSAL') || parsed.contactTitle.includes('협업 제안서')) {
          parsed.contactTitle = 'CONTACT';
        }
        if (!parsed.contactBtnText || parsed.contactBtnText === '프로포절 발송하기') {
          parsed.contactBtnText = '프로젝트 제안하기';
        }
        return { ...DEFAULT_SLOGANS, ...parsed };
      }
      return DEFAULT_SLOGANS;
    } catch {
      return DEFAULT_SLOGANS;
    }
  });

  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    try {
      const saved = localStorage.getItem('kimecci_inquiries') || 
                    localStorage.getItem('gimetti_inquiries') || 
                    localStorage.getItem('inquiries');
      return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
    } catch {
      return INITIAL_INQUIRIES;
    }
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<string>('');

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const page = params.get('page');
      if (page) {
        setCurrentPage(page);
      }
    } catch (e) {
      console.warn('URL parsing error:', e);
    }
  }, []);

  // Sync with LocalStorage
  useEffect(() => {
    try {
      if (projects && projects.length > 0) {
        localStorage.setItem('kimecci_projects', JSON.stringify(projects));
        // Keep a backup key to recover in case of a fatal error
        localStorage.setItem('kimecci_projects_backup', JSON.stringify(projects));
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem('kimecci_theme', JSON.stringify(theme));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('kimecci_slogans', JSON.stringify(slogans));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [slogans]);

  useEffect(() => {
    try {
      localStorage.setItem('kimecci_inquiries', JSON.stringify(inquiries));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [inquiries]);

  // Inject Theme properties into Document root dynamically
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-bg', theme.backgroundColor);
    root.style.setProperty('--theme-accent', theme.accentColor);
    root.style.setProperty('--theme-text', theme.textColor);
    root.style.setProperty('--theme-card-bg', theme.cardBackgroundColor);

    // Compute RGB for glowing values on background panels
    const hexToRgb = (hex: string) => {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
      return result 
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '255, 201, 46';
    };
    root.style.setProperty('--theme-accent-rgb', hexToRgb(theme.accentColor));
  }, [theme]);

  // Synchronize Tab title & favicon dynamically
  useEffect(() => {
    document.title = slogans.siteTitle || 'studio kimeccI';
  }, [slogans.siteTitle]);

  useEffect(() => {
    if (slogans.faviconUrl) {
      let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = slogans.faviconUrl;
    }
  }, [slogans.faviconUrl]);

  // Custom smooth scrolling logic with mode switcher fallback
  const scrollToSection = (id: string) => {
    if (isAdmin) {
      setIsAdmin(false);
      // Wait for React state render cycle to end prior to scrolling
      setTimeout(() => {
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleAddInquiry = (newInq: Omit<Inquiry, 'id' | 'submittedAt' | 'status'>) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const formattedInquiry: Inquiry = {
      ...newInq,
      id: `inq_${Date.now()}`,
      submittedAt: formattedDate,
      status: 'pending'
    };

    setInquiries((prev) => [formattedInquiry, ...prev]);
  };

  // Determine active Typography class based on Admin panel setup
  const fontClass = theme.fontFamily === 'mono' 
    ? 'font-mono' 
    : theme.fontFamily === 'display' 
      ? 'font-display' 
      : 'font-sans';

  return (
    <div 
      className={`min-h-screen ${fontClass} transition-colors duration-500 ease-in-out antialiased`}
      style={{ 
        backgroundColor: theme.backgroundColor,
        color: theme.textColor
      }}
    >
      {/* Solid Black Background */}

      {/* Main Header / Navigation */}
      <Navbar
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        slogans={slogans}
        theme={theme}
        scrollToSection={scrollToSection}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* Floating Status Indicator of Demo Customization */}
      <div className="fixed bottom-6 right-6 z-40">
        <div 
          className="glass-panel p-3.5 rounded-2xl flex items-center space-x-3 shadow-2xl border-zinc-800 text-xs"
          style={{ borderLeft: `3px solid ${theme.accentColor}` }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <span className="text-zinc-400 font-sans">
            설정 데스크 연동 완료 <span className="hidden sm:inline">| 실시간 수정 가능</span>
          </span>
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-black flex items-center gap-1 cursor-pointer hover:brightness-110 active:scale-95 transition-all"
            style={{ backgroundColor: theme.accentColor }}
          >
            {isAdmin ? '메인 화면' : '색상/카피 조율'}
          </button>
        </div>
      </div>

      {/* CORE VIEW STAGES ROUTER */}
      <main className="relative z-10">
        {isAdmin ? (
          /* ADMIN WORKSPACE */
          <div className="py-8">
            <AdminDashboard
              projects={projects}
              setProjects={setProjects}
              theme={theme}
              setTheme={setTheme}
              slogans={slogans}
              setSlogans={setSlogans}
              inquiries={inquiries}
              setInquiries={setInquiries}
              setIsAdmin={setIsAdmin}
            />
          </div>
        ) : currentPage ? (
          <div className="pt-8 pb-6" style={{ paddingTop: currentPage === 'work' ? '33px' : undefined }}>
            {currentPage === 'about' && (
              <AboutPage slogans={slogans} theme={theme} />
            )}
            {currentPage === 'work' && (
              <PortfolioGrid projects={projects} theme={theme} isWorkPage={true} />
            )}
            {currentPage === 'contact' && (
              <InquiryForm theme={theme} onSubmitInquiry={handleAddInquiry} slogans={slogans} isSubpage={true} />
            )}
          </div>
        ) : (
          <>
            {/* 1. HERO & SHOWREEL */}
            <div id="hero" className="relative pt-0 pb-0">
              <Showreel slogans={slogans} theme={theme} />
            </div>

            {/* 2. PORTFOLIO ARCHIVES */}
            <PortfolioGrid projects={projects} theme={theme} />

            {/* 3. BUSINESS INQUIRY */}
            <InquiryForm theme={theme} onSubmitInquiry={handleAddInquiry} slogans={slogans} />
          </>
        )}
      </main>

      {/* Unified Footer */}
      <Footer theme={theme} slogans={slogans} scrollToSection={scrollToSection} />
    </div>
  );
}
