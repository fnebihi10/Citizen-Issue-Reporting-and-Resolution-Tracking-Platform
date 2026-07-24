import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ImageMetadataRemovalError,
  stripImageMetadata,
} from '@/lib/reports/stripExif';

function installImageEnvironment(options?: {
  outputBlob?: Blob | null;
  width?: number;
  height?: number;
  contextAvailable?: boolean;
}) {
  const close = vi.fn();
  const drawImage = vi.fn();
  const outputBlob = options?.outputBlob === undefined
    ? new Blob([new Uint8Array([0xff, 0xd8, 0xff, 0xd9])], { type: 'image/jpeg' })
    : options.outputBlob;
  const contextAvailable = options?.contextAvailable ?? true;

  vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue({
    width: options?.width ?? 2,
    height: options?.height ?? 2,
    close,
  }));
  vi.stubGlobal('document', {
    createElement: vi.fn(() => ({
      width: 0,
      height: 0,
      getContext: vi.fn(() => contextAvailable ? { drawImage } : null),
      toBlob: vi.fn((callback: BlobCallback) => callback(outputBlob)),
    })),
  });

  return { close, drawImage };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('stripImageMetadata', () => {
  it('returns a newly encoded file without the original EXIF/GPS bytes', async () => {
    const { close, drawImage } = installImageEnvironment();
    const original = new File(
      [new TextEncoder().encode('JPEG-HEADER Exif\u0000\u0000 GPSLatitude PRIVATE')],
      'evidence.jpg',
      { type: 'image/jpeg' },
    );

    const sanitized = await stripImageMetadata(original);
    const sanitizedText = new TextDecoder().decode(await sanitized.arrayBuffer());

    expect(sanitized).not.toBe(original);
    expect(sanitized.name).toBe('evidence.jpg');
    expect(sanitized.type).toBe('image/jpeg');
    expect(sanitizedText).not.toContain('Exif');
    expect(sanitizedText).not.toContain('GPSLatitude');
    expect(drawImage).toHaveBeenCalledOnce();
    expect(close).toHaveBeenCalledOnce();
  });

  it('fails closed when the browser cannot create a drawing context', async () => {
    const { close } = installImageEnvironment({ contextAvailable: false });
    const original = new File(['private metadata'], 'evidence.jpg', {
      type: 'image/jpeg',
    });

    await expect(stripImageMetadata(original)).rejects.toBeInstanceOf(
      ImageMetadataRemovalError,
    );
    expect(close).toHaveBeenCalledOnce();
  });

  it('fails closed if the re-encoded blob still contains an EXIF signature', async () => {
    const { close } = installImageEnvironment({
      outputBlob: new Blob(
        [new TextEncoder().encode('encoded pixels Exif\u0000\u0000 GPSLatitude')],
        { type: 'image/jpeg' },
      ),
    });
    const original = new File(['private metadata'], 'evidence.jpg', {
      type: 'image/jpeg',
    });

    await expect(stripImageMetadata(original)).rejects.toBeInstanceOf(
      ImageMetadataRemovalError,
    );
    expect(close).toHaveBeenCalledOnce();
  });

  it('rejects decompression-bomb-sized image dimensions', async () => {
    const { close } = installImageEnvironment({
      width: 12_001,
      height: 12_001,
    });
    const original = new File(['small compressed payload'], 'oversized.jpg', {
      type: 'image/jpeg',
    });

    await expect(stripImageMetadata(original)).rejects.toBeInstanceOf(
      ImageMetadataRemovalError,
    );
    expect(close).toHaveBeenCalledOnce();
  });
});
