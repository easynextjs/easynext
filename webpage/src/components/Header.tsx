"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const menuItems = [
  {
    title: "쿠폰 등록",
    href: "#",
    variant: "outline" as const,
  },
  {
    title: "프리미엄 시작하기",
    href: "https://fastcampus.co.kr/data_online_cursor",
    variant: "default" as const,
    className:
      "bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700",
  },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <header className="w-[calc(100%+2rem)] -mx-4 px-6 border-b border-gray-700 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.png" alt="로고" width={32} height={32} />
          <span className="font-bold">EasyNext</span>
        </Link>

        {/* 데스크톱 메뉴 */}
        <div className="hidden md:flex items-center gap-4">
          {menuItems.map((item) => (
            <Button
              key={item.title}
              variant={item.variant}
              className={`${item.variant === "outline" ? "border-gray-700" : ""} ${item.className || ""}`}
              asChild
            >
              <Link
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
              >
                {item.title}
              </Link>
            </Button>
          ))}
        </div>

        {/* 모바일 메뉴 */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="flex flex-col gap-4 pt-10"
                  >
                    {menuItems.map((item) => (
                      <motion.div
                        key={item.title}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          show: { opacity: 1, y: 0 },
                        }}
                      >
                        <Button
                          variant={item.variant}
                          className={`w-full ${item.variant === "outline" ? "border-gray-700" : ""} ${item.className || ""}`}
                          asChild
                        >
                          <Link
                            href={item.href}
                            target={
                              item.href.startsWith("http")
                                ? "_blank"
                                : undefined
                            }
                            onClick={() => setIsOpen(false)}
                          >
                            {item.title}
                          </Link>
                        </Button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
