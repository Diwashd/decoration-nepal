'use client';

import CustomerLayout from '@/components/customer/CustomerLayout';
import AnimatedSection from '@/components/customer/AnimatedSection';
import { Heart, Star, Users, Award, Sparkles, Target } from 'lucide-react';

export default function AboutPage() {
  return (
    <CustomerLayout>
      <main className="pt-20 bg-surface min-h-screen">
        {/* Hero */}
        <section className="relative py-24 px-6 lg:px-20 overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="max-w-[1280px] mx-auto relative z-10">
            <AnimatedSection>
              <div className="max-w-3xl">
                <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-4 flex items-center gap-4">
                  <span className="w-8 h-px bg-primary"></span> Our Story
                </span>
                <h1 className="font-display text-cream-contrast text-4xl md:text-6xl font-bold mb-6">
                  Welcome to <span className="text-primary italic">Eleven Eleven</span>
                </h1>
                <p className="text-on-surface-variant text-lg leading-relaxed">
                  A premier decorations and event management company in Nepal, proudly associated with Naulo Koseli (NK),
                  an emerging gifting platform in the country.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* About Content */}
        <section className="py-16 px-6 lg:px-20 bg-surface">
          <div className="max-w-[1280px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <AnimatedSection direction="left">
                <div className="space-y-6">
                  <h2 className="font-display text-cream-contrast text-3xl md:text-4xl font-semibold">
                    More Than Decorations — We Design <span className="text-primary">Experiences</span>
                  </h2>
                  <p className="text-on-surface-variant leading-relaxed">
                    As a sister company to Naulo Koseli, Eleven:11 By NK brings a touch of magic to your special
                    occasions, transforming your dreams into unforgettable moments. Our extensive array of services
                    caters to every celebration imaginable.
                  </p>
                  <p className="text-on-surface-variant leading-relaxed">
                    Whether it&apos;s a Date Planner Decoration, a meticulously planned Surprise, a dreamy Proposal Setup,
                    the elegance of Anniversary or Birthday Decorations, the cultural richness of Pasni ceremonies,
                    or the vibrancy of Haldi Mehendi Decorations — we ensure a seamless blend of creativity and precision.
                  </p>
                  <p className="text-on-surface-variant leading-relaxed">
                    But we don&apos;t stop at decorations. Our commitment to being your one-stop event solution means we
                    handle every aspect of your celebration — from photography and venue finding to catering, makeup,
                    sound systems, and car decorations.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection direction="right" delay={200}>
                <div className="relative">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden border border-outline-variant/30 shadow-2xl">
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop')" }}
                    />
                  </div>
                  <div className="absolute -bottom-6 -left-6 bg-surface-container border border-outline-variant rounded-xl p-6 shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                        <Award className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-cream-contrast font-display">500+</p>
                        <p className="text-xs text-on-surface-variant uppercase tracking-widest">Events Completed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 px-6 lg:px-20 bg-surface-container-lowest">
          <div className="max-w-[1280px] mx-auto">
            <AnimatedSection>
              <div className="text-center mb-16">
                <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-4 flex items-center gap-4 justify-center">
                  <span className="w-8 h-px bg-primary"></span> Why Choose Us <span className="w-8 h-px bg-primary"></span>
                </span>
                <h2 className="font-display text-cream-contrast text-3xl md:text-4xl font-semibold">
                  Elevating Events in Nepal
                </h2>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Sparkles, title: 'Creative Excellence', desc: 'We stage your dreams with customized exquisite decor that reflects your unique vision and style.' },
                { icon: Target, title: 'One-Stop Solution', desc: 'From decorations to photography, venue finding, catering, makeup, and sound systems — we handle everything.' },
                { icon: Heart, title: 'Passion & Precision', desc: 'Every event is crafted with meticulous attention to detail, ensuring a seamless blend of creativity.' },
                { icon: Users, title: 'Trusted by Hundreds', desc: 'Over 500 happy clients have trusted us with their most precious celebrations across Nepal.' },
                { icon: Star, title: 'Premium Quality', desc: 'We use only the finest materials and work with top vendors to deliver luxury experiences.' },
                { icon: Award, title: 'Expert Team', desc: 'Our professional team brings years of experience in event management and creative design.' },
              ].map((value, i) => (
                <AnimatedSection key={value.title} delay={i * 100}>
                  <div className="bg-surface p-8 rounded-xl border border-outline-variant/30 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 h-full">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                      <value.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display text-cream-contrast text-lg font-semibold mb-3">{value.title}</h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed">{value.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Specializations */}
        <section className="py-20 px-6 lg:px-20 bg-surface">
          <div className="max-w-[1280px] mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <h2 className="font-display text-cream-contrast text-3xl md:text-4xl font-semibold mb-4">What We Specialize In</h2>
                <p className="text-on-surface-variant max-w-2xl mx-auto">
                  Eleven:11 By NK is more than an event management company — it&apos;s an experience crafted to perfection.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                'Date Planner', 'Proposal Setup', 'Romantic Dinner', 'Birthday Party',
                'Pasni Ceremony', 'Wedding', 'Haldi Mehendi', 'Corporate Functions',
                'Inauguration Ceremony', 'DJ Lights & Sound',
              ].map((spec, i) => (
                <AnimatedSection key={spec} delay={i * 80}>
                  <div className="bg-surface-container-high p-5 rounded-lg border border-outline-variant/20 text-center hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
                    <p className="text-sm font-semibold text-cream-contrast">{spec}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      </main>
    </CustomerLayout>
  );
}
