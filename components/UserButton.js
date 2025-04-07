'use client';
import { signOut } from 'next-auth/react';

export function UserButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
    >
      Sign Out
    </button>
  );
} 