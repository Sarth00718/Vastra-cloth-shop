import React, { useContext } from 'react';
import { shopDataContext } from '../context/ShopContext';
import Titles from './Titles';

function CartTotal() {
  const { currency, delivery_fee, getCartAmount } = useContext(shopDataContext);

  const subtotal = getCartAmount();
  const total = subtotal === 0 ? 0 : subtotal + delivery_fee;

  return (
    <div className="w-full">
      <div className="text-lg md:text-xl py-2">
        <Titles text1="CART" text2="TOTALS" />
      </div>
      <div className="flex flex-col gap-2 mt-3 text-sm md:text-base p-4 sm:p-6 border-2 border-[#4d8890] text-white rounded-lg">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{currency} {subtotal}</span>
        </div>
        <hr />
        <div className="flex justify-between">
          <span>Delivery Fee:</span>
          <span>{currency} {subtotal === 0 ? 0 : delivery_fee}</span>
        </div>
        <hr />
        <div className="flex justify-between font-semibold text-lg mt-2 border-t pt-2 border-[#4d8890]">
          <span>Total:</span>
          <span>{currency} {total}</span>
        </div>
      </div>
    </div>
  );
}

export default CartTotal;
