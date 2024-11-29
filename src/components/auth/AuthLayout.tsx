'use client';

import { motion } from "framer-motion";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="Pet Arogya Logo"
            width={150}
            height={150}
            className="mx-auto"
            priority
          />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome to Pet Arogya
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your pet&apos;s health, our priority
          </p>
        </div>
        {children}
      </div>
    </div>
  );
} 