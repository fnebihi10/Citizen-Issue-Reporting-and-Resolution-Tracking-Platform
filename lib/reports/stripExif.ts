const MAX_IMAGE_EDGE_PX = 12_000;
const MAX_IMAGE_PIXELS = 40_000_000;
const JPEG_QUALITY = 0.92;
const METADATA_SIGNATURES = [
  new Uint8Array([0x45, 0x78, 0x69, 0x66, 0x00, 0x00]), // JPEG Exif\0\0
  new TextEncoder().encode('EXIF'), // WebP EXIF chunk
  new TextEncoder().encode('eXIf'), // PNG eXIf chunk
  new TextEncoder().encode('GPSLatitude'),
  new TextEncoder().encode('GPSLongitude'),
];

export class ImageMetadataRemovalError extends Error {
  constructor() {
    super('IMAGE_METADATA_REMOVAL_FAILED');
    this.name = 'ImageMetadataRemovalError';
  }
}

function outputMimeType(inputMimeType: string) {
  if (inputMimeType === 'image/png') return 'image/png';
  if (inputMimeType === 'image/webp') return 'image/webp';
  return 'image/jpeg';
}

function containsSequence(bytes: Uint8Array, sequence: Uint8Array) {
  if (sequence.length === 0 || sequence.length > bytes.length) return false;

  for (let start = 0; start <= bytes.length - sequence.length; start += 1) {
    let matched = true;
    for (let offset = 0; offset < sequence.length; offset += 1) {
      if (bytes[start + offset] !== sequence[offset]) {
        matched = false;
        break;
      }
    }
    if (matched) return true;
  }

  return false;
}

async function containsKnownLocationMetadata(blob: Blob) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  return METADATA_SIGNATURES.some((signature) =>
    containsSequence(bytes, signature)
  );
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
          return;
        }
        reject(new ImageMetadataRemovalError());
      },
      mimeType,
      mimeType === 'image/png' ? undefined : JPEG_QUALITY,
    );
  });
}

/**
 * Decodes and redraws an image so EXIF, GPS and other embedded metadata are
 * not copied into the uploaded object. Sanitization fails closed: callers
 * must never upload the original file when this function rejects.
 */
export async function stripImageMetadata(file: File): Promise<File> {
  let bitmap: ImageBitmap | null = null;

  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    const pixelCount = bitmap.width * bitmap.height;
    if (
      bitmap.width < 1
      || bitmap.height < 1
      || bitmap.width > MAX_IMAGE_EDGE_PX
      || bitmap.height > MAX_IMAGE_EDGE_PX
      || pixelCount > MAX_IMAGE_PIXELS
    ) {
      throw new ImageMetadataRemovalError();
    }

    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    const context = canvas.getContext('2d');
    if (!context) throw new ImageMetadataRemovalError();

    context.drawImage(bitmap, 0, 0);
    const blob = await canvasToBlob(canvas, outputMimeType(file.type));
    if (await containsKnownLocationMetadata(blob)) {
      throw new ImageMetadataRemovalError();
    }

    return new File([blob], file.name, {
      type: blob.type,
      lastModified: Date.now(),
    });
  } catch (error) {
    if (error instanceof ImageMetadataRemovalError) throw error;
    throw new ImageMetadataRemovalError();
  } finally {
    bitmap?.close();
  }
}
