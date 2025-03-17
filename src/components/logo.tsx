import Link from "next/link";

const Logo = () => {
  return (
    <>
      <Link
        href="/"
        className="text-dark hidden text-center text-xl font-extrabold md:block"
      >
        <h1>taskly</h1>
      </Link>

      <Link
        href="/"
        className="text-dark grid h-8 w-8 place-content-center rounded bg-primary-650 text-center text-xl font-extrabold md:hidden"
      >
        <div>
          <h1 className="text-white">t</h1>
        </div>
      </Link>
    </>
  );
};

export default Logo;
