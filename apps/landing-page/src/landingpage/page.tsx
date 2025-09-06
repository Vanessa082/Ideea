"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Zap,
  Lock,
  Users,
  MessageCircle,
  Undo,
  Image as ImageIcon,
  Play,
  Download,
  Star,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AboutSection from "@/components/AboutSection";
import BookDemoSection from "@/components/BookDemoSection";
import ContactSection from "@/components/ContactSection";

// Small decorative floating blob
const FloatingBlob = ({ className = "", delay = 0 }: { className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1.2, delay }}
    className={className}
  />
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Background decorations */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        {/* <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" /> */}
        <FloatingBlob
          delay={0.1}
          className="absolute -top-24 -left-24 h-80 w-100 rounded-full bg-primary/10 blur-3xl"
        />
        <FloatingBlob
          delay={0.2}
          className="absolute top-40 -right-20 h-96 w-100 rounded-full bg-primary/10 blur-3xl"
        />
        <FloatingBlob
          delay={0.3}
          className="absolute bottom-0 left-1/3 h-72 w-100 rounded-full bg-primary/5 blur-3xl"
        />
      </div>

      <main className="pt-16 max-w-7xl mx-auto px-4" style={{ marginTop: "var(--navbar-height)" }}>
        {/* HERO */}
        <motion.section
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative grid min-h-screen grid-cols-1 items-center gap-12 py-16 md:grid-cols-2"
        >
          {/* dotted background - full bleed */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div
              className="h-full w-full text-primary/25"
              style={{
                backgroundImage: "radial-gradient(currentColor 1.2px, transparent 1.2px)",
                backgroundSize: "22px 22px",
                backgroundPosition: "center",
              }}
            />
          </div>
          {/* Left column - copy */}
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
            >
              <Star className="mr-2 h-4 w-4" />
              Loved by 10,000+ creators
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-6 text-5xl font-extrabold leading-tight md:text-6xl"
            >
              <span className="bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
                Ideea Site
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-4 max-w-xl text-lg text-muted-foreground md:text-xl"
            >
              Create beautiful sketches effortlessly with an intuitive toolset. Collaborate in real-time and bring your ideas to life.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Button
                aria-label="Get Started for Free"
                variant="default"
                size="lg"
                className="group relative overflow-hidden bg-chart-4"

              >
                <span className="relative z-10 flex items-center">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                {/* subtle sheen */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-0" />
              </Button>
              <Button aria-label="Watch demo" variant="outline" size="lg" className="group">
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>

            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4"
            >
              {[
                { label: "Sketches Created", value: "500K+" },
                { label: "Active Users", value: "50K+" },
                { label: "Uptime", value: "99.9%" },
                { label: "User Rating", value: "4.9/5" },
              ].map((s, i) => (
                <div key={i} className="rounded-lg border border-border bg-card/60 p-4 text-center shadow-sm backdrop-blur-sm">
                  <div className="text-2xl font-bold text-primary">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right column - preview card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-primary/30 to-chart-3/10 blur-lg" />
              <div className="relative rounded-3xl border border-border bg-card/80 p-6 shadow-xl backdrop-blur">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400" />
                    <span className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs text-muted-foreground">Live Canvas Preview</span>
                </div>

                {/* Fake canvas preview with animated strokes */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted">
                  <motion.div
                    className="absolute left-6 top-8 h-16 w-16 rounded-lg bg-chart-4/20"
                    animate={{ x: [0, 40, 0], y: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute bottom-10 right-8 h-24 w-24 rounded-full bg-chart-4/15"
                    animate={{ x: [0, -20, 0], y: [0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute left-1/3 top-1/2 h-2 w-40 rounded-full bg-primary"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 2, delay: 0.4, ease: "easeOut" }}
                  />
                </div>

                <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-primary" /> Real-time collaboration enabled
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* FEATURES */}
        <motion.section
          id="features"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative overflow-hidden py-24 w-screen left-[50%] right-[50%] -ml-[50vw] -mr-[50vw]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
          <div className="absolute right-10 top-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-10 left-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-7xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16 text-center"
            >
              <h2 className="text-4xl font-bold md:text-5xl">Powerful Features</h2>
              <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
                Everything you need to create, collaborate, and share your artistic vision
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Lock,
                  title: "Canvas creation and secure access",
                  description: "Secure authentication and private collaboration spaces",
                  features: [
                    "User authentication (email/password)",
                    "Private rooms for canvases",
                    "Shareable unique links for collaboration",
                  ],
                  delay: 0.1,
                },
                {
                  icon: Zap,
                  title: "Comprehensive drawing toolkit",
                  description: "Professional-grade tools for every creative need",
                  features: [
                    "Basic tools: pencil, eraser, resizable brush",
                    "Color palette for customization",
                    "Advanced geometry: rectangles, circles, lines",
                  ],
                  delay: 0.2,
                },
                {
                  icon: Users,
                  title: "User presence and activity",
                  description: "See who's working and collaborate seamlessly",
                  features: [
                    "Multiplayer cursors in real-time",
                    "User list showing current viewers/editors",
                  ],
                  delay: 0.3,
                },
                {
                  icon: MessageCircle,
                  title: "Chat functionality",
                  description:
                    "Real-time chat window integrated with WebSocket connection for seamless communication.",
                  features: [],
                  delay: 0.4,
                },
                {
                  icon: Undo,
                  title: "Versioning and history (MVP)",
                  description: "Basic undo/redo functionality for quick iteration and error correction.",
                  features: [],
                  delay: 0.5,
                },
                {
                  icon: ImageIcon,
                  title: "Exporting",
                  description: "Export the final canvas as an image (e.g., PNG).",
                  features: [],
                  delay: 0.6,
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: feature.delay, duration: 0.6 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group relative"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative rounded-xl border border-border bg-card/70 p-8 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:shadow-lg">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>

                    <h3 className="mb-2 text-xl font-semibold transition-colors duration-300 group-hover:text-primary">
                      {feature.title}
                    </h3>

                    <p className="mb-4 leading-relaxed text-muted-foreground">{feature.description}</p>

                    {feature.features.length > 0 && (
                      <ul className="space-y-2">
                        {feature.features.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 rounded-b-xl bg-gradient-to-r from-primary/60 to-primary/20 transition-transform duration-300 group-hover:scale-x-100" />
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-16 text-center"
            >
              <Button
                variant="outline"
                size="lg"
                className="group hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                Explore All Features
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>
        </motion.section>
      </main>

      {/* Secondary content sections */}
      <main className="mx-auto max-w-7xl px-4">
        <AboutSection />
        <BookDemoSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}