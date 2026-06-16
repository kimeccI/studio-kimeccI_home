/**
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

export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'A기업 글로벌 런칭 쇼케이스 메인 시네마틱',
    description: 'A기업의 차세대 폴더블 디바이스 글로벌 런칭을 시네마틱 3D 모션 그래픽으로 구현했습니다. 유기적이고 메탈릭한 텍스처와 역동적인 카메라 무빙을 활용하여 다차원적 인터렉션을 시각화했습니다.',
    category: 'ad',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1',
    client: 'A Electronics',
    year: '2026',
    tags: ['3D 시네마틱', 'Futuristic', '텍스처 디자인'],
    videoAspectRatio: '16:9'
  },
  {
    id: '2',
    title: '현대 프리미엄 카드 브랜드 컬처 비주얼라이저',
    description: '프리미엄 세대의 라이프스타일과 트렌드를 재해석한 브랜드 애니메이션입니다. 역동적인 타이포그래피와 미니멀한 라인 드로잉 기법을 믹스하여 브랜드 고유의 컬러와 모던함을 강조했습니다.',
    category: 'design',
    imageUrl: 'https://images.unsplash.com/photo-1618005198143-d3667530288e?auto=format&fit=crop&q=80&w=1200',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1',
    client: 'Hyundai Card',
    year: '2025',
    tags: ['2D 리드미컬', '시그니처 모션', 'Branding'],
    videoAspectRatio: '16:9'
  },
  {
    id: '3',
    title: '네이버 ZEPETO 메타버스 버추얼 아이콘 캐릭터 쇼츠',
    description: '제페토 메타버스 월드 속 인기 캐릭터 라인업의 공식 프레스티지 비주얼 무비입니다. 최적화된 리깅과 수작업 키프레임 기법으로 감성적이고 통통 튀는 움직임을 표현하여 탄탄한 팬덤 경험을 제공합니다.',
    category: 'design',
    imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=1200',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1',
    client: 'Naver Z',
    year: '2026',
    tags: ['3D 캐릭터', 'Rigging', '숏폼 패키지'],
    videoAspectRatio: '9:16'
  },
  {
    id: '4',
    title: '기아 EV 고감도 일렉트로닉 콘셉트 아틀리에',
    description: '차세대 전기 차량의 순수 에너지를 빛의 궤적과 아날로그 신스 사운드 비주얼라이제이션으로 시네마틱하게 연출한 콜라보레이션 광고 영상입니다. 무한히 뻗어나가는 기하학적 파티클이 압권입니다.',
    category: 'ad',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1',
    client: 'Kia Motors',
    year: '2025',
    tags: ['라이트 아트웍', '파티클 시스템', '3D Automotive'],
    videoAspectRatio: '16:9'
  },
  {
    id: '5',
    title: '스펙트럼 월드 미러링 아트월 빔 프로젝션',
    description: '글로벌 디지털 아트 페스티벌의 핵심 테상인 가상 미러링(Virtual Mirroring)을 다룬 제너러티브 모션그래픽 전시 아트웍입니다. 복잡한 알고리즘 패턴과 사이키델릭한 톤앤매너로 시지각을 확장합니다.',
    category: 'art',
    imageUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=1200',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1',
    client: 'Spectrum Festival',
    year: '2025',
    tags: ['제너러티브 아트', '빛의 왜곡', '전시 아트웍'],
    videoAspectRatio: '16:9'
  },
  {
    id: '6',
    title: '카카오 미니프렌즈 데일리 무드 툰 및 인터렉션 리소시스',
    description: '일상 복잡함을 날려줄 아기자기한 감성의 미니프렌즈 일상 시퀀스입니다. 자체 개발한 핸드헬드 스케치 효과 필터와 부드러운 스쿼시&스트레치 물리 법칙을 설계하여 사랑스러움을 불어넣었습니다.',
    category: 'design',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80/w=1200',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1',
    client: 'Kakao Space Corp',
    year: '2026',
    tags: ['2D 셀 애니메이션', '포근한 디테일', '인터랙티브 리소스'],
    videoAspectRatio: '16:9'
  }
];

export const DEFAULT_THEME: ThemeSettings = {
  backgroundColor: '#000000',
  accentColor: '#ffc92e',
  textColor: '#ffffff',
  cardBackgroundColor: '#121212',
  fontFamily: 'sans',
  borderRadius: 'lg',
};

export const DEFAULT_SLOGANS: SloganSettings = {
  siteTitle: 'studio kimeccI',
  sloganTitle: '우리는 감각을 움직이고,\n이야기를 생동하게 합니다.',
  sloganSubtitle: 'Studio Kimecci는 글로벌 광고 애니메이션, 3D/2D 모션그래픽, 버추얼 브랜드 아이덴티티를 혁신하는 하이엔드 비주얼 크리에이티브 디자인 그룹입니다.',
  bannerTitle: 'LET\'S ANIMATE TOGETHER',
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

  // ABOUT default settings
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
  aboutCareer: '2026 — SBS Pride in Animation Gold Prize Winner\n2024 — Studio Kimecci Artists Coop Founded in Seoul',
  aboutProjects: '2025 — Hyundai Card Brand Vision Project Partner\n2025 — Generative Media Project at Spectrum Festival\n2024 — Special Clip for Naver Z 버추얼 아이콘',
  aboutHistorySize: '15px',
  aboutHistoryColor: '#a1a1aa',
  aboutHistoryFont: 'sans',

  // CONTACT default settings
  contactTitle: 'CONTACT',
  contactSubtitle: '새로운 이야기의 실마리를 건네주세요. 디렉터들이 직접 꼼꼼히 확인하고 24시간 내에 답변드립니다.',
  contactPlaceholderCompany: '회사명 혹은 소속 단체',
  contactPlaceholderPerson: '성함 및 직함',
  contactBtnText: '프로젝트 제안하기',

  contactProjectTypes: [
    '소셜 브랜디드 콘텐츠',
    '2D 광고 애니메이션',
    '뮤직비디오',
    '로고 디자인',
    '캐릭터 디자인',
    '오프라인 강의'
  ],
  contactBudgets: [
    '500만원 이하',
    '500만원 - 1,000만원',
    '1,000만원 - 3,000만원',
    '3,000만원 - 5,000만원',
    '5,000만원 이상'
  ],
  contactSteps: [
    { id: '1', num: '01', title: '문의', desc: '제안된 프로젝트의 세부 사항과 예산 범위를 면밀히 검증하여, 신속하게 기획 검토 사항과 제안 보상을 연락드립니다.' },
    { id: '2', num: '02', title: '기획', desc: '유명한 국방부 시놉시스 계약안과 시놉시스 기반 영상 콘티를 공유해 완벽하게 준비된 계약을 기다리고 있습니다.' },
    { id: '3', num: '03', title: '제작', desc: '2D 애니메이션 제작, 거대한 후, 오디오 및 프로세스를 편집하는 커뮤니케이션을 통해 정밀하게 완수합니다.' },
    { id: '4', num: '04', title: '투입', desc: '정밀한 검수를 부담스러운 마스터본 파일을 업로드하거나 가져가서 완성도 있는 결과물을 공유합니다.' }
  ]
};

export const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 'inq_1',
    companyName: '메타버스 테크랩',
    contactPerson: '김민준 이사',
    email: 'minjun@metatech.com',
    phone: '010-1234-5678',
    projectType: '3D 모션그래픽 브랜딩',
    budget: '3,000만원 - 5,000만원',
    description: '새로운 가상 오피스 서비스 런칭에 필요한 90초 분량의 세계관 홍보 애니메이션 및 메인 캐릭터의 3D 모션을 의뢰드립니다. 감각적이고 고급스러운 하이테크 느낌을 원합니다.',
    submittedAt: '2026-06-12 14:32',
    status: 'pending'
  },
  {
    id: 'inq_2',
    companyName: '코스메디 서울',
    contactPerson: '최지우 브랜드 매니저',
    email: 'brand@cosmedi.co.kr',
    phone: '010-9876-5432',
    projectType: '광고 애니메이션',
    budget: '5,000만원 이상',
    description: '가을 신제품 비건 라인업에 관한 인스타그램 릴스 전용 모션그래픽 숏츠 제작(4편) 및 대형 올리브영 전광판 광고용 비주얼 루핑 영상 제작이 필요합니다.',
    submittedAt: '2026-06-13 08:15',
    status: 'reviewed'
  }
];
