import Link from "next/link";
import Text from "./typography/text";

const NavLink = ({ href, title }: { href: string; title: string }) => {
  return (
    <Text variant="primary" hover>
      <Link href={href}>{title}</Link>
    </Text>
  );
};

export default NavLink;
