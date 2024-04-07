type ColourCircleProps = {
  colour: string;
  size: number;
};

export function ColourCircle({ colour, size }: ColourCircleProps) {
  return (
    <div
      className="aspect-square rounded-full border"
      style={{ backgroundColor: colour, width: size, height: size }}
    />
  );
}
