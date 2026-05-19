import Link from "next/link";
import AuthButtons from "@/app/components/AuthButtons";

const Header = async () => {

    return (
      <header className="sticky top-0 z-50 border-b border-zinc-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 h-14">
          <span className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Express<span className="text-zinc-400 dark:text-zinc-500"> DAM</span>
          </span>
          <div className="hidden sm:flex items-center gap-6 text-sm text-zinc-500 dark:text-zinc-400">
            <Link href="/features" className="hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors">Features</Link>
            <Link href="/pricing" className="hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-2">
            <AuthButtons/>            
          </div>
        </nav>
      </header>
    )
}


export default Header;