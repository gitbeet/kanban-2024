import Text from "./text";

const HeroSubheading = ({
  text,
  className,
}: {
  text: string;
  className: string;
}) => {
  return (
    <Text variant="secondary">
      <p className={`text-lg font-light ${className}`}>{text}</p>
    </Text>
  );
};

export default HeroSubheading;
