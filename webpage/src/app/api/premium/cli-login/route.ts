import { createPureClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const supabase = await createPureClient();

    // 이용권 코드 유효성 검증
    const { data: accountData, error: accountError } = await supabase
      .from("accounts")
      .select("*")
      .eq("email", email)
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
        { error: "등록된 이메일 정보가 없습니다.", code: "EMAIL_NOT_FOUND" },
        { status: 400 }
      );
    }

    if (accountData.is_active) {
      return NextResponse.json({ success: true });
    }

    const { error: updateError } = await supabase
      .from("accounts")
      .update({ is_active: true })
      .eq("email", email);

    if (updateError) {
      console.log(updateError);

      return NextResponse.json(
        { error: "이용권 등록 중 오류가 발생했습니다.", code: "UPDATE_ERROR" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
