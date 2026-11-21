import { Link } from 'react-router-dom';
import { useCart } from './CartContext.jsx';

function formatPrice(price) {
    const numericPrice = Number.parseFloat(price);
    return Number.isFinite(numericPrice) ? numericPrice.toFixed(2) : '0.00';
}

function CartPage() {
    const {
        items,
        itemCount,
        total,
        addItem,
        decreaseQuantity,
        removeItem,
        clearCart,
    } = useCart();

    return (
        <main className="games-page cart-page">
            <div className="cart-heading">
                <h1>Shopping cart</h1>
                {items.length > 0 && (
                    <button className="cart-clear" type="button" onClick={clearCart}>
                        Clear cart
                    </button>
                )}
            </div>

            {items.length === 0 ? (
                <div className="cart-empty">
                    <p>Your cart is empty.</p>
                    <Link className="cart-primary-button" to="/">Browse games</Link>
                </div>
            ) : (
                <>
                    <ul className="cart-list">
                        {items.map((item) => (
                            <li className="cart-item" key={item.id}>
                                <Link
                                    className="cart-item-image"
                                    to={{
                                        pathname: '/game',
                                        search: `?${new URLSearchParams({ title: item.title }).toString()}`,
                                    }}
                                    state={{ game: item }}
                                >
                                    {item.imagePath && (
                                        <img src={item.imagePath} alt={item.title} />
                                    )}
                                </Link>
                                <div className="cart-item-details">
                                    <h2>{item.title}</h2>
                                    <p>{formatPrice(item.price)} PLN</p>
                                </div>
                                <div className="cart-quantity" aria-label={`Quantity for ${item.title}`}>
                                    <button
                                        type="button"
                                        onClick={() => decreaseQuantity(item.id)}
                                        aria-label={`Decrease ${item.title} quantity`}
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        type="button"
                                        onClick={() => addItem(item)}
                                        aria-label={`Increase ${item.title} quantity`}
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="cart-line-total">
                                    <strong>{formatPrice(Number.parseFloat(item.price) * item.quantity)} PLN</strong>
                                    <button
                                        type="button"
                                        onClick={() => removeItem(item.id)}
                                        aria-label={`Remove ${item.title} from cart`}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="cart-summary">
                        <p>{itemCount} {itemCount === 1 ? 'item' : 'items'} in cart</p>
                        <p className="cart-total">Total: <strong>{formatPrice(total)} PLN</strong></p>
                        <button className="cart-primary-button" type="button" disabled>
                            Checkout
                        </button>
                    </div>
                </>
            )}
        </main>
    );
}

export default CartPage;
