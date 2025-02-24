"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface PremiumDialogProps {
  children: React.ReactNode;
}

export function PremiumDialog({ children }: PremiumDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            프리미엄 구매가 필요합니다
          </DialogTitle>
          <DialogDescription className="pt-4 text-base">
            <Badge>얼리버드 ✨</Badge>
            <div className="mt-2">
              지금 강의를 구매하시면
              <br />
              프리미엄 템플릿을 평생 무료로 이용할 수 있습니다.
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:gap-0 sm:justify-end">
          <Button
            asChild
            className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-yellow-600"
          >
            <Link
              href="https://fastcampus.co.kr/data_online_cursor"
              target="_blank"
              className="flex items-center justify-center gap-2"
            >
              강의 구매하기
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
