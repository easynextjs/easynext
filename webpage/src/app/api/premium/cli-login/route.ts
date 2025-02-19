import { createPureClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "토큰이 필요합니다.", code: "TOKEN_REQUIRED" },
        { status: 400 }
      );
    }

    const supabase = await createPureClient();

    // 이용권 코드 유효성 검증
    const { data: accountData, error: accountError } = await supabase
      .from("accounts")
      .select("is_active, access_token")
      .eq("access_token", token)
      .maybeSingle();

    if (accountError) {
      console.log(accountError);

      return NextResponse.json(
        { error: "이용권 등록 중 오류가 발생했습니다.", code: "ACCOUNT_ERROR" },
        { status: 500 }
      );
    }

    if (!accountData) {
      return NextResponse.json(
        { error: "유효하지 않은 토큰입니다.", code: "TOKEN_NOT_FOUND" },
        { status: 400 }
      );
    }

    if (!accountData.is_active) {
      return NextResponse.json(
        { error: "활성화되지 않은 계정입니다.", code: "ACCOUNT_INACTIVE" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      access_token: accountData.access_token,
    });
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
