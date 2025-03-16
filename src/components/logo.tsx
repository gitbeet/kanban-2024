import { usePathname } from "next/navigation";
import Link from "next/link";

const Logo = () => {
  const pathname = usePathname();
  const isBoardsPage = pathname === "/boards";
  return (
    <>
      <Link
        href="/"
        className="text-dark hidden text-center text-2xl font-extrabold md:block"
      >
        <h1>taskly</h1>
      </Link>
      {!isBoardsPage && (
        <Link
          href="/"
          className="text-dark grid h-8 w-8 place-content-center rounded bg-primary-650 text-center text-2xl font-extrabold md:hidden"
        >
          <div>
            <h1 className="text-white">t</h1>
          </div>
        </Link>
      )}
    </>
  );
};

export default Logo;
