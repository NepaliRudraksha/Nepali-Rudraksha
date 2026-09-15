'use client';

import { useState } from 'react';
import Image from '@/components/ImageKitImage';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmitted(true);
    setIsLoading(false);
  };

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Hero */}
      <section className="relative w-full py-20 bg-brand-primary text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image src="https://images.unsplash.com/photo-1517436073-3b1b16d9ec7c?q=80&w=2000&auto=format&fit=crop" alt="Background" fill className="object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <p className="text-brand-accent tracking-[0.2em] text-xs font-bold uppercase mb-4">Get in Touch</p>
          <h1 className="text-5xl font-serif font-bold mb-4">Contact Us</h1>
          <p className="text-gray-300 max-w-xl mx-auto">Have questions about Rudraksha? We would love to help you find the perfect bead for your spiritual journey.</p>
        </div>
      </section>

      <section className="w-full max-w-7xl mx-auto py-16 px-4 md:px-10 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-serif font-bold text-brand-primary mb-6">Reach Us</h2>
              <div className="space-y-6">
                {[
                  { icon: <Phone size={22} />, label: 'Phone', value: '+91 98765 43210', sub: 'Mon - Sat: 9AM - 7PM IST' },
                  { icon: <Mail size={22} />, label: 'Email', value: 'info@nepalirudraksha.com', sub: 'We reply within 24 hours' },
                  { icon: <MapPin size={22} />, label: 'Location', value: 'Kathmandu, Nepal', sub: 'Direct Himalayan sourcing' },
                  { icon: <Clock size={22} />, label: 'Business Hours', value: 'Mon - Sat: 9:00 AM - 7:00 PM', sub: 'Closed on Sundays & major festivals' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-brand-accent/10 rounded-lg flex items-center justify-center text-brand-accent flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs text-brand-muted uppercase tracking-wider font-bold mb-0.5">{item.label}</p>
                      <p className="font-semibold text-brand-primary">{item.value}</p>
                      <p className="text-xs text-brand-muted mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="font-bold text-green-800 mb-2">💬 Chat on WhatsApp</h3>
              <p className="text-sm text-green-700 mb-4">For quick queries, consultations, or custom orders, reach us on WhatsApp.</p>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-md transition-colors text-sm">
                Chat Now
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-brand-border rounded-2xl p-8 shadow-sm">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle size={40} className="text-green-600" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-brand-primary mb-3">Message Sent!</h3>
                  <p className="text-brand-muted max-w-md">Thank you for reaching out, {formData.name}! Our spiritual advisors will get back to you within 24 hours.</p>
                  <button 
                    onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                    className="mt-8 bg-brand-accent text-brand-primary font-bold px-6 py-2.5 rounded-md hover:bg-brand-accent-hover transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-serif font-bold text-brand-primary mb-6">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-brand-primary mb-1.5" htmlFor="contact-name">Full Name *</label>
                        <input
                          id="contact-name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Your full name"
                          className="w-full border border-brand-border rounded-lg px-4 py-3 text-sm outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors bg-brand-bg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-brand-primary mb-1.5" htmlFor="contact-email">Email Address *</label>
                        <input
                          id="contact-email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="your@email.com"
                          className="w-full border border-brand-border rounded-lg px-4 py-3 text-sm outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors bg-brand-bg"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-brand-primary mb-1.5" htmlFor="contact-phone">Phone Number</label>
                        <input
                          id="contact-phone"
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 xxxxx xxxxx"
                          className="w-full border border-brand-border rounded-lg px-4 py-3 text-sm outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors bg-brand-bg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-brand-primary mb-1.5" htmlFor="contact-subject">Subject *</label>
                        <select
                          id="contact-subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full border border-brand-border rounded-lg px-4 py-3 text-sm outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors bg-brand-bg"
                        >
                          <option value="">Select a subject</option>
                          <option value="product-inquiry">Product Inquiry</option>
                          <option value="custom-order">Custom Mala / Order</option>
                          <option value="spiritual-consultation">Spiritual Consultation</option>
                          <option value="order-status">Order Status / Tracking</option>
                          <option value="return-refund">Return & Refund</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-brand-primary mb-1.5" htmlFor="contact-message">Message *</label>
                      <textarea
                        id="contact-message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Tell us how we can help you on your spiritual journey..."
                        className="w-full border border-brand-border rounded-lg px-4 py-3 text-sm outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors bg-brand-bg resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-brand-primary hover:bg-[#1a251d] text-white font-bold py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {isLoading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full bg-brand-light py-16 px-4 md:px-10 lg:px-20 border-t border-brand-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-brand-muted text-xs tracking-[0.2em] uppercase font-bold mb-2">Frequently Asked</p>
            <h2 className="text-3xl font-serif font-bold text-brand-primary">Quick Answers</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: 'Are your Rudrakshas 100% authentic?', a: 'Yes, absolutely. All our Rudraksha beads are sourced directly from Nepal and Indonesia and come with lab certification from accredited gemological laboratories. We guarantee their authenticity.' },
              { q: 'How do I know which Rudraksha is right for me?', a: 'Our spiritual advisors can guide you based on your date of birth, life goals, and specific needs. You can contact us via WhatsApp or email for a free consultation.' },
              { q: 'Do you ship internationally?', a: 'Yes, we ship to over 50 countries worldwide. International orders are fully insured and tracked. Delivery typically takes 7-14 business days.' },
              { q: 'How are Rudrakshas energized?', a: 'Before dispatch, every Rudraksha is cleansed with Panchamrit (five sacred ingredients) and energized with specific Vedic mantras by our in-house pandit, as per traditional Hindu scripture.' },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-brand-border">
                <h3 className="font-bold text-brand-primary mb-2">{faq.q}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
