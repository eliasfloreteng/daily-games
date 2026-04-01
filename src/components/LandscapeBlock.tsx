import { useMemo } from 'react';
import * as THREE from 'three';

function createPaperTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base warm paper color
  ctx.fillStyle = '#fdfbf7';
  ctx.fillRect(0, 0, size, size);

  // Fine grain noise
  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 18;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise - 2));
  }
  ctx.putImageData(imageData, 0, 0);

  // Subtle fiber lines
  ctx.strokeStyle = 'rgba(200, 190, 175, 0.15)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 40; i++) {
    ctx.beginPath();
    const x1 = Math.random() * size;
    const y1 = Math.random() * size;
    const angle = Math.random() * Math.PI;
    const len = 10 + Math.random() * 30;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 + Math.cos(angle) * len, y1 + Math.sin(angle) * len);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  return texture;
}

// Shared texture instance
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
    <mesh position={position} receiveShadow castShadow>
      <boxGeometry args={[1, height, 1]} />
      <meshStandardMaterial
        map={texture}
        color="#fdfbf7"
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}
