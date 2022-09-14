import React from "react";

export default function Navbar({ fixed }) {
  return (
    <nav className="px-2 bg-indigo-700">
        <div className="container px-4 mx-5 flex flex-wrap items-center justify-between">
            <a
                className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white"
                href="/"
            >
                Flimapp
            </a>
        </div>
    </nav>
  );
}