import { useState } from 'react';
import orderService from '../../Services/orderService';
import styles from './OrderPlacementForm.module.css';

export default function OrderPlacementForm({ gift, vendor, onSuccess, onCancel }) {
  const [quantity, setQuantity] = useState(1);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [cardId, setCardId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calculate total price
  const totalPrice = gift.price * quantity;

  // Get min and max dates
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() + 1);
  
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 90);

  // Format date to YYYY-MM-DD for input
  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const minDateStr = formatDateForInput(minDate);
  const maxDateStr = formatDateForInput(maxDate);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!deliveryDate) {
      setError('Please select a delivery date');
      return;
    }

    if (quantity < 1) {
      setError('Quantity must be at least 1');
      return;
    }

    setLoading(true);

    try {
      const result = await orderService.createOrder({
        vendor_id: vendor.id,
        gift_id: gift.id,
        quantity: parseInt(quantity),
        price_at_sale: parseFloat(gift.price),
        delivery_date: deliveryDate,
        card_id: cardId || null,
        message_text: message || null
      });

      if (result.success) {
        // Show success and close form
        onSuccess?.(result.order);
      } else {
        setError(result.message || 'Failed to place order');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error placing order. Please try again.');
      console.error('Order error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate pickup date (3 days before delivery)
  const getPickupDate = () => {
    if (!deliveryDate) return '';
    const date = new Date(deliveryDate);
    date.setDate(date.getDate() - 3);
    return formatDateForInput(date);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Place Your Order</h2>
        <p className={styles.vendor}>From: {vendor.shop_name}</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Gift Summary */}
        <div className={styles.summary}>
          <div className={styles.summaryItem}>
            <span>Gift:</span>
            <strong>{gift.title}</strong>
          </div>
          <div className={styles.summaryItem}>
            <span>Price per unit:</span>
            <strong>DA {parseFloat(gift.price).toFixed(2)}</strong>
          </div>
        </div>

        {/* Quantity */}
        <div className={styles.formGroup}>
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            max="50"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>

        {/* Delivery Date */}
        <div className={styles.formGroup}>
          <label htmlFor="deliveryDate">
            Delivery Date (1-90 days from now)
          </label>
          <input
            type="date"
            id="deliveryDate"
            name="deliveryDate"
            min={minDateStr}
            max={maxDateStr}
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            required
          />
          {deliveryDate && (
            <small className={styles.pickupInfo}>
              📦 Ahdini picks up on {getPickupDate()} (3 days before delivery)
            </small>
          )}
        </div>

        {/* Optional Card */}
        <div className={styles.formGroup}>
          <label htmlFor="cardId">Greeting Card (optional)</label>
          <select id="cardId" name="cardId" value={cardId} onChange={(e) => setCardId(e.target.value)}>
            <option value="">No card</option>
            <option value="1">Standard Card</option>
            <option value="2">Premium Card</option>
            <option value="3">Luxury Card</option>
          </select>
        </div>

        {/* Message */}
        <div className={styles.formGroup}>
          <label htmlFor="message">Message (optional)</label>
          <textarea
            id="message"
            name="message"
            rows="3"
            placeholder="Add a personal message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength="200"
          />
          <small>{message.length}/200</small>
        </div>

        {/* Price Summary */}
        <div className={styles.priceSummary}>
          <div className={styles.priceRow}>
            <span>Subtotal:</span>
            <span>DA {totalPrice.toFixed(2)}</span>
          </div>
          <div className={styles.priceRow}>
            <span>Ahdini Service (10%):</span>
            <span className={styles.commission}>-DA {(totalPrice * 0.1).toFixed(2)}</span>
          </div>
          <div className={styles.priceRowTotal}>
            <span>Vendor Receives:</span>
            <strong>DA {(totalPrice * 0.9).toFixed(2)}</strong>
          </div>
          <div className={styles.priceRowTotal}>
            <span>Total to Pay:</span>
            <strong className={styles.total}>DA {totalPrice.toFixed(2)}</strong>
          </div>
        </div>

        {/* Error Message */}
        {error && <div className={styles.error}>{error}</div>}

        {/* Buttons */}
        <div className={styles.actions}>
          <button type="button" onClick={onCancel} className={styles.cancelBtn}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !deliveryDate}
            className={styles.submitBtn}
          >
            {loading ? 'Processing...' : '✓ Place Order & Pay'}
          </button>
        </div>

        {/* Info Box */}
        <div className={styles.infoBox}>
          <strong>How it works:</strong>
          <ul>
            <li>✓ Payment required upfront</li>
            <li>✓ Vendor keeps product until pickup date</li>
            <li>✓ Ahdini picks up 3 days before delivery</li>
            <li>✓ Delivered on your chosen date</li>
          </ul>
        </div>
      </form>
    </div>
  );
}
