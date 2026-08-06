import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        alignItems: 'center',
        background: '#020617',
        borderRadius: 40,
        color: 'white',
        display: 'flex',
        fontSize: 108,
        fontWeight: 900,
        height: '100%',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      R
    </div>,
    size,
  );
}
