export interface GameLink {
  name: string;
  url: string;
}

export interface GameCategory {
  name: string;
  games: GameLink[];
  gridSize: number;
  cubePositions: [number, number][];
  offset?: [number, number, number];
}

export const categories: GameCategory[] = [
  {
    name: "Music",
    gridSize: 11,
    cubePositions: [
      [0, 0],
      [2, 2],
      [-2, -2],
      [2, -2],
      [-2, 2],
      [3, 0],
      [-3, 0],
    ],
    games: [
      { name: "Spotle", url: "https://spotle.io/" },
      { name: "Harmonies", url: "https://harmonies.io/" },
      { name: "Crosstune", url: "https://crosstune.io/" },
      { name: "Songless", url: "https://lessgames.com/songless" },
      { name: "Bandle", url: "https://bandle.app/daily" },
      { name: "Relatle", url: "https://relatle.io/" },
      { name: "Popidle", url: "https://popidle.the-sound.co.uk" },
    ],
  },
  {
    name: "Geography",
    gridSize: 7,
    offset: [9, 0, -7],
    cubePositions: [
      [0, 0],
      [1, -1],
      [-1, 1],
      [1, 1],
      [-1, -1],
    ],
    games: [
      { name: "TimeGuessr", url: "https://timeguessr.com/" },
      { name: "GeoGuessr", url: "https://www.geoguessr.com/" },
      { name: "Globle", url: "https://globle-game.com/" },
      { name: "Flagle", url: "https://www.flagle.io/" },
      { name: "Worldle", url: "https://worldle.teuteuf.fr/" },
    ],
  },
  {
    name: "Movies",
    gridSize: 7,
    offset: [-9, 0, -7],
    cubePositions: [
      [0, 0],
    ],
    games: [
      { name: "Spotle Movie", url: "https://spotle.movie/" },
    ],
  },
];
