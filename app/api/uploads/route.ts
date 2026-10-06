import { NextRequest, NextResponse } from 'next/server';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { getSession } from '@/lib/services/session';

export const runtime = 'nodejs';

const allowedFolders = new Set(['gallery', 'services', 'packages', 'destinations', 'blog', 'branding', 'misc']);
const allowedTypes = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif'],
  ['image/x-icon', '.ico'],
  ['image/vnd.microsoft.icon', '.ico'],
]);

function getSupabaseStorageConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'uploads';

  if (!url && !serviceRoleKey) return null;
  if (!url || !serviceRoleKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must both be configured');
  }

  return { url, serviceRoleKey, bucket };
}

function encodeStoragePath(filePath: string) {
  return filePath.split('/').map(encodeURIComponent).join('/');
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

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

    const filename = `${Date.now()}-${randomUUID()}${extension}`;
    const filePath = `${requestedFolder}/${filename}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const storage = getSupabaseStorageConfig();

    if (storage) {
      const encodedPath = encodeStoragePath(filePath);
      const uploadResponse = await fetch(
        `${storage.url}/storage/v1/object/${encodeURIComponent(storage.bucket)}/${encodedPath}`,
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + storage.serviceRoleKey,
            apikey: storage.serviceRoleKey,
            'Content-Type': file.type,
            'x-upsert': 'false',
          },
          body: fileBuffer,
        },
      );

      if (!uploadResponse.ok) {
        const details = await uploadResponse.text();
        console.error('Supabase Storage upload failed:', uploadResponse.status, details);
        return NextResponse.json({ success: false, error: 'Failed to save image to storage' }, { status: 502 });
      }

      return NextResponse.json({
        success: true,
        url: `${storage.url}/storage/v1/object/public/${encodeURIComponent(storage.bucket)}/${encodedPath}`,
      });
    }

    const folderPath = path.join(process.cwd(), 'public', 'uploads', requestedFolder);
    await mkdir(folderPath, { recursive: true });
    await writeFile(path.join(folderPath, filename), fileBuffer);

    return NextResponse.json({ success: true, url: `/uploads/${requestedFolder}/${filename}` });
  } catch (error) {
    console.error('Failed to save uploaded image:', error);
    return NextResponse.json({ success: false, error: 'Failed to save image' }, { status: 500 });
  }
}
