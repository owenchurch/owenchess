export type OpeningLine = {
  id: number;
  moves: string[];
};

export function parseOpeningLines(txt: string): OpeningLine[] {
  return txt
    .split(/\r?\n/)
    .map((line, i) => ({
      id: i,
      moves: line
        .split(",")
        .map((move) => move.trim())
        .filter(Boolean),
    }))
    .filter((line) => line.moves.length > 0);
}
