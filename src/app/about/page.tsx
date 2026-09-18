import Image from '@/components/ImageKitImage';
import Link from 'next/link';
import { Shield, Award, Heart, Globe, Star, Check } from 'lucide-react';

export const metadata = {
  title: 'About Us | Nepali Rudraksha',
  description: 'Learn about our journey of bringing authentic, lab-certified Rudraksha beads from the Himalayas of Nepal to the world.',
};

export default function About() {
  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Hero */}
      <section className="relative w-full py-24 bg-brand-primary text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image src="/images/banner/ChatGPT%20Image%20Sep%2018%2C%202026%2C%2007_01_56%20PM.png" alt="Himalayan background" fill className="object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-10 lg:px-20 text-center">
          <p className="text-brand-accent tracking-[0.2em] text-xs font-bold uppercase mb-4">Our Story</p>
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">Where Divinity<br/>Meets Authenticity</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Born from a deep reverence for Himalayan traditions, Nepali Rudraksha is dedicated to sourcing and delivering the most genuine, powerful Rudraksha beads directly to your doorstep.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="w-full max-w-7xl mx-auto py-20 px-4 md:px-10 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative h-[450px] rounded-2xl overflow-hidden border-2 border-brand-accent/20 shadow-xl">
            <Image 
              src="/images/handpicked_for_spiritual/WhatsApp%20Image%202026-09-18%20at%205.15.52%20PM.jpeg"
              alt="Our Founder" 
              fill 
              className="object-cover" 
            />
          </div>
          <div>
            <p className="text-brand-accent text-xs tracking-[0.2em] font-bold uppercase mb-4">The Beginning</p>
            <h2 className="text-4xl font-serif font-bold text-brand-primary mb-6">Our Journey from the Himalayas</h2>
            <div className="space-y-4 text-brand-text leading-relaxed">
              <p>
                Nepali Rudraksha was founded with a single mission: to make 100% authentic Himalayan Rudraksha accessible to spiritual seekers everywhere. Our journey began in the sacred forests of Nepal, where Rudraksha trees have grown for thousands of years.
              </p>
              <p>
                We work directly with trusted collectors in Nepal, bypassing middlemen to ensure that every bead you receive is genuine, untreated, and energetically potent. Each bead is carefully inspected, counted for its Mukhis (facets), and sent to accredited laboratories for certification.
              </p>
              <p>
                Over the years, we have helped thousands of customers find their perfect Rudraksha — whether for spiritual growth, health, protection, or prosperity. This isn't just a business for us; it's our devotion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="w-full bg-brand-light py-20 px-4 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-brand-muted text-xs tracking-[0.2em] uppercase font-bold mb-2">What We Stand For</p>
            <h2 className="text-4xl font-serif font-bold text-brand-primary">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Shield size={32} />, title: 'Authenticity First', desc: 'We never compromise on the genuineness of our Rudraksha. Every bead is verified and lab-certified.' },
              { icon: <Award size={32} />, title: 'Quality Excellence', desc: 'Only the finest beads make it to our collection. We reject anything that does not meet our high standards.' },
              { icon: <Heart size={32} />, title: 'Spiritual Devotion', desc: 'We treat every Rudraksha with reverence. They are energized with Vedic mantras before being dispatched.' },
              { icon: <Globe size={32} />, title: 'Global Reach', desc: 'We ship worldwide, making Himalayan blessings accessible to spiritual seekers across every continent.' },
            ].map((value, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-brand-border hover:shadow-lg transition-all text-center">
                <div className="text-brand-accent mb-4 flex justify-center">{value.icon}</div>
                <h3 className="font-serif font-bold text-xl text-brand-primary mb-3">{value.title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="w-full max-w-7xl mx-auto py-20 px-4 md:px-10 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-brand-accent text-xs tracking-[0.2em] font-bold uppercase mb-4">Why Choose Us</p>
            <h2 className="text-4xl font-serif font-bold text-brand-primary mb-8">The Nepali Rudraksha Difference</h2>
            <div className="space-y-5">
              {[
                { title: 'Direct Source from Nepal', desc: 'We source directly from collectors in the Himalayan regions of Nepal, ensuring the highest quality and authenticity.' },
                { title: 'IGRMS Lab Certified', desc: 'All our Nepali beads come with a certificate from an accredited gemological laboratory verifying their authenticity and Mukhi count.' },
                { title: 'Expert Guidance', desc: 'Our team of Rudraksha experts can help you choose the right bead based on your birth chart, needs, and spiritual goals.' },
                { title: 'Vedic Energization', desc: 'Before dispatch, each Rudraksha is cleansed and energized by Vedic mantras by our in-house pandit.' },
                { title: 'Secure & Insured Shipping', desc: 'All orders are shipped in protective packaging with tracking. International orders are fully insured.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-brand-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={14} className="text-brand-secondary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-primary mb-1">{item.title}</h4>
                    <p className="text-brand-muted text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-[500px] rounded-2xl overflow-hidden border border-brand-border shadow-xl">
            <Image 
              src="/images/meditating_sadhu_mountains_1789219782503.jpg" 
              alt="Lab Certified Rudraksha" 
              fill 
              className="object-cover" 
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="w-full bg-brand-primary text-white py-16 px-4 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '10,000+', label: 'Happy Customers' },
            { value: '22+', label: 'Types of Rudraksha' },
            { value: '15+', label: 'Years of Experience' },
            { value: '50+', label: 'Countries Served' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-4xl md:text-5xl font-serif font-bold text-brand-accent mb-2">{stat.value}</div>
              <p className="text-gray-300 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials preview */}
      <section className="w-full max-w-7xl mx-auto py-16 px-4 md:px-10 lg:px-20">
        <div className="text-center mb-12">
          <p className="text-brand-muted text-xs tracking-[0.2em] uppercase font-bold mb-2">Customer Love</p>
          <h2 className="text-3xl font-serif font-bold text-brand-primary">What People Say About Us</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: 'Aditya Verma', location: 'Pune', rating: 5, text: 'I was skeptical at first, but after receiving the 14 Mukhi Rudraksha with the lab certificate, I was convinced of its authenticity. The quality is outstanding and customer service is excellent.' },
            { name: 'Lakshmi Nair', location: 'Chennai', rating: 5, text: 'Nepali Rudraksha has been my go-to source for the past 3 years. Every single bead I have ordered has been genuine. The Vedic energization is a lovely touch that sets them apart.' },
          ].map((review, i) => (
            <div key={i} className="bg-brand-light border border-brand-border rounded-xl p-8 text-left">
              <div className="flex items-center mb-4 justify-start">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={16} className={s <= review.rating ? 'fill-brand-accent text-brand-accent' : 'text-gray-300'} />
                ))}
              </div>
              <p className="text-brand-text mb-4">"{review.text}"</p>
              <div className="flex flex-col items-start">
                <p className="font-bold text-brand-primary">{review.name}</p>
                <p className="text-xs text-brand-muted">{review.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-brand-light border-t border-brand-border py-16 px-4 text-center">
        <h2 className="text-3xl font-serif font-bold text-brand-primary mb-4">Begin Your Spiritual Journey Today</h2>
        <p className="text-brand-muted mb-8 max-w-xl mx-auto">Explore our curated collection of authentic Rudraksha beads and find the one that resonates with your soul.</p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/shop" className="bg-brand-primary hover:bg-[#1a251d] text-white font-bold px-6 py-3 rounded-md transition-colors shadow-lg w-full sm:w-auto min-w-[160px] text-center">
            Shop Now
          </Link>
          <Link href="/contact" className="border-2 border-brand-primary text-brand-primary font-bold px-6 py-3 rounded-md hover:bg-brand-primary hover:text-white transition-colors w-full sm:w-auto min-w-[160px] text-center">
            Contact Us
          </Link>
        </div>
      </section>

    </div>
  );
}
