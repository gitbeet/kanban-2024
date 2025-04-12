import Link from "next/link";
import Text from "../ui/typography/text";

const Logo = () => {
  return (
    <Text variant="primary" hover>
      <Link href="/" className="text-center text-xl font-extrabold">
        <h1>taskly</h1>
      </Link>
    </Text>
  );
};

export default Logo;
