"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface TechStackCardProps {
  icon: string;
  title: string;
  description: string;
  position?: {
    top?: string | number;
    bottom?: string | number;
    left?: string | number;
    right?: string | number;
    translateX?: string;
    translateY?: string;
  };
  rotation?: number;
  delay?: number;
  special?: boolean;
  initialAnimation?: {
    x?: number;
    y?: number;
    scale?: number;
  };
  badge?: string;
}

export function TechStackCard({
  icon,
  title,
  description,
  position = {},
  rotation = 0,
  delay = 0,
  special = false,
  initialAnimation = {},
  badge,
}: TechStackCardProps) {
  const {
    top,
    bottom,
    left,
    right,
    translateX = "0",
    translateY = "0",
  } = position;

  return (
    <motion.div
      className={`absolute transition-all duration-500 hover:rotate-0 hover:scale-110 hover:shadow-xl z-10 cursor-grab active:cursor-grabbing ${
        special ? "z-30" : "z-10"
      }`}
      style={{
        top,
        bottom,
        left,
        right,
        transform: `translate(${translateX}, ${translateY}) rotate(${rotation}deg)`,
      }}
      initial={{ opacity: 0, ...initialAnimation }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      drag
      whileDrag={{ zIndex: 40 }}
    >
      {" "}
      <div
        className={`bg-white ${
          special ? "p-8" : "p-6"
        } rounded-xl border-2 border-gray-700 shadow-md hover:shadow-xl transition-all flex flex-col items-center text-center ${
          special ? "max-w-[280px]" : "max-w-[220px]"
        }`}
      >
        <div
          className={`${
            special ? "w-20 h-20" : "w-16 h-16"
          } mb-4 flex items-center justify-center select-none`}
        >
          <Image
            src={icon}
            alt={title}
            width={special ? 48 : 48}
            height={special ? 48 : 48}
          />
        </div>
        <h3 className={`${special ? "text-xl" : "text-lg"} font-semibold`}>
          {title}
        </h3>
        <p
          className={`text-muted-foreground ${
            special ? "text-md" : "text-sm"
          } mt-2`}
        >
          {description}
        </p>
        {badge && (
          <div className="mt-4 px-4 py-2 bg-amber-500/10 rounded-full text-amber-600">
            <span className="text-sm font-medium">{badge}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
