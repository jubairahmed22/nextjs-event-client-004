// app/not-found.js
"use client"

import Link from "next/link";
import Head from "next/head";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page Not Found | 404 Error</title>
        <meta name="description" content="The page you're looking for doesn't exist" />
      </Head>
      
      <div className="min-h-screen font-montserrat bg-gradient-to-br from-rose-50 to-rose-100 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden p-8 text-center transform transition-all duration-500 hover:shadow-2xl">
          {/* Animated floating rose petal circle */}
          <div className="relative mx-auto w-48 h-48 mb-8">
            <div className="absolute inset-0 rounded-full bg-rose-100/50 animate-pulse"></div>
            <div className="absolute inset-4 rounded-full bg-rose-200/40 animate-pulse delay-100"></div>
            <div className="absolute inset-8 rounded-full bg-rose-300/30 animate-pulse delay-200 flex items-center justify-center">
              <span className="text-5xl">🌹</span>
            </div>
          </div>
          
          <h1 className="text-7xl font-bold text-rose-600 mb-4 animate-bounce">404</h1>
          <h2 className="text-3xl font-semibold text-gray-800 mb-3">Lost in the Garden</h2>
          <p className="text-gray-600 mb-8 text-lg">
            The page you seek has bloomed elsewhere or wilted away.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/"
              className="flex-1 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-rose-200/50"
            >
              Return Home
            </Link>
            
            <Link
              href="/contact"
              className="flex-1 border-2 border-rose-400 text-rose-600 hover:bg-rose-50 font-medium py-3 px-6 rounded-lg transition-all duration-300"
            >
              Contact Support
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-rose-100">
            <p className="text-sm text-rose-500/80">
              While you are here, smell the roses...
            </p>
          </div>
        </div>
      </div>
    </>
  );
}