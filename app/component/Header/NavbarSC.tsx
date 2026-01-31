import { auth } from "@/auth";
import Navbar from "@/app/component/Header/Navbar";

export default async function NavbarSC() {
  const session = await auth();

  return <Navbar session={session ?? null} />;
}
