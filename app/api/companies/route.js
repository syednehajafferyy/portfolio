import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const data = await readData('Companies');
  return NextResponse.json(data || [], {
    headers: {
      'Cache-Control': 'no-store, max-age=0, must-revalidate'
    }
  });
}

export async function PUT(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const updatedCompanies = await request.json();
    const result = await writeData('Companies', updatedCompanies);

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/admin', 'layout');
    } catch (_) {}

    return NextResponse.json({
      success: true,
      data: updatedCompanies,
      synced: result.synced,
      warning: result.warning
    });
  } catch (error) {
    console.error('API Error updating companies:', error);
    return NextResponse.json({ error: error.message || 'Failed to update companies' }, { status: 500 });
  }
}

