import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Html } from '@react-three/drei';
import { Mesh, MathUtils, Vector3, Object3D, InstancedMesh, Group } from 'three';

interface Props {
  position: [number, number, number];
  link: string;
}

const PARTICLE_COUNT = 27;

const iconModules = import.meta.glob('../assets/icons/*', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const iconMap: Record<string, string> = Object.fromEntries(
  Object.entries(iconModules).map(([path, url]) => {
    const filename = path.split('/').pop() ?? '';
    const hostname = filename.replace(/\.[^.]+$/, '');
    return [hostname, url];
  })
);

const FALLBACK_ICON =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

export default function InteractiveCube({ position, link }: Props) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const instancedMeshRef = useRef<InstancedMesh>(null);
  
  const [hovered, setHovered] = useState(false);
  const [exploded, setExploded] = useState(false);
  const [visible, setVisible] = useState(true);

  const hostname = useMemo(() => {
    try {
      return new URL(link).hostname;
    } catch (e) {
      return 'example.com';
    }
  }, [link]);
  
  const textureUrl = iconMap[hostname] ?? FALLBACK_ICON;
  const texture = useTexture(textureUrl);

  const dummy = useMemo(() => new Object3D(), []);
  const particlesData = useMemo(() => {
    const data = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const dir = new Vector3(x, y, z);
          if (dir.lengthSq() === 0) dir.set(0, 1, 0);
          dir.normalize();
          data.push({
            position: new Vector3(x * 0.26, y * 0.26, z * 0.26),
            velocity: dir.multiplyScalar(Math.random() * 0.06 + 0.02),
            rotationAxis: new Vector3(Math.random(), Math.random(), Math.random()).normalize(),
            rotationSpeed: Math.random() * 0.2,
            scale: 1,
          });
        }
      }
    }
    return data;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    if (!exploded) {
      // Target Y position based on hover state
      const targetY = hovered ? position[1] + 0.6 : position[1];
      
      // Smoothly interpolate to target Y
      groupRef.current.position.y = MathUtils.lerp(groupRef.current.position.y, targetY, 0.1);

      // Add bobbing effect when hovered
      if (hovered) {
        groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 4) * 0.03;
        groupRef.current.rotation.y += 0.015;
        groupRef.current.rotation.x = MathUtils.lerp(groupRef.current.rotation.x, 0.2, 0.05);
        groupRef.current.rotation.z = MathUtils.lerp(groupRef.current.rotation.z, 0.1, 0.05);
      } else {
        // Smoothly return rotation to 0
        groupRef.current.rotation.y = MathUtils.lerp(groupRef.current.rotation.y, 0, 0.1);
        groupRef.current.rotation.x = MathUtils.lerp(groupRef.current.rotation.x, 0, 0.1);
        groupRef.current.rotation.z = MathUtils.lerp(groupRef.current.rotation.z, 0, 0.1);
      }
    } else if (instancedMeshRef.current && visible) {
      let allDead = true;
      particlesData.forEach((p, i) => {
        if (p.scale > 0) {
          allDead = false;
          p.position.add(p.velocity);
          p.velocity.y -= 0.002; // slight gravity
          p.scale -= 0.03; // Shrink faster
          if (p.scale < 0) p.scale = 0;
          
          dummy.position.copy(p.position);
          dummy.scale.set(p.scale, p.scale, p.scale);
          dummy.rotateOnAxis(p.rotationAxis, p.rotationSpeed);
          dummy.updateMatrix();
          instancedMeshRef.current.setMatrixAt(i, dummy.matrix);
        }
      });
      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
      if (allDead) {
        setVisible(false);
      }
    }
  });

  if (!visible) return null;

  return (
    <group ref={groupRef} position={position}>
      {!exploded && (
        <mesh
          ref={meshRef}
          castShadow
          receiveShadow
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHovered(false);
            document.body.style.cursor = 'auto';
          }}
          onClick={(e) => {
            e.stopPropagation();
            setExploded(true);
            setHovered(false);
            document.body.style.cursor = 'auto';
            window.open(link, '_blank');
          }}
        >
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial map={texture} roughness={0.2} metalness={0.1} />
          {hovered && (
            <Html position={[0, 0.8, 0]} center zIndexRange={[100, 0]}>
              <div className="bg-slate-900/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-xl whitespace-nowrap pointer-events-none transform -translate-y-2 transition-transform">
                {hostname}
              </div>
            </Html>
          )}
        </mesh>
      )}
      
      {exploded && (
        <instancedMesh ref={instancedMeshRef} args={[undefined as any, undefined as any, PARTICLE_COUNT]} castShadow>
          <boxGeometry args={[0.26, 0.26, 0.26]} />
          <meshStandardMaterial map={texture} roughness={0.2} metalness={0.1} />
        </instancedMesh>
      )}
    </group>
  );
}
