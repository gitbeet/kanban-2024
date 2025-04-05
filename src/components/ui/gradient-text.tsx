const GradientText = ({ text }: { text: string }) => {
  return (
    <span className="via-teal-400 from-blue-500 to-sky-500 bg-gradient-to-r bg-clip-text text-transparent">
      {text}
    </span>
  );
};

export default GradientText;
