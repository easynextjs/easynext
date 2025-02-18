import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-gray-100">
      <div className="max-w-4xl mx-auto container pt-8 pb-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-muted-foreground">
                © 2025 EasyNext
              </div>
              {/* <div className="text-sm text-muted-foreground">
                Next-Cursor는 사용자의 입력을 수집하지 않습니다.
              </div> */}
            </div>
            <CursorMatfiaBanner />
            <VODBanner />
          </div>
          <div className="flex gap-4">
            <Link
              href="https://github.com/easynextjs/easynext"
              className="text-sm text-muted-foreground hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function CursorMatfiaBanner() {
  return (
    <Link
      href="https://www.threads.net/@cursormatfia"
      target="_blank"
      className="flex items-center gap-4 text-sm text-muted-foreground p-4 border border-white shadow-md rounded-md bg-gray-800 text-white group hover:text-gray-200"
    >
      <span>Made by</span>
      <div className="flex items-center gap-1">
        <div className="relative">
          <Image
            src="/cursormatfia.png"
            alt="Cursor맛피아 프로필"
            width={24}
            height={24}
            className="rounded-full transition-transform group-hover:scale-110"
          />
          <div className="absolute -bottom-1 -right-1">
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </div>
        </div>
        <span className="font-medium ml-1">Cursor맛피아</span>
      </div>
    </Link>
  );
}

function VODBanner() {
  return (
    <Link
      href="https://fastcampus.co.kr/data_online_cursor"
      target="_blank"
      className="flex items-center gap-2 text-sm text-muted-foreground p-4 border border-black shadow-md rounded-md bg-white hover:bg-gray-100 transition-colors"
    >
      <Image
        src="/fastcampus.svg"
        alt="패스트캠퍼스 커서 강의"
        width={20}
        height={20}
      />
      <span className="font-medium">커서 개발 강의 (패스트캠퍼스)</span>
      <ArrowRight className="w-4 h-4 ml-2" />
    </Link>
  );
}
