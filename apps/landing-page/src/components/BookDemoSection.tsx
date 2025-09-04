"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function BookDemoSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3, duration: 1 }}
      className="py-20 bg-muted/30"
    >
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Sketching?</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Experience the power of SketchApp with a personalized demo tailored to your creative needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" style={{ backgroundColor: "var(--primary)" }}>
            Book a Demo
          </Button>
          <Button variant="outline" size="lg">
            Download Free Trial
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
