import Heart from "./Heart";

// Renders a row of 10 hearts representing a 0-100 value.
export default function HeartBar({ value, size = 14 }: { value: number; size?: number }) {
  const total = 10;
  const fullHearts = Math.floor(value / 10);
  const hasHalf = value % 10 >= 5;

  return (
    <div className="flex items-center gap-[3px]" aria-label={`${value} out of 100`}>
      {Array.from({ length: total }).map((_, i) => {
        const filled = i < fullHearts;
        const half = !filled && i === fullHearts && hasHalf;
        return <Heart key={i} filled={filled || half} half={half} size={size} />;
      })}
    </div>
  );
}
