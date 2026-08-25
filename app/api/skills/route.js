import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const data = await readData('Skills');
  return NextResponse.json(data || []);
}

export async function PUT(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const updatedSkills = await request.json();
    await writeData('Skills', updatedSkills);
    return NextResponse.json({ success: true, data: updatedSkills });
  } catch (error) {
    console.error('API Error updating skills:', error);
    return NextResponse.json({ error: error.message || 'Failed to update skills' }, { status: 500 });
  }
}
