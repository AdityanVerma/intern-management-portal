import "./Header.css";

function Header({ loginAs }) {
  return (
    <header>
      <h1>DRDO Internship Management Portal</h1>
      <button className="flex-cen-all login-btn">{loginAs}</button>
    </header>
  );
}

export default Header;
