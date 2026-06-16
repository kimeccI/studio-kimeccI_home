/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Film, Award, Tag, Calendar, User, Eye, X } from 'lucide-react';
import { Project, ThemeSettings } from '../types';
import { CATEGORIES } from '../data';
import { getEmbedUrl } from '../utils';

interface PortfolioGridProps {
  projects: Project[];
  theme: ThemeSettings;
}

export default function PortfolioGrid({ projects, theme }: PortfolioGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [initialLimit, setInitialLimit] = useState(6);

  // Monitor screen size for accurate responsive row constraints
  React.useEffect(() => {
    const checkViewportLimit = () => {
      const width = window.innerWidth;
      if (width < 768) {
        // Mobile (col count: 1), limit is 4 rows = 4 items
        setInitialLimit(4);
        setIsMobile(true);
      } else if (width < 1024) {
        // Tablet (col count: 2), limit is 2 rows = 4 items
        setInitialLimit(4);
        setIsMobile(false);
      } else {
        // Desktop (col count: 3), limit is 2 rows = 6 items
        setInitialLimit(6);
        setIsMobile(false);
      }
    };
    checkViewportLimit();
    window.addEventListener('resize', checkViewportLimit);
    return () => window.removeEventListener('resize', checkViewportLimit);
  }, []);

  // Reset page pagination expansion when switching category tabs
  React.useEffect(() => {
    setShowAll(false);
  }, [activeCategory]);

  // Filter projects depending on selected category and visibility (hide hidden ones on the main grid)
  const visibleProjects = projects.filter((project) => !project.hidden);
  const filteredProjects = activeCategory === 'all'
    ? visibleProjects
    : visibleProjects.filter((project) => project.category === activeCategory);

  const displayedProjects = showAll ? filteredProjects : filteredProjects.slice(0, initialLimit);

  return (
    <section id="portfolio" className="pt-8 pb-20 border-t border-zinc-900/40 relative">
      <div 
        className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full blur-[150px] opacity-10 pointer-events-none"
        style={{ backgroundColor: theme.accentColor }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-6 md:space-y-0">
          <div>
            <h2 
              className="text-2xl sm:text-3xl font-extrabold tracking-wider"
              style={{ color: '#b5b5ba', fontFamily: '"Outfit", sans-serif' }}
            >
              WORK
            </h2>
          </div>

          {/* Dynamic Filter Categories Bar */}
          <div className="flex flex-wrap gap-2 bg-zinc-900/40 p-1.5 border border-zinc-900 rounded-xl overflow-x-auto scrollbar-none">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className="px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 whitespace-nowrap"
                style={{
                  backgroundColor: activeCategory === category.id ? theme.accentColor : 'transparent',
                  color: activeCategory === category.id ? theme.backgroundColor : '#8e8e93',
                }}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Motion Grid (Masonry columns layout for Tetris-like fit) */}
        <motion.div 
          layout
          className="columns-1 md:columns-2 lg:columns-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {displayedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="inline-block w-full mb-8 break-inside-avoid group relative cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                {/* Image-only thumbnail with custom border radius */}
                <div 
                  className={`relative overflow-hidden w-full ${project.videoAspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-[16/10]'} bg-zinc-950 border border-zinc-900/60 shadow-xl transition-all duration-300`}
                  style={{
                    borderRadius: theme.borderRadius === 'none' ? '0px' : theme.borderRadius === 'sm' ? '4px' : theme.borderRadius === 'md' ? '8px' : theme.borderRadius === 'lg' ? '16px' : '24px'
                  }}
                >
                  <img
                    referrerPolicy="no-referrer"
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transform duration-700 ease-out group-hover:scale-105 group-hover:brightness-[0.4] transition-all"
                  />

                  {/* Elegant overlay revealed on hover */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/70 flex flex-col justify-between p-6 opacity-0 group-hover:opacity-100 z-10 transition-all duration-300">
                    {/* Category normal badge shown only on mouse over */}
                    <div className="inline-block px-2.5 py-0.5 rounded text-[9px] font-mono tracking-wider font-bold uppercase bg-white/10 self-start border border-white/20 text-white">
                      {CATEGORIES.find(c => c.id === project.category)?.label || project.category}
                    </div>
                    
                    <div className="space-y-3 w-full">
                      <h3 className="text-white text-base sm:text-lg font-bold tracking-tight leading-tight">
                        {project.title}
                      </h3>
                      
                      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-300 border-t border-white/10 pt-2.5">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 opacity-70" style={{ color: theme.accentColor }} />
                          {project.client}
                        </span>
                        <span>{project.year}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* MORE Button Box below the list */}
        {!showAll && filteredProjects.length > initialLimit && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setShowAll(true)}
              className="px-10 py-3.5 rounded-xl border border-zinc-900 bg-zinc-950 font-mono text-xs font-bold uppercase tracking-widest text-zinc-300 hover:text-white hover:bg-zinc-900 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xl duration-300 flex items-center space-x-2"
              style={{ borderColor: `${theme.accentColor}25`, boxShadow: `0 10px 30px -10px rgba(0,0,0,0.5)` }}
            >
              <span>MORE</span>
              <span className="text-[10px]" style={{ color: theme.accentColor }}>+</span>
            </button>
          </div>
        )}

        {/* Empty placeholder */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
            <Film className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400 font-sans">선택 카테고리에 업로드된 포트폴리오가 없습니다.</p>
            <p className="text-xs text-zinc-600 mt-1">대시보드에서 신규 포트폴리오를 등록해 보세요.</p>
          </div>
        )}

      </div>

      {/* Cinematic Modal details popup */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
              style={{
                borderRadius: theme.borderRadius === 'none' ? '0px' : theme.borderRadius === 'sm' ? '4px' : theme.borderRadius === 'md' ? '8px' : theme.borderRadius === 'lg' ? '16px' : '24px'
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-40 p-2 rounded-full bg-black/60 border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 items-center">
                
                {/* Media area */}
                <div className={`${selectedProject.videoAspectRatio === '9:16' ? 'md:col-span-12 lg:col-span-5 p-6' : 'md:col-span-12 lg:col-span-7'} bg-zinc-900 border-b lg:border-b-0 lg:border-r border-zinc-900 flex flex-col justify-center`}>
                  <div className={`${selectedProject.videoAspectRatio === '9:16' ? 'aspect-[9/16] w-full max-w-[280px] sm:max-w-[320px] mx-auto rounded-xl overflow-hidden' : 'relative aspect-video w-full'} bg-black`}>
                    {(() => {
                      const embed = getEmbedUrl(selectedProject.videoUrl);
                      if (embed.type === 'video') {
                        return (
                          <video
                            src={embed.url}
                            className="w-full h-full object-cover"
                            controls
                            autoPlay
                            playsInline
                          />
                        );
                      }
                      if (embed.type === 'iframe') {
                        return (
                          <iframe
                            src={embed.url}
                            title={selectedProject.title}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          ></iframe>
                        );
                      }
                      return (
                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 font-sans p-6 text-center text-xs">
                          <Film className="w-8 h-8 mb-2 opacity-30" />
                          <p>재생 가능한 비디오 리소스가 없습니다.</p>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Details area */}
                <div className={`${selectedProject.videoAspectRatio === '9:16' ? 'md:col-span-12 lg:col-span-7' : 'md:col-span-12 lg:col-span-5'} p-6 md:p-8 flex flex-col justify-between max-h-[80vh] overflow-y-auto`}>
                  <div className="space-y-6">
                    <div>
                      <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase mb-3 text-zinc-950" style={{ backgroundColor: theme.accentColor }}>
                        {CATEGORIES.find(c => c.id === selectedProject.category)?.label || selectedProject.category}
                      </div>
                      <h3 className="text-2xl font-black text-white leading-tight">
                        {selectedProject.title}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-y border-zinc-900 py-4 font-mono text-zinc-400">
                      <div className="space-y-1">
                        <span className="text-[10px] text-zinc-600 block">CLIENT</span>
                        <span className="text-sm font-semibold flex items-center gap-1.5 text-zinc-300">
                          <User className="w-4 h-4 opacity-70" style={{ color: theme.accentColor }} />
                          {selectedProject.client}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-zinc-600 block">YEAR</span>
                        <span className="text-sm font-semibold flex items-center gap-1.5 text-zinc-300">
                          <Calendar className="w-4 h-4 opacity-70" style={{ color: theme.accentColor }} />
                          {selectedProject.year}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-zinc-600 block">PROJECT OVERVIEW</span>
                      <p className="text-sm leading-relaxed text-zinc-300">
                        {selectedProject.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-zinc-900 space-y-4">
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProject.tags.map((tag) => (
                        <span key={tag} className="px-2.5 py-1 text-xs font-mono bg-zinc-900 text-zinc-400 rounded-md border border-zinc-900">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        const contactSec = document.getElementById('inquiry');
                        if (contactSec) {
                          contactSec.scrollIntoView({ behavior: 'smooth' });
                          setSelectedProject(null);
                        }
                      }}
                      className="w-full py-3 rounded-lg text-xs font-bold text-center flex items-center justify-center space-x-2 cursor-pointer shadow-lg hover:brightness-110 active:scale-98 transition-all"
                      style={{ backgroundColor: theme.accentColor, color: theme.backgroundColor }}
                    >
                      <span>이와 같은 프로젝트 협업 의뢰하기</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
