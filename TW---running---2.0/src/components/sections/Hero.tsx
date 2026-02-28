import Link from "next/link";

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-sky-50 to-white">
      <div className="max-w-4xl mx-auto text-center">
        <span className="inline-block text-sm font-semibold tracking-widest uppercase text-sky-600 mb-4">
          Tyler Wilks Running 2.0
        </span>
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          Train smarter.<br />
          <span className="text-sky-600">Run faster.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          Personalized coaching plans built around your goals. Track workouts,
          review progress, and stay connected with your coach — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/programs"
            className="bg-sky-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-sky-700 transition-colors text-sm"
          >
            View Programs
          </Link>
          <Link
            href="/athlete"
            className="border border-gray-200 text-gray-700 font-semibold px-8 py-3 rounded-xl hover:border-sky-600 hover:text-sky-600 transition-colors text-sm"
          >
            Athlete Login
          </Link>
        </div>
      </div>
    </section>
  );
}
