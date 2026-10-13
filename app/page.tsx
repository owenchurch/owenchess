import ChessBoard from "./components/ChessBoard";

export default function Home() {
  return (
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
      }}
    >
      <ChessBoard />
    </div>
  );
}
