import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getAdminSession } from '@/lib/auth';

export async function POST(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure public/uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.promises.mkdir(uploadsDir, { recursive: true });

    // Clean file name
    const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${Date.now()}_${sanitizedOriginalName}`;
    const filePath = path.join(uploadsDir, fileName);

    await fs.promises.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${fileName}`;
    return NextResponse.json({ success: true, url: publicUrl, fileName });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
