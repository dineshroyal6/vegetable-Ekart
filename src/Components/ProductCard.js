import { useEffect, useRef, useState } from "react";
import { AiFillStar, AiOutlineStar, AiOutlineShopping } from "react-icons/ai";

const ProductCard = ({ img, name, price, onAddToCart }) => {
  const [wasAdded, setWasAdded] = useState(false);
  const feedbackTimer = useRef(null);

  useEffect(
    () => () => {
      window.clearTimeout(feedbackTimer.current);
    },
    []
  );

  const handleAddToCart = () => {
    onAddToCart({ img, name, price });
    setWasAdded(true);
    window.clearTimeout(feedbackTimer.current);
    feedbackTimer.current = window.setTimeout(() => setWasAdded(false), 1600);
  };

  return (
    <div className="relative rounded-lg border border-gray-200 transition-transform hover:scale-105 hover:border-gray-300">
      <div className="h-40 w-full overflow-hidden rounded-t-lg">
        <img src={img} alt={name} className="h-full w-full object-cover" />
      </div>

      <div className="relative space-y-2 p-4">
        <div className="flex gap-[2px] text-[20px] text-yellow-400" aria-label="4 out of 5 stars">
          <AiFillStar aria-hidden="true" />
          <AiFillStar aria-hidden="true" />
          <AiFillStar aria-hidden="true" />
          <AiFillStar aria-hidden="true" />
          <AiOutlineStar aria-hidden="true" />
        </div>
        <h3 className="font-medium">{name}</h3>
        <h3 className="text-2xl font-medium text-red-600">{price}</h3>
        <button
          type="button"
          onClick={handleAddToCart}
          aria-label={wasAdded ? `${name} added to cart` : `Add ${name} to cart`}
          title={wasAdded ? "Added to cart" : `Add ${name} to cart`}
          className="absolute -top-4 right-2 grid h-[50px] w-[50px] place-items-center rounded-full bg-accent text-[28px] text-white hover:bg-accentDark focus:outline-none focus:ring-2 focus:ring-accentDark focus:ring-offset-2"
        >
          {wasAdded ? (
            <span className="added-to-cart-feedback">
              <span className="text-xl" aria-hidden="true">✓</span>
              Added
            </span>
          ) : (
            <AiOutlineShopping aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
