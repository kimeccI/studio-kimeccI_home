/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle, HelpCircle, Loader2, DollarSign, Briefcase } from 'lucide-react';
import { Inquiry, ThemeSettings } from '../types';

interface InquiryFormProps {
  theme: ThemeSettings;
  onSubmitInquiry: (inquiry: Omit<Inquiry, 'id' | 'submittedAt' | 'status'>) => void;
}

export default function InquiryForm({ theme, onSubmitInquiry }: InquiryFormProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    projectType: '2D 광고 애니메이션',
    budget: '1,000만원 - 3,000만원',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const projectTypes = [
    '소셜 브랜디드 콘텐츠',
    '2D 광고 애니메이션',
    '뮤직비디오',
    '로고 디자인',
    '캐릭터 디자인',
    '오프라인 강의'
  ];

  const budgetScopes = [
    '500만원 이하',
    '500만원 - 1,000만원',
    '1,000만원 - 3,000만원',
    '3,000만원 - 5,000만원',
    '5,000만원 이상'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.contactPerson || !formData.email || !formData.phone || !formData.description) {
      alert('필수 양식을 모두 작성해 주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Send form data to Formspree
      const response = await fetch('https://formspree.io/f/mojzpoeo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          contactPerson: formData.contactPerson,
          email: formData.email,
          phone: formData.phone,
          projectType: formData.projectType,
          budget: formData.budget,
          description: formData.description
        })
      });

      if (!response.ok) {
        console.warn('Formspree submission status:', response.status);
      }
    } catch (err) {
      console.warn('Failed to send to Formspree:', err);
    }

    // Call local callback for state-based backup/monitoring
    onSubmitInquiry(formData);
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form
    setFormData({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      projectType: '2D 광고 애니메이션',
      budget: '1,000만원 - 3,000만원',
      description: '',
    });
  };

  return (
    <section id="inquiry" className="border-t border-zinc-900/60 relative" style={{ paddingTop: '96px', paddingBottom: '80px' }}>
      <div 
        className="absolute top-1/2 left-0 w-96 h-96 rounded-full blur-[160px] opacity-10 pointer-events-none"
        style={{ backgroundColor: theme.accentColor }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Informational Guidelines column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 
                className="text-2xl sm:text-3xl font-extrabold tracking-wider"
                style={{ color: '#b5b5ba', fontFamily: '"Outfit", sans-serif' }}
              >
                CONTACT
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                당신의 브랜드 이야기를 들려주세요<br />
                가장 의미 있는 이야기를 가장 어울리는 장면으로 세상에 보여드릴게요
              </p>
            </div>

            {/* Informative list cards */}
            <div className="space-y-4 font-sans text-sm">
              <div className="p-5 rounded-xl bg-zinc-900/20 border border-zinc-900 flex space-x-4">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center bg-zinc-900 border border-zinc-800 font-mono font-medium shrink-0"
                  style={{ color: theme.accentColor }}
                >
                  01
                </div>
                <div>
                  <h4 className="font-bold text-zinc-200">문의</h4>
                  <p className="text-xs text-zinc-500 mt-1">제안해주신 프로젝트의 세부 사항과 예산 범위를 면밀히 검증하여, 빠르고 긴밀하게 기획 검토 사항과 제안 피드백을 연락 드립니다.</p>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-zinc-900/20 border border-zinc-900 flex space-x-4">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center bg-zinc-900 border border-zinc-800 font-mono font-medium shrink-0"
                  style={{ color: theme.accentColor }}
                >
                  02
                </div>
                <div>
                  <h4 className="font-bold text-zinc-200">기획</h4>
                  <p className="text-xs text-zinc-500 mt-1">브랜드 맞춤형 시놉시스 기획안과 시놉시스 기반 영상 콘티를 공유해 완성도 있는 기획을 위한 의견을 수립합니다.</p>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-zinc-900/20 border border-zinc-900 flex space-x-4">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center bg-zinc-900 border border-zinc-800 font-mono font-medium shrink-0"
                  style={{ color: theme.accentColor }}
                >
                  03
                </div>
                <div>
                  <h4 className="font-bold text-zinc-200">제작</h4>
                  <p className="text-xs text-zinc-500 mt-1">고화질 2D 애니메이션 제작, 깔끔한 후편집, 음향 및 렌더링 공정을 단계별 소통을 통해 정밀하게 완수합니다.</p>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-zinc-900/20 border border-zinc-900 flex space-x-4">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center bg-zinc-900 border border-zinc-800 font-mono font-medium shrink-0"
                  style={{ color: theme.accentColor }}
                >
                  04
                </div>
                <div>
                  <h4 className="font-bold text-zinc-200">업로드</h4>
                  <p className="text-xs text-zinc-500 mt-1">정밀한 검수를 거친 무손실 마스터본 파일을 업로드 혹은 납품해 완성도 있는 결과물을 공유합니다.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Core Interactive Form component */}
          <div className="lg:col-span-7 bg-zinc-950 border border-zinc-900 p-6 sm:p-10 rounded-2xl relative shadow-2xl">
            
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="inquiry-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <p className="text-xs text-zinc-500 font-sans border-b border-zinc-900 pb-4">
                    <span className="text-red-500 font-bold mr-1">*</span>표시된 입력칸은 고감도 크리에이티브 설계를 위해 필수 항목입니다.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Company Name */}
                    <div className="space-y-2">
                       <label className="text-xs font-semibold text-zinc-400 font-sans block">
                        회사명 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="스튜디오 기메띠"
                        className="w-full h-11 px-4 bg-zinc-900/60 border border-zinc-800 rounded-lg focus:outline-none focus:border-yellow-400 font-sans text-xs text-zinc-300 transition-colors"
                        required
                      />
                    </div>

                    {/* Contact Person */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-400 font-sans block">
                        이름 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleChange}
                        placeholder="홍길동"
                        className="w-full h-11 px-4 bg-zinc-900/60 border border-zinc-800 rounded-lg focus:outline-none focus:border-yellow-400 font-sans text-xs text-zinc-300 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-400 font-sans block">
                        이메일 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@studiokime.com"
                        className="w-full h-11 px-4 bg-zinc-900/60 border border-zinc-800 rounded-lg focus:outline-none focus:border-yellow-400 font-sans text-xs text-zinc-300 transition-colors"
                        required
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-400 font-sans block">
                        연락처 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="010-XXXX-XXXX"
                        className="w-full h-11 px-4 bg-zinc-900/60 border border-zinc-800 rounded-lg focus:outline-none focus:border-yellow-400 font-sans text-xs text-zinc-300 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Project Type Selection */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-400 font-sans block">
                        의뢰 유형 <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        className="w-full h-11 px-4 bg-zinc-900/60 border border-zinc-800 rounded-lg focus:outline-none focus:border-yellow-400 font-sans text-xs text-zinc-400 transition-colors cursor-pointer"
                      >
                        {projectTypes.map((type) => (
                          <option key={type} value={type} className="bg-zinc-900 text-zinc-300">
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                     {/* Estimated Budget Scope */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-400 font-sans block">
                        예산 범위 <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full h-11 px-4 bg-zinc-900/60 border border-zinc-800 rounded-lg focus:outline-none focus:border-yellow-400 font-sans text-xs text-zinc-400 transition-colors cursor-pointer"
                      >
                        {budgetScopes.map((scope) => (
                          <option key={scope} value={scope} className="bg-zinc-900 text-zinc-300">
                            {scope}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                   {/* Project Details Description */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-400 font-sans block">
                      프로젝트 세부 내용 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={5}
                      placeholder="희망 마감 일정, 영상 길이, 영상 용도, 원하시는 영상 레퍼런스 URL 링크 등 세부 사항을 자유롭게 적어주세요."
                      className="w-full p-4 bg-zinc-900/60 border border-zinc-800 rounded-lg focus:outline-none focus:border-yellow-400 font-sans text-xs text-zinc-300 leading-relaxed transition-colors"
                      required
                    />
                  </div>

                  {/* Submission triggers */}
                  <div className="pt-4 border-t border-zinc-900">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 rounded-xl text-xs font-bold font-sans cursor-pointer flex items-center justify-center space-x-2 shadow-xl tracking-wider transition-all duration-300 hover:brightness-110 active:scale-98 disabled:opacity-50"
                      style={{
                        backgroundColor: theme.accentColor,
                        color: theme.backgroundColor
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>보안 연동망을 통한 의뢰 전송 중...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>프로젝트 제안하기</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="submit-success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-6"
                >
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" 
                    style={{ backgroundColor: 'rgba(255, 201, 46, 0.1)', border: '1px solid rgba(255, 201, 46, 0.3)' }}
                  >
                    <CheckCircle className="w-8 h-8" style={{ color: '#ffc92e' }} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">제안이 접수되었습니다!</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed max-w-md mx-auto">
                      기입해주신 이메일 및 연락처 주소로 담당자가 빠르게 회신드리겠습니다.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2.5 rounded-lg border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer mt-2"
                  >
                    추가 제안하기
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      </div>
    </section>
  );
}
