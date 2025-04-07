import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <span className="text-2xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 hover:from-blue-500 hover:to-indigo-500 transition-all duration-200">
        INTERN
        <span className="text-3xl font-black">X</span>
      </span>
    </Link>
  );
} 