'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CustomerLayout from '@/components/customer/CustomerLayout';
import VenueModal from '@/components/customer/VenueModal';
import { destinations, venueTypeIcons, Venue } from '@/lib/data/destinations';
import CustomDropdown from '@/components/ui/CustomDropdown';
import MultiDatePicker from '@/components/ui/MultiDatePicker';
import { getPlannerCompletedWhatsAppMessage } from '@/lib/utils';

interface EventType {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

const FALLBACK_EVENT_TYPES: EventType[] = [
  { id: 'wedding-decoration', name: 'Wedding', slug: 'wedding-decoration', description: null, image: null },
  { id: 'birthday-decoration', name: 'Birthday', slug: 'birthday-decoration', description: null, image: null },
  { id: 'pasni-decoration', name: 'Pasni', slug: 'pasni-decoration', description: null, image: null },
  { id: 'anniversary-decoration', name: 'Anniversary', slug: 'anniversary-decoration', description: null, image: null },
  { id: 'haldi-decoration', name: 'Haldi', slug: 'haldi-decoration', description: null, image: null },
  { id: 'mehendi-decoration', name: 'Mehendi', slug: 'mehendi-decoration', description: null, image: null },
  { id: 'engagement-decoration', name: 'Engagement', slug: 'engagement-decoration', description: null, image: null },
  { id: 'proposal-setup', name: 'Proposal', slug: 'proposal-setup', description: null, image: null },
  { id: 'baby-shower-decoration', name: 'Baby Shower', slug: 'baby-shower-decoration', description: null, image: null },
  { id: 'corporate-event-decoration', name: 'Corporate Event', slug: 'corporate-event-decoration', description: null, image: null },
];

function EventPlannerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedType = searchParams.get('type');
  const preSelectedDestination = searchParams.get('destination');
  const preSelectedDates = searchParams.get('dates');
  const preSelectedGuests = searchParams.get('guests');

  const [currentStep, setCurrentStep] = useState(1);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [selectedVenueName, setSelectedVenueName] = useState<string>('');
  const [modalVenue, setModalVenue] = useState<Venue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openVenueModal = (venue: Venue) => {
    setModalVenue(venue);
    setIsModalOpen(true);
  };

  const closeVenueModal = () => {
    setIsModalOpen(false);
    setModalVenue(null);
  };

  const [formData, setFormData] = useState({
    eventTypeId: '',
    eventTypeName: '',
    eventName: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    eventDates: [] as string[],
    startTime: '',
    endTime: '',
    venue: '',
    venueAddress: '',
    guestCount: '',
    budgetRange: '',
    specialRequests: '',
    selectedComponents: [] as string[],
  });

  const fetchPlannerData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/planner/data');
      const data = await response.json();
      const availableEventTypes = data.eventTypes?.length ? data.eventTypes : FALLBACK_EVENT_TYPES;
      setEventTypes(availableEventTypes);
      if (preSelectedType) {
        const selected = availableEventTypes.find((t: EventType) => t.name === preSelectedType || t.slug === preSelectedType);
        if (selected) {
          setFormData(prev => ({ ...prev, eventTypeId: selected.id, eventTypeName: selected.name }));
        }
      }
      if (preSelectedDestination) {
        const selected = destinations.find(destination => destination.id === preSelectedDestination);
        if (selected) {
          setSelectedDestination(selected.id);
          setFormData(prev => ({ ...prev, venue: selected.name, venueAddress: '' }));
        }
      }
      const initialDates = preSelectedDates
        ? preSelectedDates.split(',').filter(date => /^\d{4}-\d{2}-\d{2}$/.test(date))
        : [];
      if (initialDates.length > 0 || preSelectedGuests) {
        setFormData(prev => ({
          ...prev,
          ...(initialDates.length > 0 ? { eventDates: initialDates } : {}),
          ...(preSelectedGuests ? { guestCount: preSelectedGuests } : {}),
        }));
      }
    } catch (error) {
      console.error('Failed to load planner data:', error);
      setEventTypes(FALLBACK_EVENT_TYPES);
    } finally {
      setLoading(false);
    }
  }, [preSelectedDates, preSelectedDestination, preSelectedGuests, preSelectedType]);

  useEffect(() => {
    fetchPlannerData();
  }, [fetchPlannerData]);

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/planner/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        const whatsappMessage = getPlannerCompletedWhatsAppMessage({ ...formData, eventId: result.eventId });
        window.sessionStorage.setItem('planner-whatsapp-message', whatsappMessage);
        router.push(`/thank-you?eventId=${encodeURIComponent(result.eventId)}&whatsapp=${encodeURIComponent(whatsappMessage)}`);
      } else {
        setIsSubmitting(false);
        alert(result.error || 'Failed to submit request. Please try again.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setIsSubmitting(false);
      alert('Something went wrong. Please try again.');
    }
  };

  const steps = [
    { number: 1, name: 'Basics' },
    { number: 2, name: 'Destination' },
    { number: 3, name: 'Details' },
    { number: 4, name: 'Review' },
  ];

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center min-h-screen bg-surface">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-on-surface-variant">Loading event planner...</p>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <main className="w-full min-h-screen bg-surface pt-20">
        <div className="flex flex-col w-full relative min-h-[800px]">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[100px] pointer-events-none translate-x-1/4 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-champagne-gold/5 rounded-full blur-[80px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

          <div className="max-w-[1280px] mx-auto w-full px-4 sm:px-6 py-10 sm:py-14 lg:py-20 relative z-10 flex flex-col lg:flex-row gap-10 lg:gap-6">
            {/* Main Form Area */}
            <div className="flex-1 flex flex-col gap-10 sm:gap-16 min-w-0">
              {/* Header */}
              <div className="flex flex-col gap-4 max-w-2xl">
                <h1 className="font-display text-on-surface text-3xl sm:text-4xl md:text-5xl font-semibold">Curate Your Masterpiece</h1>
                <p className="text-secondary text-base sm:text-lg">
                  Tell us about your vision. Our meticulous planning process begins here, ensuring every detail reflects your unique narrative.
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center gap-2 sm:gap-4 w-full">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className="flex-1 flex flex-col gap-2 relative group cursor-pointer"
                    onClick={() => setCurrentStep(step.number)}
                  >
                    <div className={`h-0.5 w-full relative overflow-hidden ${currentStep >= step.number ? 'bg-primary' : 'bg-surface-container-high'}`}>
                      <div
                        className="absolute inset-0 bg-primary origin-left transition-transform duration-500"
                        style={{ transform: currentStep >= step.number ? 'scaleX(1)' : 'scaleX(0)' }}
                      ></div>
                    </div>
                    <span className={`text-[9px] sm:text-xs font-bold uppercase tracking-[0.08em] sm:tracking-widest ${currentStep >= step.number ? 'text-primary' : 'text-on-surface-variant'}`}>
                      0{step.number}. {step.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Form Container */}
              <div className="relative min-h-[400px] bg-charcoal-surface rounded-xl border border-outline-variant/30 p-4 sm:p-6 lg:p-20 overflow-hidden shadow-xl">
                {/* Step 1: Basics */}
                {currentStep === 1 && (
                  <div className="flex flex-col gap-8 animate-in fade-in">
                    <h2 className="font-display text-cream-contrast text-2xl md:text-3xl font-semibold">Event Fundamentals</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <CustomDropdown
                        label="Event Type"
                        icon="🎉"
                        value={formData.eventTypeId}
                        onChange={(val) => {
                          const selected = eventTypes.find(eventType => eventType.id === val);
                          setFormData({ ...formData, eventTypeId: val, eventTypeName: selected?.name || '' });
                        }}
                        placeholder="Select Event Type"
                        options={eventTypes.map(eventType => ({
                          value: eventType.id,
                          label: eventType.name,
                          sublabel: eventType.description || undefined,
                        }))}
                      />
                      <div className="flex flex-col relative">
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          <span className="text-sm">👥</span> Expected Guests
                        </label>
                        <input
                          type="text"
                          value={formData.guestCount}
                          onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                          className="w-full bg-surface-container-lowest text-on-surface py-4 px-4 rounded-lg border border-outline-variant/60 focus:border-primary focus:outline-none transition-colors text-base"
                          placeholder="e.g., 200 guests"
                        />
                      </div>
                    </div>
                    <MultiDatePicker
                      label="Preferred Dates"
                      icon="📅"
                      selectedDates={formData.eventDates}
                      onChange={(dates) => setFormData({ ...formData, eventDates: dates })}
                      placeholder="Select your preferred dates..."
                    />
                    <div className="mt-auto pt-8 flex justify-end">
                      <button
                        onClick={nextStep}
                        disabled={!formData.eventTypeId}
                        className="bg-primary text-on-primary text-base font-semibold py-3 px-8 rounded hover:bg-primary-fixed transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        Continue to Destination <span>→</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Destination */}
                {currentStep === 2 && (
                  <div className="flex flex-col gap-8 animate-in fade-in">
                    <h2 className="font-display text-cream-contrast text-2xl md:text-3xl font-semibold">Select Destination</h2>
                    {/* Destination Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {destinations.map((dest) => (
                        <div
                          key={dest.id}
                          onClick={() => {
                            setFormData({ ...formData, venue: dest.name, venueAddress: '' });
                            setSelectedDestination(dest.id);
                            setSelectedVenueName('');
                          }}
                          className={`relative group cursor-pointer h-64 rounded-lg overflow-hidden border transition-all duration-300 ${formData.venue === dest.name ? 'border-primary shadow-lg shadow-primary/20' : 'border-outline-variant hover:border-primary/50 hover:shadow-md'}`}
                        >
                          <div className="bg-cover bg-center w-full h-full absolute inset-0 transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${dest.image}')` }}></div>
                          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent"></div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-cream-contrast text-base font-semibold mb-1">{dest.name}</h3>
                            <p className="text-primary text-xs font-bold uppercase tracking-widest">{dest.subtitle}</p>
                          </div>
                          {formData.venue === dest.name && (
                            <div className="absolute top-4 right-4 w-6 h-6 rounded-full border border-primary flex items-center justify-center bg-primary/20">
                              <span className="text-primary text-sm">✓</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Venue Suggestions for Selected Destination */}
                    {selectedDestination && (
                      <div className="mt-2 animate-in fade-in">
                        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                          <span className="w-6 h-px bg-primary"></span>
                          Popular Venues in {destinations.find(d => d.id === selectedDestination)?.name}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {destinations.find(d => d.id === selectedDestination)?.venues.map((venue) => (
                            <div
                              key={venue.name}
                              className={`relative text-left p-4 rounded-lg border transition-all duration-300 ${selectedVenueName === venue.name ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-outline-variant/30 hover:border-primary/50 bg-surface-container-lowest/50'}`}
                            >
                              <div className="flex items-start gap-3">
                                <span className="text-lg mt-0.5">{venueTypeIcons[venue.type]}</span>
                                <div className="flex-1 min-w-0">
                                  <h5 className="text-sm font-semibold text-cream-contrast truncate flex items-center gap-2">
                                    {venue.name}
                                    {selectedVenueName === venue.name && <span className="text-primary text-xs">✓</span>}
                                  </h5>
                                  <p className="text-xs text-on-surface-variant mt-0.5">{venue.location}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-primary font-medium">{venue.capacity} pax</span>
                                    <span className="text-xs text-on-surface-variant/40">•</span>
                                    <span className="text-xs text-on-surface-variant/60">{venue.priceRange}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 mt-3">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedVenueName(venue.name);
                                    setFormData({ ...formData, venueAddress: venue.name });
                                  }}
                                  className={`flex-1 text-xs font-semibold py-2 px-3 rounded transition-colors ${selectedVenueName === venue.name ? 'bg-primary text-surface' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/50'}`}
                                >
                                  {selectedVenueName === venue.name ? '✓ Selected' : 'Select Venue'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openVenueModal(venue)}
                                  className="text-xs font-semibold py-2 px-3 rounded border border-outline-variant/50 text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
                                >
                                  Details →
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Manual Venue Entry */}
                    <div className="flex flex-col gap-2 mt-4">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Or Enter Venue Manually</label>
                      <input
                        type="text"
                        value={formData.venueAddress}
                        onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
                        className="w-full bg-surface-container-lowest text-on-surface py-4 px-4 border-b border-primary/30 focus:border-primary focus:outline-none transition-colors text-lg"
                        placeholder="e.g., Soaltee Hotel Crown Plaza"
                      />
                    </div>

                    <div className="mt-auto pt-8 flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
                      <button onClick={prevStep} className="text-on-surface-variant text-base font-semibold py-3 px-8 rounded border border-outline-variant hover:border-primary hover:text-primary transition-colors">
                        ← Back
                      </button>
                      <button onClick={nextStep} className="bg-primary text-on-primary text-base font-semibold py-3 px-8 rounded hover:bg-primary-fixed transition-colors flex items-center gap-2">
                        Continue to Details <span>→</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Details */}
                {currentStep === 3 && (
                  <div className="flex flex-col gap-8 animate-in fade-in">
                    <h2 className="font-display text-cream-contrast text-2xl md:text-3xl font-semibold">Your Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Your Name *</label>
                        <input
                          type="text"
                          value={formData.customerName}
                          onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                          className="w-full bg-surface-container-lowest text-on-surface py-4 px-4 border-b border-primary/30 focus:border-primary focus:outline-none transition-colors text-lg"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Email Address *</label>
                        <input
                          type="email"
                          value={formData.customerEmail}
                          onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                          className="w-full bg-surface-container-lowest text-on-surface py-4 px-4 border-b border-primary/30 focus:border-primary focus:outline-none transition-colors text-lg"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Phone Number *</label>
                        <input
                          type="tel"
                          value={formData.customerPhone}
                          onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                          className="w-full bg-surface-container-lowest text-on-surface py-4 px-4 border-b border-primary/30 focus:border-primary focus:outline-none transition-colors text-lg"
                          placeholder="+977-9800000000"
                          required
                        />
                      </div>
                      <CustomDropdown
                        label="Budget Range"
                        icon="💰"
                        value={formData.budgetRange}
                        onChange={(val) => setFormData({ ...formData, budgetRange: val })}
                        placeholder="Select budget range"
                        options={[
                          { value: 'under-50k', label: 'Under Rs. 50,000', icon: '💵' },
                          { value: '50k-100k', label: 'Rs. 50,000 - 1,00,000', icon: '💵💵' },
                          { value: '100k-200k', label: 'Rs. 1,00,000 - 2,00,000', icon: '💰' },
                          { value: '200k-plus', label: 'Rs. 2,00,000+', icon: '💎' },
                        ]}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Special Requests or Notes</label>
                      <textarea
                        value={formData.specialRequests}
                        onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                        className="w-full bg-surface-container-lowest text-on-surface py-4 px-4 border-b border-primary/30 focus:border-primary focus:outline-none transition-colors text-lg"
                        rows={4}
                        placeholder="Tell us any specific requirements, preferences, or ideas..."
                      />
                    </div>
                    <div className="mt-auto pt-8 flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
                      <button onClick={prevStep} className="text-on-surface-variant text-base font-semibold py-3 px-8 rounded border border-outline-variant hover:border-primary hover:text-primary transition-colors">
                        ← Back
                      </button>
                      <button onClick={nextStep} className="bg-primary text-on-primary text-base font-semibold py-3 px-8 rounded hover:bg-primary-fixed transition-colors flex items-center gap-2">
                        Review Request <span>→</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Review */}
                {currentStep === 4 && (
                  <div className="flex flex-col gap-8 animate-in fade-in">
                    <h2 className="font-display text-cream-contrast text-2xl md:text-3xl font-semibold">Review Your Request</h2>

                    <div className="space-y-4">
                      <div className="bg-surface-container-low p-6 rounded-lg border border-outline-variant">
                        <h3 className="font-semibold text-cream-contrast mb-3">Event Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div><span className="text-on-surface-variant">Event Type:</span> <strong className="text-on-surface">{formData.eventTypeName}</strong></div>
                          <div><span className="text-on-surface-variant">Dates:</span> <strong className="text-on-surface">{formData.eventDates.length > 0 ? formData.eventDates.join(', ') : 'Not specified'}</strong></div>
                          <div><span className="text-on-surface-variant">Venue:</span> <strong className="text-on-surface">{formData.venue}</strong></div>
                          <div><span className="text-on-surface-variant">Guests:</span> <strong className="text-on-surface">{formData.guestCount || 'Not specified'}</strong></div>
                        </div>
                      </div>

                      <div className="bg-surface-container-low p-6 rounded-lg border border-outline-variant">
                        <h3 className="font-semibold text-cream-contrast mb-3">Contact Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div><span className="text-on-surface-variant">Name:</span> <strong className="text-on-surface">{formData.customerName}</strong></div>
                          <div><span className="text-on-surface-variant">Email:</span> <strong className="text-on-surface">{formData.customerEmail}</strong></div>
                          <div><span className="text-on-surface-variant">Phone:</span> <strong className="text-on-surface">{formData.customerPhone}</strong></div>
                        </div>
                      </div>

                    </div>

                    <div className="bg-surface-container-high border border-primary/30 p-4 rounded-lg">
                      <p className="text-sm text-on-surface">
                        <strong className="text-primary">What happens next?</strong> Our team will review your request and send you a detailed quotation within 24 hours.
                      </p>
                    </div>

                    <div className="mt-auto pt-8 flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
                      <button onClick={prevStep} className="text-on-surface-variant text-base font-semibold py-3 px-8 rounded border border-outline-variant hover:border-primary hover:text-primary transition-colors">
                        ← Back
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-primary text-on-primary text-base font-semibold py-3 px-8 rounded hover:bg-primary-fixed transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-wait disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="w-4 h-4 border-2 border-on-primary/40 border-t-on-primary rounded-full animate-spin" />
                            Sending request...
                          </>
                        ) : (
                          'Submit Request ✓'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Venue Detail Modal */}
      <VenueModal venue={modalVenue} isOpen={isModalOpen} onClose={closeVenueModal} />

    </CustomerLayout>
  );
}

export default function EventPlannerPage() {
  return (
    <Suspense
      fallback={
        <CustomerLayout>
          <div className="flex items-center justify-center min-h-screen bg-surface">
            <p className="text-on-surface-variant">Loading event planner...</p>
          </div>
        </CustomerLayout>
      }
    >
      <EventPlannerContent />
    </Suspense>
  );
}
