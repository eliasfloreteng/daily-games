import LandscapeBlock from './LandscapeBlock';
import InteractiveCube from './InteractiveCube';
import { categories } from '../data/links';

const BLOCK_SIZE = 1;

function Island({ gridSize, cubePositions, links, offset = [0, 0, 0], keyPrefix = '' }: {
  gridSize: number;
  cubePositions: [number, number][];
  links: string[];
  offset?: [number, number, number];
  keyPrefix?: string;
}) {
  const blocks = [];
  const cubes = [];
  const [ox, oy, oz] = offset;
  const half = Math.floor(gridSize / 2);
  const isSmall = gridSize < 10;

  for (let x = -half; x <= half; x++) {
    for (let z = -half; z <= half; z++) {
      const dist = Math.sqrt(x * x + z * z);

      let height: number;
      if (isSmall) {
        height = 0.4;
        if (dist < 1.5) height = 1.2;
        else if (dist < 2.5) height = 0.8;
        if (dist >= 2.5 && Math.random() > 0.7) height = 0.2;
        if (dist >= 3.2 && Math.random() > 0.5) continue;
      } else {
        height = 0.5;
        if (dist < 2.5) height = 1.5;
        else if (dist < 4.5) height = 1.0;
        if (dist >= 4.5 && Math.random() > 0.7) height = 0.25;
        if (dist >= 5.5 && Math.random() > 0.5) continue;
      }

      const yPos = height / 2 - 0.5;

      blocks.push(
        <LandscapeBlock
          key={`${keyPrefix}block-${x}-${z}`}
          position={[ox + x * BLOCK_SIZE, yPos + oy, oz + z * BLOCK_SIZE]}
          height={height}
        />
      );

      const cubeIndex = cubePositions.findIndex(p => p[0] === x && p[1] === z);
      if (cubeIndex !== -1 && cubeIndex < links.length) {
        cubes.push(
          <InteractiveCube
            key={`${keyPrefix}cube-${x}-${z}`}
            position={[ox + x * BLOCK_SIZE, height - 0.5 + 0.4 + oy, oz + z * BLOCK_SIZE]}
            link={links[cubeIndex]}
          />
        );
      }
    }
  }

  return (
    <>
      {blocks}
      {cubes}
    </>
  );
}

export default function Scene() {
  return (
    <group>
      {categories.map((cat) => (
        <Island
          key={cat.name}
          gridSize={cat.gridSize}
          cubePositions={cat.cubePositions}
          links={cat.games.map(g => g.url)}
          offset={cat.offset}
          keyPrefix={`${cat.name}-`}
        />
      ))}
    </group>
  );
}
