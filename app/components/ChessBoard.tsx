"use client";
import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { customPieces } from "../lib/pieces";

export default function ChessBoard() {
  const [game, setGame] = useState(new Chess());

  function onPieceDrop({
    sourceSquare,
    targetSquare,
  }: {
    sourceSquare: string;
    targetSquare: string | null;
  }) {
    if (!targetSquare) return false;

    const gameCopy = new Chess(game.fen());
    try {
      gameCopy.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
    } catch {
      return false;
    }

    setGame(gameCopy);
    return true;
  }

  const chessboardOptions = {
    position: game.fen(),
    onPieceDrop,
    boardStyle: {
      borderRadius: "10px",
      border: "none",
      margin: "20px 0",
    },
    pieces: customPieces,
  };

  return <Chessboard options={chessboardOptions} />;
}
