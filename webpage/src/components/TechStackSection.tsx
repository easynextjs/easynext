"use client";

import { TechStackCard } from "@/components/TechStackCard";
import { motion } from "framer-motion";

// 기술 스택 데이터 정의
const techStacks = [
  {
    icon: "/images/logo/nextjs.svg",
    title: "Next.js",
    description: "빠른 개발과 뛰어난 사용자 경험을 위한 React 프레임워크",
    special: true,
    badge: "👑 핵심 기술",
    position: { top: 0, left: 8 },
    rotation: -5,
    initialAnimation: { x: -50 },
    mobileOrder: 1,
  },
  {
    icon: "/images/logo/typescript.svg",
    title: "TypeScript",
    description: "타입 안전성을 보장하는 자바스크립트 확장 언어",
    position: { top: 24, left: "50%", translateX: "-50%" },
    rotation: 2,
    delay: 0.2,
    initialAnimation: { y: -50 },
    mobileOrder: 2,
  },
  {
    icon: "/images/logo/tailwindcss.svg",
    title: "Tailwind CSS",
    description: "직관적인 유틸리티 기반 CSS 프레임워크",
    position: { top: 60, right: 8 },
    rotation: 5,
    delay: 0.4,
    initialAnimation: { x: 50 },
    mobileOrder: 3,
  },
  {
    icon: "/images/logo/supabase.svg",
    title: "Supabase",
    description: "Firebase 대안으로 빠르고 안전한 백엔드 서비스",
    position: { top: 200, left: 0 },
    rotation: -3,
    delay: 0.6,
    initialAnimation: { y: -60 },
    special: true,
    badge: "👑 핵심 기술",
    mobileOrder: 4,
  },
  {
    icon: "/shadcn.svg",
    title: "Shadcn UI",
    description: "재사용 가능한 고품질 UI 컴포넌트 모음",
    position: { top: 96, left: "50%", translateX: "-50%" },
    rotation: 0,
    delay: 0.8,
    initialAnimation: { scale: 0.8 },
    mobileOrder: 5,
  },
  {
    icon: "/images/logo/ga.svg",
    title: "Google Analytics",
    description: "사용자 분석 및 트래킹을 위한 강력한 도구",
    position: { top: 80, right: 20 },
    rotation: 3,
    delay: 1,
    initialAnimation: { y: 50 },
    mobileOrder: 6,
  },
  {
    icon: "/images/logo/clarity.png",
    title: "Microsoft Clarity",
    description: "사용자 행동 히트맵 및 세션 분석 도구",
    position: { bottom: 20, left: "25%", translateX: "-50%" },
    rotation: -2,
    delay: 1.2,
    initialAnimation: { y: 50 },
    mobileOrder: 7,
  },
  {
    icon: "/channelio.png",
    title: "Channelio",
    description: "실시간 고객 지원 및 소통을 위한 채팅 시스템",
    position: { bottom: 20, right: "25%", translateX: "50%" },
    rotation: 2,
    delay: 1.4,
    initialAnimation: { y: 50 },
    mobileOrder: 8,
  },
];

export function TechStackSection() {
  return (
    <motion.div className="space-y-8">
      <h2 className="text-3xl font-semibold text-center">기술 스택</h2>
      <p className="text-center text-lg text-muted-foreground max-w-3xl mx-auto">
        가장 최적화된 기술 스택으로, 토스출신 개발자가 직접 세팅한 코드베이스를
        제공합니다.
      </p>

      {/* 데스크탑 버전 - 상대 포지션 사용 */}
      <div className="relative min-h-[600px] mx-auto max-w-5xl hidden md:block">
        {techStacks.map((tech) => (
          <TechStackCard
            key={`desktop-${tech.title}`}
            icon={tech.icon}
            title={tech.title}
            description={tech.description}
            position={tech.position}
            rotation={tech.rotation}
            delay={tech.delay}
            initialAnimation={tech.initialAnimation}
            special={tech.special}
            badge={tech.badge}
          />
        ))}
      </div>

      {/* 모바일 버전 - 그리드 레이아웃 사용 */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {techStacks
          .sort((a, b) => a.mobileOrder - b.mobileOrder)
          .map((tech) => (
            <div
              key={`mobile-${tech.title}`}
              className="bg-white p-6 rounded-xl shadow-sm border-2 border-gray-700"
            >
              <div className="flex items-start gap-4">
                <div className="bg-amber-500/10 p-3 rounded-full">
                  <img
                    src={tech.icon}
                    alt={tech.title}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{tech.title}</h3>
                    {tech.special && (
                      <span className="bg-amber-500/10 text-amber-600 text-xs px-2 py-1 rounded-full">
                        {tech.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm mt-1">
                    {tech.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* 이동 유도 안내 - 데스크탑에서만 표시 */}
      <div className="text-center text-muted-foreground hidden md:block">
        <p>👆 카드를 드래그하거나 마우스를 올려보세요!</p>
      </div>
    </motion.div>
  );
}
