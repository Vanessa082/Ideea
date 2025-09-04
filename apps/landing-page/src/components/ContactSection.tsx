"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function ContactSection() {
  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3, duration: 1 }}
      className="py-20"
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-lg text-muted-foreground">
            Have questions? We&#39;d love to hear from you. Send us a message and we&#39;ll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <span className="text-sm" style={{ color: "var(--primary)" }}>📧</span>
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">sketchedevolution@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <span className="text-sm" style={{ color: "var(--primary)" }}>📞</span>
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-muted-foreground">+(237) 676184440</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <span className="text-sm" style={{ color: "var(--primary)" }}>📍</span>
                </div>
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-muted-foreground">Hotel Jouvence<br />At RebasecodeCamp</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card p-8 rounded-lg border border-border">
            <h3 className="text-xl font-semibold mb-6">Send us a Message</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Tell us about your project..."
                />
              </div>
              <Button type="submit" className="w-full" style={{ backgroundColor: "var(--primary)" }}>
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
