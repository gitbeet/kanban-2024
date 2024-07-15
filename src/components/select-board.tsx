import { type FormEvent } from "react";
import { useBoards } from "~/context/boards-context";

const SelectBoard = () => {
  const { optimisticBoards, setCurrentBoardId } = useBoards();
  const selectBoards = optimisticBoards.map(({ id, name }) => ({ id, name }));

  const handleBoardChange = (e: FormEvent<HTMLSelectElement>) => {
    setCurrentBoardId(e.currentTarget.value);
  };
  return (
    <>
      <h2>Select board</h2>
      <select onChange={handleBoardChange}>
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
