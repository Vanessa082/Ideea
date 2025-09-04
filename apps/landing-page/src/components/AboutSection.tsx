"use client";

import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <motion.section
      id="about"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3, duration: 1 }}
      className="py-20"
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">About SketchApp</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Born from a passion for creativity, SketchApp empowers artists, designers, and creative professionals
            to bring their ideas to life with unparalleled ease and precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
            <p className="text-muted-foreground mb-6">
              We believe that creativity should be accessible to everyone. Our mission is to provide
              intuitive tools that remove barriers between imagination and creation, enabling artists
              to focus on what matters most - their art.
            </p>
            <h3 className="text-2xl font-semibold mb-4">Why Choose Us?</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Professional-grade drawing tools</li>
              <li>• Cloud synchronization across devices</li>
              <li>• Community of artists and creators</li>
              <li>• Regular updates and new features</li>
            </ul>
          </div>

          <div className="bg-card p-8 rounded-lg border border-border">
            <h3 className="text-xl font-semibold mb-4">Key Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Users</span>
                <span className="font-semibold" style={{ color: "var(--primary)" }}>50K+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sketches Created</span>
                <span className="font-semibold" style={{ color: "var(--primary)" }}>2M+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Countries</span>
                <span className="font-semibold" style={{ color: "var(--primary)" }}>120+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">User Rating</span>
                <span className="font-semibold" style={{ color: "var(--primary)" }}>4.8/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
