import { type FormEvent } from "react";
import { useBoards } from "~/context/boards-context";

const SelectBoard = ({
  onChange,
}: {
  onChange: (e: FormEvent<HTMLSelectElement>) => void;
}) => {
  const { optimisticBoards } = useBoards();
  const selectBoards = optimisticBoards.map(({ id, name }) => ({ id, name }));

  return (
    <>
      <h2>Select board</h2>
      <select onChange={onChange}>
        {selectBoards.map((board) => (
          <option value={board.id} key={board.id}>
            {board.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default SelectBoard;
