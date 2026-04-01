import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

function createPaperTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base warm paper color
  ctx.fillStyle = '#f5f0e8';
  ctx.fillRect(0, 0, size, size);

  // Coarse grain noise for visible paper feel
  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 30;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise - 4));
  }
  ctx.putImageData(imageData, 0, 0);

  // Subtle speckles
  for (let i = 0; i < 300; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 0.5 + Math.random() * 1.5;
    const alpha = 0.03 + Math.random() * 0.06;
    ctx.fillStyle = `rgba(160, 140, 120, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Fiber lines
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 60; i++) {
    const x1 = Math.random() * size;
    const y1 = Math.random() * size;
    const angle = Math.random() * Math.PI;
    const len = 8 + Math.random() * 40;
    const alpha = 0.04 + Math.random() * 0.08;
    ctx.strokeStyle = `rgba(180, 165, 145, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 + Math.cos(angle) * len, y1 + Math.sin(angle) * len);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

let sharedTexture: THREE.CanvasTexture | null = null;
function getPaperTexture() {
  if (!sharedTexture) {
    sharedTexture = createPaperTexture();
  }
  return sharedTexture;
}

interface Props {
  position: [number, number, number];
  height: number;
}

export default function LandscapeBlock({ position, height }: Props) {
  const texture = useMemo(() => getPaperTexture(), []);

  return (
    <RoundedBox
      args={[1, height, 1]}
      radius={0.06}
      smoothness={4}
      position={position}
      receiveShadow
      castShadow
    >
      <meshStandardMaterial
        map={texture}
        roughness={0.9}
        metalness={0}
      />
    </RoundedBox>
  );
}
