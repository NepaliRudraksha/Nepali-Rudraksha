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
  const [imageFailed, setImageFailed] = useState(false);
  const fallbackImage = '/images/handpicked_for_spiritual/WhatsApp%20Image%202026-09-18%20at%205.15.43%20PM.jpeg';
  const hasValidStringSource =
    typeof src !== 'string' || src.startsWith('/') || /^https?:\/\//i.test(src);
  const safeSrc = hasValidStringSource
    ? src
    : fallbackImage;
  const displaySrc = imageFailed || imageKitFailed ? fallbackImage : safeSrc;
  const isLocalImage = typeof displaySrc === 'string' && displaySrc.startsWith('/');

  // Files in /public already live on this application. Sending them to
  // ImageKit turns /images/foo.jpg into an ImageKit lookup, which 404s unless
  // the file was uploaded separately to that account.
  if (!imageKitEndpoint || imageKitFailed || isLocalImage) {
    return (
      <NextImage
        src={displaySrc}
        {...props}
        onError={(event) => {
          setImageFailed(true);
          props.onError?.(event);
        }}
      />
    );
  }

  const imageSrc =
    typeof displaySrc === 'string'
      ? displaySrc
      : 'default' in displaySrc
        ? displaySrc.default.src
        : displaySrc.src;

  return (
    <ImageKitImage
      src={imageSrc}
      urlEndpoint={imageKitEndpoint}
      {...props}
      onError={(event) => {
        setImageKitFailed(true);
        setImageFailed(true);
        props.onError?.(event);
      }}
    />
  );
}
