/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Edit2, Trash2, Sliders, Type, Database, Check, RefreshCw, 
  Sparkles, ShieldCheck, Mail, Calendar, Coins, Settings, FolderOpen,
  Eye, Save, X, Info, ArrowUp, ArrowDown, EyeOff, GripVertical, Copy,
  User, MessageCircle, ChevronUp, ChevronDown, Tag, Home, Github
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
  const [activeTab, setActiveTab] = useState<'theme' | 'about' | 'projects' | 'contact' | 'inquiries' | 'export'>('theme');
  const [exportCopied, setExportCopied] = useState<boolean>(false);
  const [serverSaving, setServerSaving] = useState<boolean>(false);
  const [serverSaveSuccess, setServerSaveSuccess] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSyncToServer = async () => {
    setServerSaving(true);
    setServerError(null);
    setServerSaveSuccess(false);

    try {
      const response = await fetch('/api/save-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme, slogans, projects }),
      });

      if (!response.ok) {
        throw new Error('서버 데이터를 업데이트하는 데 실패했습니다.');
      }

      const result = await response.json();
      if (result.success) {
        setServerSaveSuccess(true);
      } else {
        throw new Error('서버 처리 중 오류가 발생했습니다.');
      }
    } catch (err: any) {
      setServerError(err.message || '서버 파일(src/data.ts) 수정 중 오류가 발생했습니다.');
    } finally {
      setServerSaving(false);
    }
  };

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
    videoAspectRatio: '16:9',
    galleryViewType: 'scroll',
    mediaList: []
  });

  const [tagBlocks, setTagBlocks] = useState<string[]>(() => {
    const saved = localStorage.getItem('kimecci_tag_blocks');
    if (saved) return JSON.parse(saved);
    
    // Fallback: collect existing tags + default nice suggestions
    const initialSet = new Set<string>(['영상', '광고', '3D', '2D', '시네마틱', '디자인', '기획', '연출', '아트']);
    projects.forEach(p => {
      if (p.tags) {
        p.tags.forEach(t => initialSet.add(t));
      }
    });
    return Array.from(initialSet);
  });
  const [newTagInput, setNewTagInput] = useState('');

  const handleAddTagBlock = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (!tagBlocks.includes(trimmed)) {
      const updated = [...tagBlocks, trimmed];
      setTagBlocks(updated);
      localStorage.setItem('kimecci_tag_blocks', JSON.stringify(updated));
    }
    // Also toggle it ON for the current projectForm.tags
    if (!projectForm.tags.includes(trimmed)) {
      setProjectForm(prev => ({
        ...prev,
        tags: [...prev.tags, trimmed]
      }));
    }
    setNewTagInput('');
  };

  const handleDeleteTagBlock = (name: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering standard button action
    const updated = tagBlocks.filter(t => t !== name);
    setTagBlocks(updated);
    localStorage.setItem('kimecci_tag_blocks', JSON.stringify(updated));
    
    // Also remove from selected if active
    if (projectForm.tags.includes(name)) {
      setProjectForm(prev => ({
        ...prev,
        tags: prev.tags.filter(t => t !== name)
      }));
    }
  };

  const handleToggleTagBlock = (name: string) => {
    setProjectForm(prev => {
      const isSelected = prev.tags.includes(name);
      return {
        ...prev,
        tags: isSelected
          ? prev.tags.filter(t => t !== name)
          : [...prev.tags, name]
      };
    });
  };

  const [rawTags, setRawTags] = useState('');

  // Slogan & Theme forms
  const [sloganForm, setSloganForm] = useState<SloganSettings>({ ...slogans });
  const [themeForm, setThemeForm] = useState<ThemeSettings>({ ...theme });
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  const [showCopyCodeSuccess, setShowCopyCodeSuccess] = useState(false);

  // Sync form states with outside changes
  React.useEffect(() => {
    setSloganForm({ ...slogans });
  }, [slogans]);

  React.useEffect(() => {
    setThemeForm({ ...theme });
  }, [theme]);

  // Save Settings Transaction
  const handleSaveAllConfig = () => {
    setTheme(themeForm);
    setSlogans(sloganForm);
    setShowSavedFeedback(true);
    setTimeout(() => {
      setShowSavedFeedback(false);
    }, 4000);
  };

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
      logoUrl: '',
      headerLogoUrl: '',
      footerLogoUrl: '',
      footerText: 'Studio Kimecci는 매 순간 한계 없는 시각 예술을 창조하며, 브랜드의 잠재적 가치를 완전히 생동하게 만드는 하이엔드 모션 크리에이티비티 허브입니다. 우리는 기술과 예술의 경계를 가로질러 새로운 가능성을 탐구하고, 감각적인 비주얼 솔루션을 제안합니다.',
      footerAddress: '서울특별시 중구 다산로 210 스튜디오 키메찌 아틀리에 빌딩 4F',
      footerPhone: '+82-2-543-0987',
      footerEmail: 'directors@kimecci.com',
      youtubeUrl: 'https://youtube.com',
      instagramUrl: 'https://instagram.com',
      vimeoUrl: 'https://tiktok.com',
      
      aboutText: 'Founded in 2024, Studio kimecci is a small 2D animation studio creating music video, commercial or personal animated film. We are very interested in the process of what I want to tell becoming the story I want to hear.',
      aboutTextSize: '18px',
      aboutTextColor: '#dddddd',
      aboutTextFont: 'sans',
      aboutImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
      aboutName: 'Studio Kimecci (스튜디오 키메찌)',
      aboutNameSize: '24px',
      aboutNameColor: '#ffc92e',
      aboutNameFont: 'display',
      aboutHistory: '2026 — SBS Pride in Animation Gold Prize Winner\n2025 — Hyundai Card Brand Vision Project Partner\n2025 — Generative Media Project at Spectrum Festival\n2024 — Studio Kimecci Artists Coop Founded in Seoul',
      aboutHistorySize: '15px',
      aboutHistoryColor: '#a1a1aa',
      aboutHistoryFont: 'sans',

      contactTitle: 'CONTACT',
      contactSubtitle: '새로운 이야기의 실마리를 건네주세요. 디렉터들이 직접 꼼꼼히 확인하고 24시간 내에 답변드립니다.',
      contactPlaceholderCompany: '회사명 혹은 소속 단체',
      contactPlaceholderPerson: '성함 및 직함',
      contactBtnText: '프로젝트 제안하기'
    };
    setTheme(defaultTheme);
    setThemeForm(defaultTheme);
    setSlogans(defaultSlogans);
    setSloganForm(defaultSlogans);
  };

  const handleThemeChange = (field: keyof ThemeSettings, value: string) => {
    const updated = { ...themeForm, [field]: value };
    setThemeForm(updated);
  };

  const handleSloganChange = (field: keyof SloganSettings, value: any) => {
    const updated = { ...sloganForm, [field]: value };
    setSloganForm(updated);
  };

  // Helper arrays/lists derived safely for Contact configs
  const currentSteps = sloganForm.contactSteps || [
    { id: '1', num: '01', title: '문의', desc: '제안해주신 프로젝트의 세부 사항과 예산 범위를 면밀히 검증하여, 빠르고 긴밀하게 기획 검토 사항과 제안 피드백을 연락 드립니다.' },
    { id: '2', num: '02', title: '기획', desc: '브랜드 맞춤형 시놉시스 기획안과 시놉시스 기반 영상 콘티를 공유해 완성도 있는 기획을 위한 의견을 수립합니다.' },
    { id: '3', num: '03', title: '제작', desc: '고화질 2D 애니메이션 제작, 깔끔한 후편집, 음향 및 렌더링 공정을 단계별 소통을 통해 정밀하게 완수합니다.' },
    { id: '4', num: '04', title: '업로드', desc: '정밀한 검수를 거친 무손실 마스터본 파일을 업로드 혹은 납품해 완성도 있는 결과물을 공유합니다.' }
  ];

  const currentProjectTypes = sloganForm.contactProjectTypes || [
    '소셜 브랜디드 콘텐츠',
    '2D 광고 애니메이션',
    '뮤직비디오',
    '로고 디자인',
    '캐릭터 디자인',
    '오프라인 강의'
  ];

  const currentBudgets = sloganForm.contactBudgets || [
    '500만원 이하',
    '500만원 - 1,000만원',
    '1,000만원 - 3,000만원',
    '3,000만원 - 5,000만원',
    '5,000만원 이상'
  ];

  const handleUpdateStep = (index: number, key: 'num' | 'title' | 'desc', val: string) => {
    const updatedSteps = [...currentSteps];
    updatedSteps[index] = { ...updatedSteps[index], [key]: val };
    handleSloganChange('contactSteps', updatedSteps);
  };

  const handleStepMoveUp = (index: number) => {
    if (index === 0) return;
    const updatedSteps = [...currentSteps];
    const temp = updatedSteps[index];
    updatedSteps[index] = updatedSteps[index - 1];
    updatedSteps[index - 1] = temp;
    handleSloganChange('contactSteps', updatedSteps);
  };

  const handleStepMoveDown = (index: number) => {
    if (index === currentSteps.length - 1) return;
    const updatedSteps = [...currentSteps];
    const temp = updatedSteps[index];
    updatedSteps[index] = updatedSteps[index + 1];
    updatedSteps[index + 1] = temp;
    handleSloganChange('contactSteps', updatedSteps);
  };

  const handleDeleteStep = (index: number) => {
    const updatedSteps = currentSteps.filter((_, i) => i !== index);
    handleSloganChange('contactSteps', updatedSteps);
  };

  const handleAddStep = () => {
    const nextNum = String(currentSteps.length + 1).padStart(2, '0');
    const newStep = {
      id: String(Date.now()),
      num: nextNum,
      title: '신규 절차',
      desc: '신규 협업 절차의 상세 설명문을 입력해 주세요.'
    };
    handleSloganChange('contactSteps', [...currentSteps, newStep]);
  };

  const handleUpdateProjectType = (index: number, val: string) => {
    const updated = [...currentProjectTypes];
    updated[index] = val;
    handleSloganChange('contactProjectTypes', updated);
  };

  const handleProjectTypeMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...currentProjectTypes];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    handleSloganChange('contactProjectTypes', updated);
  };

  const handleProjectTypeMoveDown = (index: number) => {
    if (index === currentProjectTypes.length - 1) return;
    const updated = [...currentProjectTypes];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    handleSloganChange('contactProjectTypes', updated);
  };

  const handleDeleteProjectType = (index: number) => {
    const updated = currentProjectTypes.filter((_, i) => i !== index);
    handleSloganChange('contactProjectTypes', updated);
  };

  const handleAddProjectType = () => {
    handleSloganChange('contactProjectTypes', [...currentProjectTypes, '신규 의뢰 유형']);
  };

  const handleUpdateBudget = (index: number, val: string) => {
    const updated = [...currentBudgets];
    updated[index] = val;
    handleSloganChange('contactBudgets', updated);
  };

  const handleBudgetMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...currentBudgets];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    handleSloganChange('contactBudgets', updated);
  };

  const handleBudgetMoveDown = (index: number) => {
    if (index === currentBudgets.length - 1) return;
    const updated = [...currentBudgets];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    handleSloganChange('contactBudgets', updated);
  };

  const handleDeleteBudget = (index: number) => {
    const updated = currentBudgets.filter((_, i) => i !== index);
    handleSloganChange('contactBudgets', updated);
  };

  const handleAddBudget = () => {
    handleSloganChange('contactBudgets', [...currentBudgets, '신규 예산 범위']);
  };

  // Generate data.ts code content for easy file replacing
  const generateDataTsString = () => {
    return `/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, ThemeSettings, SloganSettings, Inquiry } from './types';

export const CATEGORIES = [
  { id: 'all', label: 'ALL' },
  { id: 'ad', label: 'COMMERCIAL' },
  { id: 'art', label: 'PERSONAL' },
  { id: 'design', label: 'DESIGN' },
];

export const INITIAL_PROJECTS: Project[] = ${JSON.stringify(projects, null, 2)};

export const DEFAULT_THEME: ThemeSettings = ${JSON.stringify(themeForm, null, 2)};

export const DEFAULT_SLOGANS: SloganSettings = ${JSON.stringify(sloganForm, null, 2)};

export const INITIAL_INQUIRIES: Inquiry[] = ${JSON.stringify(inquiries, null, 2)};
`;
  };

  // Copy data.ts file code to clipboard
  const handleCopyCodeToClipboard = () => {
    const code = generateDataTsString();
    navigator.clipboard.writeText(code);
    setShowCopyCodeSuccess(true);
    setTimeout(() => setShowCopyCodeSuccess(false), 3000);
  };

  // Download settings as JSON config file
  const handleDownloadJsonConfig = () => {
    const payload = {
      projects,
      theme: themeForm,
      slogans: sloganForm,
      inquiries
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kimecci_config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      videoAspectRatio: '16:9',
      galleryViewType: 'scroll',
      mediaList: []
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
      videoAspectRatio: proj.videoAspectRatio || '16:9',
      galleryViewType: proj.galleryViewType || 'scroll',
      mediaList: proj.mediaList || []
    });
    setRawTags(proj.tags.join(', '));
  };

  const handleDeleteProject = (id: string) => {
    setDeleteConfirmTarget({ type: 'project', id });
  };

  const handleAddMediaItem = () => {
    const newItem = {
      id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type: 'image' as const,
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800'
    };
    setProjectForm(prev => ({
      ...prev,
      mediaList: [...(prev.mediaList || []), newItem]
    }));
  };

  const handleRemoveMediaItem = (id: string) => {
    setProjectForm(prev => ({
      ...prev,
      mediaList: (prev.mediaList || []).filter(m => m.id !== id)
    }));
  };

  const handleUpdateMediaItem = (id: string, field: string, value: any) => {
    setProjectForm(prev => ({
      ...prev,
      mediaList: (prev.mediaList || []).map(m => m.id === id ? { ...m, [field]: value } : m)
    }));
  };

  const handleMoveMediaItem = (index: number, direction: 'up' | 'down') => {
    const list = [...(projectForm.mediaList || [])];
    if (direction === 'up' && index > 0) {
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
    } else if (direction === 'down' && index < list.length - 1) {
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
    }
    setProjectForm(prev => ({ ...prev, mediaList: list }));
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.client) {
      alert('필수 필드(프로젝트명, 클라이언트)를 채워주세요.');
      return;
    }

    const mergedForm = { ...projectForm };

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
  const [draggedMediaIndex, setDraggedMediaIndex] = useState<number | null>(null);
  const [dragOverMediaIndex, setDragOverMediaIndex] = useState<number | null>(null);

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
            { id: 'theme', label: '홈페이지', icon: Home },
            { id: 'about', label: '프로필', icon: User },
            { id: 'projects', label: '아카이브', icon: Database },
            { id: 'contact', label: '커뮤니케이션', icon: MessageCircle },
            { id: 'inquiries', label: '수신함', icon: Mail, count: inquiries.filter(i=>i.status==='pending').length },
            { id: 'export', label: 'GitHub 영구 저장 가이드', icon: Github }
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
                <div className="flex items-center space-x-3">
                  <IconComp 
                    className="w-5 h-5 shrink-0" 
                    style={{ color: isActive ? theme.accentColor : '#71717a' }} 
                  />
                  <div>
                    <span 
                      className="text-xs font-bold block"
                      style={{ color: isActive ? '#ffffff' : '#a1a1aa' }}
                    >
                      {tab.label}
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Home className="w-4 h-4 text-yellow-400" />
                    홈페이지
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">브랜드 아이덴티티 슬로건과 시각적 포인트 컬러를 조화롭게 커스터마이징합니다.</p>
                </div>
              </div>

              {showSavedFeedback && (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-fade-in">
                  <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>브랜드 설정 데이터가 원활하게 저장되었고 홈 화면에 즉시 적용되었습니다!</span>
                </div>
              )}

              {/* Text Slogans inputs */}
              <div className="space-y-4 border-t border-zinc-900 pt-6">
                <span className="text-[10px] font-mono font-bold text-zinc-400 block tracking-wider uppercase">
                  1. 홈 상단 설정
                </span>
                
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-500 font-semibold block">브랜드명</label>
                  <input
                    type="text"
                    value={sloganForm.siteTitle}
                    onChange={(e) => handleSloganChange('siteTitle', e.target.value)}
                    className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium text-zinc-300 focus:outline-none focus:border-yellow-400"
                  />
                </div>

                {/* Header Logo Upload */}
                <div className="border-t border-zinc-900/50 pt-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-500 font-semibold block">로고 이미지 업로드</label>
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
                  <label className="text-xs text-zinc-500 font-semibold block">브랜드 슬로건</label>
                  <textarea
                    rows={2}
                    value={sloganForm.sloganSubtitle}
                    onChange={(e) => handleSloganChange('sloganSubtitle', e.target.value)}
                    placeholder="홈 화면 쇼릴 동영상 하단의 블랙 아웃(그라데이션) 영역에 자연스럽게 표시될 핵심 브랜드 슬로건 카피입니다."
                    className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium text-zinc-300 focus:outline-none focus:border-yellow-400 leading-relaxed font-sans"
                  />
                </div>

                {/* Showreel video Upload */}
                <div className="border-t border-zinc-900 pt-4">
                  <div className="space-y-1.5 font-sans">
                    <label className="text-xs text-zinc-500 font-semibold block">쇼릴 비디오 업로드</label>
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
                  2. 홈 하단 설정
                </span>

                {/* Footer Logo Upload */}
                <div className="border-t border-zinc-900/40 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-500 font-semibold block">푸티지 로고 이미지 업로드</label>
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
                  <label className="text-xs text-zinc-500 font-semibold block">푸티지 텍스트</label>
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
                  3. 홈 디자인 설정
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
                    <label className="text-xs text-zinc-500 font-semibold block">홈페이지 기본 폰트</label>
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
                    <label className="text-xs text-zinc-500 font-semibold block">모서리 라운딩</label>
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

                {/* Favicon Upload - Moved below design settings */}
                <div className="border-t border-zinc-900/50 pt-4">
                  <div className="space-y-1.5 font-sans">
                    <label className="text-xs text-zinc-500 font-semibold block">파비콘 이미지 업로드 (32~512px이내)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const img = new Image();
                          img.src = URL.createObjectURL(file);
                          img.onload = () => {
                            const diff = Math.abs(img.width - img.height);
                            if (diff > 5) {
                              alert('파비콘은 1:1 비율(정사각형) 이미지여야 합니다.');
                              return;
                            }
                            if (img.width < 16 || img.width > 512) {
                              alert('적정 파비콘 규격(32x32px ~ 512x512px 권장)으로만 업로드해 주세요.');
                              return;
                            }
                            
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const base64 = event.target?.result as string;
                              handleSloganChange('faviconUrl', base64);
                            };
                            reader.readAsDataURL(file);
                          };
                        }
                      }}
                      className="w-full h-10 p-1 bg-zinc-905 border border-zinc-800 rounded-lg text-xs font-semibold text-zinc-300 focus:outline-none focus:border-yellow-400 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-zinc-850 file:text-zinc-300 hover:file:bg-zinc-700"
                    />
                  </div>
                </div>

                <div className="p-4 bg-zinc-900/30 rounded-xl border border-zinc-900 flex items-start gap-3 mt-4">
                  <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-zinc-500 leading-normal">
                    본 설정 값은 로컬 React 렌더 환경에 동기화되며, 브라우저가 포인터 락 혹은 핫 리로드를 거치더라도 소스 코드 내에서 안정적으로 보전될 수 있도록 CSS 변수를 제어합니다.
                  </p>
                </div>

                {/* Bot Save Button */}
                <div className="pt-6 border-t border-zinc-900 flex justify-end">
                  <button
                    onClick={handleSaveAllConfig}
                    className="px-6 py-2.5 rounded-lg text-xs font-black text-black shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center space-x-1.5 cursor-pointer"
                    style={{ backgroundColor: theme.accentColor }}
                  >
                    <Save className="w-4 h-4" />
                    <span>저장</span>
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* TAB: BRAND INTRODUCTION (ABOUT) */}
          {activeTab === 'about' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-400" />
                    프로필
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">회사 소개 단락 및 디렉터 프로필, 연혁의 레이아웃 사양을 정밀하게 제어합니다.</p>
                </div>
              </div>

              {showSavedFeedback && (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-fade-in">
                  <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>프로필 설정 데이터가 안전하게 저장되어 실시간 반영되었습니다!</span>
                </div>
              )}

              {/* Settings Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Brand description / About profile left side */}
                <div className="space-y-6 bg-zinc-900/10 p-5 rounded-2xl border border-zinc-900">
                  {/* 1. 좌상단 브랜드 설명 텍스트 박스 */}
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400 font-bold block">인사말</label>
                    <textarea
                      rows={4}
                      value={sloganForm.aboutText || ''}
                      onChange={(e) => handleSloganChange('aboutText', e.target.value)}
                      placeholder="스튜디오를 소개하는 문단을 작성해 보세요."
                      className="w-full p-3 bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-zinc-350 leading-relaxed focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] text-zinc-500 font-bold block mb-1">인사말 크기</label>
                      <input
                        type="text"
                        value={sloganForm.aboutTextSize || '18px'}
                        onChange={(e) => handleSloganChange('aboutTextSize', e.target.value)}
                        placeholder="예: 18px"
                        className="w-full h-9 px-2.5 bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-zinc-300 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500 font-bold block mb-1">인사말 색상</label>
                      <div className="flex items-center space-x-1.5">
                        <input
                          type="color"
                          value={sloganForm.aboutTextColor?.startsWith('#') ? sloganForm.aboutTextColor : '#dddddd'}
                          onChange={(e) => handleSloganChange('aboutTextColor', e.target.value)}
                          className="w-8 h-9 p-0.5 bg-zinc-950 border border-zinc-850 rounded-lg cursor-pointer shrink-0"
                        />
                        <input
                          type="text"
                          value={sloganForm.aboutTextColor || '#dddddd'}
                          onChange={(e) => handleSloganChange('aboutTextColor', e.target.value)}
                          className="w-full h-9 px-1.5 bg-zinc-950 border border-zinc-850 rounded-lg text-[10px] text-zinc-300 font-mono focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500 font-bold block mb-1">인사말 자형</label>
                      <select
                        value={sloganForm.aboutTextFont || 'sans'}
                        onChange={(e) => handleSloganChange('aboutTextFont', e.target.value as any)}
                        className="w-full h-9 px-2 bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-zinc-400 focus:outline-none cursor-pointer"
                      >
                        <option value="sans">인터 고딕 (Sans)</option>
                        <option value="display">스페이스 로고 (Display)</option>
                        <option value="mono">코딩 테크 (Mono)</option>
                      </select>
                    </div>
                  </div>

                  {/* 2. 원형 프로필 이미지 */}
                  <div className="space-y-2 pt-2 border-t border-zinc-900/80">
                    <label className="text-xs text-zinc-400 font-bold block">프로필 이미지</label>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center shrink-0">
                        {sloganForm.aboutImage ? (
                          <img src={sloganForm.aboutImage} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <User className="w-6 h-6 text-zinc-700" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={sloganForm.aboutImage || ''}
                          onChange={(e) => handleSloganChange('aboutImage', e.target.value)}
                          placeholder="이미지 절대 URL 혹은 아래서 파일선택"
                          className="w-full h-9 px-2.5 bg-zinc-950 border border-zinc-850 rounded-lg text-[10px] text-zinc-350 focus:outline-none font-mono"
                        />
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
                                  const MAX_WIDTH = 400;
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
                                    const compressed = canvas.toDataURL('image/jpeg', 0.7);
                                    handleSloganChange('aboutImage', compressed);
                                  }
                                };
                                img.src = readerEvent.target?.result as string;
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="w-full text-[10px] text-zinc-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. 프로필 이미지 하단의 네임 소개 볼드 텍스트 박스 */}
                  <div className="space-y-2 pt-2 border-t border-zinc-900/80">
                    <label className="text-xs text-zinc-400 font-bold block">프로필명</label>
                    <input
                      type="text"
                      value={sloganForm.aboutName || ''}
                      onChange={(e) => handleSloganChange('aboutName', e.target.value)}
                      placeholder="예: Studio Kimecci (스튜디오 키메찌)"
                      className="w-full h-9 px-3 bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-zinc-450 focus:outline-none font-sans"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] text-zinc-500 font-bold block mb-1">성함 크기</label>
                        <input
                          type="text"
                          value={sloganForm.aboutNameSize || '24px'}
                          onChange={(e) => handleSloganChange('aboutNameSize', e.target.value)}
                          className="w-full h-9 px-2.5 bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-zinc-350 focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-500 font-bold block mb-1">성함 컬러</label>
                        <div className="flex items-center space-x-1.5">
                          <input
                            type="color"
                            value={sloganForm.aboutNameColor?.startsWith('#') ? sloganForm.aboutNameColor : theme.accentColor}
                            onChange={(e) => handleSloganChange('aboutNameColor', e.target.value)}
                            className="w-8 h-9 p-0.5 bg-zinc-950 border border-zinc-850 rounded-lg cursor-pointer shrink-0"
                          />
                          <input
                            type="text"
                            value={sloganForm.aboutNameColor || theme.accentColor}
                            onChange={(e) => handleSloganChange('aboutNameColor', e.target.value)}
                            className="w-full h-9 px-1.5 bg-zinc-950 border border-zinc-850 rounded-lg text-[10px] text-zinc-350 font-mono focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-500 font-bold block mb-1">성함 자형</label>
                        <select
                          value={sloganForm.aboutNameFont || 'display'}
                          onChange={(e) => handleSloganChange('aboutNameFont', e.target.value as any)}
                          className="w-full h-9 px-2 bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-zinc-400 focus:outline-none cursor-pointer"
                        >
                          <option value="sans">인터 고딕 (Sans)</option>
                          <option value="display">스페이스 로고 (Display)</option>
                          <option value="mono">코딩 테크 (Mono)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Experience/history on the right */}
                <div className="space-y-6 bg-zinc-900/10 p-5 rounded-2xl border border-zinc-900">
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400 font-bold block">작가 이력 (Artist Career)</label>
                    <textarea
                      rows={5}
                      value={sloganForm.aboutCareer || ''}
                      onChange={(e) => handleSloganChange('aboutCareer', e.target.value)}
                      placeholder="각 한 줄씩 엔터 단위로 수상 실적, 개인 경력을 기재해 보세요."
                      className="w-full p-3 bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-zinc-300 leading-relaxed focus:outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400 font-bold block">참여 프로젝트 (Projects Highlights)</label>
                    <textarea
                      rows={5}
                      value={sloganForm.aboutProjects || ''}
                      onChange={(e) => handleSloganChange('aboutProjects', e.target.value)}
                      placeholder="주요 상업광고, 브랜드 콜라보, 혹은 개인 독립작품을 기재해 보세요."
                      className="w-full p-3 bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-zinc-300 leading-relaxed focus:outline-none font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] text-zinc-500 font-bold block mb-1">본문 텍스트 크기</label>
                      <input
                        type="text"
                        value={sloganForm.aboutHistorySize || '14px'}
                        onChange={(e) => handleSloganChange('aboutHistorySize', e.target.value)}
                        className="w-full h-9 px-2.5 bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-zinc-300 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500 font-bold block mb-1">본문 텍스트 컬러</label>
                      <div className="flex items-center space-x-1.5">
                        <input
                          type="color"
                          value={sloganForm.aboutHistoryColor?.startsWith('#') ? sloganForm.aboutHistoryColor : '#a1a1aa'}
                          onChange={(e) => handleSloganChange('aboutHistoryColor', e.target.value)}
                          className="w-8 h-9 p-0.5 bg-zinc-950 border border-zinc-850 rounded-lg cursor-pointer shrink-0"
                        />
                        <input
                          type="text"
                          value={sloganForm.aboutHistoryColor || '#a1a1aa'}
                          onChange={(e) => handleSloganChange('aboutHistoryColor', e.target.value)}
                          className="w-full h-9 px-1.5 bg-zinc-950 border border-zinc-850 rounded-lg text-[10px] text-zinc-350 font-mono focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500 font-bold block mb-1">본문 텍스트 자형</label>
                      <select
                        value={sloganForm.aboutHistoryFont || 'sans'}
                        onChange={(e) => handleSloganChange('aboutHistoryFont', e.target.value as any)}
                        className="w-full h-9 px-2 bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-zinc-400 focus:outline-none cursor-pointer"
                      >
                        <option value="sans">인터 고딕 (Sans)</option>
                        <option value="display">스페이스 로고 (Display)</option>
                        <option value="mono">코딩 테크 (Mono)</option>
                      </select>
                    </div>
                  </div>

                </div>

              </div>

              {/* Bot Save Button */}
              <div className="pt-6 border-t border-zinc-900 flex justify-end">
                <button
                  onClick={handleSaveAllConfig}
                  className="px-6 py-2.5 rounded-lg text-xs font-black text-black shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center space-x-1.5 cursor-pointer"
                  style={{ backgroundColor: theme.accentColor }}
                >
                  <Save className="w-4 h-4" />
                  <span>저장</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB: COMMUNICATION (CONTACT) */}
          {activeTab === 'contact' && (
            <div className="space-y-8 animate-fade-in pb-12">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    커뮤니케이션
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">협업 의뢰 수신을 위한 하단 설명문, 협업 절차, 의뢰 유형 및 예산 범위를 조율합니다.</p>
                </div>
              </div>

              {showSavedFeedback && (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-fade-in">
                  <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>커뮤니케이션 설정 데이터가 안전하게 저장되어 실시간 반영되었습니다!</span>
                </div>
              )}

              {/* 1. 설명문 */}
              <div className="bg-zinc-900/10 p-6 rounded-2xl border border-zinc-900 space-y-4">
                <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-3 rounded-sm animate-pulse" style={{ backgroundColor: theme.accentColor }} />
                  설명문
                </h4>
                <div className="space-y-1.5">
                  <textarea
                    rows={3}
                    value={sloganForm.contactSubtitle || ''}
                    onChange={(e) => handleSloganChange('contactSubtitle', e.target.value)}
                    placeholder="CONTACT 타이틀 아래에 올 설명 문구를 자유롭게 기재해 주세요."
                    className="w-full p-3 bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-zinc-300 leading-relaxed focus:outline-none focus:border-emerald-550 font-sans"
                  />
                </div>
              </div>

              {/* 2. 협업 절차 항목 관리 */}
              <div className="bg-zinc-900/10 p-6 rounded-2xl border border-zinc-900 space-y-6">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                  <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                    <span className="w-1.5 h-3 rounded-sm" style={{ backgroundColor: theme.accentColor }} />
                    협업 절차 설정
                  </h4>
                  <button
                    onClick={handleAddStep}
                    className="flex items-center space-x-1 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white rounded text-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>항목 추가</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {currentSteps.map((step, index) => (
                    <div key={step.id || index} className="p-4 bg-zinc-950 border border-zinc-850 rounded-xl space-y-3 relative">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] text-zinc-500 font-bold uppercase font-mono">STEP {index + 1}</span>
                          <input
                            type="text"
                            value={step.num || ''}
                            onChange={(e) => handleUpdateStep(index, 'num', e.target.value)}
                            placeholder="01"
                            maxLength={3}
                            className="w-8 h-6 bg-zinc-900 border border-zinc-800 rounded font-mono text-[10px] text-center text-zinc-300 focus:outline-none"
                          />
                        </div>

                        <div className="flex items-center space-x-1 bg-zinc-900 p-0.5 rounded border border-zinc-800">
                          <button
                            onClick={() => handleStepMoveUp(index)}
                            disabled={index === 0}
                            className="p-1 text-zinc-500 hover:text-white disabled:opacity-30 cursor-pointer"
                            title="위로 이동"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleStepMoveDown(index)}
                            disabled={index === currentSteps.length - 1}
                            className="p-1 text-zinc-500 hover:text-white disabled:opacity-30 cursor-pointer"
                            title="아래로 이동"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteStep(index)}
                            className="p-1 text-red-500/70 hover:text-red-500 cursor-pointer"
                            title="삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="sm:col-span-1 space-y-1">
                          <label className="text-[10px] text-zinc-500 font-semibold block">절차명 (제목)</label>
                          <input
                            type="text"
                            value={step.title || ''}
                            onChange={(e) => handleUpdateStep(index, 'title', e.target.value)}
                            placeholder="제목"
                            className="w-full h-8 px-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none font-semibold"
                          />
                        </div>
                        <div className="sm:col-span-3 space-y-1">
                          <label className="text-[10px] text-zinc-500 font-semibold block">절차 상세 설명</label>
                          <textarea
                            rows={2}
                            value={step.desc || ''}
                            onChange={(e) => handleUpdateStep(index, 'desc', e.target.value)}
                            placeholder="상세 설명문"
                            className="w-full p-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-300 focus:outline-none leading-relaxed"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {currentSteps.length === 0 && (
                    <p className="text-zinc-650 text-xs text-center py-4">등록된 협업 절차가 없습니다.</p>
                  )}
                </div>
              </div>

              {/* 3. 의뢰 유형 & 예산 범위 설정 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 의뢰 유형 설정 */}
                <div className="bg-zinc-900/10 p-6 rounded-2xl border border-zinc-900 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                    <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                      <span className="w-1.5 h-3 rounded-sm" style={{ backgroundColor: theme.accentColor }} />
                      의뢰 유형 목록
                    </h4>
                    <button
                      onClick={handleAddProjectType}
                      className="flex items-center space-x-1 px-2.5 py-0.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white rounded text-[10px] transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>추가</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {currentProjectTypes.map((type, index) => (
                      <div key={index} className="flex items-center space-x-2 bg-zinc-950 p-2 border border-zinc-850 rounded-lg">
                        <input
                          type="text"
                          value={type}
                          onChange={(e) => handleUpdateProjectType(index, e.target.value)}
                          className="flex-1 h-8 px-2.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-300 focus:outline-none font-medium"
                        />
                        <div className="flex items-center space-x-0.5 bg-zinc-900 p-0.5 rounded border border-zinc-800 shrink-0">
                          <button
                            onClick={() => handleProjectTypeMoveUp(index)}
                            disabled={index === 0}
                            className="p-1 text-zinc-500 hover:text-white disabled:opacity-30 cursor-pointer"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleProjectTypeMoveDown(index)}
                            disabled={index === currentProjectTypes.length - 1}
                            className="p-1 text-zinc-500 hover:text-white disabled:opacity-30 cursor-pointer"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProjectType(index)}
                            className="p-1 text-red-500/70 hover:text-red-500 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {currentProjectTypes.length === 0 && (
                      <p className="text-zinc-650 text-xs text-center py-4">의뢰유형 항목이 없습니다.</p>
                    )}
                  </div>
                </div>

                {/* 예산 범위 설정 */}
                <div className="bg-zinc-900/10 p-6 rounded-2xl border border-zinc-900 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                    <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                      <span className="w-1.5 h-3 rounded-sm" style={{ backgroundColor: theme.accentColor }} />
                      예산 범위 목록
                    </h4>
                    <button
                      onClick={handleAddBudget}
                      className="flex items-center space-x-1 px-2.5 py-0.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white rounded text-[10px] transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>추가</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {currentBudgets.map((budget, index) => (
                      <div key={index} className="flex items-center space-x-2 bg-zinc-950 p-2 border border-zinc-850 rounded-lg">
                        <input
                          type="text"
                          value={budget}
                          onChange={(e) => handleUpdateBudget(index, e.target.value)}
                          className="flex-1 h-8 px-2.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-300 focus:outline-none font-medium"
                        />
                        <div className="flex items-center space-x-0.5 bg-zinc-900 p-0.5 rounded border border-zinc-800 shrink-0">
                          <button
                            onClick={() => handleBudgetMoveUp(index)}
                            disabled={index === 0}
                            className="p-1 text-zinc-500 hover:text-white disabled:opacity-30 cursor-pointer"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleBudgetMoveDown(index)}
                            disabled={index === currentBudgets.length - 1}
                            className="p-1 text-zinc-500 hover:text-white disabled:opacity-30 cursor-pointer"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteBudget(index)}
                            className="p-1 text-red-500/70 hover:text-red-500 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {currentBudgets.length === 0 && (
                      <p className="text-zinc-650 text-xs text-center py-4">예산범위 항목이 없습니다.</p>
                    )}
                  </div>
                </div>

              </div>

              {/* Bot Save Button */}
              <div className="pt-6 border-t border-zinc-900 flex justify-end">
                <button
                  onClick={handleSaveAllConfig}
                  className="px-6 py-2.5 rounded-lg text-xs font-black text-black shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center space-x-1.5 cursor-pointer"
                  style={{ backgroundColor: theme.accentColor }}
                >
                  <Save className="w-4 h-4" />
                  <span>저장</span>
                </button>
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
                    아카이브
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
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        {editingProjectId ? '프로젝트 수정' : '프로젝트 생성'}
                      </span>
                      <button
                        onClick={() => setIsEditingProject(false)}
                        className="text-zinc-500 hover:text-white p-1 cursor-pointer"
                        type="button"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveProject} className="space-y-4">
                      {/* 1. 프로젝트명 * & 2. 클라이언트 * */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs text-zinc-400 font-semibold block">프로젝트명 *</label>
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
                          <label className="text-xs text-zinc-400 font-semibold block">클라이언트 *</label>
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

                      {/* 3. 카테고리 * & 4. 제작 연도 (Year) * */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs text-zinc-400 font-semibold block">카테고리 *</label>
                          <select
                            value={projectForm.category}
                            onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value as any })}
                            className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none cursor-pointer"
                          >
                            {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                              <option key={c.id} value={c.id}>{c.label}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="space-y-1.5">
                          <label className="text-xs text-zinc-400 font-semibold block">제작 연도 (Year) *</label>
                          <input
                            type="text"
                            value={projectForm.year}
                            onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                            className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none"
                            placeholder="2026"
                            required
                          />
                        </div>
                      </div>

                      {/* 5. 썸네일 업로드 */}
                      <div className="space-y-1.5">
                        <label className="text-xs text-zinc-400 font-semibold block">썸네일 업로드</label>
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
                          className="w-full h-10 p-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-750 cursor-pointer"
                        />
                      </div>

                      {/* 6. 이미지/비디오 업로드 */}
                      <div className="pt-4 border-t border-zinc-850 space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-zinc-300">이미지/비디오 업로드</h4>
                          </div>
                          
                          <button
                            type="button"
                            onClick={handleAddMediaItem}
                            className="px-3 h-8 rounded bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-350 text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5 text-yellow-400" />
                            <span>미디어 추가</span>
                          </button>
                        </div>

                        {/* Gallery types selection */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs text-zinc-400 font-semibold block">이미지/비디오 보기 방식 선택</label>
                          </div>
                          <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-850 h-10 shrink-0">
                            <button
                              type="button"
                              onClick={() => setProjectForm({ ...projectForm, galleryViewType: 'scroll' })}
                              className={`flex-1 rounded-md text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${projectForm.galleryViewType !== 'slider' ? 'text-black font-extrabold' : 'text-zinc-500 hover:text-zinc-300'}`}
                              style={projectForm.galleryViewType !== 'slider' ? { backgroundColor: theme.accentColor } : {}}
                            >
                              스크롤
                            </button>
                            <button
                              type="button"
                              onClick={() => setProjectForm({ ...projectForm, galleryViewType: 'slider' })}
                              className={`flex-1 rounded-md text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${projectForm.galleryViewType === 'slider' ? 'text-black font-extrabold' : 'text-zinc-500 hover:text-zinc-300'}`}
                              style={projectForm.galleryViewType === 'slider' ? { backgroundColor: theme.accentColor } : {}}
                            >
                              슬라이드
                            </button>
                          </div>
                        </div>

                        {/* List of media items */}
                        <div className="space-y-4">
                          {(!projectForm.mediaList || projectForm.mediaList.length === 0) ? (
                            <div className="text-center py-6 border border-dashed border-zinc-900 rounded-lg bg-zinc-950/20 text-zinc-500 text-[11px]">
                              등록된 상세 미디어가 없습니다. 우측 상단의 '미디어 추가' 버튼을 눌러보세요.
                            </div>
                          ) : (
                            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                              {projectForm.mediaList.map((media, idx) => (
                                <div 
                                  key={media.id} 
                                  draggable
                                  onDragStart={(e) => {
                                    setDraggedMediaIndex(idx);
                                    e.dataTransfer.setData('text/plain', idx.toString());
                                    e.dataTransfer.effectAllowed = 'move';
                                  }}
                                  onDragOver={(e) => {
                                    e.preventDefault();
                                    if (draggedMediaIndex !== idx) {
                                      setDragOverMediaIndex(idx);
                                    }
                                  }}
                                  onDragLeave={() => {
                                    setDragOverMediaIndex(null);
                                  }}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    if (draggedMediaIndex === null || draggedMediaIndex === idx) return;
                                    const list = [...(projectForm.mediaList || [])];
                                    const draggedItem = list[draggedMediaIndex];
                                    list.splice(draggedMediaIndex, 1);
                                    list.splice(idx, 0, draggedItem);
                                    setProjectForm(prev => ({ ...prev, mediaList: list }));
                                    setDraggedMediaIndex(null);
                                    setDragOverMediaIndex(null);
                                  }}
                                  onDragEnd={() => {
                                    setDraggedMediaIndex(null);
                                    setDragOverMediaIndex(null);
                                  }}
                                  className={`p-4 rounded-lg bg-zinc-950 border flex flex-col md:flex-row gap-4 items-start md:items-center relative transition-all duration-200 ${
                                    draggedMediaIndex === idx 
                                      ? 'opacity-30 border-dashed border-zinc-800 bg-zinc-950 scale-[0.98]' 
                                      : dragOverMediaIndex === idx
                                        ? 'border-yellow-500 bg-zinc-900/40 scale-[1.01] translate-y-[-1px] shadow-lg shadow-black/40' 
                                        : 'border-zinc-900 hover:border-zinc-800'
                                  }`}
                                >
                                  {/* Drag handle & Order indicator */}
                                  <div className="flex flex-row md:flex-col items-center gap-2 shrink-0 select-none">
                                    <div className="p-1.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-500 hover:text-zinc-300 cursor-grab active:cursor-grabbing transition-colors" title="드래그하여 순서 변경">
                                      <GripVertical className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-[10px] font-mono text-zinc-400 font-bold w-6 text-center">#{idx + 1}</span>
                                  </div>

                                  {/* Preview thumbnail */}
                                  <div className="w-20 h-14 rounded overflow-hidden bg-black border border-zinc-850 shrink-0 flex items-center justify-center">
                                    {media.type === 'video' ? (
                                      <div className="w-full h-full flex flex-col items-center justify-center text-[8px] text-zinc-500 font-semibold bg-zinc-900">
                                        <svg className="w-4 h-4 text-zinc-400 mb-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                        <span className="truncate max-w-[70px]">{media.url ? '동영상' : '비디오'}</span>
                                      </div>
                                    ) : (
                                      <img
                                        referrerPolicy="no-referrer"
                                        src={media.url}
                                        alt={`preview-${idx}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          (e.target as HTMLElement).style.display = 'none';
                                        }}
                                      />
                                    )}
                                  </div>

                                  {/* Inputs */}
                                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-3 w-full">
                                    {/* Type toggler */}
                                    <div className="sm:col-span-3">
                                      <select
                                        value={media.type}
                                        onChange={(e) => handleUpdateMediaItem(media.id, 'type', e.target.value as any)}
                                        className="w-full h-8 px-2 bg-zinc-900 border border-zinc-800 rounded text-[11px] text-zinc-300 focus:outline-none cursor-pointer"
                                      >
                                        <option value="image">이미지 파일</option>
                                        <option value="video">비디오/유튜브 링크</option>
                                      </select>
                                    </div>

                                    {/* Link & file uploading */}
                                    <div className="sm:col-span-9 space-y-1.5 flex flex-col justify-center">
                                      <input
                                        type="text"
                                        value={media.url}
                                        onChange={(e) => handleUpdateMediaItem(media.id, 'url', e.target.value)}
                                        placeholder={media.type === 'image' ? "이미지 링크 (구글드라이브 공유 링크, Unsplash 등)" : "비디오 플레이어 EMBED 링크 (YouTube, Vimeo, MP4 등)"}
                                        className="w-full h-8 px-2.5 bg-zinc-900 border border-zinc-800 rounded text-[11px] text-zinc-300 focus:outline-none font-mono"
                                      />
                                      
                                      <div className="flex items-center justify-between text-[10px] text-zinc-500">
                                        <span>또는 컴퓨터 파일 선택:</span>
                                        <input
                                          type="file"
                                          accept={media.type === 'image' ? "image/*" : "video/*"}
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              const reader = new FileReader();
                                              reader.onload = (readerEvent) => {
                                                if (media.type === 'image') {
                                                  const img = new Image();
                                                  img.onload = () => {
                                                    const canvas = document.createElement('canvas');
                                                    const MAX_WIDTH = 1000;
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
                                                      const compressed = canvas.toDataURL('image/jpeg', 0.8);
                                                      handleUpdateMediaItem(media.id, 'url', compressed);
                                                    } else {
                                                      handleUpdateMediaItem(media.id, 'url', readerEvent.target?.result as string);
                                                    }
                                                  };
                                                  img.src = readerEvent.target?.result as string;
                                                } else {
                                                  const result = readerEvent.target?.result as string;
                                                  handleUpdateMediaItem(media.id, 'url', result);
                                                }
                                              };
                                              reader.readAsDataURL(file);
                                            }
                                          }}
                                          className="text-[9px] text-zinc-400 file:mr-2 file:py-0.5 file:px-2 file:rounded file:border-0 file:text-[9px] file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-750 cursor-pointer text-right w-fit ml-auto"
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {/* Delete media btn */}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveMediaItem(media.id)}
                                    className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-red-900/40 text-zinc-500 hover:text-red-400 cursor-pointer self-start md:self-center shrink-0 transition-colors"
                                    title="미디어 삭제"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 7. 프로젝트 설명 */}
                      <div className="space-y-1.5">
                        <label className="text-xs text-zinc-400 font-semibold block">프로젝트 설명</label>
                        <textarea
                          rows={4}
                          value={projectForm.description}
                          onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                          className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 leading-relaxed focus:outline-none"
                          placeholder="프로젝트 상세 설명 및 스펙 (선택 가능)"
                        />
                      </div>

                      {/* 8. 태그 * (태그 블록 설정 기능) */}
                      <div className="space-y-2 border border-zinc-850 p-4 rounded-lg bg-zinc-950/20">
                        <div className="flex items-center justify-between">
                          <label className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 text-yellow-500" />
                            태그 *
                          </label>
                          <span className="text-[10px] text-zinc-500 font-mono">선택됨: {projectForm.tags.length}개</span>
                        </div>
                        
                        {/* Tag Blocks Selection Area */}
                        <div className="flex flex-wrap gap-1.5 py-2 max-h-[140px] overflow-y-auto pr-1">
                          {tagBlocks.map(tag => {
                            const isSelected = projectForm.tags.includes(tag);
                            return (
                              <span
                                key={tag}
                                onClick={() => handleToggleTagBlock(tag)}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-all select-none border ${
                                  isSelected
                                    ? 'bg-zinc-100 text-black border-transparent font-bold animate-pulse-once'
                                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                                }`}
                                style={isSelected ? { backgroundColor: theme.accentColor } : {}}
                              >
                                <span>{tag}</span>
                                <button
                                  type="button"
                                  title="태그 블록 제거"
                                  onClick={(e) => handleDeleteTagBlock(tag, e)}
                                  className="ml-1 hover:text-red-400 rounded-full transition-colors cursor-pointer p-0.5"
                                >
                                  <X className="w-2.5 h-2.5" />
                                </button>
                              </span>
                            );
                          })}
                          {tagBlocks.length === 0 && (
                            <span className="text-[11px] text-zinc-650 italic py-1">태그 블록 카테고리가 없습니다. 아래 입력창으로 생성해 보세요.</span>
                          )}
                        </div>

                        {/* Tag Blocks Creator */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newTagInput}
                            onChange={(e) => setNewTagInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTagBlock(newTagInput);
                              }
                            }}
                            placeholder="등록할 새 태그 블록 단어 입력..."
                            className="flex-1 h-8 px-2.5 bg-zinc-950 border border-zinc-800 rounded text-xs text-zinc-300 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddTagBlock(newTagInput)}
                            className="px-3 h-8 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-bold rounded flex items-center gap-1 cursor-pointer"
                          >
                            <span>블록 추가</span>
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
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

          {/* TAB: EXPORT/GITHUB SYNC */}
          {activeTab === 'export' && (
            <div className="space-y-8 animate-fade-in font-sans">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Github className="w-4 h-4 text-yellow-400" />
                  GitHub 동기화 및 영구 저장
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">현재 수정한 모든 데이터를 코드 파일(data.ts)에 영구 적용하여 모바일과 모든 브라우저에 항상 뜨도록 설정합니다.</p>
              </div>

              <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 md:p-8 space-y-6">
                
                {/* 1-Click Server Sync Block */}
                <div className="bg-yellow-400/5 border border-yellow-400/10 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center text-yellow-400 shrink-0 border border-yellow-400/20">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">클릭 한 번으로 솔루션 완성하기 (추천)</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">복잡하게 채팅으로 보내실 필요 없이, 이 버튼 하나로 작업 공간에 직접 반영됩니다.</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      현재 어드민(홈페이지, 프로필, 아카이브, 커뮤니케이션)에서 입력하신 모든 정보는 <strong>브라우저의 임시 로컬 저장소(LocalStorage)</strong>에만 기록되어 있습니다. 모바일이나 배포 환경에서도 똑같이 뜨게 하려면 아래 버튼을 눌러 소스코드에 주입해야 합니다.
                    </p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                      <button
                        onClick={handleSyncToServer}
                        disabled={serverSaving}
                        className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 disabled:bg-zinc-850 disabled:text-zinc-500 text-black rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-yellow-400/10 shrink-0"
                      >
                        {serverSaving ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            파일에 저장 중...
                          </>
                        ) : serverSaveSuccess ? (
                          <>
                            <Check className="w-4 h-4" />
                            영구 저장 성공!
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            현재 수정본을 소스코드 파일에 저장
                          </>
                        )}
                      </button>

                      {serverSaveSuccess && (
                        <p className="text-xs text-green-400 font-bold bg-green-500/10 border border-green-500/20 px-3 py-2 rounded-lg animate-fade-in">
                          ✓ 성공! <code className="bg-zinc-900 px-1 py-0.5 rounded text-zinc-300">src/data.ts</code> 파일에 완벽하게 내보내졌습니다. 이제 오른쪽 맨 위 <strong>GitHub</strong> 탭(고양이 아이콘 옆)을 클릭하고 <strong>Stage and commit all changes</strong>를 누르면 Netlify에서 영구 배포가 자동 갱신됩니다!
                        </p>
                      )}

                      {serverError && (
                        <p className="text-xs text-red-400 font-bold bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
                          ⚠️ 실패: {serverError}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-900 pt-6">
                  <h4 className="text-sm font-bold text-white mb-4">영구 저장 4단계 가이드</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-2">
                      <div className="text-xs font-bold text-yellow-400 font-mono">01. 수정 완료하기</div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">포트폴리오, 컬러, 슬로건 등 세팅 수정 완료하기.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-2">
                      <div className="text-xs font-bold text-yellow-400 font-mono">02. 파일에 저장 클릭</div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">위 노란색 상자의 <strong>'현재 수정본을 소스코드 파일에 저장'</strong> 누르기.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-2">
                      <div className="text-xs font-bold text-yellow-400 font-mono">03. 깃허브 탭 클릭</div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">우측 상단 메뉴에서 <strong>GitHub</strong> 탭 또는 동기화 메뉴 열기.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-2">
                      <div className="text-xs font-bold text-yellow-400 font-mono">04. 커밋 & 퍼블리시</div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">커밋 메시지 입력 후 <strong>Stage and commit all changes</strong> 클릭하면 Netlify 자동 배포 완료!</p>
                    </div>
                  </div>
                </div>

                {/* Backup manual code block */}
                <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-900 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-300">백업/수동 백업용 원시 설정 코드 (선택사항)</h4>
                      <p className="text-[11px] text-zinc-500 mt-1">혹시라도 직접 데이터를 간직하거나, 하단 어시스턴트에 전달하고 싶으시다면 마우스로 드래그해서 복사해 가세요!</p>
                    </div>
                  </div>

                  <div className="relative">
                    <textarea
                      readOnly
                      onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                      value={JSON.stringify({ theme, slogans, projects }, null, 2)}
                      className="w-full h-40 bg-zinc-950 border border-zinc-900 rounded-lg p-3 text-[10px] font-mono text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-800 cursor-text"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none rounded-b-lg" />
                  </div>
                </div>

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
