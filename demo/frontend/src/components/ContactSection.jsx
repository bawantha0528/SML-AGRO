import { AlertCircle, CheckCircle2, Clock, Loader2, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';

const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
  'France', 'Netherlands', 'Belgium', 'UAE', 'Saudi Arabia', 'China',
  'Japan', 'South Korea', 'India', 'Singapore', 'Malaysia', 'Thailand',
  'Brazil', 'Mexico', 'Argentina', 'South Africa', 'Nigeria', 'Other'
];

const PRODUCTS = [
  'Coir Fiber', 'Coir Pith / Cocopeat', 'Grow Bags', 'Coir Mats',
  'Geotextiles', 'Coir Rope', 'Mixed Products', 'Other'
];

const INITIAL_FORM = {
  customerName: '',
  email: '',
  phone: '',
  company: '',
  country: '',
  productsRequested: '',
  estimatedQuantity: '',
  specialRequirements: '',
};

export function ContactSection() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null); // { inquiryNumber }
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(null);

    try {
      const res = await fetch('/api/inquiries/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setSuccess({ inquiryNumber: json.data.inquiryNumber });
        setForm(INITIAL_FORM);
      } else {
        setError(json.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error — please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* ── Form Side ── */}
          <div className="surface-card p-8 md:p-12 shadow-[0_10px_40px_-5px_rgba(21,126,84,0.1)]">
            <span className="inline-block py-1.5 px-4 rounded-full bg-sml-green/10 text-sml-green font-bold text-xs tracking-[0.2em] uppercase mb-6 shadow-[inset_0_0_0_1px_rgba(21,126,84,0.2)]">
              Get in Touch
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-sml-dark mb-4">
              Request a Quote
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              Fill in the form and our team will respond within 24 hours.
              You'll receive a unique inquiry number for tracking.
            </p>

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6 flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-green-800">Inquiry Submitted Successfully!</p>
                  <p className="text-sm text-green-700 mt-1">
                    Thank you! Your inquiry has been received. An automatic email confirmation has been sent to your email. Our team will contact you within 24 hours.
                  </p>
                  <div className="mt-2 bg-green-100 rounded-lg px-3 py-2 inline-block">
                    <p className="text-xs text-green-600 font-medium">Your Inquiry Number</p>
                    <p className="font-mono font-bold text-green-800 text-sm">{success.inquiryNumber}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 flex items-center gap-3 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-sml-text/70 uppercase tracking-widest mb-2">
                    Your Name <span className="text-sml-green">*</span>
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={form.customerName}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-200 px-4 py-3 text-sm focus:ring-0 focus:border-sml-green focus:bg-sml-green/5 outline-none transition-all"
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-sml-text/70 uppercase tracking-widest mb-2">
                    Email Address <span className="text-sml-green">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-200 px-4 py-3 text-sm focus:ring-0 focus:border-sml-green focus:bg-sml-green/5 outline-none transition-all"
                    placeholder="email@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-sml-text/70 uppercase tracking-widest mb-2">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-200 px-4 py-3 text-sm focus:ring-0 focus:border-sml-green focus:bg-sml-green/5 outline-none transition-all"
                    placeholder="Your Company"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-sml-text/70 uppercase tracking-widest mb-2">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-200 px-4 py-3 text-sm focus:ring-0 focus:border-sml-green focus:bg-sml-green/5 outline-none transition-all"
                    placeholder="+1 555 000 0000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-sml-text/70 uppercase tracking-widest mb-2">Country <span className="text-sml-green">*</span></label>
                  <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-200 px-4 py-3 text-sm focus:ring-0 focus:border-sml-green focus:bg-sml-green/5 outline-none transition-all cursor-pointer"
                  >
                    <option value="">Select country...</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-sml-text/70 uppercase tracking-widest mb-2">Product Interest</label>
                  <select
                    name="productsRequested"
                    value={form.productsRequested}
                    onChange={handleChange}
                    className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-200 px-4 py-3 text-sm focus:ring-0 focus:border-sml-green focus:bg-sml-green/5 outline-none transition-all cursor-pointer"
                  >
                    <option value="">Select a product...</option>
                    {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-sml-text/70 uppercase tracking-widest mb-2">Estimated Quantity</label>
                <input
                  type="text"
                  name="estimatedQuantity"
                  value={form.estimatedQuantity}
                  onChange={handleChange}
                  className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-200 px-4 py-3 text-sm focus:ring-0 focus:border-sml-green focus:bg-sml-green/5 outline-none transition-all"
                  placeholder="e.g. 500 MT, 20 containers/year"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-sml-text/70 uppercase tracking-widest mb-2">
                  Message / Special Requirements
                </label>
                <textarea
                  name="specialRequirements"
                  value={form.specialRequirements}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-200 px-4 py-3 text-sm focus:ring-0 focus:border-sml-green focus:bg-sml-green/5 outline-none transition-all resize-none"
                  placeholder="Tell us about your requirements, certifications needed, delivery terms, etc."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-sml-dark text-sml-cream font-bold py-4 rounded-lg hover:bg-black transition-colors shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting Inquiry...
                  </>
                ) : 'Send Inquiry →'}
              </button>
            </form>
          </div>

          {/* ── Info Side ── */}
          <div className="bg-sml-dark rounded-3xl p-10 h-full flex flex-col justify-between shadow-strong relative overflow-hidden">
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-sml-green/20 rounded-full blur-[80px]" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-sml-amber/20 rounded-full blur-[80px]" />
            <div className="relative z-10">
              <h3 className="text-3xl font-serif font-bold text-white mb-8">
                Contact Information
              </h3>
              <div className="space-y-6">
                {[
                  {
                    icon: MapPin,
                    title: 'Headquarters',
                    lines: ['123 Coconut Grove Rd,', 'Kurunegala, Sri Lanka']
                  },
                  {
                    icon: Mail,
                    title: 'Email Us',
                    lines: ['exports@smlagro.com', 'support@smlagro.com']
                  },
                  {
                    icon: Phone,
                    title: 'Call Us',
                    lines: ['+94 37 222 3333', '+94 77 123 4567 (WhatsApp)']
                  },
                  {
                    icon: Clock,
                    title: 'Business Hours',
                    lines: ['Mon – Fri: 8:00 AM – 6:00 PM (IST)'],
                    extra: '🌍 Available for enquiries 24/7'
                  }
                ].map(({ icon: Icon, title, lines, extra }) => (
                  <div key={title} className="flex items-start space-x-4">
                    <div className="bg-white/5 border border-white/10 p-3 rounded-full">
                      <Icon className="w-6 h-6 text-[#34D399]" />
                    </div>
                    <div>
                      <p className="font-bold text-white tracking-wide">{title}</p>
                      {lines.map(l => <p key={l} className="text-gray-400 text-sm mt-1">{l}</p>)}
                      {extra && <p className="text-xs text-[#34D399] mt-2 font-medium bg-[#34D399]/10 inline-block px-2 py-1 rounded">{extra}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-6 relative z-10 backdrop-blur-sm">
              <p className="text-sm font-bold text-white mb-3 uppercase tracking-widest">Why choose SML Agro?</p>
              <ul className="text-sm text-gray-400 space-y-2 mt-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#34D399]" /> 5000+ MT export volume annually</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#34D399]" /> ISO certified quality processes</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#34D399]" /> Direct factory pricing</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#34D399]" /> 24–48h response guarantee</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
