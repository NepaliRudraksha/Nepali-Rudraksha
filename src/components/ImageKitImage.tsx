'use client';

import { Image as ImageKitImage } from '@imagekit/next';
import NextImage, { type ImageProps } from 'next/image';
import { useState } from 'react';

/**
 * Project-wide image component. Configure NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT to
 * serve relative image paths through ImageKit; until then, local images retain
 * the existing Next.js behavior for a safe, non-breaking rollout.
 */
export default function Image({ src, ...props }: ImageProps) {
  const imageKitEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
  const [imageKitFailed, setImageKitFailed] = useState(false);
  const hasValidStringSource =
    typeof src !== 'string' || src.startsWith('/') || /^https?:\/\//i.test(src);
  const safeSrc = hasValidStringSource
    ? src
    : '/images/rudraksha_bead_close_1789219796219.jpg';
  const isLocalImage = typeof safeSrc === 'string' && safeSrc.startsWith('/');

  // Files in /public already live on this application. Sending them to
  // ImageKit turns /images/foo.jpg into an ImageKit lookup, which 404s unless
  // the file was uploaded separately to that account.
  if (!imageKitEndpoint || imageKitFailed || isLocalImage) {
    return <NextImage src={safeSrc} {...props} />;
  }

  const imageSrc =
    typeof safeSrc === 'string'
      ? safeSrc
      : 'default' in safeSrc
        ? safeSrc.default.src
        : safeSrc.src;

  return (
    <ImageKitImage
      src={imageSrc}
      urlEndpoint={imageKitEndpoint}
      {...props}
      onError={(event) => {
        setImageKitFailed(true);
        props.onError?.(event);
      }}
    />
  );
}
