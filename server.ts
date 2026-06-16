import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Serve static files / JSON payloads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API Route to save config permanently into src/data.ts
  app.post("/api/save-config", (req, res) => {
    try {
      const { theme, slogans, projects } = req.body;
      if (!theme || !slogans || !projects) {
        return res.status(400).json({ error: "Missing config parameters" });
      }

      const filePath = path.join(process.cwd(), "src", "data.ts");
      const template = `/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, ThemeSettings, SloganSettings } from './types';

export const CATEGORIES = [
  { id: 'all', label: 'ALL' },
  { id: 'ad', label: 'COMMERCIAL' },
  { id: 'art', label: 'PERSONAL' },
  { id: 'design', label: 'DESIGN' },
];

export const INITIAL_PROJECTS: Project[] = ${JSON.stringify(projects, null, 2)};

export const DEFAULT_THEME: ThemeSettings = ${JSON.stringify(theme, null, 2)};

export const DEFAULT_SLOGANS: SloganSettings = ${JSON.stringify(slogans, null, 2)};

export const INITIAL_INQUIRIES = [
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
`;

      fs.writeFileSync(filePath, template, "utf-8");
      console.log("Successfully saved new configuration to src/data.ts");
      res.json({ success: true });
    } catch (error: any) {
      console.error("Failed to write data.ts:", error);
      res.status(500).json({ error: error.message || "Failed to write file" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
