"use client";
import { useEffect, useState } from "react";
import { Chess, type Square } from "chess.js";
import {
  Chessboard,
  type PieceHandlerArgs,
  type SquareHandlerArgs,
} from "react-chessboard";
import { customPieces } from "../lib/pieces";
import { parseOpeningLines, type OpeningLine } from "../lib/openings";

export default function ChessBoard() {
  const [game, setGame] = useState(new Chess());

  const [moveFrom, setMoveFrom] = useState<string>("");
  const [optionSquares, setOptionSquares] = useState({});

  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(
    null,
  );
  const lastMoveSquares: Record<string, React.CSSProperties> = lastMove
    ? {
        [lastMove.from]: { backgroundColor: "rgba(144, 213, 255, 0.4)" },
        [lastMove.to]: { backgroundColor: "rgba(144, 213, 255, 0.4)" },
      }
    : {};

  const [dragActivationDistance, setDragActivationDistance] = useState(1);

  const [openingLines, setOpeningLines] = useState<OpeningLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [currentLine, setCurrentLine] = useState<OpeningLine | null>(null);
  const [moveIndex, setMoveIndex] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const [lineComplete, setLineComplete] = useState(false);

  useEffect(() => {
    async function loadOpeningLines() {
      try {
        const response = await fetch("/openings/vienna.txt");

        if (!response.ok) {
          throw new Error("Failed to load Vienna opening lines");
        }

        const text = await response.text();
        const lines = parseOpeningLines(text);

        setOpeningLines(lines);
      } catch (error) {
        console.error(error);
        setLoadError("Could not load Vienna opening lines.");
      } finally {
        setLoading(false);
      }
    }

    loadOpeningLines();
  }, []);

  function startSession() {
    if (loading || openingLines.length === 0) return;

    const randomIndex = Math.floor(Math.random() * openingLines.length);
    const selectedLine = openingLines[randomIndex];

    setLineComplete(false);
    setCurrentLine(selectedLine);
    setMoveIndex(0);
    setGame(new Chess());
    setLastMove(null);
    setMoveFrom("");
    setOptionSquares({});
    setSquareStyles({});
  }

  function tryUserMove(from: string, to: string): boolean {
    if (!currentLine || isThinking) return false;

    const gameCopy = new Chess(game.fen());

    let move;

    try {
      move = gameCopy.move({
        from,
        to,
        promotion: "q",
      });
    } catch {
      return false;
    }

    if (move.san !== currentLine.moves[moveIndex]) {
      return false;
    }

    let lastMovePlayed = move;
    let nextIndex = moveIndex + 1;

    setGame(gameCopy);
    setMoveIndex(nextIndex);
    setLastMove({
      from: lastMovePlayed.from,
      to: lastMovePlayed.to,
    });
    setMoveFrom("");
    setOptionSquares({});
    setSquareStyles({});

    if (moveIndex + 1 < currentLine.moves.length) {
      setIsThinking(true);

      setTimeout(() => {
        const nextGame = new Chess(gameCopy.fen());
        const blackMove = nextGame.move(currentLine.moves[moveIndex + 1]);

        setGame(nextGame);
        setLastMove({
          from: blackMove.from,
          to: blackMove.to,
        });
        setMoveIndex(moveIndex + 2);
        setIsThinking(false);
      }, 500);
    } else {
      setLineComplete(true);
    }
    return true;
  }

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
    setSquareStyles({});
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

    return tryUserMove(sourceSquare, targetSquare);
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
    setSquareStyles({});
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

    tryUserMove(moveFrom, square);
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
    dragActivationDistance,
    animationDurationInMs: 200,
    arrowOptions,
    onSquareClick,
    onSquareRightClick,
    onPieceDrag,
    onPieceDrop,
    squareStyles: { ...lastMoveSquares, ...optionSquares, ...squareStyles },
    pieces: customPieces,
  };

  return (
    <div>
      <button
        onClick={startSession}
        className="btn m-2 absolute rounded-2xl border-none shadow-none bg-blue-500 hover:bg-blue-400"
        disabled={loading}
      >
        start practice
      </button>
      {lineComplete && (
        <div className="absolute inset-0 place-self-center p-5 bg-blue-500 text-white rounded-3xl z-100">
          opening line complete!
        </div>
      )}
      <div
        style={{
          backgroundImage: "url(/boards/icy-sea.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "10px",
          overflow: "hidden",
          width: 900,
          height: 900,
          margin: "auto",
          marginTop: 20,
        }}
      >
        <Chessboard options={chessboardOptions} />
      </div>
    </div>
  );
}
