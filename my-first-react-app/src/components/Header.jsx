const Header = ({ setContent }) => {
  return (
    <nav>
      <h1>Bootcamp batch 10</h1>
      <ul>
        <li className="nav-link" onClick={() => setContent("Batch")}>
          Batch
        </li>
        <li className="nav-link" onClick={() => setContent("About")}>
          About
        </li>
        <li className="nav-link" onClick={() => setContent("Contact")}>
          Contact
        </li>
      </ul>
    </nav>
  );
};

export default Header;
