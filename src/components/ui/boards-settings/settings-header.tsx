import Text from "../typography/text";

const SettingsHeader = ({ title }: { title: string }) => {
  return (
    <Text variant="primary">
      <h2 className="text-lg font-bold">{title}</h2>
    </Text>
  );
};

export default SettingsHeader;
