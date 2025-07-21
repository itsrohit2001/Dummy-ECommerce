import "./App.css";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import ProductList from "./components/ProductList/ProductList";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Pages from "./pages/Pages";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import WishlistPage from "./pages/WishlistPage";
import UserPage from "./pages/UserPage";
import ForgotPassword from "./pages/ForgotPassword";
import CreateNewPassword from "./pages/CreateNewPassword";

const App = () => {
  return (
    // <CartContextProvider>
      <Router>
        <main className="">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products/*" element={<ProductList />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/Home" element={<HomePage />} />
            <Route path="/Pages" element={<Pages />} />
            <Route path="/Shop" element={<Shop />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/create-new-password" element={<CreateNewPassword />} />
          </Routes>
          <Footer />
        </main>
      </Router>
    //  </CartContextProvider>
  );
}

export default App;
