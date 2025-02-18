"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, Copy, Github } from "lucide-react";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion, Variants } from "framer-motion";

export default function Home() {
  const [copied, setCopied] = useState(false);
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
    <motion.div
      className="min-h-screen flex"
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

        <motion.div variants={itemVariants} className="flex items-center gap-2">
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
              GitHub
            </a>
          </Button>
        </motion.div>

        <Section />
      </div>
    </motion.div>
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
