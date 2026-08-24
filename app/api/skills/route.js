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
    const success = await writeData('Skills', updatedSkills);
    if (!success) {
      return NextResponse.json({ error: 'Failed to update skills' }, { status: 500 });
    }
    return NextResponse.json({ success: true, data: updatedSkills });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
