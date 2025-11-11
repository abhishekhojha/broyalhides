import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import BookingVisit from "../about/booking";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-slate-900">
      <section className="container mx-auto px-4 py-20 pt-32">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4">Get in Touch</Badge>
          <h1 className="text-4xl md:text-5xl font-semibold">We’d love to hear from you</h1>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">Whether you have questions about our leather goods, need custom work, or simply want to say hello — we’re here to help.</p>
        </div>

        {/* Contact Info + Form */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="text-lg font-semibold">Our Studio</CardHeader>
              <CardContent className="space-y-4 text-slate-600">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5" />
                  <span>123 Artisan Lane, City, Country</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  <span>hello@brandname.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" />
                  <span>Mon – Sat: 10am – 6pm</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-lg font-semibold">Visit Us</CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm mb-4">We welcome studio visits by appointment. Get a feel for our materials and craftsmanship firsthand.</p>
                <BookingVisit w="full"/>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Send a Message</h2>
            <form className="space-y-4">
              <Input type="text" placeholder="Your Name" required />
              <Input type="email" placeholder="Your Email" required />
              <Input type="text" placeholder="Subject" />
              <Textarea placeholder="Your Message" className="h-32" required />
              <Button className="w-full">Submit</Button>
            </form>
          </Card>
        </div>

        {/* Map Section */}
        <div className="mt-20 rounded-2xl overflow-hidden shadow">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3473.0365576144513!2d76.03361867506477!3d22.95184647922334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3963179ae61e2239%3A0xc341f124b9f17c87!2sDurga%20Shoes%20(%20broyal%20)!5e1!3m2!1sen!2sin!4v1762714878789!5m2!1sen!2sin" width={"100%"} height="450" style={{border:0}} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </section>
    </main>
  );
}
