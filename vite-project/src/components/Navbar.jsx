import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={styles.navbar}>
      <h3 style={styles.logo}>KitchenMind</h3>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link> {/* לינק לדף הבית */}
        {token && <Link to="/products" style={styles.link}>Products</Link>}
        {token && <Link to="/add-product" style={styles.link}>Add Product</Link>}
        {!token && <Link to="/login" style={styles.link}>Login</Link>}
        {!token && <Link to="/register" style={styles.link}>Register</Link>}
        {token && <button onClick={handleLogout} style={styles.button}>Logout</button>}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#3f51b5",
    color: "white",
  },
  logo: {
    margin: 0,
  },
  links: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
  },
  button: {
    backgroundColor: "transparent",
    border: "1px solid white",
    color: "white",
    padding: "5px 10px",
    cursor: "pointer",
  },
};

export default Navbar;
