/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Edit2, Trash2, Sliders, Type, Database, Check, RefreshCw, 
  Sparkles, ShieldCheck, Mail, Calendar, Coins, Settings, FolderOpen,
  Eye, Save, X, Info, ArrowUp, ArrowDown, EyeOff, GripVertical, Copy
} from 'lucide-react';
import { Project, ThemeSettings, SloganSettings, Inquiry } from '../types';
import { CATEGORIES } from '../data';

interface AdminDashboardProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  theme: ThemeSettings;
  setTheme: (theme: ThemeSettings) => void;
  slogans: SloganSettings;
  setSlogans: (slogans: SloganSettings) => void;
  inquiries: Inquiry[];
  setInquiries: React.Dispatch<React.SetStateAction<Inquiry[]>>;
  setIsAdmin: (isAdmin: boolean) => void;
}

export default function AdminDashboard({
  projects,
  setProjects,
  theme,
  setTheme,
  slogans,
  setSlogans,
  inquiries,
  setInquiries,
  setIsAdmin
}: AdminDashboardProps) {
  
  // Dashboard Active Tab
  const [activeTab, setActiveTab] = useState<'theme' | 'projects' | 'inquiries'>('theme');

  // CRUD States for Projects
  const [isEditingProject, setIsEditingProject] = useState<boolean>(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{ type: 'project' | 'inquiry'; id: string } | null>(null);
  
  const [projectForm, setProjectForm] = useState<Omit<Project, 'id'>>({
    title: '',
    description: '',
    category: 'ad',
    imageUrl: '',
    videoUrl: '',
    client: '',
    year: '2026',
    tags: [],
    videoAspectRatio: '16:9'
  });

  const [rawTags, setRawTags] = useState('');

  // Slogan & Theme forms
  const [sloganForm, setSloganForm] = useState<SloganSettings>({ ...slogans });
  const [themeForm, setThemeForm] = useState<ThemeSettings>({ ...theme });

  // Reset Slogan and Theme to factory presets
  const handleResetTheme = () => {
    const defaultTheme: ThemeSettings = {
      backgroundColor: '#000000',
      accentColor: '#ffc92e',
      textColor: '#ffffff',
      cardBackgroundColor: '#121212',
      fontFamily: 'sans',
      borderRadius: 'lg',
    };
    const defaultSlogans: SloganSettings = {
      siteTitle: '스튜디오 키메찌',
      sloganTitle: '우리는 감각을 움직이고,\n이야기를 생동하게 합니다.',
      sloganSubtitle: 'Studio Kimecci는 글로벌 광고 애니메이션, 3D/2D 모션그래픽, 버추얼 브랜드 아이덴티티를 혁신하는 하이엔드 비주얼 크리에이티브 디자인 그룹입니다.',
      bannerTitle: "LET'S ANIMATE TOGETHER",
      showreelTitle: '2026 STUDIO KIMECCI SHOWREEL',
      showreelUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      logoUrl: ''
    };
    setTheme(defaultTheme);
    setThemeForm(defaultTheme);
    setSlogans(defaultSlogans);
    setSloganForm(defaultSlogans);
  };

  const handleThemeChange = (field: keyof ThemeSettings, value: string) => {
    const updated = { ...themeForm, [field]: value };
    setThemeForm(updated);
    setTheme(updated);
  };

  const handleSloganChange = (field: keyof SloganSettings, value: string) => {
    const updated = { ...sloganForm, [field]: value };
    setSloganForm(updated);
    setSlogans(updated);
  };

  // CRUD HANDLERS
  const handleOpenAddProject = () => {
    setIsEditingProject(true);
    setEditingProjectId(null);
    setProjectForm({
      title: '',
      description: '',
      category: 'ad',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1',
      client: '',
      year: '2026',
      tags: [],
      videoAspectRatio: '16:9'
    });
    setRawTags('');
  };

  const handleOpenEditProject = (proj: Project) => {
    setIsEditingProject(true);
    setEditingProjectId(proj.id);
    setProjectForm({
      title: proj.title,
      description: proj.description,
      category: proj.category,
      imageUrl: proj.imageUrl,
      videoUrl: proj.videoUrl,
      client: proj.client,
      year: proj.year,
      tags: proj.tags,
      videoAspectRatio: proj.videoAspectRatio || '16:9'
    });
    setRawTags(proj.tags.join(', '));
  };

  const handleDeleteProject = (id: string) => {
    setDeleteConfirmTarget({ type: 'project', id });
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.client || !projectForm.description) {
      alert('필수 필드(제목, 고객사, 설명)를 채워주세요.');
      return;
    }

    const tagsArray = rawTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const mergedForm = { ...projectForm, tags: tagsArray };

    if (editingProjectId) {
      // Edit mode
      setProjects((prev) =>
        prev.map((p) => (p.id === editingProjectId ? { ...mergedForm, id: editingProjectId } : p))
      );
    } else {
      // Add mode
      const newProj: Project = {
        ...mergedForm,
        id: `proj_${Date.now()}`
      };
      setProjects((prev) => [newProj, ...prev]);
    }

    setIsEditingProject(false);
    setEditingProjectId(null);
  };

  // Inquiry Status modifiers
  const handleUpdateInquiryStatus = (id: string, nextStatus: 'pending' | 'reviewed' | 'completed') => {
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: nextStatus } : i))
    );
  };

  const handleDeleteInquiry = (id: string) => {
    setDeleteConfirmTarget({ type: 'inquiry', id });
  };

  const confirmDeleteAction = () => {
    if (!deleteConfirmTarget) return;
    const { type, id } = deleteConfirmTarget;
    if (type === 'project') {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } else if (type === 'inquiry') {
      setInquiries((prev) => prev.filter((i) => i.id !== id));
    }
    setDeleteConfirmTarget(null);
  };

  const handleToggleProjectVisibility = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, hidden: !p.hidden } : p))
    );
  };

  const handleDuplicateProject = (proj: Project, index: number) => {
    const duplicated: Project = {
      ...proj,
      id: `proj_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      title: `${proj.title} (복사본)`
    };
    
    setProjects((prev) => {
      const updated = [...prev];
      updated.splice(index + 1, 0, duplicated);
      return updated;
    });
  };

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const updated = [...projects];
    const draggedItem = updated[draggedIndex];
    updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    setProjects(updated);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[80vh] font-sans">
      
      {/* Dashboard Top banner */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 sm:p-8 mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-yellow-400/10 border border-yellow-400/20 text-yellow-500 rounded-full mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase">
              STUDIO KIMECCI ADMIN CONSOLE
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            크리에이티브 대시보드
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            스튜디오의 타이틀, 컬러 무드, 아카이브 포트폴리오 및 수신된 비즈니스 파트너 문의를 실시간 조율합니다.
          </p>
        </div>

        <button
          onClick={() => setIsAdmin(false)}
          className="flex items-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-all cursor-pointer shadow-lg"
        >
          <Eye className="w-4 h-4 text-emerald-400" />
          <span>업데이트 사항 사이트 확인</span>
        </button>
      </div>

      {/* Main Grid navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Nav buttons */}
        <div className="lg:col-span-3 space-y-2">
          {[
            { id: 'theme', label: '브랜드 & 테마 스타일', icon: Sliders, desc: '사이트명, 슬로건 및 포인트 색상 변경' },
            { id: 'projects', label: '포트폴리오 업로드 (CRUD)', icon: Database, desc: '제작 시퀀스 추가, 수정, 실시간 삭제' },
            { id: 'inquiries', label: '협업 의뢰 수신함', icon: Mail, desc: '접수된 파트너 제안서 모니터링', count: inquiries.filter(i=>i.status==='pending').length }
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setIsEditingProject(false);
                }}
                className="w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all duration-200 cursor-pointer"
                style={{
                  backgroundColor: isActive ? 'rgba(255,255,255,0.02)' : 'transparent',
                  borderColor: isActive ? theme.accentColor : 'rgba(255,255,255,0.05)'
                }}
              >
                <div className="flex items-start space-x-3">
                  <IconComp 
                    className="w-5 h-5 shrink-0 mt-0.5" 
                    style={{ color: isActive ? theme.accentColor : '#71717a' }} 
                  />
                  <div className="space-y-0.5">
                    <span 
                      className="text-xs font-bold block"
                      style={{ color: isActive ? '#ffffff' : '#a1a1aa' }}
                    >
                      {tab.label}
                    </span>
                    <span className="text-[10px] text-zinc-500 leading-tight block">
                      {tab.desc}
                    </span>
                  </div>
                </div>

                {tab.count !== undefined && tab.count > 0 ? (
                  <span className="bg-red-500 font-mono font-bold text-[10px] text-white px-2 py-0.5 rounded-full">
                    {tab.count}
                  </span>
                ) : null}
              </button>
            );
          })}

          <div className="pt-6">
            <button
              onClick={handleResetTheme}
              className="w-full h-11 rounded-lg border border-red-950 text-red-500 hover:bg-red-500/10 text-xs font-medium cursor-pointer transition-colors flex items-center justify-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>디자인 & 텍스트 순정 초기화</span>
            </button>
          </div>
        </div>

        {/* Dynamic Panels Stage */}
        <div className="lg:col-span-9 bg-zinc-950 border border-zinc-900 rounded-2xl p-6 sm:p-8 min-h-[500px]">
          
          {/* TAB 1: BRANDING & THEME */}
          {activeTab === 'theme' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-yellow-400" />
                  브랜드 및 비주얼 테마 설정
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">브랜드 아이덴티티 슬로건과 시각적 포인트 컬러를 조화롭게 커스터마이징합니다.</p>
              </div>

              {/* Text Slogans inputs */}
              <div className="space-y-4 border-t border-zinc-900 pt-6">
                <span className="text-[10px] font-mono font-bold text-zinc-400 block tracking-wider uppercase">
                  1. 핵심 브랜드 타이틀 및 헤더 카피
                </span>
                
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-500 font-semibold block">스튜디오 상호 (Site Title)</label>
                  <input
                    type="text"
                    value={sloganForm.siteTitle}
                    onChange={(e) => handleSloganChange('siteTitle', e.target.value)}
                    className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium text-zinc-300 focus:outline-none focus:border-yellow-400"
                  />
                </div>

                {/* Header Logo URL & Upload - Box A */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-900/50 pt-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-500 font-semibold block">상단 홈 로고 이미지 URL (외부 주소나 드라이브 링크)</label>
                    <input
                      type="text"
                      value={sloganForm.headerLogoUrl || ''}
                      onChange={(e) => handleSloganChange('headerLogoUrl', e.target.value)}
                      placeholder="상단 헤더에 들어갈 로고 URL"
                      className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium text-zinc-300 focus:outline-none focus:border-yellow-400 font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-500 font-semibold block">상단 홈 로고 직접 파일 선택</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const base64 = event.target?.result as string;
                            handleSloganChange('headerLogoUrl', base64);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full h-10 p-1 bg-zinc-905 border border-zinc-800 rounded-lg text-xs font-medium text-zinc-450 focus:outline-none focus:border-yellow-400 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-zinc-850 file:text-zinc-300 hover:file:bg-zinc-700"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 font-sans border-t border-zinc-900/50 pt-4">
                  <label className="text-xs text-zinc-500 font-semibold block">메인 브랜드 슬로건 (Main Brand Slogan)</label>
                  <textarea
                    rows={2}
                    value={sloganForm.sloganSubtitle}
                    onChange={(e) => handleSloganChange('sloganSubtitle', e.target.value)}
                    placeholder="홈 화면 쇼릴 동영상 하단의 블랙 아웃(그라데이션) 영역에 자연스럽게 표시될 핵심 브랜드 슬로건 카피입니다."
                    className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium text-zinc-300 focus:outline-none focus:border-yellow-400 leading-relaxed font-sans"
                  />
                </div>

                {/* Showreel video URL & Upload section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-900 pt-4">
                  <div className="space-y-1.5 font-sans">
                    <label className="text-xs text-zinc-500 font-semibold block">쇼릴 비디오 URL (유튜브, 비메오, 구글 드라이브)</label>
                    <input
                      type="text"
                      value={sloganForm.showreelUrl || ''}
                      onChange={(e) => handleSloganChange('showreelUrl', e.target.value)}
                      placeholder="https://www.youtube.com/embed/..."
                      className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium text-zinc-300 focus:outline-none focus:border-yellow-400 font-mono"
                    />
                  </div>
                  <div className="space-y-1.5 font-sans">
                    <label className="text-xs text-zinc-500 font-semibold block">쇼릴 비디오 직접 파일 업로드 (Local MP4/WebM)</label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const base64 = event.target?.result as string;
                            handleSloganChange('showreelUrl', base64);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full h-10 p-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium text-zinc-300 focus:outline-none focus:border-yellow-400 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700"
                    />
                  </div>
                </div>
              </div>

               {/* 하단 인포메이션 및 SNS 연동 섹션 */}
              <div className="space-y-4 border-t border-zinc-900 pt-6">
                <span className="text-[10px] font-mono font-bold text-zinc-400 block tracking-wider uppercase">
                  2. 하단 정보 데스크 및 소셜 채널 연동
                </span>

                {/* Footer Logo URL & Upload - Box B */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-900/40 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-500 font-semibold block">하단 로고 이미지 URL (외부 주소나 드라이브 링크)</label>
                    <input
                      type="text"
                      value={sloganForm.footerLogoUrl || ''}
                      onChange={(e) => handleSloganChange('footerLogoUrl', e.target.value)}
                      placeholder="하단 푸터에 들어갈 로고 URL"
                      className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium text-zinc-300 focus:outline-none focus:border-yellow-400 font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-500 font-semibold block">하단 로고 직접 파일 선택</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const base64 = event.target?.result as string;
                            handleSloganChange('footerLogoUrl', base64);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full h-10 p-1 bg-zinc-905 border border-zinc-800 rounded-lg text-xs font-medium text-zinc-455 focus:outline-none focus:border-yellow-400 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-zinc-850 file:text-zinc-300 hover:file:bg-zinc-700"
                    />
                  </div>
                </div>

                {/* Footer Body Text input */}
                <div className="space-y-1.5 border-t border-zinc-900/40 pt-2">
                  <label className="text-xs text-zinc-500 font-semibold block">하단 본문 설명 텍스트 (Footer Body Text)</label>
                  <textarea
                    rows={3}
                    value={sloganForm.footerText || ''}
                    onChange={(e) => handleSloganChange('footerText', e.target.value)}
                    placeholder="하단 로고 바로 밑에 정렬되어 출력될 브랜드 설명 혹은 소개 본문 텍스트입니다."
                    className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium text-zinc-300 focus:outline-none focus:border-yellow-400 leading-relaxed font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-zinc-900/40 pt-4">
                  <div className="space-y-1.5 font-sans">
                    <label className="text-xs text-zinc-500 font-semibold block">하단 표시용 주소 (Address)</label>
                    <input
                      type="text"
                      value={sloganForm.footerAddress || ''}
                      onChange={(e) => handleSloganChange('footerAddress', e.target.value)}
                      placeholder="서울 강남구 학동로 ..."
                      className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium text-zinc-300 focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                  <div className="space-y-1.5 font-sans">
                    <label className="text-xs text-zinc-500 font-semibold block">하단 연락처 (Phone)</label>
                    <input
                      type="text"
                      value={sloganForm.footerPhone || ''}
                      onChange={(e) => handleSloganChange('footerPhone', e.target.value)}
                      placeholder="+82 (0)2 541 3332"
                      className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium text-zinc-300 focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                  <div className="space-y-1.5 font-sans">
                    <label className="text-xs text-zinc-500 font-semibold block">하단 이메일 주소 (Email)</label>
                    <input
                      type="email"
                      value={sloganForm.footerEmail || ''}
                      onChange={(e) => handleSloganChange('footerEmail', e.target.value)}
                      placeholder="hello@kimecci.com"
                      className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium text-zinc-300 focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5 font-sans">
                    <label className="text-xs text-zinc-500 font-semibold block">YouTube 채널 링크</label>
                    <input
                      type="url"
                      value={sloganForm.youtubeUrl || ''}
                      onChange={(e) => handleSloganChange('youtubeUrl', e.target.value)}
                      placeholder="https://youtube.com/..."
                      className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium text-zinc-300 focus:outline-none focus:border-yellow-400 font-mono"
                    />
                  </div>
                  <div className="space-y-1.5 font-sans">
                    <label className="text-xs text-zinc-500 font-semibold block">Instagram 링크</label>
                    <input
                      type="url"
                      value={sloganForm.instagramUrl || ''}
                      onChange={(e) => handleSloganChange('instagramUrl', e.target.value)}
                      placeholder="https://instagram.com/..."
                      className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium text-zinc-300 focus:outline-none focus:border-yellow-400 font-mono"
                    />
                  </div>
                  <div className="space-y-1.5 font-sans">
                    <label className="text-xs text-zinc-500 font-semibold block">TikTok (틱톡) 링크</label>
                    <input
                      type="url"
                      value={sloganForm.vimeoUrl || ''}
                      onChange={(e) => handleSloganChange('vimeoUrl', e.target.value)}
                      placeholder="https://tiktok.com/@..."
                      className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium text-zinc-300 focus:outline-none focus:border-yellow-400 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Theme Styling settings */}
              <div className="space-y-4 border-t border-zinc-900 pt-6">
                <span className="text-[10px] font-mono font-bold text-zinc-400 block tracking-wider uppercase">
                  3. 스튜디오 시큐어 컬러 팔레트 & 기하 구조
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {/* Accent Color picker */}
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-500 font-semibold block">포인트 강조색 (Accent)</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={themeForm.accentColor}
                        onChange={(e) => handleThemeChange('accentColor', e.target.value)}
                        className="w-10 h-10 p-0 rounded-lg bg-transparent border border-zinc-800 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={themeForm.accentColor}
                        onChange={(e) => handleThemeChange('accentColor', e.target.value)}
                        className="w-full h-10 px-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono uppercase text-zinc-300 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Background Color Picker */}
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-500 font-semibold block">사이트 기본 배경색 (Background)</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={themeForm.backgroundColor}
                        onChange={(e) => handleThemeChange('backgroundColor', e.target.value)}
                        className="w-10 h-10 p-0 rounded-lg bg-transparent border border-zinc-800 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={themeForm.backgroundColor}
                        onChange={(e) => handleThemeChange('backgroundColor', e.target.value)}
                        className="w-full h-10 px-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono uppercase text-zinc-300 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Card Background Color */}
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-500 font-semibold block">컴포넌트 카드색 (Card Fill)</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={themeForm.cardBackgroundColor}
                        onChange={(e) => handleThemeChange('cardBackgroundColor', e.target.value)}
                        className="w-10 h-10 p-0 rounded-lg bg-transparent border border-zinc-800 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={themeForm.cardBackgroundColor}
                        onChange={(e) => handleThemeChange('cardBackgroundColor', e.target.value)}
                        className="w-full h-10 px-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono uppercase text-zinc-300 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  {/* Font Family selector */}
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-500 font-semibold block">스튜디오 기본 폰트군 (Typography)</label>
                    <select
                      value={themeForm.fontFamily}
                      onChange={(e) => handleThemeChange('fontFamily', e.target.value as any)}
                      className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-400 focus:outline-none cursor-pointer"
                    >
                      <option value="sans">스탠다드 산스 (Outfit + Noto Sans KR)</option>
                      <option value="display">디스플레이 그래픽 (Outfit 볼드 중심)</option>
                      <option value="mono">테크니컬 모노 (JetBrains 코딩 라인)</option>
                    </select>
                  </div>

                  {/* Border Radius selector */}
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-500 font-semibold block">모서리 곡공율 사양 (Radius)</label>
                    <select
                      value={themeForm.borderRadius}
                      onChange={(e) => handleThemeChange('borderRadius', e.target.value as any)}
                      className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-400 focus:outline-none cursor-pointer"
                    >
                      <option value="none">모서리 제로 (직각 엣지)</option>
                      <option value="sm">각진 라운딩 (Small 4px)</option>
                      <option value="md">미니멀 서클 (Medium 8px)</option>
                      <option value="lg">프리미엄 엣지 (Large 16px)</option>
                      <option value="full">완전 타원 (Rounded Circle-style)</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-zinc-900/30 rounded-xl border border-zinc-900 flex items-start gap-3 mt-4">
                  <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-zinc-500 leading-normal">
                    본 설정 값은 로컬 React 렌더 환경에 동기화되며, 브라우저가 포인터 락 혹은 핫 리로드를 거치더라도 소스 코드 내에서 안정적으로 보전될 수 있도록 CSS 변수를 제어합니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PORTFOLIO CRUD LIST */}
          {activeTab === 'projects' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-yellow-400" />
                    포트폴리오 업로드 아카이브
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">스튜디오의 작품 목록을 생성(Create), 읽기(Read), 수정(Update), 삭제(Delete) 관리합니다.</p>
                </div>

                {!isEditingProject && (
                  <button
                    onClick={handleOpenAddProject}
                    className="flex items-center space-x-1.5 px-4 h-10 rounded-lg text-xs font-bold font-sans cursor-pointer tracking-wide shadow-md hover:brightness-110 active:scale-95 transition-all text-black"
                    style={{ backgroundColor: theme.accentColor }}
                  >
                    <Plus className="w-4 h-4" />
                    <span>신규 작품 등록</span>
                  </button>
                )}
              </div>

              {/* CRUD FORM DRAWER OVERLAY */}
              <AnimatePresence>
                {isEditingProject && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-6"
                  >
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                      <span className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        {editingProjectId ? '작품 세부 사항 수정' : '신규 시네마틱 프로젝트 추가'}
                      </span>
                      <button
                        onClick={() => setIsEditingProject(false)}
                        className="text-zinc-500 hover:text-white p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveProject} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs text-zinc-500 font-semibold block">작품 프로젝트 제목 *</label>
                          <input
                            type="text"
                            value={projectForm.title}
                            onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                            placeholder="A기업 콜라보 모션그래픽"
                            className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none"
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs text-zinc-500 font-semibold block">협업 기업 / 고객명 *</label>
                          <input
                            type="text"
                            value={projectForm.client}
                            onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })}
                            placeholder="예: 현대카드, Naver"
                            className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs text-zinc-500 font-semibold block">비주얼 카테고리 *</label>
                          <select
                            value={projectForm.category}
                            onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value as any })}
                            className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-400 focus:outline-none cursor-pointer"
                          >
                            {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                              <option key={c.id} value={c.id}>{c.label}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="space-y-1.5">
                          <label className="text-xs text-zinc-500 font-semibold block">제작 연도 (Year) *</label>
                          <input
                            type="text"
                            value={projectForm.year}
                            onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                            className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs text-zinc-500 font-semibold block">태그 (쉼표 단위 구분) *</label>
                          <input
                            type="text"
                            value={rawTags}
                            onChange={(e) => setRawTags(e.target.value)}
                            placeholder="3D Motion, VFX, Branding"
                            className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs text-zinc-500 font-semibold block">대표 썸네일 이미지 링크 (Unsplash, Google Drive 등 URL) *</label>
                          <input
                            type="text"
                            value={projectForm.imageUrl}
                            onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none font-mono"
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs text-zinc-500 font-semibold block">대표 썸네일 실시간 업로드 (또는 드라이브 파일 선택)</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (readerEvent) => {
                                  const img = new Image();
                                  img.onload = () => {
                                    const canvas = document.createElement('canvas');
                                    const MAX_WIDTH = 800;
                                    let width = img.width;
                                    let height = img.height;

                                    if (width > MAX_WIDTH) {
                                      height = Math.round((height * MAX_WIDTH) / width);
                                      width = MAX_WIDTH;
                                    }

                                    canvas.width = width;
                                    canvas.height = height;
                                    const ctx = canvas.getContext('2d');
                                    if (ctx) {
                                      ctx.drawImage(img, 0, 0, width, height);
                                      // Compress to jpeg quality 0.7 to significantly minimize bytes size
                                      const compressed = canvas.toDataURL('image/jpeg', 0.7);
                                      setProjectForm({ ...projectForm, imageUrl: compressed });
                                    } else {
                                      setProjectForm({ ...projectForm, imageUrl: readerEvent.target?.result as string });
                                    }
                                  };
                                  img.src = readerEvent.target?.result as string;
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="w-full h-10 p-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700 cursor-pointer"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs text-zinc-500 font-semibold block">비디오 플레이어 링크 (Embed YouTube/Vimeo/Direct MP4) *</label>
                          <input
                            type="url"
                            value={projectForm.videoUrl}
                            onChange={(e) => setProjectForm({ ...projectForm, videoUrl: e.target.value })}
                            className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none font-mono"
                            placeholder="https://youtu.be/..."
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs text-zinc-500 font-semibold block">비디오 비율 선택 *</label>
                          <select
                            value={projectForm.videoAspectRatio || '16:9'}
                            onChange={(e) => setProjectForm({ ...projectForm, videoAspectRatio: e.target.value as '16:9' | '9:16' })}
                            className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none"
                          >
                            <option value="16:9">가로형 일반 비디오 (16:9)</option>
                            <option value="9:16">세로형 숏폼 비디오 (9:16)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs text-zinc-500 font-semibold block">작품 상세 해설 및 사양 설명 *</label>
                        <textarea
                          rows={4}
                          value={projectForm.description}
                          onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                          className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 leading-relaxed focus:outline-none"
                          required
                        />
                      </div>

                      <div className="flex justify-end space-x-2 pt-2 border-t border-zinc-800">
                        <button
                          type="button"
                          onClick={() => setIsEditingProject(false)}
                          className="px-4 py-2 text-xs font-semibold text-zinc-400 bg-transparent hover:text-white transition-colors"
                        >
                          취소
                        </button>
                        <button
                          type="submit"
                          className="flex items-center space-x-1.5 px-5 py-2 rounded-lg text-xs font-bold text-black"
                          style={{ backgroundColor: theme.accentColor }}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{editingProjectId ? '작품 사양 업데이트' : '아카이브 실시간 배포'}</span>
                        </button>
                      </div>

                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ACTIVE PROJECTS GRID LIST */}
              <div className="border border-zinc-900 rounded-xl overflow-hidden bg-zinc-950">
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans text-xs">
                    <thead className="bg-zinc-900/60 border-b border-zinc-900 text-zinc-500 font-mono text-[10px]">
                      <tr>
                        <th className="p-4 uppercase text-center w-20">순서</th>
                        <th className="p-4 uppercase">작품 정보</th>
                        <th className="p-4 uppercase">인증 카테고리</th>
                        <th className="p-4 uppercase">의뢰/기업</th>
                        <th className="p-4 uppercase">제작년도</th>
                        <th className="p-4 uppercase text-right">제어동작</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/50 text-zinc-300">
                      {projects.map((proj, index) => (
                        <tr 
                          key={proj.id} 
                          draggable
                          onDragStart={() => handleDragStart(index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDragEnd={handleDragEnd}
                          className={`hover:bg-zinc-900/20 transition-all ${proj.hidden ? 'bg-zinc-900/10 opacity-70' : ''} ${draggedIndex === index ? 'bg-zinc-800/40 opacity-40 border-y border-dashed border-zinc-700' : ''}`}
                        >
                          <td className="p-4 text-center select-none">
                            <div 
                              className="inline-flex items-center justify-center cursor-grab active:cursor-grabbing p-2 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 rounded transition-colors"
                              title="드래그하여 순서 변동"
                            >
                              <GripVertical className="w-4 h-4" />
                            </div>
                          </td>
                          <td className="p-4 flex items-center space-x-3 min-w-[240px]">
                            <img
                              referrerPolicy="no-referrer"
                              src={proj.imageUrl}
                              alt={proj.title}
                              className="w-12 h-8 rounded object-cover shrink-0 bg-zinc-900 border border-zinc-800"
                            />
                            <div>
                              <p className="font-bold text-white text-xs line-clamp-1">{proj.title}</p>
                              <p className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5">{proj.tags.join(', ')}</p>
                            </div>
                          </td>
                          <td className="p-4 font-semibold text-zinc-400">
                            {CATEGORIES.find(c => c.id === proj.category)?.label || proj.category}
                          </td>
                          <td className="p-4 font-semibold text-zinc-400">{proj.client}</td>
                          <td className="p-4 font-mono text-zinc-500">{proj.year}</td>
                          <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleProjectVisibility(proj.id)}
                              className={`p-1.5 rounded bg-zinc-900 border transition-colors cursor-pointer ${proj.hidden ? 'border-red-950/40 text-amber-500/60 hover:text-amber-400' : 'border-zinc-800 hover:border-zinc-700 text-emerald-400/80 hover:text-emerald-300'}`}
                              title={proj.hidden ? '숨김 상태 (클릭시 표시)' : '노출 상태 (클릭시 숨김)'}
                            >
                              {proj.hidden ? (
                                <EyeOff className="w-3.5 h-3.5" />
                              ) : (
                                <Eye className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDuplicateProject(proj, index)}
                              className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                              title="복사"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEditProject(proj)}
                              className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white cursor-pointer"
                              title="수정"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(proj.id)}
                              className="p-1.5 rounded bg-zinc-900 border border-red-950/40 hover:border-red-900 hover:bg-red-500/10 text-red-500 cursor-pointer"
                              title="삭제"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}

                      {projects.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-12 text-center text-zinc-600 font-sans">
                            활성화된 시큐어 포트폴리오 데이터가 비어 있습니다.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: INQUIRIES LIST VIEW */}
          {activeTab === 'inquiries' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-yellow-400" />
                  비즈니스 협업 의뢰 수신함
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">메인 사이트 협업 의뢰 폼을 통해 접수된 기업들의 제안 카드를 모니터링합니다.</p>
              </div>

              <div className="space-y-6">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-6 bg-zinc-900/20 border border-zinc-900 rounded-xl space-y-4 relative overflow-hidden"
                  >
                    
                    {/* Status Badge header bar */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="space-y-0.5">
                        <span className="font-mono text-[10px] text-zinc-600 block">SUBMITTED AT: {inq.submittedAt}</span>
                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                          {inq.companyName}
                          <span className="text-zinc-600 font-medium text-xs">/ {inq.contactPerson}</span>
                        </h4>
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Status tag */}
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                            inq.status === 'pending'
                              ? 'bg-yellow-400/15 text-yellow-400 border border-yellow-400/25'
                              : inq.status === 'reviewed'
                                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {inq.status === 'pending' ? '대기 중' : inq.status === 'reviewed' ? '검토 완료' : '매칭 성공'}
                        </span>

                        {/* Status switcher action */}
                        <div className="flex items-center space-x-1.5 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                          <button
                            onClick={() => handleUpdateInquiryStatus(inq.id, 'reviewed')}
                            className={`px-2 py-0.5 rounded text-[9px] font-sans ${inq.status === 'reviewed' ? 'bg-cyan-500 text-black font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                          >
                            검토처리
                          </button>
                          <button
                            onClick={() => handleUpdateInquiryStatus(inq.id, 'completed')}
                            className={`px-2 py-0.5 rounded text-[9px] font-sans ${inq.status === 'completed' ? 'bg-emerald-500 text-black font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                          >
                            매칭성공
                          </button>
                        </div>

                        {/* Delete action */}
                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="p-1.5 bg-zinc-950 border border-zinc-900 rounded hover:bg-zinc-900 text-red-500/70 hover:text-red-500 transition-colors"
                          title="의뢰 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Specification layout grids */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-zinc-950/40 p-4 rounded-lg border border-zinc-900 font-mono text-[11px] text-zinc-400">
                      <p className="flex items-center gap-1.5">
                        <FolderOpen className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />
                        <span className="text-zinc-650">유형:</span> {inq.projectType}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />
                        <span className="text-zinc-650">예산:</span> {inq.budget}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />
                        <span className="text-zinc-650">이메일:</span> {inq.email}
                      </p>
                      <p className="flex items-center gap-1.5 col-span-1 sm:col-span-2">
                        <Info className="w-3.5 h-3.5 animate-pulse" style={{ color: theme.accentColor }} />
                        <span className="text-zinc-650">연락처:</span> {inq.phone}
                      </p>
                    </div>

                    {/* Description message box */}
                    <div className="space-y-1 bg-zinc-950/60 p-4 rounded-lg border border-zinc-900 text-xs leading-relaxed text-zinc-300">
                      <p className="font-bold text-[10px] text-zinc-600 font-mono uppercase mb-1">PROPOSAL MEMO</p>
                      <p className="whitespace-pre-line">{inq.description}</p>
                    </div>

                  </div>
                ))}

                {inquiries.length === 0 && (
                  <div className="text-center py-16 border border-dashed border-zinc-900 rounded-xl text-zinc-600 font-sans">
                    접수된 파트너 제안이 존재하지 않습니다.
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Custom Confirmation Modal */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
          <div className="bg-zinc-950 border border-zinc-850 rounded-2xl max-w-sm w-full p-6 text-center space-y-6 shadow-2xl">
            <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
              <Trash2 className="w-5 h-5" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-white font-sans">
                {deleteConfirmTarget.type === 'project' ? '프로젝트 삭제' : '의뢰 삭제'}
              </h3>
              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                {deleteConfirmTarget.type === 'project' 
                  ? '이 포트폴리오 프로젝트를 아카이브에서 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.' 
                  : '이 제안 의뢰 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.'}
              </p>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setDeleteConfirmTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-zinc-850 text-zinc-400 text-xs font-bold bg-zinc-900/50 hover:bg-zinc-900 hover:text-white transition-all cursor-pointer font-sans"
              >
                취소
              </button>
              <button
                onClick={confirmDeleteAction}
                className="flex-1 py-2.5 rounded-xl bg-red-650 hover:bg-red-700 text-white text-xs font-bold transition-all cursor-pointer font-sans"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
