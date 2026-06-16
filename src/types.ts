/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProjectMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  name?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'ad' | 'mv' | 'art' | 'design' | 'motion';
  imageUrl: string;
  videoUrl: string; // YouTube or Vimeo embed url / mock player URL
  client: string; // 협업 기업명
  year: string;
  tags: string[];
  videoAspectRatio?: '16:9' | '9:16';
  hidden?: boolean;
  galleryViewType?: 'scroll' | 'slider';
  mediaList?: ProjectMedia[];
}

export interface ThemeSettings {
  backgroundColor: string;
  accentColor: string;
  textColor: string;
  cardBackgroundColor: string;
  fontFamily: 'sans' | 'display' | 'mono';
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export interface SloganSettings {
  siteTitle: string;
  sloganTitle: string;
  sloganSubtitle: string;
  bannerTitle: string;
  showreelTitle: string;
  showreelUrl: string;
  logoUrl?: string;
  headerLogoUrl?: string;
  footerLogoUrl?: string;
  faviconUrl?: string;
  footerText?: string;
  footerAddress?: string;
  footerPhone?: string;
  footerEmail?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  vimeoUrl?: string;

  // ABOUT Page configs
  aboutText?: string;
  aboutTextSize?: string;
  aboutTextColor?: string;
  aboutTextFont?: 'sans' | 'display' | 'mono';
  
  aboutImage?: string;
  
  aboutName?: string;
  aboutNameSize?: string;
  aboutNameColor?: string;
  aboutNameFont?: 'sans' | 'display' | 'mono';
  
  aboutHistory?: string;
  aboutHistorySize?: string;
  aboutHistoryColor?: string;
  aboutHistoryFont?: 'sans' | 'display' | 'mono';
  
  aboutCareer?: string;
  aboutProjects?: string;

  // CONTACT Page configs
  contactTitle?: string;
  contactSubtitle?: string;
  contactPlaceholderCompany?: string;
  contactPlaceholderPerson?: string;
  contactBtnText?: string;

  contactSteps?: Array<{ id: string; num: string; title: string; desc: string }>;
  contactProjectTypes?: string[];
  contactBudgets?: string[];
}

export interface Inquiry {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  description: string;
  submittedAt: string;
  status: 'pending' | 'reviewed' | 'completed';
}
