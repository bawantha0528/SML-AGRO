import React from "react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-white pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-4 text-sml-dark">Contact Us</h2>
        <p className="text-gray-600 mb-8">
          Have questions? We'd love to hear from you. Get in touch with us today.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sml-green focus:border-transparent"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sml-green focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sml-green focus:border-transparent"
                  placeholder="Your message..."
                />
              </div>
              <button className="w-full bg-sml-green text-white font-bold py-2 rounded-lg hover:bg-sml-dark transition">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-sml-dark mb-2">
                Address
              </h3>
              <p className="text-gray-600">
                SML Agro Lanka<br />
                Colombo, Sri Lanka
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-sml-dark mb-2">
                Phone
              </h3>
              <p className="text-gray-600">+94 77 000 0000</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-sml-dark mb-2">
                Email
              </h3>
              <p className="text-gray-600">info@smlagro.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
