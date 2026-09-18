'use client';

import { useState } from 'react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import AnimatedSection from '@/components/customer/AnimatedSection';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { getWhatsAppLink } from '@/lib/utils';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <CustomerLayout>
      <main className="pt-20 bg-surface min-h-screen">
        {/* Hero */}
        <section className="relative py-24 px-6 lg:px-20 overflow-hidden">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="max-w-[1280px] mx-auto relative z-10">
            <AnimatedSection>
              <div className="max-w-3xl">
                <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-4 flex items-center gap-4">
                  <span className="w-8 h-px bg-primary"></span> Get in Touch
                </span>
                <h1 className="font-display text-cream-contrast text-4xl md:text-6xl font-bold mb-6">
                  Book Your <span className="text-primary italic">Extraordinary</span> Event Today
                </h1>
                <p className="text-on-surface-variant text-lg leading-relaxed">
                  We are here — so just make a wish! Make the day special with our various services.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-16 px-6 lg:px-20 bg-surface">
          <div className="max-w-[1280px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Contact Info */}
              <div className="lg:col-span-5">
                <AnimatedSection direction="left">
                  <div className="space-y-8">
                    <div>
                      <h2 className="font-display text-cream-contrast text-2xl font-semibold mb-6">Contact Information</h2>
                      <div className="space-y-5">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-cream-contrast mb-1">Visit Us</p>
                            <p className="text-on-surface-variant text-sm">Jawalakhel, Lalitpur, Nepal</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Phone className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-cream-contrast mb-1">Call Us</p>
                            <a href="tel:+9779847411305" className="text-primary text-sm hover:text-primary-container transition-colors">
                              +977-9847411305
                            </a>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Mail className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-cream-contrast mb-1">Email Us</p>
                            <a href="mailto:event.eleveneleven@gmail.com" className="text-primary text-sm hover:text-primary-container transition-colors">
                              event.eleveneleven@gmail.com
                            </a>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Clock className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-cream-contrast mb-1">Business Hours</p>
                            <p className="text-on-surface-variant text-sm">Sun — Fri: 9:00 AM — 6:00 PM</p>
                            <p className="text-on-surface-variant text-sm">Saturday: By Appointment</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div>
                      <p className="text-sm font-semibold text-cream-contrast mb-4">Follow Us</p>
                      <div className="flex gap-3">
                        <a href="https://www.facebook.com/11byNK" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-surface-container-high border border-outline-variant/30 flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all">
                          <FaFacebookF className="w-5 h-5 text-on-surface-variant" />
                        </a>
                        <a href="https://www.instagram.com/11byNK" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-surface-container-high border border-outline-variant/30 flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all">
                          <FaInstagram className="w-5 h-5 text-on-surface-variant" />
                        </a>
                        <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-surface-container-high border border-outline-variant/30 flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all">
                          <FaWhatsapp className="w-5 h-5 text-on-surface-variant" />
                        </a>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-col gap-3">
                      <a href="tel:+9779847411305" className="flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-lg hover:bg-primary-fixed transition-all font-semibold text-sm shadow-lg shadow-primary/20">
                        <Phone className="w-4 h-4" />
                        Call Now
                      </a>
                      <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary/10 transition-all font-semibold text-sm">
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp Chat
                      </a>
                    </div>
                  </div>
                </AnimatedSection>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-7">
                <AnimatedSection direction="right" delay={200}>
                  <div className="bg-surface-container border border-outline-variant rounded-xl p-8">
                    <h2 className="font-display text-cream-contrast text-2xl font-semibold mb-2">Book an Appointment</h2>
                    <p className="text-on-surface-variant text-sm mb-8">Tell us about your event and we&apos;ll get back to you within 24 hours.</p>

                    {submitted ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <Send className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="font-display text-cream-contrast text-xl font-semibold mb-2">Message Sent!</h3>
                        <p className="text-on-surface-variant">We&apos;ll get back to you within 24 hours.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">Your Name *</label>
                            <input
                              type="text"
                              required
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="w-full bg-surface-container-high text-cream-contrast py-3 px-4 border-b border-outline focus:border-primary focus:outline-none transition-colors text-sm"
                              placeholder="Enter your full name"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">Email Address *</label>
                            <input
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full bg-surface-container-high text-cream-contrast py-3 px-4 border-b border-outline focus:border-primary focus:outline-none transition-colors text-sm"
                              placeholder="your@email.com"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">Phone Number *</label>
                            <input
                              type="tel"
                              required
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full bg-surface-container-high text-cream-contrast py-3 px-4 border-b border-outline focus:border-primary focus:outline-none transition-colors text-sm"
                              placeholder="+977-9800000000"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">Event Type</label>
                            <select
                              value={formData.eventType}
                              onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                              className="w-full bg-surface-container-high text-cream-contrast py-3 px-4 border-b border-outline focus:border-primary focus:outline-none transition-colors text-sm appearance-none cursor-pointer"
                            >
                              <option value="">Select event type</option>
                              <option value="wedding">Wedding</option>
                              <option value="birthday">Birthday</option>
                              <option value="anniversary">Anniversary</option>
                              <option value="pasni">Pasni</option>
                              <option value="haldi-mehendi">Haldi / Mehendi</option>
                              <option value="proposal">Proposal Setup</option>
                              <option value="date-planner">Date Planner</option>
                              <option value="corporate">Corporate Event</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">Your Message</label>
                          <textarea
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full bg-surface-container-high text-cream-contrast py-3 px-4 border-b border-outline focus:border-primary focus:outline-none transition-colors text-sm resize-none"
                            rows={4}
                            placeholder="Tell us about your event — date, venue, guest count, any special requests..."
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-primary text-on-primary py-3 px-6 rounded-lg hover:bg-primary-fixed transition-all font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                        >
                          <Send className="w-4 h-4" />
                          Send Message
                        </button>
                      </form>
                    )}
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </section>

        {/* Map Placeholder */}
        <section className="px-6 lg:px-20 pb-20 bg-surface">
          <AnimatedSection>
            <div className="max-w-[1280px] mx-auto">
              <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden h-80 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-primary mx-auto mb-3" />
                  <p className="text-cream-contrast font-semibold font-display text-lg">Jawalakhel, Lalitpur, Nepal</p>
                  <p className="text-on-surface-variant text-sm mt-1">Open in Google Maps</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>
      </main>
    </CustomerLayout>
  );
}
