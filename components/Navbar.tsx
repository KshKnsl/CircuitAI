import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-[#0B304A]">
            CircuitAi
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <Link href="/ai-assistbot">AI Circuit Builder</Link>
          <Link href="/full-adder">Examples</Link>
          <Link href="/docs">Documentation</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
