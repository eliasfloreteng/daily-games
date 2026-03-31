import { Suspense, useState, useRef, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrthographicCamera, Environment, ContactShadows, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Scene from './components/Scene';

const ISLANDS = [
  { name: 'Music', target: [0, -1, 0] as [number, number, number] },
  { name: 'Geography', target: [9, -1, -7] as [number, number, number] },
];

function CameraController({ targetIndex, controlsRef }: { targetIndex: number; controlsRef: React.RefObject<any> }) {
  const targetVec = useRef(new THREE.Vector3(...ISLANDS[0].target));

  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const desired = ISLANDS[targetIndex].target;
    targetVec.current.set(desired[0], desired[1], desired[2]);

    controls.target.lerp(targetVec.current, 0.05);
    controls.object.position.x += (desired[0] + 15 - controls.object.position.x) * 0.05;
    controls.object.position.z += (desired[2] + 15 - controls.object.position.z) * 0.05;
    controls.update();
  });

  return null;
}

export default function App() {
  const [islandIndex, setIslandIndex] = useState(0);
  const controlsRef = useRef<any>(null);

  const goNext = useCallback(() => setIslandIndex(i => (i + 1) % ISLANDS.length), []);
  const goPrev = useCallback(() => setIslandIndex(i => (i - 1 + ISLANDS.length) % ISLANDS.length), []);

  return (
    <div className="w-full h-screen bg-[#e2e8f0] relative overflow-hidden select-none" onDragStart={e => e.preventDefault()}>
      <Canvas shadows style={{ touchAction: 'none' }}>
        <Suspense fallback={null}>
          <OrthographicCamera makeDefault position={[15, 15, 15]} zoom={85} near={-100} far={100} />
          <ambientLight intensity={0.6} />
          <directionalLight
            castShadow
            position={[10, 20, 5]}
            intensity={1.2}
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-15}
            shadow-camera-right={15}
            shadow-camera-top={15}
            shadow-camera-bottom={-15}
          />
          <Environment preset="city" />
          <group position={[0, -1, 0]}>
            <Scene />
            <ContactShadows position={[0, -0.49, 0]} opacity={0.4} scale={30} blur={2.5} far={4} color="#000000" />
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
