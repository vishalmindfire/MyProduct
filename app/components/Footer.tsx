import Link from "next/link";
import SubscriptionBox from '@/app/components/SubscriptionBox';
import { auth } from '@/auth';

const Footer = async () => {
    const session = await auth();
    console.log(session)
    return (
        <footer className="border-t border-zinc-100 dark:border-zinc-800">
            <div className="mx-auto max-w-5xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400 dark:text-zinc-500">
            <span className="font-semibold text-zinc-500 dark:text-zinc-400">
                Axon DAM
            </span>
            <div className="flex items-center gap-6">
                <Link href="/features" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Features</Link>
                <Link href="/pricing" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Pricing</Link>
                <a href="#" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Privacy</a>
                <a href="#" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Terms</a>
            </div>
            <span><SubscriptionBox/></span>
            </div>
        </footer>
    )
}

export default Footer;