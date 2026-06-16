/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'ad' | 'motion' | 'art';
  imageUrl: string;
  videoUrl: string; // YouTube or Vimeo embed url / mock player URL
  client: string; // 협업 기업명
  year: string;
  tags: string[];
  videoAspectRatio?: '16:9' | '9:16';
  hidden?: boolean;
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
  footerText?: string;
  footerAddress?: string;
  footerPhone?: string;
  footerEmail?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  vimeoUrl?: string;
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
