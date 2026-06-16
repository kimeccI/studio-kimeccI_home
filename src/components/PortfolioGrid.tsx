/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Film, Award, Tag, Calendar, User, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Project, ThemeSettings } from '../types';
import { CATEGORIES } from '../data';
import { getEmbedUrl } from '../utils';

interface PortfolioGridProps {
  projects: Project[];
  theme: ThemeSettings;
  isWorkPage?: boolean;
}

export default function PortfolioGrid({ projects, theme, isWorkPage }: PortfolioGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [initialLimit, setInitialLimit] = useState(6);
  const [isVertical, setIsVertical] = useState(false);

  React.useEffect(() => {
    setCurrentSlide(0);
    if (selectedProject?.imageUrl) {
      const img = new Image();
      img.onload = () => {
        setIsVertical(img.height > img.width);
      };
      img.src = selectedProject.imageUrl;
    } else {
      setIsVertical(false);
    }
  }, [selectedProject]);

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

  const displayedProjects = (showAll || isWorkPage) ? filteredProjects : filteredProjects.slice(0, initialLimit);

  return (
    <section id="portfolio" className={`pb-0 relative ${isWorkPage ? 'pt-2' : 'pt-8 border-t border-zinc-900/40'}`} style={{ paddingTop: isWorkPage ? '1px' : undefined }}>
      <div 
        className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full blur-[150px] opacity-10 pointer-events-none"
        style={{ backgroundColor: theme.accentColor }}
      />
      
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
        initial={isWorkPage ? { opacity: 0, y: 15 } : undefined}
        animate={isWorkPage ? { opacity: 1, y: 0 } : undefined}
        transition={isWorkPage ? { duration: 0.5, ease: 'easeOut' } : undefined}
      >
        
        {/* Header Block */}
        <div className={`flex flex-col md:flex-row md:items-end ${isWorkPage ? 'justify-start mb-10' : 'justify-between mb-16'} space-y-6 md:space-y-0`}>
          {!isWorkPage && (
            <div style={{ marginLeft: '0px', marginTop: '-5px' }}>
              <h2 
                className="text-2xl sm:text-3xl font-extrabold tracking-wider"
                style={{ color: '#b5b5ba', fontFamily: '"Outfit", sans-serif' }}
              >
                WORK
              </h2>
            </div>
          )}

          {/* Dynamic Filter Categories Bar */}
          <div className="flex flex-wrap gap-2 bg-zinc-900/40 p-1.5 border border-zinc-900 rounded-xl overflow-x-auto scrollbar-none">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className="px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 whitespace-nowrap"
                style={{
                  backgroundColor: activeCategory === category.id ? '#ffc92e' : 'transparent',
                  color: activeCategory === category.id ? '#000000' : '#8e8e93',
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
                onClick={() => {
                  setSelectedProject(project);
                }}
              >
                {/* Image-only thumbnail with custom border radius */}
                <div 
                  className="relative overflow-hidden w-full h-auto bg-zinc-950 border border-zinc-900/60 shadow-xl transition-all duration-300"
                  style={{
                    borderRadius: theme.borderRadius === 'none' ? '0px' : theme.borderRadius === 'sm' ? '4px' : theme.borderRadius === 'md' ? '8px' : theme.borderRadius === 'lg' ? '16px' : '24px'
                  }}
                >
                  <img
                    referrerPolicy="no-referrer"
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-auto block transform duration-700 ease-out group-hover:scale-105 group-hover:brightness-[0.4] transition-all"
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
        {!showAll && !isWorkPage && filteredProjects.length > initialLimit && (
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

      </motion.div>
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
                <div className={`${isVertical ? 'md:col-span-12 lg:col-span-5 p-6' : 'md:col-span-12 lg:col-span-7'} bg-zinc-900 border-b lg:border-b-0 lg:border-r border-zinc-900 flex flex-col justify-center`}>
                  {selectedProject.mediaList && selectedProject.mediaList.length > 0 ? (
                    selectedProject.galleryViewType === 'slider' ? (
                      /* ---------------- HORIZONTAL SLIDER Carousel MODE ---------------- */
                      <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center">
                          {(() => {
                            const media = selectedProject.mediaList[currentSlide];
                            if (!media) return null;
                            if (media.type === 'video') {
                              const embed = getEmbedUrl(media.url);
                              return (
                                <div className="w-full h-full relative">
                                  {embed.type === 'video' ? (
                                    <video src={embed.url} className="w-full h-full object-contain" controls autoPlay playsInline />
                                  ) : embed.type === 'iframe' ? (
                                    <iframe src={embed.url} className="w-full h-full border-0" allow="autoplay; encrypted-media" allowFullScreen title="video" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs font-sans">비디오 재생 불가</div>
                                  )}
                                </div>
                              );
                            } else {
                              return (
                                <img
                                  src={media.url}
                                  alt={`Slide ${currentSlide + 1}`}
                                  className="w-full h-full object-contain"
                                  referrerPolicy="no-referrer"
                                />
                              );
                            }
                          })()}
                        </div>

                        {/* Navigation Chevron Buttons */}
                        {selectedProject.mediaList.length > 1 && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentSlide(prev => prev > 0 ? prev - 1 : selectedProject.mediaList!.length - 1);
                              }}
                              className="absolute left-3 p-2 rounded-full bg-black/70 border border-zinc-800/80 hover:bg-zinc-800 text-white transition-all cursor-pointer shadow-md z-20"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentSlide(prev => prev < selectedProject.mediaList!.length - 1 ? prev + 1 : 0);
                              }}
                              className="absolute right-3 p-2 rounded-full bg-black/70 border border-zinc-800/80 hover:bg-zinc-800 text-white transition-all cursor-pointer shadow-md z-20"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            
                            {/* Fraction Indicator */}
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center bg-black/60 border border-zinc-800/40 px-3 py-1 rounded-full text-[10px] font-mono font-bold text-zinc-300 z-20 select-none shadow-sm">
                              {currentSlide + 1} / {selectedProject.mediaList.length}
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      /* ---------------- VERTICAL MOUSE WHEEL SCROLL MODE ---------------- */
                      <div className="w-full overflow-y-auto max-h-[60vh] sm:max-h-[70vh] p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                        {selectedProject.mediaList.map((media, idx) => (
                          <div key={media.id || idx} className="w-full bg-black rounded-xl overflow-hidden border border-zinc-900 flex flex-col justify-center">
                            {media.type === 'video' ? (
                              <div className="relative aspect-video w-full">
                                {(() => {
                                  const embed = getEmbedUrl(media.url);
                                  if (embed.type === 'video') {
                                    return <video src={embed.url} className="w-full h-full object-cover" controls playsInline />;
                                  } else if (embed.type === 'iframe') {
                                    return <iframe src={embed.url} className="w-full h-full border-0" allow="autoplay; encrypted-media" allowFullScreen title="video" />;
                                  } else {
                                    return (
                                      <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">재생 불가 비디오</div>
                                    );
                                  }
                                })()}
                              </div>
                            ) : (
                              <img
                                src={media.url}
                                alt={`media-${idx}`}
                                className="w-full h-auto object-contain max-h-[500px]"
                                referrerPolicy="no-referrer"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    /* ---------------- FALLBACK SINGLE VIDEO/IMAGE PLAYBACK ---------------- */
                    <div className={`${isVertical ? 'aspect-[9/16] w-full max-w-[280px] sm:max-w-[320px] mx-auto rounded-xl overflow-hidden' : 'relative aspect-video w-full'} bg-black`}>
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
                  )}
                </div>

                {/* Details area */}
                <div className={`${isVertical ? 'md:col-span-12 lg:col-span-7' : 'md:col-span-12 lg:col-span-5'} p-6 md:p-8 flex flex-col justify-between max-h-[80vh] overflow-y-auto`}>
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
