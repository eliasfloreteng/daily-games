import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrthographicCamera, Environment, ContactShadows, OrbitControls } from '@react-three/drei';
import Scene from './components/Scene';

export default function App() {
  return (
    <div className="w-full h-screen bg-[#e2e8f0] relative overflow-hidden">
      <Canvas shadows>
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
            enableZoom={true} 
            enablePan={true} 
            maxPolarAngle={Math.PI / 2 - 0.1} 
            minPolarAngle={0} 
          />
        </Suspense>
      </Canvas>
      <div className="absolute top-8 left-8 pointer-events-none z-10">
        <h1 className="text-4xl font-bold text-slate-800 tracking-tight drop-shadow-sm">Daily Games</h1>
        <p className="text-slate-600 mt-2 font-medium">Hover to interact, click to explore.</p>
      </div>
    </div>
  );
}
