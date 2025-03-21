import { createPureClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function generatePresignedUrl(
  bucketName: string,
  objectKey: string,
  expiresInSec = 3600
) {
  const s3Client = new S3Client({
    region: "auto",
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY,
    },
    forcePathStyle: true,
  });

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  });
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: expiresInSec,
  });
  return url;
}

export async function POST(request: Request) {
  try {
    const { token, template_name } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "토큰이 필요합니다.", code: "TOKEN_REQUIRED" },
        { status: 400 }
      );
    }

    if (!template_name) {
      return NextResponse.json(
        { error: "템플릿 이름이 필요합니다.", code: "TEMPLATE_NAME_REQUIRED" },
        { status: 400 }
      );
    }

    const supabase = await createPureClient();

    // 이용권 코드 유효성 검증
    const { data: accountData, error: accountError } = await supabase
      .from("accounts")
      .select("is_active")
      .eq("access_token", token)
      .maybeSingle();

    if (accountError) {
      return NextResponse.json(
        {
          error: "계정 정보 조회 중 오류가 발생했습니다.",
          code: "ACCOUNT_ERROR",
        },
        { status: 500 }
      );
    }

    if (!accountData || !accountData.is_active) {
      return NextResponse.json(
        { error: "유효하지 않은 토큰입니다.", code: "TOKEN_NOT_FOUND" },
        { status: 400 }
      );
    }
    // 이용권 코드 유효성 검증
    const { data: templateData, error: templateError } = await supabase
      .from("templates")
      .select("storage_bucket_name, storage_object_key")
      .eq("name", template_name)
      .maybeSingle();

    if (templateError) {
      console.log(templateError);

      return NextResponse.json(
        {
          error: "템플릿 조회 중 오류가 발생했습니다.",
          code: "TEMPLATE_ERROR",
        },
        { status: 500 }
      );
    }

    if (!templateData) {
      return NextResponse.json(
        { error: "존재하지 않는 템플릿입니다.", code: "TEMPLATE_NOT_FOUND" },
        { status: 404 }
      );
    }

    const url = `https://pub-1e1da3e1a18e4bf5bb237da6a27da929.r2.dev/${templateData.storage_object_key}`;

    return NextResponse.json({
      success: true,
      download_url: url,
    });
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
