'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle, Github, Copy, Sparkles } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const PACKAGE_NAME = '@easynext/cli';
const CURRENT_VERSION = 'v0.1.35';

function latestVersion(packageName: string) {
  return axios
    .get('https://registry.npmjs.org/' + packageName + '/latest')
    .then((res) => res.data.version);
}

export default function Home() {
  const { toast } = useToast();
  const [latest, setLatest] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestVersion = async () => {
      try {
        const version = await latestVersion(PACKAGE_NAME);
        setLatest(`v${version}`);
      } catch (error) {
        console.error('Failed to fetch version info:', error);
      }
    };
    fetchLatestVersion();
  }, []);

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(`npm install -g ${PACKAGE_NAME}@latest`);
    toast({
      description: 'Update command copied to clipboard',
    });
  };

  const needsUpdate = latest && latest !== CURRENT_VERSION;

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      {/* Main Content */}
      <div className="min-h-screen flex bg-gray-100">
        <div className="flex flex-col p-5 md:p-8 space-y-4">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tighter !leading-tight text-left">
            Easiest way to start
            <br /> Next.js project
            <br /> with Cursor
          </h1>

          <p className="text-lg text-muted-foreground">
            Get Pro-created Next.js bootstrap just in seconds
          </p>

          <div className="flex items-center gap-2">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="gap-2 w-fit rounded-full px-4 py-2 border border-black"
            >
              <a href="https://github.com/easynextjs/easynext" target="_blank">
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="gap-2 w-fit rounded-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              <a href="https://easynext.org/premium" target="_blank">
                <Sparkles className="w-4 h-4" />
                Premium
              </a>
            </Button>
          </div>
          <Section />
        </div>
      </div>

      <div className="min-h-screen ml-16 flex-1 flex flex-col items-center justify-center space-y-4">
        <div className="flex flex-col items-center space-y-2">
          <p className="text-muted-foreground">
            Current Version: {CURRENT_VERSION}
          </p>
          <p className="text-muted-foreground">
            Latest Version:{' '}
            <span className="font-bold">{latest || 'Loading...'}</span>
          </p>
        </div>

        {needsUpdate && (
          <div className="flex flex-col items-center space-y-2">
            <p className="text-yellow-600">New version available!</p>
            <p className="text-sm text-muted-foreground">
              Copy and run the command below to update:
            </p>
            <div className="relative group">
              <pre className="bg-gray-100 p-4 rounded-lg">
                npm install -g {PACKAGE_NAME}@latest
              </pre>
              <button
                onClick={handleCopyCommand}
                className="absolute top-2 right-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Section() {
  const items = [
    { href: 'https://nextjs.org/', label: 'Next.js' },
    { href: 'https://ui.shadcn.com/', label: 'shadcn/ui' },
    { href: 'https://tailwindcss.com/', label: 'Tailwind CSS' },
    { href: 'https://www.framer.com/motion/', label: 'framer-motion' },
    { href: 'https://zod.dev/', label: 'zod' },
    { href: 'https://date-fns.org/', label: 'date-fns' },
    { href: 'https://ts-pattern.dev/', label: 'ts-pattern' },
    { href: 'https://es-toolkit.dev/', label: 'es-toolkit' },
    { href: 'https://zustand.docs.pmnd.rs/', label: 'zustand' },
    { href: 'https://supabase.com/', label: 'supabase' },
    { href: 'https://react-hook-form.com/', label: 'react-hook-form' },
  ];

  return (
    <div className="flex flex-col py-5 md:py-8 space-y-2 opacity-75">
      <p className="font-semibold">What&apos;s Included</p>

      <div className="flex flex-col space-y-1 text-muted-foreground">
        {items.map((item) => (
          <SectionItem key={item.href} href={item.href}>
            {item.label}
          </SectionItem>
        ))}
      </div>
    </div>
  );
}

function SectionItem({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-2 underline"
      target="_blank"
    >
      <CheckCircle className="w-4 h-4" />
      <p>{children}</p>
    </a>
  );
}
