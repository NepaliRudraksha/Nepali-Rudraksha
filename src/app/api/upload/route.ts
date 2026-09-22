import { NextRequest, NextResponse } from 'next/server';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const purpose = formData.get('purpose');
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size too large. Maximum 5MB allowed.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const folder = purpose === 'homepage-instagram'
      ? '/nepali-rudraksha/homepage-instagram'
      : '/nepali-rudraksha/products';

    // Upload to ImageKit
    const uploadResult = await new Promise<{ url: string; fileId: string }>((resolve, reject) => {
      imagekit.upload({
        file: buffer,
        fileName,
        folder,
        useUniqueFileName: true,
        // transformation: 'q-auto,f-auto', // Commented out - causing error
      }, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result) {
          reject(new Error('ImageKit returned no upload result.'));
          return;
        }
        resolve({ url: result.url, fileId: result.fileId });
      });
    });

    return NextResponse.json({ 
      url: uploadResult.url,
      fileId: uploadResult.fileId,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const fileId = typeof body === 'object' && body !== null
      ? (body as Record<string, unknown>).fileId
      : undefined;

    if (typeof fileId !== 'string' || !fileId) {
      return NextResponse.json({ error: 'A valid ImageKit file ID is required.' }, { status: 400 });
    }

    await imagekit.deleteFile(fileId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('ImageKit deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete image from ImageKit.' }, { status: 500 });
  }
}
