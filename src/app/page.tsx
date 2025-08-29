import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SignInButton } from "@/components/auth/sign-in-button";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <main className="flex flex-col items-center gap-8 text-center">
        <Image
          src="/next.svg"
          alt="App Logo"
          width={180}
          height={38}
          className="dark:invert"
          priority
        />
        <p className="text-lg">匿名で曲を出し合って、みんなで盛り上がろう。</p>
        {session ? (
          <Link
            href="/dashboard"
            className="rounded-full bg-foreground text-background px-6 py-3 font-medium hover:opacity-90"
          >
            ダッシュボードへ
          </Link>
        ) : (
          <SignInButton />
        )}
      </main>
    </div>
  );
}
