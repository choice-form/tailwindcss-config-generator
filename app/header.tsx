import { auth } from './auth';
import HeaderBar from './header-bar';

export default async function Header() {
  const session = await auth();
  return <HeaderBar user={session?.user} />;
}