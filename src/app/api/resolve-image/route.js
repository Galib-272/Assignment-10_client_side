import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    // If it's already a direct image
    if (/\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(targetUrl) || targetUrl.includes("i.ibb.co")) {
      return NextResponse.json({ directUrl: targetUrl });
    }

    // If it's an ImgBB viewer page (e.g. ibb.co/XYZ)
    if (targetUrl.includes("ibb.co/")) {
      const res = await fetch(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });
      const html = await res.text();

      // Extract og:image or direct i.ibb.co image url
      const ogMatch = html.match(/<meta property=["']og:image["'] content=["']([^"']+)["']/i);
      if (ogMatch && ogMatch[1]) {
        return NextResponse.json({ directUrl: ogMatch[1] });
      }

      const directMatch = html.match(/https:\/\/i\.ibb\.co\/[a-zA-Z0-9_\-./]+\.(jpg|jpeg|png|webp)/i);
      if (directMatch && directMatch[0]) {
        return NextResponse.json({ directUrl: directMatch[0] });
      }
    }

    return NextResponse.json({ directUrl: targetUrl });
  } catch (err) {
    return NextResponse.json({ directUrl: targetUrl, error: err.message });
  }
}
