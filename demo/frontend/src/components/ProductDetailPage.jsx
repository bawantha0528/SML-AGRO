import { ArrowLeft, CheckCircle2, Loader2, Send } from 'lucide-react';
import { useMemo, useState } from 'react';
import { formatSpecifications } from '../utils/formatSpecifications';
import { getProductGallery } from '../utils/productImages';

const COLOR_OPTIONS = ['Natural', 'Brown', 'Black', 'White', 'Green', 'Blue', 'Custom'];
const SIZE_OPTIONS = ['Small', 'Medium', 'Large', 'Extra Large', 'Custom'];
const BUDGET_OPTIONS = ['Under $500', '$500 - $2,000', '$2,000 - $5,000', '$5,000 - $10,000', 'Above $10,000'];

const defaultProduct = {
  id: 'default',
  name: 'Premium Coir Product',
  productType: 'Premium Coir Product',
  description: 'Natural coconut coir product suitable for exports and custom projects.',
  category: 'GENERAL',
  price: 0,
  unit: 'piece',
  stockQuantity: null,
  imageUrl: '',
  specifications: 'Eco-friendly, biodegradable, export quality.',
};

const buildCustomInitial = (product) => ({
  customerName: '',
  email: '',
  phone: '',
  country: '',
  productType: product.productType || product.name,
  color: 'Natural',
  size: 'Medium',
  designName: `${product.name} custom design`,
  quantity: 50,
  budgetRange: '$500 - $2,000',
  targetDeliveryDate: '',
  referenceImages: '',
  specialNotes: '',
});

const buildInquiryInitial = (product) => ({
  customerName: '',
  email: '',
  phone: '',
  company: '',
  country: '',
  productsRequested: product.productType || product.name,
  estimatedQuantity: '100',
  specialRequirements: '',
  customizationDetails: '',
});

export function ProductDetailPage({ onNavigate, product }) {
  const activeProduct = {
    ...defaultProduct,
    ...(product || {}),
  };

  const isCustomProduct = activeProduct.category === 'CUSTOM' || activeProduct.productKind === 'custom';

  const gallery = useMemo(() => {
    return getProductGallery(activeProduct);
  }, [activeProduct]);

  const [mainImage, setMainImage] = useState(gallery[0]);
  const [quantity, setQuantity] = useState(50);
  const [selectedColor, setSelectedColor] = useState('Natural');
  const [selectedSize, setSelectedSize] = useState('Medium');

  const [customForm, setCustomForm] = useState(buildCustomInitial(activeProduct));
  const [inquiryForm, setInquiryForm] = useState(buildInquiryInitial(activeProduct));

  const [customLoading, setCustomLoading] = useState(false);
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [customSuccess, setCustomSuccess] = useState('');
  const [inquirySuccess, setInquirySuccess] = useState('');
  const [customError, setCustomError] = useState('');
  const [inquiryError, setInquiryError] = useState('');

  const updateCustom = (field, value) => {
    setCustomForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateInquiry = (field, value) => {
    setInquiryForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCustomSubmit = async (event) => {
    event.preventDefault();
    setCustomLoading(true);
    setCustomError('');
    setCustomSuccess('');

    try {
      const payload = {
        ...customForm,
        productType: activeProduct.productType || activeProduct.name,
        color: selectedColor,
        size: selectedSize,
        quantity,
      };

      const response = await fetch('http://localhost:8081/api/custom-orders/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.message || 'Failed to place custom order');
      }

      setCustomSuccess(`Custom order submitted. Order Number: ${json.data.orderNumber}`);
      setCustomForm(buildCustomInitial(activeProduct));
    } catch (error) {
      setCustomError(error.message || 'Unable to place custom order');
    } finally {
      setCustomLoading(false);
    }
  };

  const handleInquirySubmit = async (event) => {
    event.preventDefault();
    setInquiryLoading(true);
    setInquiryError('');
    setInquirySuccess('');

    try {
      const payload = {
        ...inquiryForm,
        productsRequested: activeProduct.productType || activeProduct.name,
        estimatedQuantity: String(quantity),
        customizationDetails: `Color: ${selectedColor}, Size: ${selectedSize}`,
      };

      const response = await fetch('http://localhost:8081/api/inquiries/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.message || 'Failed to send inquiry');
      }

      setInquirySuccess(`Inquiry submitted. Reference Number: ${json.data.inquiryNumber}`);
      setInquiryForm(buildInquiryInitial(activeProduct));
    } catch (error) {
      setInquiryError(error.message || 'Unable to submit inquiry');
    } finally {
      setInquiryLoading(false);
    }
  };

  const shownPrice = Number(activeProduct.price || 0);

  return (
    <section className="py-24 bg-[#FAFAF7] min-h-screen relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-sml-amber/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-sml-green/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 stagger-fade">
        <button
          onClick={() => onNavigate(isCustomProduct ? 'customize' : 'catalog')}
          className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-sml-text/60 hover:text-sml-green transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          {isCustomProduct ? 'Back to Customized Products' : 'Back to Product Catalog'}
        </button>

        <div className="surface-card p-6 md:p-10 shadow-strong rounded-[2rem]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="rounded-2xl overflow-hidden border border-gray-200 bg-[#f2ece2] aspect-square">
                <img src={mainImage} alt={activeProduct.name} className="w-full h-full object-cover" />
              </div>
              <div className="grid grid-cols-3 gap-3 mt-3">
                {gallery.map((img, index) => (
                  <button
                    key={`${img}-${index}`}
                    onClick={() => setMainImage(img)}
                    className={`rounded-xl overflow-hidden border ${mainImage === img ? 'border-sml-dark' : 'border-gray-200'}`}
                  >
                    <img src={img} alt={`${activeProduct.name} ${index + 1}`} className="h-24 w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] bg-sml-green/10 text-sml-green px-3 py-1 rounded inline-block font-bold uppercase tracking-widest mb-3 border border-sml-green/20">{activeProduct.category}</p>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-sml-dark">{activeProduct.name}</h1>
              <p className="text-gray-600 mt-3 leading-relaxed">{activeProduct.description}</p>

              <div className="mt-6 rounded-xl border border-gray-200 bg-[#fbf8f3] p-4">
                <p className="text-sm text-gray-600">Price</p>
                <p className="text-2xl font-bold text-sml-dark">
                  {shownPrice > 0 ? `$${shownPrice.toFixed(2)} / ${activeProduct.unit || 'piece'}` : 'Price on request'}
                </p>
                <p className="text-sm mt-2 text-gray-500">{formatSpecifications(activeProduct.specifications)}</p>
              </div>

              <div className="mt-6">
                <p className="text-sm font-semibold text-sml-dark mb-2">Color</p>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);
                        updateCustom('color', color);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${selectedColor === color ? 'bg-sml-dark text-white border-sml-dark' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-sm font-semibold text-sml-dark mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {SIZE_OPTIONS.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        updateCustom('size', size);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${selectedSize === size ? 'bg-sml-dark text-white border-sml-dark' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 max-w-xs">
                <label className="text-xs font-bold text-sml-text/70 uppercase tracking-widest mb-2 block">Quantity</label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => {
                    const value = Math.max(1, Number(e.target.value) || 1);
                    setQuantity(value);
                    updateCustom('quantity', value);
                  }}
                  className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-200 px-4 py-3 text-sm focus:ring-0 focus:border-sml-green focus:bg-sml-green/5 outline-none transition-all"
                />
              </div>

              <div className={`mt-6 grid grid-cols-1 ${isCustomProduct ? 'sm:grid-cols-2' : ''} gap-3`}>
                {isCustomProduct && (
                  <div className="sm:col-span-2 rounded-xl border border-sml-cream-dark bg-sml-cream px-4 py-3 text-sm text-sml-dark">
                    Set your color, size, quantity, and design details, then send the custom inquiry using the single submit button below.
                  </div>
                )}
                {!isCustomProduct && (
                  <div className="rounded-xl border border-sml-cream-dark bg-sml-cream px-4 py-3 text-sm text-sml-dark">
                    Select color, size, and quantity, fill your details in the form below, then click Send Inquiry.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={`grid grid-cols-1 ${isCustomProduct ? 'xl:grid-cols-2' : ''} gap-6 mt-10`}>
            {isCustomProduct && (
              <form id="custom-order-form" onSubmit={handleCustomSubmit} className="rounded-2xl border border-gray-200 bg-white p-6">
                <h2 className="text-xl font-bold text-sml-dark">Custom Product Order</h2>
                <p className="text-sm text-gray-500 mt-1">Submit a production-ready custom request for this product.</p>

                {customSuccess && (
                  <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 inline-flex items-start">
                    <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5" />
                    {customSuccess}
                  </div>
                )}
                {customError && <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{customError}</div>}

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input value={customForm.customerName} onChange={(e) => updateCustom('customerName', e.target.value)} required placeholder="Full Name" className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-200 px-4 py-3 text-sm focus:ring-0 focus:border-sml-green focus:bg-sml-green/5 outline-none transition-all" />
                  <input value={customForm.email} onChange={(e) => updateCustom('email', e.target.value)} required type="email" placeholder="Email" className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-200 px-4 py-3 text-sm focus:ring-0 focus:border-sml-green focus:bg-sml-green/5 outline-none transition-all" />
                  <input value={customForm.phone} onChange={(e) => updateCustom('phone', e.target.value)} placeholder="Phone / WhatsApp" className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-200 px-4 py-3 text-sm focus:ring-0 focus:border-sml-green focus:bg-sml-green/5 outline-none transition-all" />
                  <input value={customForm.country} onChange={(e) => updateCustom('country', e.target.value)} required placeholder="Country" className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-200 px-4 py-3 text-sm focus:ring-0 focus:border-sml-green focus:bg-sml-green/5 outline-none transition-all" />
                  <input value={customForm.designName} onChange={(e) => updateCustom('designName', e.target.value)} required placeholder="Design Name" className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-200 px-4 py-3 text-sm focus:ring-0 focus:border-sml-green focus:bg-sml-green/5 outline-none transition-all md:col-span-2" />
                  <select value={customForm.budgetRange} onChange={(e) => updateCustom('budgetRange', e.target.value)} className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-200 px-4 py-3 text-sm focus:ring-0 focus:border-sml-green focus:bg-sml-green/5 outline-none transition-all cursor-pointer">
                    {BUDGET_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                  <div className="flex flex-col relative pt-1">
                    <span className="absolute top-0 text-[10px] uppercase font-bold text-gray-400 pl-4">Target Delivery</span>
                    <input value={customForm.targetDeliveryDate} onChange={(e) => updateCustom('targetDeliveryDate', e.target.value)} type="date" className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-200 px-4 pt-4 pb-2 text-sm focus:ring-0 focus:border-sml-green focus:bg-sml-green/5 outline-none transition-all" />
                  </div>
                  <textarea value={customForm.referenceImages} onChange={(e) => updateCustom('referenceImages', e.target.value)} rows={2} placeholder="Reference image URL(s), comma separated" className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-200 px-4 py-3 text-sm focus:ring-0 focus:border-sml-green focus:bg-sml-green/5 outline-none transition-all md:col-span-2 resize-none" />
                  <textarea value={customForm.specialNotes} onChange={(e) => updateCustom('specialNotes', e.target.value)} rows={3} placeholder="Special notes" className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-200 px-4 py-3 text-sm focus:ring-0 focus:border-sml-green focus:bg-sml-green/5 outline-none transition-all md:col-span-2 resize-none" />
                </div>

                <button
                  type="submit"
                  disabled={customLoading}
                  className="mt-4 w-full bg-sml-dark text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors inline-flex items-center justify-center disabled:opacity-60"
                >
                  {customLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                  {customLoading ? 'Sending...' : 'Send Custom Inquiry'}
                </button>
              </form>
            )}

            {!isCustomProduct && (
              <form id="inquiry-form" onSubmit={handleInquirySubmit} className="rounded-2xl border border-gray-200 bg-white p-6">
                <h2 className="text-xl font-bold text-sml-dark">Inquiry Form</h2>
                <p className="text-sm text-gray-500 mt-1">Send a direct inquiry about this product from the same page.</p>

                {inquirySuccess && (
                  <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 inline-flex items-start">
                    <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5" />
                    {inquirySuccess}
                  </div>
                )}
                {inquiryError && <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{inquiryError}</div>}

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input value={inquiryForm.customerName} onChange={(e) => updateInquiry('customerName', e.target.value)} required placeholder="Full Name" className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-200 px-4 py-3 text-sm focus:ring-0 focus:border-sml-green focus:bg-sml-green/5 outline-none transition-all" />
                  <input value={inquiryForm.email} onChange={(e) => updateInquiry('email', e.target.value)} required type="email" placeholder="Email" className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-200 px-4 py-3 text-sm focus:ring-0 focus:border-sml-green focus:bg-sml-green/5 outline-none transition-all" />
                  <input value={inquiryForm.phone} onChange={(e) => updateInquiry('phone', e.target.value)} placeholder="Phone / WhatsApp" className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-200 px-4 py-3 text-sm focus:ring-0 focus:border-sml-green focus:bg-sml-green/5 outline-none transition-all" />
                  <input value={inquiryForm.company} onChange={(e) => updateInquiry('company', e.target.value)} placeholder="Company" className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-200 px-4 py-3 text-sm focus:ring-0 focus:border-sml-green focus:bg-sml-green/5 outline-none transition-all" />
                  <input value={inquiryForm.country} onChange={(e) => updateInquiry('country', e.target.value)} placeholder="Country" className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-200 px-4 py-3 text-sm focus:ring-0 focus:border-sml-green focus:bg-sml-green/5 outline-none transition-all md:col-span-2" />
                  <textarea value={inquiryForm.specialRequirements} onChange={(e) => updateInquiry('specialRequirements', e.target.value)} rows={4} placeholder="Special requirements" className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-200 px-4 py-3 text-sm focus:ring-0 focus:border-sml-green focus:bg-sml-green/5 outline-none transition-all md:col-span-2 resize-none" />
                </div>

                <button
                  type="submit"
                  disabled={inquiryLoading}
                  className="mt-4 w-full bg-sml-green text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors inline-flex items-center justify-center disabled:opacity-60"
                >
                  {inquiryLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                  {inquiryLoading ? 'Sending...' : 'Submit Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
