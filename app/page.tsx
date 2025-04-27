import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-neutral-900 dark:via-black dark:to-neutral-800">
      <div className="text-center z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex flex-col">

        <div className="mb-12">
          {/* Consider adding a logo here if available */}
          {/* <Image src="/logo.svg" alt="GateGPT Logo" width={150} height={50} className="mx-auto mb-6" /> */}
          <h1 className="text-4xl sm:text-6xl font-bold text-blue-800 dark:text-blue-300">
            Welcome to GateGPT AI
          </h1>
          <p className="mt-4 text-lg sm:text-2xl text-gray-700 dark:text-gray-200">
            The AI-powered logic gate simulator – design, simulate, and learn with ease.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link
            href="/full-adder" // Link to the Full Adder example page
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg text-lg"
          >
            View Full Adder Example
          </Link>
          <Link
            href="/ai-assistbot" // Link to the AI Assistant page
            className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition duration-200 shadow-md hover:shadow-lg text-lg"
          >
            Launch AI Circuit Builder
          </Link>
        </div>

        {/* Optional: Add a section describing features */}
        <div className="mt-16 text-left max-w-3xl w-full">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Features</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 text-lg">
            <li>Visualize logic circuits with an interactive interface.</li>
            <li>Generate circuits instantly using AI based on your descriptions.</li>
            <li>Explore pre-built examples like the Full Adder.</li>
            <li>Modify and simulate circuits in real-time.</li>
          </ul>
        </div>

        {/* Remove or repurpose the bottom placeholder div */}
        {/* <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none mt-12">
        </div> */}
        <footer className="mt-16 text-gray-500 dark:text-gray-400 text-sm">
          Powered by DigitalJS & Gemini AI
        </footer>
      </div>
    </main>
  );
}
