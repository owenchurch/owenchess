import type { PieceRenderObject } from "react-chessboard";

const pieceCodes = [
  "wP",
  "wN",
  "wB",
  "wR",
  "wQ",
  "wK",
  "bP",
  "bN",
  "bB",
  "bR",
  "bQ",
  "bK",
];

export const customPieces: PieceRenderObject = Object.fromEntries(
  pieceCodes.map((code) => [
    code,
    () => (
      <img
        src={`/pieces/${code}.png`}
        style={{ width: "100%", height: "100%" }}
        alt={code}
      />
    ),
  ]),
);
