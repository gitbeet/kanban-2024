const ColorGradientText = ({ text }: { text: string }) => {
  return (
    <span className="isolate bg-gradient-to-r from-blue-500 via-teal-400 to-sky-500 bg-clip-text !text-transparent">
      {text}
    </span>
  );
};

export default ColorGradientText;
