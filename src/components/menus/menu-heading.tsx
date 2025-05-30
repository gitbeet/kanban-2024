import Text from "../ui/typography/text";

const MenuHeading = ({ text }: { text: string }) => {
  return (
    <Text variant="primary">
      <h1 className="truncate text-lg font-bold">{text}</h1>
    </Text>
  );
};

export default MenuHeading;
