// src/components/Header.jsx
import React from "react";

function Header() {
  return (
    <header className="header">
      {" "}
      {/* Note: class becomes className in JSX */}
      <img src="/assets/icons/logo.svg" alt="Spots logo" />
    </header>
  );
}

export default Header;
