import Text from "../ui/typography/text";

const MenuSectionHeading = ({ text }: { text: string }) => {
  return (
    <Text variant="primary">
      <h4 className="text-sm font-bold">{text}</h4>
    </Text>
  );
};

export default MenuSectionHeading;
