"use client";
import { useState } from "react";
import { Chess, type Square } from "chess.js";
import {
  Chessboard,
  PieceHandlerArgs,
  SquareHandlerArgs,
} from "react-chessboard";
import { customPieces } from "../lib/pieces";

export default function ChessBoard() {
  const [game, setGame] = useState(new Chess());

  const [moveFrom, setMoveFrom] = useState<string>("");
  const [optionSquares, setOptionSquares] = useState<
    Record<string, React.CSSProperties>
  >({});

  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(
    null,
  );
  const lastMoveSquares: Record<string, React.CSSProperties> = lastMove
    ? {
        [lastMove.from]: { backgroundColor: "rgba(144, 213, 255, 0.4)" },
        [lastMove.to]: { backgroundColor: "rgba(144, 213, 255, 0.4)" },
      }
    : {};

  function getMoveOptions(square: Square) {
    const moves = game.moves({ square, verbose: true });

    const newSquares: Record<string, React.CSSProperties> = {
      [square]: { background: "rgba(144, 213, 255, 0.4)" },
    };

    for (const move of moves) {
      newSquares[move.to] = {
        background:
          "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
    }

    setOptionSquares(newSquares);
    return true;
  }

  function onPieceDrag({ square }: PieceHandlerArgs) {
    if (!square) return;
    if (moveFrom !== square) {
      getMoveOptions(square as Square);
      setMoveFrom(square);
    }
  }

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
    setLastMove({ from: sourceSquare, to: targetSquare });
    setMoveFrom("");
    setOptionSquares({});
    return true;
  }

  const defaultArrowOptions = {
    colors: {
      default: "#ffaa00",
      shift: "#4caf50",
      ctrl: "#f44336",
      alt: "#9c27b0",
      meta: "#fbbf24",
    },
    color: "#ffaa00",
    secondaryColor: "#4caf50",
    tertiaryColor: "#f44336",
    arrowLengthReducerDenominator: 8,
    sameTargetArrowLengthReducerDenominator: 5,
    arrowWidthDenominator: 5,
    activeArrowWidthMultiplier: 1,
    opacity: 0.65,
    activeOpacity: 0,
    arrowStartOffset: 0.35,
  };

  const [arrowOptions, setarrowOptions] = useState(defaultArrowOptions);

  const [squareStyles, setSquareStyles] = useState<
    Record<string, React.CSSProperties>
  >({});

  function onSquareClick({ square, piece }: SquareHandlerArgs) {
    if (moveFrom === square) {
      setMoveFrom("");
      setOptionSquares({});
      return;
    }

    if (!moveFrom) {
      if (piece) {
        getMoveOptions(square as Square);
        setMoveFrom(square);
      }

      return;
    }

    const moves = game.moves({ square: moveFrom as Square, verbose: true });
    const foundMove = moves.find((m) => m.to === square);

    if (!foundMove) {
      if (piece) {
        getMoveOptions(square as Square);
        setMoveFrom(square);
      } else {
        setMoveFrom("");
        setOptionSquares({});
      }
      return;
    }

    const gameCopy = new Chess(game.fen());
    gameCopy.move({ from: moveFrom, to: square, promotion: "q" });
    setGame(gameCopy);
    setLastMove({ from: moveFrom, to: square });
    setMoveFrom("");
    setOptionSquares({});
  }

  function onSquareRightClick(args: SquareHandlerArgs) {
    setSquareStyles((prev) => {
      const newSquareStyles = {
        ...prev,
      };
      if (newSquareStyles[args.square]) {
        delete newSquareStyles[args.square];
      } else {
        newSquareStyles[args.square] = {
          backgroundColor: "rgba(255,0,0,0.5)",
        };
      }
      return newSquareStyles;
    });
  }

  const chessboardOptions = {
    position: game.fen(),
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
    dropSquareStyle: {
      boxShadow: "inset 0px 0px 0px 6px #ffffff50",
    },
    arrowOptions,
    onSquareClick,
    onSquareRightClick,
    onPieceDrag,
    onPieceDrop,
    squareStyles: { ...lastMoveSquares, ...squareStyles, ...optionSquares },
    pieces: customPieces,
  };

  return <Chessboard options={chessboardOptions} />;
}
