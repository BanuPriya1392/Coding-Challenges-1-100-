import React, { useState, useEffect, useMemo } from "react";

const App = () => {
  // --- STATE ---
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // --- DATA FETCHING ---
  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      });
  }, []);

  // --- CART LOGIC ---
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // --- FILTER LOGIC ---
  const filteredItems = useMemo(() => {
    return items.filter((p) => {
      const matchesSearch = p.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCat =
        selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchTerm, selectedCategory, items]);

  const categories = ["All", ...new Set(items.map((i) => i.category))];

  if (loading)
    return (
      <div style={fullPageCenter}>
        <h2>Loading SwiftShop...</h2>
      </div>
    );

  return (
    <div style={pageBackground}>
      {/* 1. CENTERED CONTAINER */}
      <div style={appContainer}>
        {/* HEADER SECTION */}
        <header style={headerStyle}>
          <div style={headerTop}>
            <h1 style={logoStyle}>SwiftShop</h1>
            <button onClick={() => setIsCartOpen(true)} style={cartToggleBtn}>
              🛒 Cart ({cartCount})
            </button>
          </div>

          <div style={searchWrapper}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={searchInputStyle}
            />
          </div>
        </header>

        {/* CATEGORY BAR */}
        <div style={categoryBarStyle}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                ...categoryBtnStyle,
                backgroundColor: selectedCategory === cat ? "#000" : "#fff",
                color: selectedCategory === cat ? "#fff" : "#333",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* PRODUCT GRID */}
        <main style={gridStyle}>
          {filteredItems.map((product) => (
            <div key={product.id} style={cardStyle}>
              <div style={imageWrapper}>
                <img
                  src={product.image}
                  alt={product.title}
                  style={imageStyle}
                />
              </div>
              <div style={contentStyle}>
                <h3 style={titleStyle}>{product.title}</h3>
                <div style={footerStyle}>
                  <span style={priceStyle}>${product.price}</span>
                  <button
                    onClick={() => addToCart(product)}
                    style={addBtnStyle}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>

      {/* --- CART SIDEBAR (FIXED ALIGNMENT) --- */}
      {isCartOpen && (
        <div style={cartOverlay} onClick={() => setIsCartOpen(false)}>
          <div style={cartSidebar} onClick={(e) => e.stopPropagation()}>
            {/* Header: Always at top */}
            <div style={cartHeader}>
              <h2 style={{ margin: 0 }}>Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} style={closeBtn}>
                ✕
              </button>
            </div>

            {/* Content: Scrollable list */}
            <div style={cartItemsList}>
              {cart.length === 0 ? (
                <p style={{ textAlign: "center", marginTop: "40px" }}>
                  Empty cart
                </p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} style={cartItemRow}>
                    <img
                      src={item.image}
                      style={{ width: "45px", objectFit: "contain" }}
                      alt=""
                    />
                    <div style={{ flex: 1, padding: "0 12px" }}>
                      <div style={cartItemTitle}>{item.title}</div>
                      <div style={{ fontSize: "13px" }}>
                        {item.quantity} x ${item.price}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={removeBtn}
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer: Sticky at bottom */}
            <div style={cartFooter}>
              <div style={totalContainer}>
                <span>Total:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <button style={checkoutBtn}>Checkout Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- STYLES ---

const pageBackground = {
  backgroundColor: "#f5f5f5",
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  justifyContent: "center",
};

const appContainer = {
  width: "90%",
  maxWidth: "1200px",
  padding: "40px 0",
};

const headerStyle = {
  marginBottom: "40px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};
const headerTop = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  marginBottom: "20px",
};
const logoStyle = { fontSize: "2.5rem", fontWeight: "900" };
const cartToggleBtn = {
  position: "absolute",
  right: "0",
  padding: "10px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  backgroundColor: "#fff",
  border: "1px solid #ddd",
};
const searchWrapper = { width: "100%", maxWidth: "600px" };
const searchInputStyle = {
  width: "100%",
  padding: "15px 25px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  outline: "none",
  fontSize: "16px",
};
const categoryBarStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  flexWrap: "wrap",
  marginBottom: "40px",
};
const categoryBtnStyle = {
  padding: "10px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  border: "1px solid #ddd",
  fontWeight: "600",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "30px",
};

const cardStyle = {
  backgroundColor: "#fff",
  borderRadius: "20px",
  padding: "20px",
  border: "1px solid #eee",
  display: "flex",
  flexDirection: "column",
};
const imageWrapper = {
  height: "200px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "15px",
};
const imageStyle = {
  maxHeight: "100%",
  maxWidth: "100%",
  objectFit: "contain",
};
const contentStyle = { flexGrow: 1, display: "flex", flexDirection: "column" };
const titleStyle = {
  fontSize: "16px",
  fontWeight: "600",
  marginBottom: "15px",
  height: "45px",
  overflow: "hidden",
};
const footerStyle = {
  marginTop: "auto",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};
const priceStyle = { fontSize: "20px", fontWeight: "800" };
const addBtnStyle = {
  padding: "10px 16px",
  backgroundColor: "#000",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

// --- CORRECTED CART STYLES (NO MORE OVERFLOW) ---
const cartOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.4)",
  zIndex: 1000,
  display: "flex",
  justifyContent: "flex-end",
};

const cartSidebar = {
  width: "100%",
  maxWidth: "400px",
  backgroundColor: "#fff",
  height: "100vh", // Forces it to browser height
  display: "flex",
  flexDirection: "column", // Essential for the scroll fix
  boxShadow: "-5px 0 15px rgba(0,0,0,0.1)",
};

const cartHeader = {
  padding: "25px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #eee",
};
const closeBtn = {
  background: "#f5f5f5",
  border: "none",
  fontSize: "18px",
  cursor: "pointer",
  borderRadius: "50%",
  width: "35px",
  height: "35px",
};

const cartItemsList = {
  flex: 1, // This pushes the footer down
  overflowY: "auto", // This enables scrolling only for the items list
  padding: "20px 25px",
};

const cartItemRow = {
  display: "flex",
  alignItems: "center",
  marginBottom: "20px",
  borderBottom: "1px solid #f5f5f5",
  paddingBottom: "10px",
};
const cartItemTitle = {
  fontSize: "13px",
  fontWeight: "600",
  display: "-webkit-box",
  WebkitLineClamp: "2",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};
const removeBtn = {
  color: "red",
  border: "none",
  background: "none",
  cursor: "pointer",
  fontSize: "12px",
};

const cartFooter = {
  padding: "25px",
  borderTop: "1px solid #eee",
  backgroundColor: "#fff",
  marginBottom: "20px", // Ensures it doesn't touch the absolute bottom of the browser
};

const totalContainer = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "20px",
  fontWeight: "800",
  marginBottom: "15px",
};
const checkoutBtn = {
  width: "100%",
  padding: "16px",
  backgroundColor: "#000",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  fontWeight: "bold",
  cursor: "pointer",
};
const fullPageCenter = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
};

export default App;
