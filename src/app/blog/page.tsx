import Image from '@/components/ImageKitImage';
import Link from 'next/link';
import { Clock, ArrowRight, Tag } from 'lucide-react';

export const metadata = {
  title: 'Spiritual Insights | Nepali Rudraksha Blog',
  description: 'Explore our blog for in-depth articles on Rudraksha, spirituality, meditation, and living a balanced life guided by ancient Himalayan wisdom.',
};

const blogPosts = [
  {
    id: 'power-of-5-mukhi-rudraksha',
    title: 'The Power of 5 Mukhi Rudraksha: Your Complete Guide',
    excerpt: 'The 5 Mukhi Rudraksha is the most versatile and widely worn Rudraksha bead. Learn about its profound spiritual benefits, who should wear it, and how to care for this sacred bead.',
    category: 'Product Guide',
    readTime: '6 min read',
    date: 'September 8, 2026',
    image: '/images/rudraksha_bead_close_1789219796219.jpg',
    featured: true,
  },
  {
    id: 'how-to-wear-rudraksha',
    title: 'How to Wear Rudraksha: The Right Way According to Vedic Science',
    excerpt: 'There is an exact science to how Rudraksha should be worn to maximize its spiritual benefits. From threading methods to the day to begin wearing — a comprehensive guide.',
    category: 'Spiritual Guide',
    readTime: '8 min read',
    date: 'September 2, 2026',
    image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=600&auto=format&fit=crop',
    featured: true,
  },
  {
    id: 'rudraksha-and-chakras',
    title: 'Rudraksha and the Seven Chakras: A Divine Connection',
    excerpt: 'Different Mukhi Rudrakshas are associated with different chakras. Discover which Rudraksha activates which energy center in your body and how to use them for chakra healing.',
    category: 'Spirituality',
    readTime: '10 min read',
    date: 'August 25, 2026',
    image: 'https://images.unsplash.com/photo-1617791160536-598cf32026fb?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'gaurishankar-for-relationships',
    title: 'Gaurishankar Rudraksha: The Secret to Harmonious Relationships',
    excerpt: 'The Gaurishankar Rudraksha, representing the divine union of Shiva and Parvati, is revered as the most powerful bead for love and relationships. Here is everything you need to know.',
    category: 'Product Guide',
    readTime: '5 min read',
    date: 'August 18, 2026',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'spotting-fake-rudraksha',
    title: '5 Ways to Spot a Fake Rudraksha Bead',
    excerpt: 'The market is unfortunately flooded with fake Rudraksha beads. As a buyer, it is crucial to know how to identify an authentic bead. We share 5 tried-and-tested methods.',
    category: 'Buyer\'s Guide',
    readTime: '7 min read',
    date: 'August 10, 2026',
    image: 'https://images.unsplash.com/photo-1528721074744-93be9f627a6f?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'meditation-with-rudraksha-mala',
    title: 'Japa Meditation with a Rudraksha Mala: A Beginner\'s Guide',
    excerpt: 'Using a Rudraksha Mala for Japa meditation is one of the most powerful spiritual practices. Learn the correct technique, mantras to chant, and how to maintain your Mala.',
    category: 'Meditation',
    readTime: '9 min read',
    date: 'July 30, 2026',
    image: 'https://images.unsplash.com/photo-1616428236166-410a56e5223c?q=80&w=600&auto=format&fit=crop',
  },
];

const categories = ['All', 'Product Guide', 'Spirituality', 'Meditation', 'Buyer\'s Guide', 'Spiritual Guide'];

const categoryColors: Record<string, string> = {
  'Product Guide': 'bg-blue-100 text-blue-700',
  'Spirituality': 'bg-purple-100 text-purple-700',
  'Meditation': 'bg-green-100 text-green-700',
  "Buyer's Guide": 'bg-orange-100 text-orange-700',
  'Spiritual Guide': 'bg-amber-100 text-amber-700',
};

export default function Blog() {
  const featured = blogPosts.filter(p => p.featured);
  const regular = blogPosts.filter(p => !p.featured);

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Hero */}
      <section className="w-full bg-brand-primary text-white py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image src="https://images.unsplash.com/photo-1517436073-3b1b16d9ec7c?q=80&w=2000&auto=format&fit=crop" alt="Background" fill className="object-cover" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4">
          <p className="text-brand-accent tracking-[0.2em] text-xs font-bold uppercase mb-4">Knowledge & Wisdom</p>
          <h1 className="text-5xl font-serif font-bold mb-4">Spiritual Insights</h1>
          <p className="text-gray-300 max-w-xl mx-auto">Articles on Rudraksha, meditation, chakras, and Himalayan spirituality — from our experts to your heart.</p>
        </div>
      </section>

      {/* Category Filters (visual only — categories shown as badges on posts) */}
      <section className="w-full border-b border-brand-border bg-white sticky top-[0] z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex gap-3 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border border-brand-border hover:bg-brand-accent hover:text-brand-primary hover:border-brand-accent transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <div className="w-full max-w-7xl mx-auto py-12 px-4 md:px-8">
        {/* Featured Posts */}
        <div className="mb-16">
          <p className="text-brand-muted text-xs tracking-[0.2em] uppercase font-bold mb-6">Featured Articles</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featured.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`} className="group bg-white border border-brand-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative h-56 overflow-hidden">
                  <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 ${categoryColors[post.category] || 'bg-gray-100 text-gray-700'}`}>
                      <Tag size={11} />
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-brand-muted mb-3">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Clock size={12} />{post.readTime}</span>
                  </div>
                  <h2 className="font-serif font-bold text-xl text-brand-primary mb-3 group-hover:text-brand-secondary transition-colors leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-brand-muted text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                  <div className="mt-4 flex items-center text-brand-accent text-sm font-bold">
                    Read Article <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* All Other Posts */}
        <div>
          <p className="text-brand-muted text-xs tracking-[0.2em] uppercase font-bold mb-6">More Articles</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regular.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`} className="group bg-white border border-brand-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative h-44 overflow-hidden">
                  <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${categoryColors[post.category] || 'bg-gray-100 text-gray-700'}`}>
                      <Tag size={10} />
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-brand-muted mb-2">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Clock size={11} />{post.readTime}</span>
                  </div>
                  <h3 className="font-bold text-brand-primary mb-2 group-hover:text-brand-secondary transition-colors leading-tight line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-brand-muted text-xs leading-relaxed line-clamp-2">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="mt-20 bg-brand-primary text-white rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-serif font-bold text-brand-accent mb-3">Stay Spiritually Informed</h2>
          <p className="text-gray-300 mb-8 max-w-lg mx-auto">Subscribe to our newsletter and receive fresh insights on Rudraksha, spirituality, and exclusive offers — directly in your inbox.</p>
          <div className="flex max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email..." 
              className="flex-1 px-4 py-3 text-sm rounded-l-lg text-brand-text outline-none border-0"
            />
            <button className="bg-brand-accent hover:bg-brand-accent-hover text-brand-primary font-bold px-6 py-3 rounded-r-lg transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
