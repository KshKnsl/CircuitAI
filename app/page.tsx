import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-neutral-900 dark:via-black dark:to-neutral-800">
      <div className="text-center z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex flex-col">

        <div className="mb-12">
          <h1 className="text-4xl sm:text-6xl font-bold text-blue-800 dark:text-blue-300">
            Welcome to GateGPT AI
          </h1>
          <p className="mt-4 text-lg sm:text-2xl text-gray-700 dark:text-gray-200">
            The great logic gates simulator empowered by AI – simulate, create, and fix with ease.
          </p>
        </div>

        <div className="mb-12">
          <Link
            href="/logic-assistant"
            className="px-8 py-3 bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-300 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-neutral-700 transition duration-200 shadow-md hover:shadow-lg"
          >
            Launch Simulator
          </Link>
        </div>

        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none mt-12">
        </div>
      </div>
    </main>
  );
}
