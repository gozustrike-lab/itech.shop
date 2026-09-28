import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

/**
 * /api/disable-preview
 *
 * Disables Next.js draft mode and redirects to the same page
 * without the draft mode cookie. Used by the Presentation Tool
 * to exit preview mode.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const redirectUrl = searchParams.get("redirect") || "/";

  // Disable Next.js draft mode
  const draft = await draftMode();
  draft.disable();

  return NextResponse.redirect(new URL(redirectUrl, request.url));
}