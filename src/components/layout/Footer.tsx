import Link from 'next/link';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { getSettings } from '@/lib/api';

export default async function Footer() {
  const settings = await getSettings();

  return (
    <footer className="bg-brand-primary text-brand-light font-sans mt-auto">
      {/* Top Banner */}
      <div className="bg-[#19251D]">
        <div className="max-w-7xl mx-auto py-4 px-4 md:px-10 lg:px-20 flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center text-brand-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <h3 className="font-serif text-brand-accent font-semibold text-base">Join Our Spiritual Community</h3>
            <p className="text-xs text-brand-border">Get updates on new arrivals, exclusive offers and spiritual insights.</p>
          </div>
        </div>
        <div className="flex w-full md:w-auto">
          <input 
            type="email" 
            placeholder="Enter your email address" 
            className="px-4 py-2 text-brand-text bg-white outline-none w-full md:w-64"
          />
          <button className="bg-brand-accent text-brand-primary font-semibold px-4 py-2 hover:bg-brand-accent-hover transition-colors">
            Subscribe &rarr;
          </button>
        </div>
        <div className="hidden lg:block font-serif text-brand-accent italic ml-8">
          "Good Things Take Faith"
        </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto py-12 px-4 md:px-10 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Brand Info */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-brand-accent rounded-full flex items-center justify-center text-brand-primary font-serif font-bold text-xl">
              NR
            </div>
            <div>
              <h1 className="font-serif font-bold text-xl text-brand-accent leading-tight">NEPALI</h1>
              <h1 className="font-serif font-bold text-xl text-brand-accent leading-tight">RUDRAKSHA</h1>
              <p className="text-[10px] text-brand-border tracking-widest">DIVINE BEADS. BETTER LIFE.</p>
            </div>
          </Link>
          <div className="flex space-x-4 pt-4">
            <a href="#" className="w-8 h-8 rounded-full bg-[#19251D] flex items-center justify-center hover:bg-brand-accent hover:text-brand-primary transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-[#19251D] flex items-center justify-center hover:bg-brand-accent hover:text-brand-primary transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-[#19251D] flex items-center justify-center hover:bg-brand-accent hover:text-brand-primary transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-serif font-bold text-brand-accent text-lg mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-brand-border">
            <li><Link href="/" className="hover:text-brand-accent transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-brand-accent transition-colors">About Us</Link></li>
            <li><Link href="/shop" className="hover:text-brand-accent transition-colors">Shop</Link></li>
            <li><Link href="/types" className="hover:text-brand-accent transition-colors">Rudraksha Types</Link></li>
            <li><Link href="/accessories" className="hover:text-brand-accent transition-colors">Accessories</Link></li>
            <li><Link href="/blog" className="hover:text-brand-accent transition-colors">Blog</Link></li>
            <li><Link href="/contact" className="hover:text-brand-accent transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Our Services */}
        <div>
          <h4 className="font-serif font-bold text-brand-accent text-lg mb-4">Our Services</h4>
          <ul className="space-y-2 text-sm text-brand-border">
            <li><Link href="/shop" className="hover:text-brand-accent transition-colors">Original Beads</Link></li>
            <li><Link href="/custom" className="hover:text-brand-accent transition-colors">Custom Malas</Link></li>
            <li><Link href="/pendants" className="hover:text-brand-accent transition-colors">Pendants</Link></li>
            <li><Link href="/consultation" className="hover:text-brand-accent transition-colors">Spiritual Consultation</Link></li>
            <li><Link href="/shipping" className="hover:text-brand-accent transition-colors">Worldwide Shipping</Link></li>
            <li><Link href="/track" className="hover:text-brand-accent transition-colors">Track Order</Link></li>
            <li><Link href="/returns" className="hover:text-brand-accent transition-colors">Return & Refund</Link></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h4 className="font-serif font-bold text-brand-accent text-lg mb-4">Contact Us</h4>
          <ul className="space-y-4 text-sm text-brand-border">
            <li className="flex items-start space-x-3">
              <Phone size={18} className="text-brand-accent mt-0.5" />
              <span>{settings.store_phone}</span>
            </li>
            <li className="flex items-start space-x-3">
              <Mail size={18} className="text-brand-accent mt-0.5" />
              <span>{settings.store_email}</span>
            </li>
            <li className="flex items-start space-x-3">
              <MapPin size={18} className="text-brand-accent mt-0.5" />
              <span>{settings.store_address.split(',').map((part, i) => <span key={i}>{part}<br/></span>)}</span>
            </li>
            <li className="flex items-start space-x-3">
              <Clock size={18} className="text-brand-accent mt-0.5" />
              <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="bg-[#151f18]">
        <div className="max-w-7xl mx-auto py-4 px-4 md:px-10 lg:px-20 flex flex-col md:flex-row justify-between items-center text-xs text-brand-border">
          <p>&copy; 2026 Nepali Rudraksha. All Rights Reserved.</p>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <Link href="/privacy" className="hover:text-brand-accent transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-brand-accent transition-colors">Terms & Conditions</Link>
        </div>
        </div>
      </div>
    </footer>
  );
}
