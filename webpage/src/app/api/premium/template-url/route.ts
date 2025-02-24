import { createPureClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

async function generatePresignedUrl(
  bucketName: string,
  objectKey: string,
  expiresInSec = 600
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

    const url = await generatePresignedUrl(
      templateData.storage_bucket_name,
      templateData.storage_object_key
    );

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
