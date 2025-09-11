export function Spiral() {
  return (
    <div
      className="relative h-14 rounded-t-xl border-foreground/10 border-b bg-gradient-to-b from-foreground/10 to-foreground/5"
      style={{}}
    >
      <div
        className="absolute inset-x-4 top-2 h-9"
        style={{
          background:
            "radial-gradient(circle at 12px 50%, #cdd5df 6px, transparent 7px) left top / 64px 100% repeat-x",
        }}
      />
    </div>
  );
}
