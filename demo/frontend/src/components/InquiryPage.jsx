import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ContactSection } from './ContactSection';

export function InquiryPage({ onNavigate }) {
    return (
        <div className="min-h-screen bg-sml-cream flex flex-col">
            <Navbar onNavigate={onNavigate} currentPage="inquiry" />
            <main className="flex-grow pt-28 pb-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="bg-sml-dark px-8 py-6">
                            <h1 className="text-3xl font-serif font-bold text-sml-cream">
                                Submit Your Inquiry
                            </h1>
                            <p className="text-sml-green-light mt-2">
                                Please refer the details of the product you are interested in.
                            </p>
                        </div>

                        <div className="p-8 md:p-12">
                            {/* We can reuse the form structure here or import ContactSection. 
                   For a dedicated page, let's make it focused. */}
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                        <input type="text" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sml-green focus:border-transparent" placeholder="Your Name" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Company (Optional)</label>
                                        <input type="text" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sml-green focus:border-transparent" placeholder="Company Name" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <input type="email" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sml-green focus:border-transparent" placeholder="email@company.com" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                        <input type="tel" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sml-green focus:border-transparent" placeholder="+1 (555) 000-0000" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                        <select className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sml-green focus:border-transparent">
                                            <option value="">Select your country...</option>
                                            <option>United States</option>
                                            <option>United Kingdom</option>
                                            <option>Canada</option>
                                            <option>Australia</option>
                                            <option>Germany</option>
                                            <option>France</option>
                                            <option>UAE</option>
                                            <option>China</option>
                                            <option>Japan</option>
                                            <option>South Korea</option>
                                            <option>India</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                        <input type="text" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sml-green focus:border-transparent" placeholder="City" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Interest</label>
                                    <select className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sml-green focus:border-transparent">
                                        <option>Select a product...</option>
                                        <option>Coir Fiber</option>
                                        <option>Cocopeat Blocks</option>
                                        <option>Grow Bags</option>
                                        <option>Coir Mats</option>
                                        <option>Geotextiles</option>
                                        <option>Coir Rope</option>
                                        <option>Other / Custom Order</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Message & Requirements</label>
                                    <textarea rows={6} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sml-green focus:border-transparent" placeholder="Tell us about your estimated quantity, destination, and any specific requirements..."></textarea>
                                </div>

                                <div className="flex justify-end">
                                    <button type="submit" className="bg-sml-dark text-sml-cream font-bold py-4 px-12 rounded-lg hover:bg-gray-800 transition-colors shadow-lg">
                                        Submit Inquiry
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
