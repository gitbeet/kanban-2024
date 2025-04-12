import { FaPlus } from "react-icons/fa";
import Text from "../typography/text";
import { Button, type ButtonProps } from "./button";

type AddButtonProps = Pick<ButtonProps, "onClick"> & { text: string };

const AddButton = ({ text, onClick }: AddButtonProps) => (
  <Button variant="text" onClick={onClick} className="!px-0" size="small">
    <Text variant="secondary" hover>
      <div className="flex items-center gap-1">
        <FaPlus className="h-3 w-3" />
        <span>{text}</span>
      </div>
    </Text>
  </Button>
);

export default AddButton;
