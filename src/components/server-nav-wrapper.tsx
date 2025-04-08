import { auth, currentUser } from "@clerk/nextjs/server";
import ClientNav from "./client-nav";
const ServerNavWrapper = async () => {
  const { userId } = auth();
  const user = userId ? await currentUser() : null;

  return <ClientNav loggedIn={!!user} name={user?.firstName} />;
};

export default ServerNavWrapper;
