'use client';

import Link from 'next/link';
import { useState } from 'react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import AnimatedSection from '@/components/customer/AnimatedSection';
import CustomDropdown from '@/components/ui/CustomDropdown';
import MultiDatePicker from '@/components/ui/MultiDatePicker';
import FeaturedDestinationsSection from '@/components/customer/FeaturedDestinationsSection';

export default function Home() {
  const [selectedEventType, setSelectedEventType] = useState('');
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [guestCount, setGuestCount] = useState('');

  const heroBg = "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAD7mPCb1hYUN9bXHaMlFuL39yVLR-caNZqd8JFmj99fkshd-ba9EgjRUIXAOzRdntLA_RdL8LVZGXyaD7D5SLTlyXfVTp6FImraIFKPrFAymMfSQ-aqNlQ0XTXMgzQtvvmJ0LJMRKr6EzqCVdvWJGt_aLaKZdahYiAfiflL8cwvnNjZrGInFVcAuA_hA_-DOt4cotPTtq_-pQIZ7ihE3Cfvc0oj5nVxXLlosEmA_G9dj2Baxw3QPh-')";

  return (
    <CustomerLayout>
      <main className="pt-20 bg-surface min-h-screen">
        {/* Hero Section */}
        <div className="flex flex-col w-full bg-background text-on-background relative">
          <div className="absolute top-0 right-0 w-3/4 h-[800px] bg-gradient-radial from-primary/10 to-transparent blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-[600px] bg-gradient-radial from-champagne-gold/5 to-transparent blur-3xl pointer-events-none"></div>

          <section className="relative min-h-[90vh] flex items-center justify-center -mt-20 pt-20 px-6 lg:px-20">
            {/* Background Image */}
            <div className="absolute inset-0 z-0" style={{ backgroundImage: heroBg }}>
              <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background"></div>
            </div>

            <div className="relative z-10 w-full max-w-[1280px] mx-auto flex flex-col items-center text-center gap-8 mt-20">
              <AnimatedSection direction="fade" delay={0} immediate>
                <div className="inline-flex items-center gap-3 bg-surface-container-low/80 backdrop-blur-md px-6 py-2 rounded-full border-[0.5px] border-primary/30 shadow-2xl">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">Bespoke Events in Nepal</span>
                </div>
              </AnimatedSection>

              <AnimatedSection direction="up" delay={200} immediate>
                <h1 className="font-display text-cream-contrast max-w-4xl tracking-tight leading-tight text-5xl md:text-7xl font-bold drop-shadow-2xl">
                  Elevate Events with <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-champagne-gold to-muted-gold italic pr-4">
                    Extraordinary
                  </span>{' '}
                  Experiences
                </h1>
              </AnimatedSection>

              <AnimatedSection direction="up" delay={400} immediate>
                <p className="text-on-surface-variant max-w-2xl font-light text-lg">
                  Crafting turnkey event masterpieces with meticulous attention to luxury, exclusivity, and professional perfection.
                </p>
              </AnimatedSection>

              <AnimatedSection direction="up" delay={600} immediate>
                <div className="w-full max-w-5xl mt-8 bg-surface-container-high/90 backdrop-blur-xl p-3 md:p-4 rounded-xl border-[0.5px] border-outline-variant/50 shadow-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1.15fr_0.8fr_auto] items-end gap-3 relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden rounded-xl"></div>

                  <CustomDropdown
                    label="Event Type"
                    icon="🎉"
                    value={selectedEventType}
                    onChange={setSelectedEventType}
                    placeholder="Select Event"
                    options={[
                      { value: 'Wedding', label: 'Wedding', icon: '💒' },
                      { value: 'Birthday', label: 'Birthday', icon: '🎂' },
                      { value: 'Anniversary', label: 'Anniversary', icon: '💕' },
                      { value: 'Pasni', label: 'Pasni', icon: '👶' },
                      { value: 'Haldi', label: 'Haldi Mehendi', icon: '🌼' },
                      { value: 'Corporate Event', label: 'Corporate Event', icon: '🏢' },
                    ]}
                  />

                  <MultiDatePicker
                    label="Preferred Dates"
                    icon="📅"
                    selectedDates={selectedDates}
                    onChange={setSelectedDates}
                    placeholder="Select dates"
                  />

                  <div className="flex flex-col min-w-0">
                    <label htmlFor="hero-guests" className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      <span className="text-sm">👥</span> Guests
                    </label>
                    <input
                      id="hero-guests"
                      type="text"
                      value={guestCount}
                      onChange={(event) => setGuestCount(event.target.value)}
                      placeholder="e.g. 200"
                      className="w-full min-w-0 bg-surface-container-lowest text-on-surface py-3.5 px-4 rounded-xl border border-outline-variant/60 focus:border-primary focus:outline-none transition-colors text-sm"
                    />
                  </div>

                  <Link
                    href={{
                      pathname: '/planner',
                      query: {
                        ...(selectedEventType ? { type: selectedEventType } : {}),
                        ...(selectedDates.length > 0 ? { dates: selectedDates.join(',') } : {}),
                        ...(guestCount ? { guests: guestCount } : {}),
                      },
                    }}
                    className="bg-primary text-on-primary text-sm font-semibold px-5 py-3.5 rounded-lg hover:bg-primary-fixed transition-all duration-300 flex items-center justify-center gap-1.5 group/btn shadow-lg shadow-primary/20 hover:shadow-primary/40 whitespace-nowrap flex-shrink-0"
                  >
                    Plan Now
                    <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </AnimatedSection>
            </div>
          </section>
        </div>

        {/* Events We Specialize In */}
        <section className="py-24 px-6 lg:px-20 bg-surface relative">
          <div className="max-w-[1280px] mx-auto">
            <AnimatedSection>
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                <div className="max-w-2xl">
                  <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase block mb-4 flex items-center gap-4">
                    <span className="w-8 h-px bg-primary"></span> What We Do Best
                  </span>
                  <h2 className="font-display text-cream-contrast text-4xl md:text-5xl font-semibold">Events We <span className="text-primary">Specialize</span> In</h2>
                </div>
                <Link href="/services" className="text-primary text-xs font-bold uppercase tracking-widest hover:text-primary-fixed transition-colors flex items-center gap-2 pb-2 border-b border-primary/30 hover:border-primary">
                  View All Services →
                </Link>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {[
                { name: 'Wedding Decoration', icon: '💒', slug: 'wedding' },
                { name: 'Birthday Party', icon: '🎂', slug: 'birthday' },
                { name: 'Pasni Ceremony', icon: '👶', slug: 'pasni' },
                { name: 'Anniversary', icon: '💕', slug: 'anniversary' },
                { name: 'Haldi Mehendi', icon: '🌼', slug: 'haldi' },
                { name: 'Date Planner', icon: '🌹', slug: 'date-planner' },
                { name: 'Surprise Plan', icon: '🎁', slug: 'surprise' },
                { name: 'Proposal Setup', icon: '💍', slug: 'proposal' },
                { name: 'Corporate Event', icon: '🏢', slug: 'corporate' },
                { name: 'Inauguration', icon: '🎀', slug: 'inauguration' },
              ].map((et, i) => (
                <AnimatedSection key={et.slug} delay={i * 60}>
                  <Link
                    href={`/planner?event=${et.slug}`}
                    className="group flex flex-col items-center justify-center bg-surface-container-high border-[0.5px] border-outline-variant/30 rounded-xl p-6 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
                  >
                    <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform duration-300">{et.icon}</span>
                    <p className="text-sm font-semibold text-cream-contrast group-hover:text-primary transition-colors duration-300">{et.name}</p>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 px-6 lg:px-20 bg-surface relative">
          <div className="max-w-[1280px] mx-auto">
            <AnimatedSection>
              <div className="text-center mb-16 flex flex-col items-center">
                <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-4 flex items-center gap-4">
                  <span className="w-8 h-px bg-primary"></span> Comprehensive Care <span className="w-8 h-px bg-primary"></span>
                </span>
                <h2 className="font-display text-cream-contrast text-4xl md:text-5xl font-semibold">What We Offer</h2>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { icon: '✨', title: 'Decoration', desc: 'Bespoke thematic designs tailored to your unique style and vision.' },
                { icon: '🏙️', title: 'Venue Finding', desc: 'Scouting the perfect, exclusive locations for your grand celebration.' },
                { icon: '📸', title: 'Photo & Video', desc: 'Capturing timeless moments with cinematic precision and artistry.' },
                { icon: '💄', title: 'Makeup', desc: 'Professional styling to ensure you look radiant on your special day.' },
                { icon: '🎵', title: 'Band Baja', desc: 'Traditional and modern musical ensembles to set the perfect mood.' },
              ].map((service, i) => (
                <AnimatedSection key={service.title} delay={i * 100}>
                  <div className="bg-surface-container-high p-8 rounded-xl border-[0.5px] border-outline-variant/20 hover:border-primary/50 transition-all duration-300 group flex flex-col items-center text-center hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
                    <div className="w-16 h-16 rounded-full bg-surface-container-lowest border-[0.5px] border-outline-variant/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] text-3xl">
                      {service.icon}
                    </div>
                    <h3 className="text-cream-contrast text-base font-semibold mb-3">{service.title}</h3>
                    <p className="text-on-surface-variant text-sm">{service.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection delay={500}>
              <div className="mt-12 flex justify-center">
                <button className="bg-transparent text-primary text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-full border border-primary hover:bg-primary hover:text-on-primary transition-all duration-300 flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20">
                  Explore All Services →
                </button>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Featured Destinations */}
        <FeaturedDestinationsSection />

        {/* Testimonials Section */}
        <section className="py-24 px-6 lg:px-20 bg-surface-container-low relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#d4af37 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
          <div className="max-w-[1280px] mx-auto relative z-10">
            <AnimatedSection>
              <div className="flex flex-col items-center mb-12">
                <span className="text-primary text-4xl mb-4 opacity-50">❝</span>
                <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-2">Voices of Joy</span>
                <h2 className="font-display text-cream-contrast text-center text-4xl md:text-5xl font-semibold">Client Experiences</h2>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { quote: "The level of detail was simply astounding. They took our vision and elevated it beyond anything we could have imagined for our Kathmandu wedding.", name: "Aarav & Priya", role: "Wedding Client" },
                { quote: "Professional, creative, and incredibly reliable. Our corporate gala in Pokhara went flawlessly thanks to the Eleven 11 team.", name: "Sushant G.", role: "Corporate Event", offset: true },
                { quote: "For our parents' 50th anniversary, we wanted absolute perfection. They delivered a breathtaking aesthetic with zero stress for us.", name: "The Malla Family", role: "Anniversary Celebration" },
              ].map((testimonial, i) => (
                <AnimatedSection key={testimonial.name} delay={i * 150}>
                  <div className={`bg-surface p-8 rounded-xl border-[0.5px] border-outline-variant/30 shadow-lg relative transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 ${testimonial.offset ? 'lg:-translate-y-8' : ''}`}>
                    <div className="flex items-center gap-1 mb-6">
                      {[1,2,3,4,5].map(star => (
                        <span key={star} className="text-primary text-sm">★</span>
                      ))}
                    </div>
                    <p className="font-display text-cream-contrast italic mb-8 leading-snug text-xl">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div className="w-12 h-px bg-primary/50 mb-4"></div>
                    <p className="text-on-surface text-base font-semibold">{testimonial.name}</p>
                    <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mt-1">{testimonial.role}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 lg:px-20 bg-background border-t-[0.5px] border-outline-variant/20">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
              <h2 className="font-display text-cream-contrast text-5xl md:text-7xl font-bold mb-6">
                Ready to Create <br />
                <span className="text-primary italic">Magic?</span>
              </h2>
              <p className="text-on-surface-variant text-lg mb-10 max-w-2xl">
                Begin the journey to your extraordinary event. Schedule a private consultation with our master planners today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/planner" className="bg-primary text-on-primary text-base font-semibold px-8 py-4 rounded-lg hover:bg-primary-fixed transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105">
                  Book Consultation
                </Link>
                <Link href="/gallery" className="bg-transparent text-on-surface text-base font-semibold px-8 py-4 rounded-lg border-[0.5px] border-outline-variant hover:border-primary hover:text-primary transition-all duration-300 hover:scale-105">
                  View Portfolio
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </section>
      </main>
    </CustomerLayout>
  );
}
