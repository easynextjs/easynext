import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
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
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [accessToken, setAccessToken] = useState<string>("");

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
        setAccessToken(result.access_token);
        setShowLoginDialog(true);
        form.reset();
        setOpen(false);
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
          setAccessToken(result.access_token);
          setShowLoginDialog(true);
          form.reset();
          setOpen(false);
        } else {
          console.log(result);

          toast({
            title: "이용권 등록 실패",
            description: "알 수 없는 오류가 발생했습니다.",
            variant: "destructive",
          });
          form.reset();
          setOpen(false);
        }
      }
    } catch (error) {
      console.log(error);

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
    <>
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

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>CLI 로그인 안내</DialogTitle>
            <DialogDescription className="pt-4 space-y-4">
              <p>
                이용권이 성공적으로 등록되었습니다. CLI를 통해 로그인해주세요.
                <br />
                아래 명령어를 터미널에 붙여넣어주세요!
              </p>
              <div className="bg-slate-100 p-3 rounded-md">
                <code className="text-sm">easynext login {accessToken}</code>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(`easynext login ${accessToken}`);
                toast({
                  title: "복사되었습니다. 터미널에 붙여넣어주세요!",
                  description: `easynext login ${accessToken}`,
                });
              }}
            >
              복사
            </Button>
            <Button onClick={() => setShowLoginDialog(false)}>확인</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
