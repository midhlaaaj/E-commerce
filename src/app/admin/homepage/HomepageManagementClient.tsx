'use client';

import { useState } from 'react';
import { adminSupabase } from '@/lib/supabase';
import { uploadImage } from '@/lib/storage';
import { ImageCropper } from '@/components/admin/ImageCropper';
import { 
  Save, 
  Loader2, 
  Image as ImageIcon, 
  Home, 
  User, 
  UserPlus, 
  Baby,
  CheckCircle2,
  Upload,
  X,
  Quote,
  Smartphone
} from 'lucide-react';

interface HomepageContent {
  id: string;
  section_key: string;
  title: string;
  title_bold?: string;
  subtitle: string;
  image_url: string;
  mobile_image_url?: string;
  cta_text: string;
  cta_link: string;
  cta_secondary_text?: string;
  cta_secondary_link?: string;
}

const sectionIcons: Record<string, any> = {
  main_hero: Home,
  men_hero: User,
  women_hero: UserPlus,
  kids_hero: Baby,
  gender_men: User,
  gender_women: UserPlus,
  gender_kids: Baby,
  editorial_quote: Quote,
};

const sectionNames: Record<string, string> = {
  main_hero: 'Main Homepage Hero',
  men_hero: "Men's Collection Hero",
  women_hero: "Women's Collection Hero",
  kids_hero: "Kids' Collection Hero",
  gender_men: "Shop by Gender: Men",
  gender_women: "Shop by Gender: Women",
  gender_kids: "Shop by Gender: Kids",
  editorial_quote: "Editorial Quote",
};

export default function HomepageManagementClient({ initialData }: { initialData: HomepageContent[] }) {
  const [content, setContent] = useState<HomepageContent[]>(initialData);
  const [saving, setSaving] = useState<string | null>(null);
  const [savedStatus, setSavedStatus] = useState<string | null>(null);
  const [pendingFiles, setPendingFiles] = useState<Record<string, { 
    desktop: { file: File, preview: string },
    mobile: { file: File, preview: string }
  }>>({});
  const [croppingAsset, setCroppingAsset] = useState<{ sectionId: string; file: File; preview: string } | null>(null);

  const handleFileChange = (sectionId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setCroppingAsset({ sectionId, file, preview });
    }
    // Reset file input so selecting the same file again works
    e.target.value = '';
  };

  const handleCropComplete = (desktopFile: File, mobileFile: File, desktopPreview: string, mobilePreview: string) => {
    if (!croppingAsset) return;
    
    URL.revokeObjectURL(croppingAsset.preview);
    
    setPendingFiles(prev => ({
      ...prev,
      [croppingAsset.sectionId]: { 
        desktop: { file: desktopFile, preview: desktopPreview },
        mobile: { file: mobileFile, preview: mobilePreview }
      }
    }));
    
    setCroppingAsset(null);
  };

  async function handleUpdate(section: HomepageContent) {
    setSaving(section.id);
    try {
      let finalImageUrl = section.image_url;
      let finalMobileImageUrl = section.mobile_image_url;
      
      const pending = pendingFiles[section.id];
      if (pending) {
        // Upload both in parallel for efficiency
        const [desktopUrl, mobileUrl] = await Promise.all([
          uploadImage(pending.desktop.file, 'products'),
          uploadImage(pending.mobile.file, 'products')
        ]);
        
        finalImageUrl = desktopUrl;
        finalMobileImageUrl = mobileUrl;
        
        URL.revokeObjectURL(pending.desktop.preview);
        URL.revokeObjectURL(pending.mobile.preview);
      }

      const { error } = await adminSupabase
        .from('homepage_content')
        .update({
          title: section.title,
          title_bold: section.title_bold,
          subtitle: section.subtitle,
          image_url: finalImageUrl,
          mobile_image_url: finalMobileImageUrl,
          cta_text: section.cta_text,
          cta_link: section.cta_link,
          cta_secondary_text: section.cta_secondary_text,
          cta_secondary_link: section.cta_secondary_link,
          updated_at: new Date().toISOString(),
        })
        .match({ id: section.id });
      
      if (error) throw error;
      
      setContent(prev => prev.map(item => item.id === section.id ? { ...item, image_url: finalImageUrl, mobile_image_url: finalMobileImageUrl } : item));
      setPendingFiles(prev => {
        const next = { ...prev };
        delete next[section.id];
        return next;
      });
      
      setSavedStatus(section.id);
      setTimeout(() => setSavedStatus(null), 3000);
    } catch (err) {
      console.error('Error updating section:', err);
      alert('Error saving changes. Check console.');
    } finally {
      setSaving(null);
    }
  }

  const handleChange = (id: string, field: keyof HomepageContent, value: string) => {
    setContent(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-heading tracking-tighter italic">Experience Designer</h1>
        <p className="text-sm text-gray-500 mt-1">Customize the visual identity and messaging of your storefront.</p>
      </div>

      <div className="space-y-12">
        {content.map((section) => {
          const Icon = sectionIcons[section.section_key] || Home;
          return (
            <div key={section.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group">
              <div className="flex flex-col lg:flex-row">
                    <div className={`lg:w-1/3 relative aspect-video lg:aspect-auto ${section.section_key === 'editorial_quote' ? 'bg-[#F8F8F8] p-8 flex flex-col justify-center items-center text-center' : 'bg-gray-100'} overflow-hidden`}>
                  {section.section_key === 'editorial_quote' ? (
                    <div className="text-black">
                      <Quote size={24} className="mx-auto mb-4 text-[#D97706] rotate-180" />
                      <h4 className="font-heading font-black text-sm italic mb-4 leading-tight">"{section.title}"</h4>
                      <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-500">— {section.subtitle}</p>
                    </div>
                  ) : (
                    <>
                      <img src={pendingFiles[section.id]?.desktop.preview || section.image_url} alt={section.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                        <div className="text-white">
                          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">{section.subtitle}</p>
                          <h4 className="font-heading font-bold text-lg leading-tight mt-1">{section.title}</h4>
                        </div>
                      </div>
                      
                      {/* Mobile Preview Badge if a mobile crop is pending */}
                      {pendingFiles[section.id] && (
                        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
                          <Smartphone size={10} className="text-[#D97706]" />
                          <span className="text-[8px] font-bold text-white uppercase tracking-tighter">Dual Crop Ready</span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="flex-1 p-8 space-y-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg text-black group-hover:bg-black group-hover:text-white transition-colors">
                        <Icon size={20} />
                      </div>
                      <h3 className="font-bold text-lg tracking-tight uppercase italic">{sectionNames[section.section_key]}</h3>
                    </div>
                    {savedStatus === section.id && (
                      <div className="flex items-center gap-2 text-green-600 text-xs font-bold animate-in fade-in slide-in-from-right-2 duration-300">
                        <CheckCircle2 size={16} />
                        Changes Published
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={section.section_key === 'editorial_quote' ? "col-span-full space-y-2" : "space-y-2"}>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {section.section_key === 'editorial_quote' ? 'Quote Text' : 'Hero Title (Use | for dual style)'}
                      </label>
                      <textarea 
                        rows={section.section_key === 'editorial_quote' ? 3 : 1}
                        placeholder={section.section_key === 'main_hero' ? 'MODERN | ELEGANCE' : ''}
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#D97706] transition-all resize-none"
                        value={section.title}
                        onChange={(e) => handleChange(section.id, 'title', e.target.value)}
                      />
                    </div>
                    <div className={section.section_key === 'editorial_quote' ? "col-span-full space-y-2" : "space-y-2"}>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{section.section_key === 'editorial_quote' ? 'Author / Source' : 'Hero Subtitle'}</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#D97706] transition-all"
                        value={section.subtitle}
                        onChange={(e) => handleChange(section.id, 'subtitle', e.target.value)}
                      />
                    </div>
                    {section.section_key !== 'editorial_quote' && (
                      <div className="col-span-full space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <ImageIcon size={12} />
                          Background Asset
                        </label>
                        <div className="relative group/field h-14">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleFileChange(section.id, e)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className={`w-full h-full border-2 border-dashed rounded-xl flex items-center px-4 transition-all ${
                            pendingFiles[section.id]
                              ? 'border-[#D97706] bg-[#D97706]/5' 
                              : 'border-gray-200 bg-gray-50 group-hover/field:border-[#D97706]'
                          }`}>
                            <Upload size={18} className={`${pendingFiles[section.id] ? 'text-[#D97706]' : 'text-gray-400'} mr-3`} />
                            <span className={`text-[10px] font-bold truncate uppercase tracking-widest ${pendingFiles[section.id] ? 'text-[#D97706]' : 'text-gray-400'}`}>
                              {pendingFiles[section.id] ? pendingFiles[section.id].desktop.file.name : 'Upload New Asset from Device'}
                            </span>
                            {pendingFiles[section.id] && (
                              <button 
                                 onClick={(e) => {
                                   e.preventDefault();
                                   URL.revokeObjectURL(pendingFiles[section.id].desktop.preview);
                                   URL.revokeObjectURL(pendingFiles[section.id].mobile.preview);
                                   setPendingFiles(prev => {
                                     const next = { ...prev };
                                     delete next[section.id];
                                     return next;
                                   });
                                 }}
                                 className="ml-auto p-1 text-[#D97706] hover:bg-[#D97706] hover:text-white rounded transition-colors"
                              >
                                <X size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {section.section_key !== 'editorial_quote' && (
                      <>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">CTA Button Text</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#D97706] transition-all"
                            value={section.cta_text}
                            onChange={(e) => handleChange(section.id, 'cta_text', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">CTA Link Path</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#D97706] transition-all"
                            value={section.cta_link}
                            onChange={(e) => handleChange(section.id, 'cta_link', e.target.value)}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-50">
                    <button 
                      disabled={saving === section.id}
                      onClick={() => handleUpdate(section)}
                      className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl text-xs font-bold hover:bg-[#D97706] transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-black/10"
                    >
                      {saving === section.id ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                      Update {sectionNames[section.section_key].split(' ')[0]} Section
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {croppingAsset && (
        <ImageCropper 
          imageSrc={croppingAsset.preview}
          originalFile={croppingAsset.file}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            URL.revokeObjectURL(croppingAsset.preview);
            setCroppingAsset(null);
          }}
        />
      )}
    </div>
  );
}
