import { useState } from "react";

export function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </section>
  );
}
