// import { type FormEvent } from "react";
// import { useBoards } from "~/context/boards-context";

// const SelectBoard = () => {
//   const { optimisticBoards } = useBoards();
//   const selectBoards = optimisticBoards.map(({ id, name }) => ({ id, name }));

//   const handleBoardChange = (e: FormEvent<HTMLSelectElement>) => {
//     setCurrentBoardId(e.currentTarget.value);
//   };
//   return (
//     <>
//       <select
//         className="rounded-md bg-neutral-800 px-4 py-2 text-2xl text-white"
//         onChange={handleBoardChange}
//       >
//         {selectBoards.map((board) => (
//           <option value={board.id} key={board.id}>
//             {board.name}
//           </option>
//         ))}
//       </select>
//     </>
//   );
// };

// export default SelectBoard;
