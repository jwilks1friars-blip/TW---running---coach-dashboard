import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm font-semibold text-white">TW Running 2.0</p>
        <div className="flex gap-6 text-sm">
          <Link href="/programs" className="hover:text-white transition-colors">
            Programs
          </Link>
          <Link href="/about" className="hover:text-white transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-white transition-colors">
            Contact
          </Link>
        </div>
        <p className="text-xs">© {new Date().getFullYear()} Tyler Wilks Running. All rights reserved.</p>
      </div>
    </footer>
  );
}
