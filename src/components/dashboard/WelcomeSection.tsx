export function WelcomeSection() {
  return (
    <div className="bg-white/20 backdrop-blur-xl backdrop-filter rounded-lg p-8 border border-white/20">
      <h2 className="text-2xl font-bold text-black mb-2">Welcome back, Alex!</h2>
      <p className="text-black/80 mb-4">You have 3 unread messages and 2 pending tasks.</p>
      <button className="w-full bg-gradient-to-r from-purple-400 to-indigo-500 
            text-black font-semibold py-2 rounded-lg shadow-md hover:shadow-lg 
            transition duration-300 ease-in-out">
        View Tasks
      </button>
    </div>
  );
}