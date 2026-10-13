"use client";
import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard, defaultDarkSquareStyle } from "react-chessboard";
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
      border: "none",
    },
    darkSquareStyle: {
      backgroundColor: "transparent",
    },
    lightSquareStyle: {
      backgroundColor: "transparent",
    },
    darkSquareNotationStyle: {
      color: "#ffffff80",
    },
    lightSquareNotationStyle: {
      color: "#394f6880",
    },
    alphaNotationStyle: {
      fontSize: "26px",
    },
    numericNotationStyle: {
      fontSize: "26px",
    },
    draggingPieceStyle: {
      transform: "none",
    },
    draggingPieceGhostStyle: {
      opacity: 0,
    },
    pieces: customPieces,
  };

  return <Chessboard options={chessboardOptions} />;
}
