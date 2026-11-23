import { useState } from "react";

export function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className={isOpen ? "box" : "box box-collapsed"}>
      <button
        className="btn-toggle"
        type="button"
        aria-label={isOpen ? "Collapse panel" : "Expand panel"}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </section>
  );
}
