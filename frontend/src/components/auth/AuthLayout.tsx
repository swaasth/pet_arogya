'use client';

import { motion } from "framer-motion";
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 20px 20px, rgba(0,0,0,0.05) 2px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md mx-auto p-6"
      >
        <div className="mb-8 text-center">
          <Image
            src="/images/logo.png"
            alt="PawTracker Logo"
            width={80}
            height={80}
            className="mx-auto"
            priority
          />
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          {children}
        </div>
      </motion.div>
    </div>
  );
} 