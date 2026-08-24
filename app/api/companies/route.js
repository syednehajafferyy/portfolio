import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const data = await readData('Companies');
  return NextResponse.json(data || []);
}

export async function PUT(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const updatedCompanies = await request.json();
    const success = await writeData('Companies', updatedCompanies);
    if (!success) {
      return NextResponse.json({ error: 'Failed to update companies' }, { status: 500 });
    }
    return NextResponse.json({ success: true, data: updatedCompanies });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
