import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {  CheckCircle, MapPin } from "lucide-react";
import BookingVisit from "./booking";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-slate-900">
      <section className="max-w-6xl mx-auto px-6 pb-20 pt-32">
        {/* Hero */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-4">Handcrafted · Ethical · Timeless</Badge>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
              Broyal — The Art of Leather Craft
            </h1>
            <p className="mt-6 text-lg text-slate-600">
              Every pair of shoes we create tells a story of precision,
              patience, and passion. Our leather jackets and footwear are made
              by artisans who blend heritage craftsmanship with a minimalist
              design language for today’s world.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button>Shop Shoes</Button>
              <Button variant="outline">Explore Jackets</Button>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/images/about/shoes2.png"
                alt="Leather shoes in crafting"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Crafting Process */}
        <section className="mt-20">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            The Crafting Journey
          </h2>
          <p className="text-center max-w-3xl mx-auto text-slate-600 mb-12">
            Our process is as intentional as our design — from selecting
            full-grain leathers to the final polish. Every shoe passes through
            expert hands to ensure comfort, durability, and timeless appeal.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden shadow-md">
                <img
                  src={`/images/about/about${i + 1}.jpeg`}
                  alt={`Crafting step ${i + 1}`}
                  className="w-full h-56 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Ethos Section */}
        <section className="mt-20 grid gap-8 items-start">
          <div>
            <h2 className="text-2xl font-semibold">
              Sourced with Integrity, Built to Last
            </h2>
            <p className="mt-4 text-slate-600">
              We source responsibly — selecting leathers, threads, and metals
              that are traceable, natural, and environmentally mindful. We
              believe luxury should never compromise the planet.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-1" />
                <span>Full-grain leathers from ethical tanneries</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-1" />
                <span>Minimal waste cutting process</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-1" />
                <span>Designed for repairability, not disposal</span>
              </li>
            </ul>
          </div>

          {/* <div className="rounded-xl overflow-hidden shadow">
            <img src="/images/materials.jpg" alt="Leather materials and tools" className="w-full h-64 object-cover" />
          </div> */}
        </section>

        {/* Studio & Contact CTA */}
        <section className="mt-20 bg-white rounded-2xl p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-semibold">Visit Our Studio</h3>
            <p className="mt-2 text-sm text-slate-600">
              We welcome visitors by appointment to experience the materials,
              craftsmanship, and care that go into each product.
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-slate-600">
              <MapPin className="w-4 h-4" />
              <span>Broyal Studio: Dewas, India — By Appointment</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <BookingVisit />
            <Button variant="ghost">Contact Us</Button>
          </div>
        </section>
      </section>
    </main>
  );
}
