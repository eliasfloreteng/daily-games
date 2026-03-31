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

// Geography games on a smaller island to the side
const GEO_LINKS = [
  "https://timeguessr.com/",
  "https://www.geoguessr.com/",
  "https://globle-game.com/",
  "https://www.flagle.io/",
  "https://worldle.teuteuf.fr/"
];

const GEO_ISLAND_OFFSET = [9, 0, -7]; // Offset from main island
const GEO_GRID_SIZE = 7;

const GEO_CUBE_POSITIONS = [
  [0, 0],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1]
];

export default function Scene() {
  const blocks = [];
  const interactiveCubes = [];

  // Main island
  for (let x = -Math.floor(GRID_SIZE / 2); x <= Math.floor(GRID_SIZE / 2); x++) {
    for (let z = -Math.floor(GRID_SIZE / 2); z <= Math.floor(GRID_SIZE / 2); z++) {
      const dist = Math.sqrt(x * x + z * z);

      let height = 0.5;
      if (dist < 2.5) height = 1.5;
      else if (dist < 4.5) height = 1.0;

      if (dist >= 4.5 && Math.random() > 0.7) {
        height = 0.25;
      }
      if (dist >= 5.5 && Math.random() > 0.5) {
        continue;
      }

      const yPos = height / 2 - 0.5;

      blocks.push(
        <LandscapeBlock key={`block-${x}-${z}`} position={[x * BLOCK_SIZE, yPos, z * BLOCK_SIZE]} height={height} />
      );

      const cubeIndex = CUBE_POSITIONS.findIndex(p => p[0] === x && p[1] === z);

      if (cubeIndex !== -1 && cubeIndex < LINKS.length) {
        interactiveCubes.push(
          <InteractiveCube
            key={`cube-${x}-${z}`}
            position={[x * BLOCK_SIZE, height - 0.5 + 0.4, z * BLOCK_SIZE]}
            link={LINKS[cubeIndex]}
          />
        );
      }
    }
  }

  // Geography island (smaller, off to the side)
  const [ox, oy, oz] = GEO_ISLAND_OFFSET;
  const geoHalf = Math.floor(GEO_GRID_SIZE / 2);

  for (let x = -geoHalf; x <= geoHalf; x++) {
    for (let z = -geoHalf; z <= geoHalf; z++) {
      const dist = Math.sqrt(x * x + z * z);

      let height = 0.4;
      if (dist < 1.5) height = 1.2;
      else if (dist < 2.5) height = 0.8;

      if (dist >= 2.5 && Math.random() > 0.7) {
        height = 0.2;
      }
      if (dist >= 3.2 && Math.random() > 0.5) {
        continue;
      }

      const yPos = height / 2 - 0.5;

      blocks.push(
        <LandscapeBlock
          key={`geo-block-${x}-${z}`}
          position={[ox + x * BLOCK_SIZE, yPos + oy, oz + z * BLOCK_SIZE]}
          height={height}
        />
      );

      const cubeIndex = GEO_CUBE_POSITIONS.findIndex(p => p[0] === x && p[1] === z);

      if (cubeIndex !== -1 && cubeIndex < GEO_LINKS.length) {
        interactiveCubes.push(
          <InteractiveCube
            key={`geo-cube-${x}-${z}`}
            position={[ox + x * BLOCK_SIZE, height - 0.5 + 0.4 + oy, oz + z * BLOCK_SIZE]}
            link={GEO_LINKS[cubeIndex]}
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
