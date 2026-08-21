import { NextResponse } from 'next/server';

/**
 * The public site is a brand brochure and does not transact online.
 * Keep the former feed URL explicit so cached integrations stop ingesting stale offers.
 */
export async function GET() {
  return new NextResponse(
    '<?xml version="1.0" encoding="UTF-8"?><error>Merchant feed retired: brochure website.</error>',
    {
      status: 410,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    },
  );
}
