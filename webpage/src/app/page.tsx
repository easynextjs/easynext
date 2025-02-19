"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Copy, Github } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion, Variants } from "framer-motion";

const backgroundImages = [
  "/images/home/background/0.png",
  "/images/home/background/1.png",
  "/images/home/background/2.png",
  "/images/home/background/3.png",
  "/images/home/background/4.png",
  "/images/home/background/5.png",
  "/images/home/background/6.png",
  "/images/home/background/7.png",
  "/images/home/background/8.png",
  "/images/home/background/9.png",
  "/images/home/background/10.png",
  "/images/home/background/11.png",
  "/images/home/background/12.webp",
  "/images/home/background/13.webp",
  "/images/home/background/14.webp",
  "/images/home/background/15.webp",
  "/images/home/background/16.webp",
  "/images/home/background/17.webp",
  "/images/home/background/18.webp",
];

const BackgroundCard = ({ imagePath }: { imagePath: string }) => (
  <Card className="w-64 h-48 overflow-hidden flex-shrink-0 mx-4 bg-background/50 backdrop-blur-sm">
    <div className="relative w-full h-full">
      <Image
        src={imagePath}
        alt="Background image"
        fill
        className="object-cover"
        sizes="(max-width: 256px) 100vw, 256px"
      />
    </div>
  </Card>
);

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [shuffledImages, setShuffledImages] = useState<string[][]>([]);
  const { toast } = useToast();

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

  // Fisher-Yates 셔플 알고리즘
  const shuffleArray = (array: string[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const shuffled = shuffleArray(backgroundImages);
    // 배열을 3개의 그룹으로 나눔
    const chunkSize = Math.ceil(shuffled.length / 3);
    const row1 = shuffled.slice(0, chunkSize);
    const row2 = shuffled.slice(chunkSize, chunkSize * 2);
    const row3 = shuffled.slice(chunkSize * 2);

    setShuffledImages([row1, row2, row3]);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText("npm i -g @easynext/cli");
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "The command has been copied to your clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Marquee Background */}
      <div className="absolute inset-0 -rotate-45 flex flex-col pt-64 gap-48 opacity-30">
        {shuffledImages.map((row, rowIndex) => (
          <motion.div
            key={`row-${rowIndex}`}
            initial={{ x: rowIndex % 2 === 0 ? "100%" : "-100%" }}
            animate={{ x: rowIndex % 2 === 0 ? "-100%" : "100%" }}
            transition={{
              duration: 30 + rowIndex * 5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex whitespace-nowrap"
          >
            {row.map((image, index) => (
              <BackgroundCard key={`${rowIndex}-${index}`} imagePath={image} />
            ))}
            {row.map((image, index) => (
              <BackgroundCard
                key={`${rowIndex}-repeat-${index}`}
                imagePath={image}
              />
            ))}
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        className="min-h-screen flex relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="flex flex-col p-5 md:p-8 space-y-4">
          <motion.h1
            variants={itemVariants}
            className="text-3xl md:text-5xl font-semibold tracking-tighter !leading-tight text-left"
          >
            Easiest way to start
            <br /> Next.js project
            <br /> with Cursor
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg text-muted-foreground"
          >
            Get Pro-created Next.js bootstrap just in seconds
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2"
          >
            <Button
              variant="secondary"
              size="lg"
              className="gap-2 w-fit rounded-full px-5 border border-black"
              onClick={handleCopy}
            >
              {copied ? "Copied to clipboard!" : "npm i -g @easynext/cli"}{" "}
              {copied ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
            <Button
              asChild
              size="lg"
              className="gap-2 w-fit rounded-full px-5 border border-black"
            >
              <a href="https://github.com/easynextjs/easynext" target="_blank">
                <Github className="w-4 h-4" />
                Docs
              </a>
            </Button>
          </motion.div>

          <Section />
        </div>
      </motion.div>
    </div>
  );
}

function Section() {
  const [isExpanded, setIsExpanded] = useState(false);

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const items = [
    { href: "https://nextjs.org/", label: "Next.js" },
    { href: "https://ui.shadcn.com/", label: "shadcn/ui" },
    { href: "https://tailwindcss.com/", label: "Tailwind CSS" },
    { href: "https://www.framer.com/motion/", label: "framer-motion" },
    { href: "https://zod.dev/", label: "zod" },
    { href: "https://date-fns.org/", label: "date-fns" },
    { href: "https://ts-pattern.dev/", label: "ts-pattern" },
    { href: "https://es-toolkit.dev/", label: "es-toolkit" },
    { href: "https://zustand.docs.pmnd.rs/", label: "zustand" },
    { href: "https://supabase.com/", label: "supabase" },
    { href: "https://react-hook-form.com/", label: "react-hook-form" },
  ];

  const visibleItems = isExpanded ? items : items.slice(0, 5);

  return (
    <motion.div
      className="flex flex-col py-5 md:py-8 space-y-2 opacity-75"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.p variants={itemVariants} className="font-semibold">
        What&apos;s Included
      </motion.p>

      <div className="flex flex-col space-y-1 text-muted-foreground">
        {visibleItems.map((item) => (
          <SectionItem key={item.href} href={item.href} variants={itemVariants}>
            {item.label}
          </SectionItem>
        ))}
        {!isExpanded && items.length > 5 && (
          <motion.div variants={itemVariants}>
            <Button
              variant="ghost"
              className="w-fit text-muted-foreground hover:text-foreground"
              onClick={() => setIsExpanded(true)}
            >
              + {items.length - 5} more
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function SectionItem({
  children,
  href,
  variants,
}: {
  children: React.ReactNode;
  href: string;
  variants?: Variants;
}) {
  return (
    <motion.a
      variants={variants}
      href={href}
      className="flex items-center gap-2 underline"
      target="_blank"
    >
      <CheckCircle className="w-4 h-4" />
      <p>{children}</p>
    </motion.a>
  );
}
