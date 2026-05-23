import { useContext } from 'react';
import { shopDataContext } from '../context/ShopContext';

function CartTotal() {
  const { currency, delivery_fee, getCartAmount } = useContext(shopDataContext);
  const subtotal = getCartAmount();
  const freeShipping = subtotal >= 999;
  const shippingCost = subtotal === 0 ? 0 : (freeShipping ? 0 : delivery_fee);
  const total = subtotal === 0 ? 0 : subtotal + shippingCost;

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
      <h3 className="text-white font-bold text-base mb-4">Order Summary</h3>
      <div className="flex flex-col gap-3 text-sm">
        <div className="flex justify-between text-slate-300">
          <span>Subtotal</span>
          <span>{currency} {subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>Delivery</span>
          <span className={freeShipping && subtotal > 0 ? 'text-green-400 font-medium' : ''}>
            {subtotal === 0 ? '—' : freeShipping ? 'FREE' : `${currency} ${delivery_fee}`}
          </span>
        </div>
        {freeShipping && subtotal > 0 && (
          <p className="text-green-400/80 text-xs">You've unlocked free delivery!</p>
        )}
        <div className="border-t border-slate-700 pt-3 flex justify-between text-white font-bold text-base">
          <span>Total</span>
          <span>{currency} {total.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
}

export default CartTotal;
