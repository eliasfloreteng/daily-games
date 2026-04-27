import { Suspense, useState, useRef, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrthographicCamera, ContactShadows, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Scene from './components/Scene';
import { categories } from './data/links';

const ISLANDS = categories.map((cat) => ({
  name: cat.name,
  target: (cat.offset ? [cat.offset[0], -1, cat.offset[2]] : [0, -1, 0]) as [number, number, number],
}));

function CameraController({ targetIndex, controlsRef }: { targetIndex: number; controlsRef: React.RefObject<any> }) {
  const prevIndex = useRef(targetIndex);
  const animating = useRef(false);
  const offsetSnapshot = useRef(new THREE.Vector3());

  useFrame(() => {
    if (prevIndex.current !== targetIndex) {
      prevIndex.current = targetIndex;
      animating.current = true;
      const controls = controlsRef.current;
      if (controls) {
        offsetSnapshot.current.copy(controls.object.position).sub(controls.target);
      }
    }

    if (!animating.current) return;

    const controls = controlsRef.current;
    if (!controls) return;

    const desired = ISLANDS[targetIndex].target;
    const tx = desired[0], ty = desired[1], tz = desired[2];

    controls.target.x += (tx - controls.target.x) * 0.08;
    controls.target.y += (ty - controls.target.y) * 0.08;
    controls.target.z += (tz - controls.target.z) * 0.08;

    const goalPos = new THREE.Vector3(tx, ty, tz).add(offsetSnapshot.current);
    controls.object.position.x += (goalPos.x - controls.object.position.x) * 0.08;
    controls.object.position.y += (goalPos.y - controls.object.position.y) * 0.08;
    controls.object.position.z += (goalPos.z - controls.object.position.z) * 0.08;

    controls.update();

    const dist = Math.abs(controls.target.x - tx) + Math.abs(controls.target.y - ty) + Math.abs(controls.target.z - tz);
    if (dist < 0.01) {
      controls.target.set(tx, ty, tz);
      controls.update();
      animating.current = false;
    }
  });

  return null;
}

export default function App() {
  const [islandIndex, setIslandIndex] = useState(0);
  const controlsRef = useRef<any>(null);

  const goNext = useCallback(() => setIslandIndex(i => (i + 1) % ISLANDS.length), []);
  const goPrev = useCallback(() => setIslandIndex(i => (i - 1 + ISLANDS.length) % ISLANDS.length), []);

  return (
    <div className="w-full h-screen bg-[#f0eeeb] relative overflow-hidden select-none" onDragStart={e => e.preventDefault()}>
      <Canvas shadows style={{ touchAction: 'none' }}>
        <Suspense fallback={null}>
          <OrthographicCamera makeDefault position={[15, 15, 15]} zoom={85} near={-100} far={100} />
          <ambientLight intensity={0.6} color="#ffffff" />
          {/* Sun light — soft warm shadows */}
          <directionalLight
            castShadow
            position={[10, 18, 8]}
            intensity={1.5}
            color="#fffaf0"
            shadow-mapSize={[4096, 4096]}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
            shadow-camera-near={0.1}
            shadow-camera-far={50}
            shadow-bias={-0.0004}
            shadow-radius={5}
          />
          {/* Fill light to soften shadow side */}
          <directionalLight
            position={[-6, 12, -4]}
            intensity={0.25}
            color="#f0f0ff"
          />
          <group position={[0, -1, 0]}>
            <Scene />
            <ContactShadows position={[0, -0.49, 0]} opacity={0.4} scale={40} blur={2.5} far={5} color="#8a8078" />
          </group>
          <OrbitControls
            ref={controlsRef}
            enableZoom={true}
            enablePan={true}
            maxPolarAngle={Math.PI / 2 - 0.1}
            minPolarAngle={0}
          />
          <CameraController targetIndex={islandIndex} controlsRef={controlsRef} />
        </Suspense>
      </Canvas>
      <div className="absolute top-8 left-8 pointer-events-none z-10">
        <h1 className="text-4xl font-bold text-slate-800 tracking-tight drop-shadow-sm">Daily Games</h1>
        <p className="text-slate-600 mt-2 font-medium">Hover to interact, click to explore.</p>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
        <button
          onClick={goPrev}
          className="w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-md flex items-center justify-center text-slate-700 hover:bg-white hover:scale-110 transition-all cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 5L7 10L12 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <span className="px-4 py-2 rounded-full bg-white/80 backdrop-blur shadow-md text-sm font-semibold text-slate-700 select-none">
          {ISLANDS[islandIndex].name}
        </span>
        <button
          onClick={goNext}
          className="w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-md flex items-center justify-center text-slate-700 hover:bg-white hover:scale-110 transition-all cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8 5L13 10L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  );
}
