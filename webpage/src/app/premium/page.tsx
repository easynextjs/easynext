"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  CheckCircle,
  Lock,
  Sparkles,
  ArrowRight,
  Database,
  Layout,
  FileCode,
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CouponDialog } from "./_CouponDialog";
import { PremiumDialog } from "./_PremiumDialog";
import { TechStackSection } from "@/components/TechStackSection";

const premiumTemplates = [
  {
    name: "랜딩페이지",
    description: "제품/서비스 소개 템플릿",
    isLocked: false,
    image: "/images/home/templates/landing.gif",
    templateName: "landing",
  },
  {
    name: "커뮤니티",
    description: "커뮤니티 템플릿",
    isLocked: false,
    image: "/images/home/templates/community.png",
    templateName: "community",
  },
  {
    name: "SaaS",
    description: "SaaS 템플릿",
    isLocked: true,
    comingSoon: "03.30 공개 예정",
    templateName: "saas",
  },
  {
    name: "AI 서비스",
    description: "LLM API 연동 템플릿",
    isLocked: true,
    comingSoon: "04.06 공개 예정",
    templateName: "ai",
  },
];

const features = [
  "기본 템플릿 외 다양한 템플릿 제공",
  "관리자 대시보드 템플릿 (Coming Soon)",
  "전자상거래 템플릿 (Coming Soon)",
  "지속적인 업데이트",
];

const includedComponents = [
  {
    icon: Layout,
    title: "바로 사용 가능한 컴포넌트",
    description: "레이아웃, 버튼, 카드, 폼 등 재사용 가능한 컴포넌트",
  },
  {
    icon: Database,
    title: "데이터베이스 스키마",
    description: "사용자, 인증, 기능별 데이터 모델 포함",
  },
  {
    icon: FileCode,
    title: "각종 기능 구현체",
    description: "인증, 파일 업로드, API 연동 등 필수 기능 구현",
  },
];

const useCase = [
  {
    title: "실전 외주개발 템플릿",
    description:
      "실제로 외주개발할 때 사용하는 템플릿들입니다. 수많은 실전 프로젝트에서 검증된 코드 구조와 패턴을 포함합니다.",
  },
  {
    title: "한국형 ShipFast",
    description:
      "한국의 ShipFast를 목표로, 한국 서비스에 최적화된 템플릿과 가이드를 제공합니다.",
  },
  {
    title: "코드베이스를 활용해, 빠르게 출시하세요!",
    description:
      "템플릿으로 기본을 잡고, 디자인/DB를 수정하는 식으로 작업하세요. 필요한 부분만 수정해 빠르게 출시할 수 있습니다.",
  },
];

const faqs = [
  {
    question: "프리미엄 구독은 어떤 혜택이 있나요?",
    answer:
      "프리미엄 구독 시 모든 템플릿에 접근 가능하며, 신규 템플릿 출시 시에도 추가 비용 없이 이용하실 수 있습니다.",
  },
  {
    question: "환불 정책은 어떻게 되나요?",
    answer: "구독 후 7일 이내에 환불 요청 시 전액 환불이 가능합니다.",
  },
  {
    question: "기술 지원이 제공되나요?",
    answer: "네, 프리미엄 사용자를 위한 전용 기술 지원이 제공됩니다.",
  },
];

function Separator() {
  return <div className="h-8 bg-gray-100 mt-16 mb-24 -mx-4" />;
}

export default function PremiumPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const renderTemplatePreview = (template) => {
    if (template.isLocked) {
      return (
        <div className="relative h-48 bg-gray-100 flex items-center justify-center">
          <div className="text-center space-y-2">
            <Lock className="w-8 h-8 text-gray-400 mx-auto" />
            <p className="text-sm text-gray-500">{template.comingSoon}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="relative h-48">
        <Image
          src={template.image}
          alt={template.name}
          fill
          className="object-contain bg-gray-100"
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-50 px-4">
      <motion.div
        className="container mx-auto px-4 pb-16 space-y-20 border-x border-gray-700"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Header />

        {/* Hero 섹션 */}
        <motion.div
          className="text-center space-y-6 max-w-3xl mx-auto"
          variants={itemVariants}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-full text-amber-600 mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">얼리버드 할인 진행 중</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-[1.3] text-gray-900">
            출시까지 걸리는 시간을
            <br />
            80% 단축하세요
          </h1>
          <p className="text-xl text-black/80 break-keep">
            모든 기능이 준비된 Next.js 템플릿으로
            <br className="hidden md:block" />
            나만의 커뮤니티, SaaS, AI 서비스를 순식간에 완성해보세요
          </p>

          <div className="flex flex-col items-center gap-4">
            <p className="text-muted-foreground/80">
              지금이 가장 저렴합니다!
              <br />
              사전예약 시 30% 할인
            </p>
            <div className="space-y-2">
              <PremiumStartButton />
              <div className="text-center">
                <CouponDialog>
                  <Button
                    variant="link"
                    className="text-muted-foreground hover:text-primary"
                  >
                    이미 강의를 구매하셨나요?
                  </Button>
                </CouponDialog>
              </div>
            </div>
          </div>
        </motion.div>

        <Separator />

        {/* 외주개발 템플릿 소개 섹션 */}
        <motion.div variants={itemVariants} className="space-y-8">
          <h2 className="text-3xl font-semibold text-center">
            EasyNext 프리미엄 소개
          </h2>
          <div className="max-w-4xl mx-auto space-y-8">
            {useCase.map((item, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm border-2 border-gray-700 hover:shadow-md transition-all"
              >
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-lg">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <Separator />

        {/* 템플릿 프리뷰 섹션 */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-semibold text-center mb-8">
            서비스를 순식간에 완성하는
            <br />
            치트키 템플릿 제공
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {premiumTemplates.map((template) => (
              <Card
                key={template.name}
                className="overflow-hidden border-2 border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                {renderTemplatePreview(template)}
                <div className="p-6 space-y-4 border-t border-gray-700">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{template.name}</h3>
                      {template.isLocked && (
                        <Lock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <p className="text-muted-foreground">
                      {template.description}
                    </p>
                  </div>
                  <PremiumDialog templateName={template.templateName}>
                    <Button
                      className={`w-full ${
                        template.isLocked ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      variant={template.isLocked ? "outline" : "default"}
                      disabled={template.isLocked}
                    >
                      {template.isLocked
                        ? template.comingSoon
                        : "지금 사용하기"}
                    </Button>
                  </PremiumDialog>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        <Separator />

        {/* 기술 스택 섹션 */}
        <motion.div variants={itemVariants}>
          <TechStackSection />
        </motion.div>

        <Separator />

        {/* 포함 기능 섹션 */}
        <motion.div variants={itemVariants} className="space-y-8">
          <h2 className="text-3xl font-semibold text-center">포함 기능</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {includedComponents.map((component, index) => (
              <div
                key={index}
                className="p-8 bg-white rounded-xl shadow-sm border-2 border-gray-700 flex flex-col items-center text-center hover:shadow-md transition-all"
              >
                <div className="bg-amber-500/10 p-3 rounded-full mb-4">
                  <component.icon className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {component.title}
                </h3>
                <p className="text-muted-foreground">{component.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <Separator />

        {/* 특징 섹션 */}
        <motion.div
          className="space-y-8 bg-white rounded-2xl p-10 shadow-sm"
          variants={itemVariants}
        >
          <h2 className="text-3xl font-semibold text-center">프리미엄 혜택</h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-3 text-muted-foreground bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors border border-gray-700"
              >
                <CheckCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                <span className="text-lg">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <Separator />

        {/* FAQ 섹션 */}
        <motion.div variants={itemVariants} className="space-y-8">
          <h2 className="text-3xl font-semibold text-center">자주 묻는 질문</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq) => (
              <Card
                key={faq.question}
                className="p-6 hover:shadow-md transition-shadow border-2 border-gray-700"
              >
                <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </motion.div>

        <Separator />

        {/* CTA 섹션 */}
        <motion.div
          className="text-center bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-3xl p-12 border-2 border-gray-700"
          variants={itemVariants}
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-full text-amber-600 mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">출시 기념 혜택!</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 break-keep">
              지금이 가장 저렴합니다!
            </h2>
            <p className="text-2xl font-medium">
              <span className="text-gray-700 line-through">299,900</span>{" "}
              <br className="md:hidden" />
              <span className="text-gray-900 font-bold whitespace-nowrap text-center">
                209,900원
              </span>
            </p>
            <div className="text-muted-foreground mb-4">
              <p className="text-sm">* 사전예약 한정 30% 할인</p>
            </div>
          </div>
          <PremiumStartButton />
        </motion.div>
      </motion.div>
      <Footer />
    </div>
  );
}

function PremiumStartButton() {
  return (
    <Button
      asChild
      size="lg"
      className="rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-amber-600 to-yellow-600 group hover:scale-105"
    >
      <Link href="https://getwaitlist.com/waitlist/27062" target="_blank">
        프리미엄 사전예약
        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
      </Link>
    </Button>
  );
}
