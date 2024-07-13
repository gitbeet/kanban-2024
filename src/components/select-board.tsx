import { type FormEvent } from "react";

const SelectBoard = ({
  boards,
  onChange,
}: {
  boards: { id: string; name: string }[];
  onChange: (e: FormEvent<HTMLSelectElement>) => void;
}) => {
  return (
    <>
      <h2>Select board</h2>
      <select onChange={onChange}>
        {boards.map((board) => (
          <option value={board.id} key={board.id}>
            {board.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default SelectBoard;
