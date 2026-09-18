import { NextRequest, NextResponse } from 'next/server';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

export const runtime = 'nodejs';

const allowedFolders = new Set(['gallery', 'services', 'packages', 'destinations', 'blog', 'misc']);
const allowedTypes = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif'],
]);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const requestedFolder = String(formData.get('folder') || 'misc');

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: 'Image file is required' }, { status: 400 });
    }
    if (!allowedFolders.has(requestedFolder)) {
      return NextResponse.json({ success: false, error: 'Invalid upload folder' }, { status: 400 });
    }
    const extension = allowedTypes.get(file.type);
    if (!extension) {
      return NextResponse.json({ success: false, error: 'Only JPG, PNG, WebP, and GIF images are supported' }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'Images must be 5MB or smaller' }, { status: 400 });
    }

    const folderPath = path.join(process.cwd(), 'public', 'uploads', requestedFolder);
    await mkdir(folderPath, { recursive: true });
    const filename = `${Date.now()}-${randomUUID()}${extension}`;
    await writeFile(path.join(folderPath, filename), Buffer.from(await file.arrayBuffer()));

    return NextResponse.json({ success: true, url: `/uploads/${requestedFolder}/${filename}` });
  } catch (error) {
    console.error('Failed to save uploaded image:', error);
    return NextResponse.json({ success: false, error: 'Failed to save image' }, { status: 500 });
  }
}
