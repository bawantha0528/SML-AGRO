import React from 'react';
import { ShieldCheck, Globe, Leaf, Award } from 'lucide-react';

export function AboutSection() {
  return (
    <section id="about" className="py-32 relative overflow-hidden bg-white">
      {/* Decorative Diagonal Slice */}
      <div className="absolute top-0 left-0 w-full h-[30%] bg-sml-cream/50 skew-y-[-2deg] origin-top-left -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="stagger-fade">
            <span className="inline-block py-1.5 px-4 rounded-full bg-sml-amber/10 text-sml-amber font-bold text-xs tracking-[0.2em] uppercase mb-6 shadow-[inset_0_0_0_1px_rgba(207,153,76,0.3)]">
              Our Legacy
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-sml-dark mb-8 tracking-tight">
              Decades of Excellence in <span className="text-gradient">Coconut Coir</span>
            </h2>
            <p className="text-sml-text/80 text-lg md:text-xl leading-relaxed mb-6 font-medium">
              Founded in the heart of Sri Lanka's coconut triangle, SML Agro has
              grown from a local processor to a global export leader.
            </p>
            <p className="text-sml-text/60 text-lg leading-relaxed mb-10">
              Our commitment goes beyond profit. We bridge the gap between traditional craftsmanship and modern agricultural needs, empowering over 500 local farming families while delivering precision-engineered coir products worldwide.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div className="surface-card p-6 border-l-4 border-l-sml-green relative overflow-hidden group hover:border-l-8 transition-all">
                <div className="absolute right-[-10%] top-[-10%] w-24 h-24 bg-sml-green/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
                <p className="text-4xl lg:text-5xl font-bold text-sml-dark mb-2 tracking-tighter">15<span className="text-sml-green text-3xl">+</span></p>
                <p className="text-sm font-semibold text-sml-text/60 uppercase tracking-widest">Years Exp</p>
              </div>
              <div className="surface-card p-6 border-l-4 border-l-sml-amber relative overflow-hidden group hover:border-l-8 transition-all">
                <div className="absolute right-[-10%] top-[-10%] w-24 h-24 bg-sml-amber/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
                <p className="text-4xl lg:text-5xl font-bold text-sml-dark mb-2 tracking-tighter">5<span className="text-sml-amber text-3xl">k+</span></p>
                <p className="text-sm font-semibold text-sml-text/60 uppercase tracking-widest">Tons/Year</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
            {/* Background Blob for the grid */}
            <div className="absolute inset-0 bg-gradient-to-tr from-sml-green/5 to-sml-amber/5 rounded-[3rem] -m-8 pointer-events-none -z-10" />

            {[
              {
                icon: Leaf,
                title: '100% Sustainable',
                desc: 'Zero waste production process with eco-friendly sourcing practices.',
                color: 'text-emerald-500',
                bg: 'bg-emerald-50'
              },
              {
                icon: ShieldCheck,
                title: 'Quality Assured',
                desc: 'Rigorous testing for EC levels, expansion, and extreme durability.',
                color: 'text-blue-500',
                bg: 'bg-blue-50'
              },
              {
                icon: Globe,
                title: 'Global Logistics',
                desc: 'Seamless shipping to Europe, Americas, and across Asia.',
                color: 'text-indigo-500',
                bg: 'bg-indigo-50'
              },
              {
                icon: Award,
                title: 'Certified',
                desc: 'ISO 9001, GMP, and Organic certified processing standards.',
                color: 'text-amber-500',
                bg: 'bg-amber-50'
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="surface-card p-8 group hover:-translate-y-2 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm`}>
                  <item.icon className={`w-7 h-7 ${item.color}`} />
                </div>
                <h3 className="font-bold text-lg text-sml-dark mb-3">{item.title}</h3>
                <p className="text-sm text-sml-text/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
