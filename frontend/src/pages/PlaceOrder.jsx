import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MdLock, MdLocalShipping, MdCreditCard } from 'react-icons/md';
import Titles from '../components/Titles';
import CartTotal from '../components/CartTotal';
import { shopDataContext } from '../context/ShopContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import RazorpayImg from '../assets/Razorpay.jpg';

const FIELD_LABELS = {
  firstName: 'First Name', lastName: 'Last Name', email: 'Email',
  street: 'Street Address', city: 'City', state: 'State',
  pinCode: 'Pin Code', country: 'Country', phone: 'Phone Number',
};

const INITIAL_FORM = {
  firstName: '', lastName: '', email: '',
  street: '', city: '', state: '',
  pinCode: '', country: 'India', phone: '',
};

function FormField({ name, value, onChange, type = 'text', error }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-slate-400 text-xs font-medium">{FIELD_LABELS[name]}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={FIELD_LABELS[name]}
        className={`h-11 rounded-xl bg-slate-800 border text-white px-4 text-sm placeholder-slate-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
          error ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-blue-500'
        }`}
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}

function PlaceOrder() {
  const { setCartItem, cartItem, getCartAmount, delivery_fee, products } = useContext(shopDataContext);
  const navigate = useNavigate();
  const [method, setMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const onChange = (e) => {
    setFormData(d => ({ ...d, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(errs => ({ ...errs, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    Object.keys(INITIAL_FORM).forEach(key => {
      if (!formData[key]?.trim()) errs[key] = 'Required';
    });
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Invalid email';
    }
    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      errs.phone = 'Must be 10 digits';
    }
    if (formData.pinCode && !/^[0-9]{6}$/.test(formData.pinCode)) {
      errs.pinCode = 'Must be 6 digits';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const buildOrderItems = () => {
    const items = [];
    for (const productId in cartItem) {
      for (const size in cartItem[productId]) {
        const qty = cartItem[productId][size];
        if (qty > 0) {
          const info = structuredClone(products.find(p => p._id === productId));
          if (info) { info.size = size; info.quantity = qty; items.push(info); }
        }
      }
    }
    return items;
  };

  const initRazorpay = (razorpayOrder) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: 'Vastra',
      description: 'Order Payment',
      order_id: razorpayOrder.id,
      handler: async (response) => {
        try {
          await api.post('/api/order/verifyrazorpay', response);
          setCartItem({});
          toast.success('Payment successful! 🎉');
          navigate('/order');
        } catch {
          toast.error('Payment verification failed');
        }
      },
      prefill: { name: `${formData.firstName} ${formData.lastName}`, email: formData.email, contact: formData.phone },
      theme: { color: '#3b82f6' },
    };
    new window.Razorpay(options).open();
  };

  const onSubmit = async () => {
    if (!validate()) { toast.error('Please fix the form errors'); return; }

    const orderItems = buildOrderItems();
    if (orderItems.length === 0) { toast.error('Your cart is empty!'); return; }

    setLoading(true);
    const payload = { address: formData, orderItems, amount: getCartAmount() + delivery_fee };

    try {
      if (method === 'cod') {
        await api.post('/api/order/place', payload);
        setCartItem({});
        toast.success('Order placed successfully! 🎉');
        navigate('/order');
      } else if (method === 'razorpay') {
        const res = await api.post('/api/order/razorpay', payload);
        initRazorpay(res.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error placing order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen pb-28 md:pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto pt-24">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Delivery Form ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <Titles text1="DELIVERY" text2="INFORMATION" />
            <div className="mt-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField name="firstName" value={formData.firstName} onChange={onChange} error={errors.firstName} />
                <FormField name="lastName" value={formData.lastName} onChange={onChange} error={errors.lastName} />
              </div>
              <FormField name="email" type="email" value={formData.email} onChange={onChange} error={errors.email} />
              <FormField name="street" value={formData.street} onChange={onChange} error={errors.street} />
              <div className="grid grid-cols-2 gap-4">
                <FormField name="city" value={formData.city} onChange={onChange} error={errors.city} />
                <FormField name="state" value={formData.state} onChange={onChange} error={errors.state} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField name="pinCode" value={formData.pinCode} onChange={onChange} error={errors.pinCode} />
                <FormField name="country" value={formData.country} onChange={onChange} error={errors.country} />
              </div>
              <FormField name="phone" type="tel" value={formData.phone} onChange={onChange} error={errors.phone} />
            </div>
          </motion.div>

          {/* ── Right Panel ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-[380px] shrink-0 flex flex-col gap-6"
          >
            <CartTotal />

            {/* Payment Method */}
            <div>
              <Titles text1="PAYMENT" text2="METHOD" />
              <div className="flex flex-col gap-3 mt-4">
                {/* Razorpay */}
                <button
                  onClick={() => setMethod('razorpay')}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                    method === 'razorpay'
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center shrink-0">
                    {method === 'razorpay' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                  </div>
                  <img src={RazorpayImg} alt="Razorpay" className="h-8 object-contain rounded" />
                  <span className="text-slate-300 text-sm font-medium">Razorpay</span>
                </button>

                {/* COD */}
                <button
                  onClick={() => setMethod('cod')}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                    method === 'cod'
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center shrink-0">
                    {method === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                  </div>
                  <MdLocalShipping className="w-7 h-7 text-slate-400" />
                  <div className="text-left">
                    <p className="text-slate-200 text-sm font-medium">Cash on Delivery</p>
                    <p className="text-slate-500 text-xs">Pay when your order arrives</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Place Order Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSubmit}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-slate-700 disabled:to-slate-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 transition-all text-sm tracking-wide"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
              ) : (
                <><MdLock className="w-5 h-5" /> Place Order</>
              )}
            </motion.button>

            <p className="text-center text-slate-600 text-xs">
              🔒 Secure checkout · Your data is encrypted
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrder;
