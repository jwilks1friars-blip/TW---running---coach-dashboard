export default function AthletePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Athlete Portal</h1>
        <p className="text-gray-500 text-sm mb-8">
          Sign in to view your training plan and messages from your coach.
        </p>
        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email address"
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button
            type="submit"
            className="bg-sky-600 text-white font-semibold py-2.5 rounded-lg hover:bg-sky-700 transition-colors text-sm"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
