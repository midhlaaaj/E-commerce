import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#F9FAFB] pt-20 pb-10 px-6 border-t border-gray-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        {/* Brand & Social */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black flex items-center justify-center rounded-sm">
              <span className="text-white font-bold text-xl italic">E</span>
            </div>
            <span className="font-heading font-bold text-xl tracking-tighter">ELITEWEAR</span>
          </div>
          <p className="text-xs text-gray-500 max-w-[240px] leading-relaxed">
            Premium clothing brand designed for minimalist aesthetics, quality and sustainable fashion selection for the modern minimalist.
          </p>
          <div className="flex gap-4">
            {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-full hover:bg-black hover:text-white transition-colors">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Collections */}
        <div className="space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#D97706]">COLLECTIONS</h4>
          <ul className="space-y-4 text-xs font-semibold text-gray-500">
            {['Winter 2024', 'Linen Essentials', 'Premium Denim', 'Handmade Series'].map((link) => (
              <li key={link}><Link href="#" className="hover:text-black transition-colors">{link}</Link></li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div className="space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#D97706]">SUPPORT</h4>
          <ul className="space-y-4 text-xs font-semibold text-gray-500">
            {['Shipping & Returns', 'Track Order', 'Size Guide', 'Contact Us'].map((link) => (
              <li key={link}><Link href="#" className="hover:text-black transition-colors">{link}</Link></li>
            ))}
          </ul>
        </div>

        {/* Flagship Store */}
        <div className="space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#D97706]">FLAGSHIP STORE</h4>
          <p className="text-xs font-semibold text-gray-500 leading-relaxed">
            123 Fashion Avenue, Suite 500<br />
            Manhattan, New York 10001
          </p>
          <div className="w-full h-32 bg-gray-200 rounded-xl overflow-hidden grayscale">
            {/* Mock map image */}
            <div className="w-full h-full bg-slate-300 flex items-center justify-center text-xs font-bold text-gray-400">
               MAP VIEW
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-10 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
        <p>© 2024 ELITEWEAR. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8">
          <Link href="#" className="hover:text-black">PRIVACY POLICY</Link>
          <Link href="#" className="hover:text-black">TERMS OF SERVICE</Link>
        </div>
      </div>
    </footer>
  );
};
