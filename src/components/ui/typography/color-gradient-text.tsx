const ColorGradientText = ({ text }: { text: string }) => {
  return (
    // py-1 to fix clipping
    <span className="isolate bg-gradient-to-r from-blue-500 via-teal-400 to-sky-500 bg-clip-text py-1 !text-transparent">
      {text}
    </span>
  );
};

export default ColorGradientText;
