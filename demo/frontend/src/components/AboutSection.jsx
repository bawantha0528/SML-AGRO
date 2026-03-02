import React from 'react';
import { motion } from 'framer-motion';

export function AboutSection() {
    return (
        <section id="about" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-serif font-bold text-sml-dark mb-6"
                    >
                        About Us
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-gray-600"
                    >
                        SML Agro Lanka is a premier manufacturer and exporter of high-quality coconut coir products based in Sri Lanka.
                        With a commitment to sustainability and excellence, we serve global agricultural and industrial sectors.
                    </motion.p>
                </div>
            </div>
        </section>
    );
}

export default AboutSection;
