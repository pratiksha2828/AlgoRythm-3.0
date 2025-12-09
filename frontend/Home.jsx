import { Link } from "react-router-dom";

const paths = [
  {
    title: "Learn Coding from Scratch",
    desc: "Start your coding journey with beginner-friendly resources.",
    btn: "Get Started",
    link: "/learn",
    img: "https://cdn-icons-png.flaticon.com/512/906/906324.png",
  },
  {
    title: "Trace & Learn Algorithms",
    desc: "Understand logic step by step through tracing.",
    btn: "Trace Now",
    link: "/trace",
    img: "https://cdn-icons-png.flaticon.com/512/3242/3242257.png",
  },
  {
    title: "Build Live Projects",
    desc: "Engage in hands-on learning with real-world projects.",
    btn: "Join Project",
    link: "/projects",
    img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  },
  {
    title: "Refactor Your Code",
    desc: "Improve your code quality with optimization techniques.",
    btn: "Enhance Now",
    link: "/refactor",
    img: "https://cdn-icons-png.flaticon.com/512/4785/4785457.png",
  },
];

export default function Home() {
  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 bg-gray-800 shadow-md">
        <h1 className="text-2xl font-extrabold tracking-wide text-white">
          CodeCraf
        </h1>
        <nav className="space-x-6 text-gray-300 font-medium">
          <Link to="/" className="hover:text-white transition">
            Home
          </Link>
          <Link to="/courses" className="hover:text-white transition">
            Courses
          </Link>
          <Link to="/community" className="hover:text-white transition">
            Community
          </Link>
          <Link to="/contact" className="hover:text-white transition">
            Contact
          </Link>
        </nav>

        {/* GitHub Login */}
        <a
          href="http://localhost:5000/auth/github"
          className="ml-6 bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Login with GitHub
        </a>
      </header>

      {/* Hero Section */}
      <section className="text-center py-16 px-6 flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-bold">
          Explore Your Coding Journey
        </h2>
        <p className="mt-4 text-gray-400 text-lg max-w-xl">
          Choose your path and start mastering code through learning, tracing,
          and building real-world projects.
        </p>

        <Link
          to="/learn"
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Start Learning
        </Link>
      </section>

      {/* Learning Paths */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-8 pb-16">
        {paths.map((p, i) => (
          <div
            key={i}
            className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-200"
          >
            <img
              src={p.img}
              alt={p.title}
              className="h-40 mx-auto mb-4 object-contain"
            />
            <h3 className="text-xl font-semibold mb-2 text-center">{p.title}</h3>
            <p className="text-gray-400 mb-4 text-center">{p.desc}</p>
            <div className="flex justify-center">
              <Link
                to={p.link}
                className="bg-white text-gray-900 px-4 py-2 rounded-lg font-bold hover:bg-gray-200 inline-block"
              >
                {p.btn}
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center py-6 mt-auto">
        <p>
          © {new Date().getFullYear()} CodeCraf. All rights reserved. |
          <Link to="/privacy" className="hover:text-white ml-1">
            Privacy Policy
          </Link>
        </p>
      </footer>
    </div>
  );
}
