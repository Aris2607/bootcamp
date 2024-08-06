const Header = ({ setContent }) => {
  return (
    <nav>
      <h1>Bootcamp batch 10</h1>
      <ul>
        <li className="nav-link" onClick={() => setContent("home")}>
          Home
        </li>
        <li className="nav-link" onClick={() => setContent("batch")}>
          Batch
        </li>
        <li className="nav-link" onClick={() => setContent("about")}>
          About
        </li>
        <li className="nav-link" onClick={() => setContent("contact")}>
          Contact
        </li>
      </ul>
    </nav>
  );
};

export default Header;
