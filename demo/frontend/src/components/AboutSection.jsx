import React from 'react';
import { ShieldCheck, Globe, Leaf, Award } from 'lucide-react';

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-sml-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-sml-green font-semibold text-sm tracking-widest uppercase">
              Our Story
            </span>
            <h2 className="text-4xl font-serif font-bold text-sml-dark mt-3 mb-6">
              Decades of Excellence in Coconut Coir
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Founded in the heart of Sri Lanka's coconut triangle, SML Agro has
              grown from a local processor to a global export leader. We bridge
              the gap between traditional craftsmanship and modern agricultural
              needs.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Our commitment goes beyond profit. We empower over 500 local
              farming families, ensuring fair trade practices while delivering
              precision-engineered coir products to 30+ countries worldwide.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-sml-cream-dark">
                <p className="text-3xl font-bold text-sml-green mb-1">15+</p>
                <p className="text-sm text-gray-600">Years Experience</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-sml-cream-dark">
                <p className="text-3xl font-bold text-sml-green mb-1">5k+</p>
                <p className="text-sm text-gray-600">Tons Exported/Year</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                icon: Leaf,
                title: '100% Sustainable',
                desc: 'Zero waste production process with eco-friendly sourcing.',
              },
              {
                icon: ShieldCheck,
                title: 'Quality Assured',
                desc: 'Rigorous testing for EC levels, expansion, and durability.',
              },
              {
                icon: Globe,
                title: 'Global Logistics',
                desc: 'Seamless shipping to Europe, Americas, and Asia.',
              },
              {
                icon: Award,
                title: 'Certified',
                desc: 'ISO 9001, GMP, and Organic certified processing.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-sml-green"
              >
                <item.icon className="w-8 h-8 text-sml-green mb-4" />
                <h3 className="font-bold text-sml-dark mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
