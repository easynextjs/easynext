import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const couponFormSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .email("올바른 이메일 형식이 아닙니다"),
});

type CouponFormValues = z.infer<typeof couponFormSchema>;

export function CouponDialog({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: CouponFormValues) => {
    try {
      const response = await fetch("/api/premium/coupon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.code === "EMAIL_NOT_FOUND") {
        toast({
          title: "이메일 찾을 수 없음",
          description: "패스트캠퍼스 계정 이메일을 입력해주세요.",
          variant: "destructive",
        });
      } else if (result.code === "ALREADY_ACTIVE") {
        toast({
          title: "이미 프리미엄 이용권이 등록되어 있습니다.",
          variant: "destructive",
        });
      } else if (result.code === "ACCOUNT_ERROR") {
        toast({
          title: "이용권 등록 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      } else if (result.code === "UPDATE_ERROR") {
        toast({
          title: "이용권 등록 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      } else {
        if (result.code === "SUCCESS") {
          toast({
            title: "이용권 등록 완료",
            description: "프리미엄 기능을 이용하실 수 있습니다.",
            variant: "default",
          });
        } else {
          toast({
            title: "이용권 등록 실패",
            description: "알 수 없는 오류가 발생했습니다.",
            variant: "destructive",
          });
        }

        form.reset();
        setOpen(false);
      }
    } catch (error) {
      // 에러 처리
      toast({
        title: "이용권 등록 실패",
        description:
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>이용권 등록</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              이메일
            </label>
            <Input
              id="email"
              type="email"
              placeholder="패스트캠퍼스 계정 이메일을 입력해주세요"
              className={cn(
                "w-full",
                form.formState.errors.email && "border-red-500"
              )}
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "처리 중..." : "등록"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
