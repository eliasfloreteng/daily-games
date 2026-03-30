import LandscapeBlock from './LandscapeBlock';
import InteractiveCube from './InteractiveCube';

const GRID_SIZE = 11;
const BLOCK_SIZE = 1;

const LINKS = [
  "https://spotle.io/",
  "https://harmonies.io/",
  "https://crosstune.io/",
  "https://lessgames.com/songless",
  "https://bandle.app/daily",
  "https://relatle.io/",
  "https://popidle.the-sound.co.uk"
];

const CUBE_POSITIONS = [
  [0, 0],
  [2, 2],
  [-2, -2],
  [2, -2],
  [-2, 2],
  [3, 0],
  [-3, 0]
];

export default function Scene() {
  const blocks = [];
  const interactiveCubes = [];

  for (let x = -Math.floor(GRID_SIZE / 2); x <= Math.floor(GRID_SIZE / 2); x++) {
    for (let z = -Math.floor(GRID_SIZE / 2); z <= Math.floor(GRID_SIZE / 2); z++) {
      // Distance from center
      const dist = Math.sqrt(x * x + z * z);
      
      // Height based on distance (plateau in center, stepping down)
      let height = 0.5;
      if (dist < 2.5) height = 1.5;
      else if (dist < 4.5) height = 1.0;
      
      // Add some random variation to the outer blocks to make it look organic
      if (dist >= 4.5 && Math.random() > 0.7) {
        height = 0.25;
      }
      if (dist >= 5.5 && Math.random() > 0.5) {
        continue; // Skip some outer blocks
      }

      const yPos = height / 2 - 0.5;

      blocks.push(
        <LandscapeBlock key={`block-${x}-${z}`} position={[x * BLOCK_SIZE, yPos, z * BLOCK_SIZE]} height={height} />
      );

      // Add interactive cubes on specific blocks
      const cubeIndex = CUBE_POSITIONS.findIndex(p => p[0] === x && p[1] === z);

      if (cubeIndex !== -1 && cubeIndex < LINKS.length) {
        interactiveCubes.push(
          <InteractiveCube
            key={`cube-${x}-${z}`}
            position={[x * BLOCK_SIZE, height - 0.5 + 0.4, z * BLOCK_SIZE]} // 0.4 is half of cube height (0.8)
            link={LINKS[cubeIndex]}
          />
        );
      }
    }
  }

  return (
    <group>
      {blocks}
      {interactiveCubes}
    </group>
  );
}
