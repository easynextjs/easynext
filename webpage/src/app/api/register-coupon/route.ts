import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, coupon } = await request.json();
    const supabase = await createClient();

    // 이메일 중복 확인
    const { data: existingEmail } = await supabase
      .from("accounts")
      .select()
      .eq("email", email)
      .single();

    if (existingEmail) {
      return NextResponse.json(
        { message: "이미 등록된 이메일입니다." },
        { status: 400, statusText: "EMAIL_REGISTERED" }
      );
    }

    // 쿠폰 중복 확인
    const { data: existingCoupon } = await supabase
      .from("accounts")
      .select()
      .eq("coupon", coupon)
      .single();

    if (existingCoupon) {
      return NextResponse.json(
        { message: "이미 사용된 이용권 코드입니다." },
        { status: 400, statusText: "COUPON_REGISTERED" }
      );
    }

    // 신규 계정 등록
    const { error } = await supabase
      .from("accounts")
      .insert([{ email, coupon, is_premium: true }]);

    if (error) throw error;

    return NextResponse.json(
      { message: "이용권이 성공적으로 등록되었습니다." },
      { status: 200, statusText: "SUCCESS" }
    );
  } catch (error) {
    console.error("Error registering coupon:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
