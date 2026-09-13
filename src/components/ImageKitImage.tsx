import { Image as ImageKitImage } from '@imagekit/next';
import NextImage, { type ImageProps } from 'next/image';

/**
 * Project-wide image component. Configure NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT to
 * serve relative image paths through ImageKit; until then, local images retain
 * the existing Next.js behavior for a safe, non-breaking rollout.
 */
export default function Image({ src, ...props }: ImageProps) {
  const imageKitEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (!imageKitEndpoint) {
    return <NextImage src={src} {...props} />;
  }

  const imageSrc = typeof src === 'string' ? src : 'default' in src ? src.default.src : src.src;

  return <ImageKitImage src={imageSrc} urlEndpoint={imageKitEndpoint} {...props} />;
}
