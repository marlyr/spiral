export function Badge({
  label,
  bg,
  color,
  style,
}: {
  label: string;
  bg: string;
  color: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={{ background: bg, color: color, ...style }}
      className="self-start capitalize text-[10px] font-medium px-[7px] py-[2px] rounded-sm tracking-[0.02em]"
    >
      {label}
    </span>
  );
}
