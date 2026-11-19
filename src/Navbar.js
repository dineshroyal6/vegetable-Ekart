import { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";
import { FaShoppingCart } from "react-icons/fa";

const Navbar = ({
  user,
  cartItems,
  onAuthenticate,
  onSignOut,
  onUpdateCartQuantity,
}) => {
  const [authMode, setAuthMode] = useState(null);
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [search, setSearch] = useState("");
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => {
    const price = Number((item.price.match(/\d+/) || [0])[0]);
    return total + price * item.quantity;
  }, 0);

  const openAuth = (mode) => {
    setAuthMode(mode);
    setAuthError("");
    setShowProfile(false);
    setShowCart(false);
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setAuthError("");
    const formData = new FormData(event.currentTarget);

    try {
      const error = await onAuthenticate({
        mode: authMode,
        name: formData.get("name") || "",
        email: formData.get("email"),
        password: formData.get("password"),
      });
      if (error) {
        setAuthError(error);
      } else {
        setAuthMode(null);
      }
    } catch (error) {
      setAuthError(error.message || "Unable to complete sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <header className="container relative z-20 py-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <a href="/" className="text-3xl font-semibold text-accentDark">
          Logo
        </a>

        <form
          className="order-3 relative w-full lg:order-2 lg:w-1/2"
          onSubmit={(event) => event.preventDefault()}
          role="search"
        >
          <input
            className="w-full rounded-full border-none bg-[#f2f3f5] px-6 py-3 pr-12 outline-none"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search Product..."
            aria-label="Search products"
          />
          <BsSearch
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
            aria-hidden="true"
          />
        </form>

        <div className="order-2 flex items-center gap-5 lg:order-3">
          <div
            className="relative"
            onMouseEnter={() => {
              if (user) {
                setShowCart(false);
                setShowProfile(true);
              }
            }}
            onMouseLeave={() => setShowProfile(false)}
          >
            <button
              type="button"
              onClick={() => {
                if (user) {
                  setShowCart(false);
                  setShowProfile(true);
                } else {
                  openAuth("login");
                }
              }}
              onFocus={() => user && setShowProfile(true)}
              className="profile-button relative grid h-10 w-10 place-items-center rounded-full text-gray-600 hover:bg-gray-100"
              aria-label={user ? `Profile: ${user.name}` : "Sign in or sign up"}
            >
              <AiOutlineUser size={24} aria-hidden="true" />
              {user && <span className="profile-tooltip">{user.name}</span>}
            </button>
            {user && showProfile && (
              <div className="profile-menu">
                <p className="font-semibold">{user.name}</p>
                <p className="mt-1 break-all text-sm text-gray-500">{user.email}</p>
                <button
                  type="button"
                  className="mt-3 text-sm font-medium text-red-600 hover:underline"
                  onClick={() => {
                    onSignOut();
                    setShowProfile(false);
                  }}
                >
                  Log out
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowProfile(false);
                setShowCart((visible) => !visible);
              }}
              className="relative grid h-10 w-10 place-items-center rounded-full text-gray-600 hover:bg-gray-100"
              aria-label={`Shopping cart, ${itemCount} items`}
              aria-expanded={showCart}
            >
              <FaShoppingCart size={21} aria-hidden="true" />
              {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
            </button>
            {showCart && (
              <section className="cart-panel" aria-label="Shopping cart">
                <div className="flex items-center justify-between border-b pb-3">
                  <h2 className="text-lg font-semibold">Your cart ({itemCount})</h2>
                  <button
                    type="button"
                    onClick={() => setShowCart(false)}
                    className="text-sm text-gray-500 hover:text-black"
                  >
                    Close
                  </button>
                </div>
                {cartItems.length === 0 ? (
                  <p className="py-6 text-center text-sm text-gray-500">
                    Your cart is empty.
                  </p>
                ) : (
                  <>
                    <ul className="max-h-72 divide-y overflow-y-auto">
                      {cartItems.map((item) => (
                        <li
                          key={`${item.name}-${item.price}`}
                          className="flex items-center gap-3 py-3"
                        >
                          <img
                            src={item.img}
                            alt=""
                            className="h-14 w-14 rounded object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">{item.price}</p>
                            <div className="mt-1 flex items-center gap-3">
                              <button
                                type="button"
                                className="quantity-button"
                                aria-label={`Remove one ${item.name}`}
                                onClick={() =>
                                  onUpdateCartQuantity(item, item.quantity - 1)
                                }
                              >
                                −
                              </button>
                              <span className="text-sm">{item.quantity}</span>
                              <button
                                type="button"
                                className="quantity-button"
                                aria-label={`Add one ${item.name}`}
                                onClick={() =>
                                  onUpdateCartQuantity(item, item.quantity + 1)
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="flex justify-between border-t pt-3 font-semibold">
                      <span>Estimated total</span>
                      <span>₹{cartTotal}</span>
                    </div>
                  </>
                )}
              </section>
            )}
          </div>
        </div>
      </div>

      {authMode && (
        <div
          className="auth-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setAuthMode(null);
          }}
        >
          <section
            className="auth-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-title"
          >
            <button
              type="button"
              className="auth-close"
              aria-label="Close"
              onClick={() => setAuthMode(null)}
            >
              ×
            </button>
            <h2 id="auth-title" className="mb-1 text-2xl font-semibold">
              {authMode === "signup" ? "Create your account" : "Welcome back"}
            </h2>
            <p className="mb-5 text-sm text-gray-500">
              {authMode === "signup"
                ? "Sign up to get started with your shopping."
                : "Log in to your account to continue."}
            </p>
            <form className="space-y-4" onSubmit={handleAuthSubmit}>
              {authMode === "signup" && (
                <label className="auth-label">
                  Name
                  <input
                    className="auth-input"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    minLength={2}
                  />
                </label>
              )}
              <label className="auth-label">
                Email
                <input
                  className="auth-input"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </label>
              <label className="auth-label">
                Password
                <input
                  className="auth-input"
                  name="password"
                  type="password"
                  autoComplete={authMode === "signup" ? "new-password" : "current-password"}
                  required
                  minLength={6}
                />
              </label>
              {authError && (
                <p className="text-sm text-red-600" role="alert">
                  {authError}
                </p>
              )}
              <button
                className="w-full rounded-full bg-accentDark px-5 py-3 font-medium text-white hover:bg-accent disabled:opacity-60"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Please wait..."
                  : authMode === "signup"
                    ? "Sign up"
                    : "Log in"}
              </button>
            </form>
            <p className="mt-5 text-center text-sm text-gray-600">
              {authMode === "signup"
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <button
                type="button"
                className="font-semibold text-accentDark hover:underline"
                onClick={() =>
                  openAuth(authMode === "signup" ? "login" : "signup")
                }
              >
                {authMode === "signup" ? "Log in" : "Sign up"}
              </button>
            </p>
          </section>
        </div>
      )}
    </header>
  );
};

export default Navbar;
