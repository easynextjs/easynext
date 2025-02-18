import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, coupon } = await request.json();

    const supabase = createRouteHandlerClient({ cookies });

    // 이용권 코드 유효성 검증
    const { data: couponData, error: couponError } = await supabase
      .from("premium_coupons")
      .select("*")
      .eq("code", coupon)
      .eq("is_used", false)
      .single();

    if (couponError || !couponData) {
      return NextResponse.json(
        { error: "유효하지 않은 이용권 코드입니다." },
        { status: 400 }
      );
    }

    // 트랜잭션 시작: 이용권 사용 처리 및 프리미엄 계정 활성화
    const { error: updateError } = await supabase.rpc(
      "activate_premium_coupon",
      {
        p_email: email,
        p_coupon_code: coupon,
      }
    );

    if (updateError) {
      return NextResponse.json(
        { error: "이용권 등록 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
