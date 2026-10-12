import { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LuLock, LuTruck, LuCircleAlert, LuTriangleAlert, LuShieldCheck } from 'react-icons/lu';
import Titles from '../components/Titles';
import CartTotal from '../components/CartTotal';
import { shopDataContext } from '../context/ShopContext';
import { userDataContext } from '../context/UserContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import RazorpayImg from '../assets/Razorpay.jpg';

const FIELD_LABELS = {
  firstName: 'First Name',
  lastName: 'Last Name',
  email: 'Email',
  street: 'Street Address',
  city: 'City',
  state: 'State',
  pinCode: 'Pin Code',
  country: 'Country',
  phone: 'Phone Number',
};

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  street: '',
  city: '',
  state: '',
  pinCode: '',
  country: 'India',
  phone: '',
};

function FormField({ name, value, onChange, type = 'text', error, required = true }) {
  return (
    <div className="flex flex-col gap-1.5" id={`field-wrap-${name}`}>
      <div className="flex items-center justify-between">
        <label className="text-slate-300 text-xs font-semibold flex items-center gap-1">
          {FIELD_LABELS[name]}
          {required && <span className="text-blue-400">*</span>}
        </label>
        {error && (
          <span className="text-red-400 text-[11px] font-semibold flex items-center gap-1 animate-pulse">
            <LuCircleAlert className="w-3 h-3 text-red-400 shrink-0" /> {error}
          </span>
        )}
      </div>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={`Enter ${FIELD_LABELS[name].toLowerCase()}`}
          className={`w-full h-11 rounded-xl bg-slate-800/90 border text-white px-4 text-sm placeholder-slate-500 transition-all focus:outline-none ${
            error
              ? 'border-red-500 bg-red-950/20 text-red-100 shadow-sm shadow-red-500/20 focus:ring-2 focus:ring-red-500/40 focus:border-red-500'
              : 'border-slate-700/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40'
          }`}
        />
      </div>
    </div>
  );
}

function PlaceOrder() {
  const { setCartItem, cartItem, getCartAmount, delivery_fee, products } = useContext(shopDataContext);
  const { user } = useContext(userDataContext);
  const navigate = useNavigate();
  const [method, setMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: prev.email || user.email || '',
        firstName: prev.firstName || (user.name ? user.name.split(' ')[0] : ''),
        lastName: prev.lastName || (user.name && user.name.includes(' ') ? user.name.split(' ').slice(1).join(' ') : ''),
      }));
    }
  }, [user]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((d) => ({ ...d, [name]: value }));
    if (errors[name]) {
      setErrors((errs) => {
        const next = { ...errs };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const errs = {};

    if (!formData.firstName?.trim()) {
      errs.firstName = 'First name is required';
    }
    if (!formData.lastName?.trim()) {
      errs.lastName = 'Last name is required';
    }
    if (!formData.email?.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.street?.trim()) {
      errs.street = 'Street address is required';
    }
    if (!formData.city?.trim()) {
      errs.city = 'City is required';
    }
    if (!formData.state?.trim()) {
      errs.state = 'State is required';
    }
    if (!formData.pinCode?.trim()) {
      errs.pinCode = 'Pin code is required';
    } else if (!/^[0-9]{6}$/.test(formData.pinCode.trim())) {
      errs.pinCode = 'Must be a 6-digit pin code';
    }
    if (!formData.country?.trim()) {
      errs.country = 'Country is required';
    }

    const cleanedPhone = (formData.phone || '').trim().replace(/^(\+91|0)/, '').replace(/[\s-]/g, '');
    if (!formData.phone?.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(cleanedPhone)) {
      errs.phone = 'Must be a 10-digit phone number';
    }

    setErrors(errs);
    return errs;
  };

  const buildOrderItems = () => {
    const items = [];
    for (const productId in cartItem) {
      for (const size in cartItem[productId]) {
        const qty = cartItem[productId][size];
        if (qty > 0) {
          const info = structuredClone(products.find((p) => p._id === productId));
          if (info) {
            info.size = size;
            info.quantity = qty;
            items.push(info);
          }
        }
      }
    }
    return items;
  };

  const initRazorpay = (razorpayOrder) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_ZIY1M0ykaWoWyC',
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: 'Vastra',
      description: 'Order Payment',
      order_id: razorpayOrder.id,
      handler: async (response) => {
        try {
          await api.post('/api/order/verifyrazorpay', response);
          localStorage.removeItem('vastra_guest_cart');
          setCartItem({});
          toast.success('Payment successful!');
          navigate('/order');
        } catch {
          toast.error('Payment verification failed');
        }
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        contact: formData.phone,
      },
      theme: { color: '#3b82f6' },
    };
    new window.Razorpay(options).open();
  };

  const onSubmit = async () => {
    setHasAttemptedSubmit(true);
    const errs = validate();
    const errorKeys = Object.keys(errs);

    if (errorKeys.length > 0) {
      // Smoothly scroll to the first invalid field and focus it
      const firstKey = errorKeys[0];
      const targetInput = document.querySelector(`[name="${firstKey}"]`);
      if (targetInput) {
        targetInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetInput.focus();
      } else {
        const deliverySection = document.getElementById('delivery-section');
        if (deliverySection) {
          deliverySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }

      // Explicit, precise feedback
      if (errorKeys.length === 1) {
        toast.error(`Please enter your ${FIELD_LABELS[firstKey]}`);
      } else if (errorKeys.length <= 3) {
        const missingLabels = errorKeys.map((k) => FIELD_LABELS[k]);
        toast.error(`Please complete: ${missingLabels.join(', ')}`);
      } else {
        const missingLabels = errorKeys.map((k) => FIELD_LABELS[k]);
        toast.error(`Please fill in delivery details: ${missingLabels.slice(0, 3).join(', ')} (+${missingLabels.length - 3} more)`);
      }
      return;
    }

    const orderItems = buildOrderItems();
    if (orderItems.length === 0) {
      toast.error('Your cart is empty! Add products before checking out.');
      navigate('/cart');
      return;
    }

    setLoading(true);
    const cleanedPhone = (formData.phone || '').trim().replace(/^(\+91|0)/, '').replace(/[\s-]/g, '');
    const payload = {
      address: { ...formData, phone: cleanedPhone },
      orderItems,
      amount: getCartAmount() + delivery_fee,
      paymentMethod: method === 'cod' ? 'COD' : 'Razorpay',
    };

    try {
      if (method === 'cod') {
        await api.post('/api/order/place', payload);
        localStorage.removeItem('vastra_guest_cart');
        setCartItem({});
        toast.success('Order placed successfully!');
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
            id="delivery-section"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 scroll-mt-28"
          >
            <Titles text1="DELIVERY" text2="INFORMATION" />

            {/* Error Banner when fields are incomplete */}
            {hasAttemptedSubmit && Object.keys(errors).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/40 text-red-300 text-xs flex items-start gap-3 shadow-lg shadow-red-950/30"
              >
                <LuTriangleAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-red-200 text-sm">Please complete required delivery details</p>
                  <p className="text-red-300/90 mt-1 leading-relaxed">
                    Missing or invalid: <span className="font-semibold text-white">{Object.keys(errors).map((k) => FIELD_LABELS[k]).join(', ')}</span>
                  </p>
                </div>
              </motion.div>
            )}

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
                  type="button"
                  onClick={() => setMethod('razorpay')}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
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
                  type="button"
                  onClick={() => setMethod('cod')}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    method === 'cod'
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center shrink-0">
                    {method === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                  </div>
                  <LuTruck className="w-7 h-7 text-slate-400" />
                  <div className="text-left">
                    <p className="text-slate-200 text-sm font-medium">Cash on Delivery</p>
                    <p className="text-slate-500 text-xs">Pay when your order arrives</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Place Order Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSubmit}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-slate-700 disabled:to-slate-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 transition-all text-sm tracking-wide cursor-pointer"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
              ) : (
                <><LuLock className="w-5 h-5" /> Place Order</>
              )}
            </motion.button>

            <p className="text-center text-slate-500 text-xs flex items-center justify-center gap-1.5">
              <LuShieldCheck className="w-4 h-4 text-slate-400" /> Secure checkout · Your data is encrypted
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrder;
