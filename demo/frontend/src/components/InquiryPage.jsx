import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';
import { useState } from 'react';
import { Footer } from './Footer';
import { Navbar } from './Navbar';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://sml-agro-backend-production.up.railway.app';

const COUNTRIES = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
    'France', 'Netherlands', 'Belgium', 'UAE', 'Saudi Arabia', 'China',
    'Japan', 'South Korea', 'India', 'Singapore', 'Malaysia', 'Thailand',
    'Brazil', 'Mexico', 'Argentina', 'South Africa', 'Nigeria', 'Other'
];

const PRODUCTS = [
    'Coir Fiber', 'Coir Pith / Cocopeat', 'Grow Bags', 'Coir Mats',
    'Geotextiles', 'Coir Rope', 'Mixed Products', 'Other / Custom Order'
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
    customizationDetails: '',
};

export function InquiryPage({ onNavigate, initialCustomization }) {
    const [form, setForm] = useState(() => {
        if (!initialCustomization) return INITIAL_FORM;
        
        // Handle potential property name mismatches between customization data and inquiry form
        const productType = initialCustomization.productType || 
                         (initialCustomization.productsRequested?.name) || 
                         '';
                         
        const quantityVal = initialCustomization.quantity || 
                          initialCustomization.estimatedQuantity || 
                          '100';
                          
        return {
            ...INITIAL_FORM,
            productsRequested: productType,
            estimatedQuantity: String(quantityVal),
            customizationDetails: initialCustomization.customizationDetails || JSON.stringify(initialCustomization),
            specialRequirements: initialCustomization.customNotes || initialCustomization.specialRequirements || ''
        };
    });

    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(null);
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
            const res = await fetch(`${API_BASE_URL}/api/inquiries/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const json = await res.json();

            if (res.ok && json.success) {
                setSuccess({ inquiryNumber: json.data.inquiryNumber });
                setForm(INITIAL_FORM);
                // Scroll to top to show success message
                window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <div className="min-h-screen bg-sml-cream flex flex-col">
            <Navbar onNavigate={onNavigate} currentPage="inquiry" />
            <main className="flex-grow pt-28 pb-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Page Header */}
                    <div className="surface-card bg-sml-dark p-10 mb-8 rounded-[2rem] shadow-strong relative overflow-hidden">
                        <div className="absolute -top-32 -right-32 w-64 h-64 bg-sml-green/20 rounded-full blur-[80px]" />
                        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-sml-amber/20 rounded-full blur-[80px]" />
                        <div className="relative z-10">
                            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                                Submit Your Inquiry
                            </h1>
                            <p className="text-gray-400 max-w-2xl text-lg leading-relaxed">
                                Fill in the details below and our export team will respond within 24 hours.
                                You'll receive a unique inquiry tracking number upon submission.
                            </p>
                        </div>
                    </div>

                    {/* Success Banner */}
                    {success && (
                        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6 flex items-start gap-4 shadow-sm">
                            <CheckCircle2 className="w-8 h-8 text-green-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold text-green-800 text-lg">Inquiry Submitted Successfully!</p>
                                <p className="text-green-700 text-sm mt-1">
                                    Thank you! Your request was received. An automatic email confirmation has been sent to your email with your reference number. Our team will contact you within 24 hours.
                                </p>
                                <div className="mt-3 inline-flex items-center gap-3 bg-green-100 border border-green-200 rounded-xl px-4 py-2">
                                    <div>
                                        <p className="text-xs text-green-600 font-medium">Your Inquiry Reference Number</p>
                                        <p className="font-mono font-bold text-green-800 text-lg tracking-wider">{success.inquiryNumber}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-green-600 mt-3">
                                    Please save this number to track your inquiry status.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Error Banner */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 flex items-center gap-3 text-sm text-red-700 shadow-sm">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Form Card */}
                    <div className="surface-card p-10 md:p-12 mb-8 rounded-[2rem]">
                        <form onSubmit={handleSubmit} className="space-y-10">

                            {/* Contact Info */}
                            <div>
                                <h2 className="text-xs font-bold text-sml-text/70 uppercase tracking-widest mb-6 pb-2 border-b-2 border-gray-100">
                                    Contact Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                                    <div>
                                        <label className="block text-xs font-bold text-sml-text/70 uppercase tracking-widest mb-2">
                                            Full Name <span className="text-sml-green">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="customerName"
                                            value={form.customerName}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-200 px-4 py-3 text-sm focus:ring-0 focus:border-sml-green focus:bg-sml-green/5 outline-none transition-all"
                                            placeholder="Your Full Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-sml-text/70 uppercase tracking-widest mb-2">
                                            Company / Organisation
                                        </label>
                                        <input
                                            type="text"
                                            name="company"
                                            value={form.company}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-200 px-4 py-3 text-sm focus:ring-0 focus:border-sml-green focus:bg-sml-green/5 outline-none transition-all"
                                            placeholder="Company Name"
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
                                    <div>
                                        <label className="block text-xs font-bold text-sml-text/70 uppercase tracking-widest mb-2">
                                            Phone / WhatsApp
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-200 px-4 py-3 text-sm focus:ring-0 focus:border-sml-green focus:bg-sml-green/5 outline-none transition-all"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Order Details */}
                            <div>
                                <h2 className="text-xs font-bold text-sml-text/70 uppercase tracking-widest mb-6 pb-2 border-b-2 border-gray-100">
                                    Order Details
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                                    <div>
                                        <label className="block text-xs font-bold text-sml-text/70 uppercase tracking-widest mb-2">
                                            Country <span className="text-sml-green">*</span>
                                        </label>
                                        <select
                                            name="country"
                                            value={form.country}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-200 px-4 py-3 text-sm focus:ring-0 focus:border-sml-green focus:bg-sml-green/5 outline-none cursor-pointer transition-all"
                                        >
                                            <option value="">Select your country...</option>
                                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-sml-text/70 uppercase tracking-widest mb-2">
                                            Product Interest
                                        </label>
                                        <select
                                            name="productsRequested"
                                            value={form.productsRequested}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-200 px-4 py-3 text-sm focus:ring-0 focus:border-sml-green focus:bg-sml-green/5 outline-none cursor-pointer transition-all"
                                        >
                                            <option value="">Select a product...</option>
                                            {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-sml-text/70 uppercase tracking-widest mb-2">
                                            Estimated Quantity
                                        </label>
                                        <input
                                            type="text"
                                            name="estimatedQuantity"
                                            value={form.estimatedQuantity}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-200 px-4 py-3 text-sm focus:ring-0 focus:border-sml-green focus:bg-sml-green/5 outline-none transition-all"
                                            placeholder="e.g. 500 MT, 20 x 40ft containers, 10,000 bags"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <h2 className="text-xs font-bold text-sml-text/70 uppercase tracking-widest mb-6 pb-2 border-b-2 border-gray-100">
                                    Message & Requirements
                                </h2>
                                <textarea
                                    name="specialRequirements"
                                    value={form.specialRequirements}
                                    onChange={handleChange}
                                    rows={5}
                                    className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-200 px-4 py-3 text-sm focus:ring-0 focus:border-sml-green focus:bg-sml-green/5 outline-none transition-all resize-none"
                                    placeholder="Tell us about your specific requirements — EC levels, certifications needed (organic, EU), delivery terms, packaging preferences, timeline, etc."
                                />
                            </div>

                            {/* Submit */}
                            <div className="flex items-center justify-between pt-2">
                                <p className="text-xs text-gray-400">
                                    <span className="text-red-500">*</span> Required fields
                                </p>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="inline-flex items-center gap-2 bg-sml-dark text-sml-cream font-bold py-4 px-10 rounded-xl hover:bg-sml-green transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Submit Inquiry
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Back link */}
                    <div className="text-center mt-6">
                        <button
                            onClick={() => onNavigate('home')}
                            className="text-sm text-gray-500 hover:text-sml-green transition-colors"
                        >
                            ← Back to Homepage
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
