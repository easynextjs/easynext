"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle, Lock, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CouponDialog } from "./_CouponDialog";
import { PremiumDialog } from "./_PremiumDialog";

const premiumTemplates = [
  {
    name: "랜딩페이지",
    description: "제품/서비스 소개 템플릿",
    isLocked: false,
    image: "/images/home/templates/landing.gif",
  },
  {
    name: "커뮤니티",
    description: "커뮤니티 템플릿",
    isLocked: true,
    comingSoon: "03.03 공개 예정",
  },
  {
    name: "SaaS",
    description: "SaaS 템플릿",
    isLocked: true,
    comingSoon: "03.17 공개 예정",
  },
  {
    name: "AI 서비스",
    description: "전자상거래 템플릿",
    isLocked: true,
    comingSoon: "03.31 공개 예정",
  },
];

const features = [
  "기본 템플릿 외 다양한 템플릿 제공",
  "관리자 대시보드 템플릿 (Coming Soon)",
  "전자상거래 템플릿 (Coming Soon)",
  "지속적인 업데이트",
];

// const testimonials = [
//   {
//     name: "김서연",
//     role: "프리랜서 개발자",
//     comment: "템플릿 덕분에 개발 시간을 50% 이상 단축할 수 있었어요.",
//     rating: 5,
//     avatar: "/images/avatars/1.png",
//   },
//   {
//     name: "이준호",
//     role: "스타트업 CEO",
//     comment: "퀄리티 높은 템플릿으로 초기 비용을 크게 절감했습니다.",
//     rating: 5,
//     avatar: "/images/avatars/2.png",
//   },
//   {
//     name: "박지민",
//     role: "프로덕트 매니저",
//     comment: "디자인부터 개발까지 완벽한 솔루션입니다.",
//     rating: 5,
//     avatar: "/images/avatars/3.png",
//   },
// ];

// const stats = [
//   { label: "활성 사용자", value: "1,000+", icon: Users },
//   { label: "기업 고객", value: "50+", icon: Building2 },
//   { label: "평균 평점", value: "4.9", icon: Star },
// ];

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
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-50">
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
              강의 구매 시 평생 무료 이용
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

        {/* 통계 섹션 */}
        {/* <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-700"
            >
              <stat.icon className="w-8 h-8 text-amber-600 mb-2" />
              <div className="text-3xl font-bold text-amber-600">
                {stat.value}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div> */}

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
                  <PremiumDialog>
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

        {/* 테스티모니얼 섹션 */}
        {/* <motion.div variants={itemVariants} className="space-y-8">
          <h2 className="text-3xl font-semibold text-center">사용자 후기</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.name}
                className="p-6 space-y-4 border-2 border-gray-700"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={testimonial.avatar}
                      alt={testimonial.name}
                    />
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground">{testimonial.comment}</p>
              </Card>
            ))}
          </div>
        </motion.div>

        <Separator /> */}

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
                강의 구매 시 평생 무료 이용
              </span>
            </p>
            <div className="text-muted-foreground mb-4">
              <p className="text-sm">* 얼리버드 기간 한정 특가</p>
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
      <Link href="https://fastcampus.co.kr/data_online_cursor" target="_blank">
        프리미엄 시작하기
        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
      </Link>
    </Button>
  );
}
