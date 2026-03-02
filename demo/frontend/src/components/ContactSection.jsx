import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form Side */}
          <div>
            <span className="text-sml-green font-semibold text-sm tracking-widest uppercase">
              Get in Touch
            </span>
            <h2 className="text-4xl font-serif font-bold text-sml-dark mt-3 mb-8">
              Request a Quote
            </h2>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sml-green focus:border-transparent"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sml-green focus:border-transparent"
                  placeholder="email@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Interest
                </label>
                <select className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sml-green focus:border-transparent">
                  <option>Select a product...</option>
                  <option>Coir Fiber</option>
                  <option>Coir Pith / Cocopeat</option>
                  <option>Grow Bags</option>
                  <option>Coir Mats</option>
                  <option>Geotextiles</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sml-green focus:border-transparent"
                  placeholder="Tell us about your requirements..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-sml-dark text-sml-cream font-bold py-4 rounded-lg hover:bg-gray-800 transition-colors shadow-lg"
              >
                Send Inquiry
              </button>
            </form>
          </div>

          {/* Info Side */}
          <div className="bg-sml-cream rounded-2xl p-10 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-serif font-bold text-sml-dark mb-6">
                Contact Information
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-white p-3 rounded-full shadow-sm">
                    <MapPin className="w-6 h-6 text-sml-green" />
                  </div>
                  <div>
                    <p className="font-bold text-sml-dark">Headquarters</p>
                    <p className="text-gray-600">
                      123 Coconut Grove Rd,
                      <br />
                      Kurunegala, Sri Lanka
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-white p-3 rounded-full shadow-sm">
                    <Mail className="w-6 h-6 text-sml-green" />
                  </div>
                  <div>
                    <p className="font-bold text-sml-dark">Email Us</p>
                    <p className="text-gray-600">exports@smlagro.com</p>
                    <p className="text-gray-600">support@smlagro.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-white p-3 rounded-full shadow-sm">
                    <Phone className="w-6 h-6 text-sml-green" />
                  </div>
                  <div>
                    <p className="font-bold text-sml-dark">Call Us</p>
                    <p className="text-gray-600">+94 37 222 3333</p>
                    <p className="text-gray-600">+94 77 123 4567 (WhatsApp)</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-white p-3 rounded-full shadow-sm">
                    <Clock className="w-6 h-6 text-sml-green" />
                  </div>
                  <div>
                    <p className="font-bold text-sml-dark">Business Hours</p>
                    <p className="text-gray-600">
                      Mon - Fri: 8:00 AM - 6:00 PM (IST)
                    </p>
                    <p className="text-sm text-sml-green mt-1 font-medium">
                      🌍 Available for enquiries 24/7
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
