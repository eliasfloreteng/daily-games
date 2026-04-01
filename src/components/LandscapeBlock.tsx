interface Props {
  position: [number, number, number];
  height: number;
}

export default function LandscapeBlock({ position, height }: Props) {
  return (
    <mesh position={position} receiveShadow castShadow>
      {/* Width and depth set to 1 to remove borders between blocks */}
      <boxGeometry args={[1, height, 1]} />
      <meshStandardMaterial 
        color="#fdfbf7" 
        roughness={1} 
        metalness={0} 
      />
    </mesh>
  );
}
