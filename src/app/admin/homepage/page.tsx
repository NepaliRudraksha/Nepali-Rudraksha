'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSettings, saveSettings, isSupabaseConfigured, SiteSettings } from '@/lib/api';
import { Save, Loader2, CheckCircle, AlertCircle, PlusCircle, Trash2, Image as ImageIcon, Upload } from 'lucide-react';
import Image from 'next/image';

interface Category {
  name: string;
  description: string;
  img: string;
  href: string;
}

export default function AdminHomepageSettings() {
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [instagramImages, setInstagramImages] = useState<string[]>([]);
  
  const [originalSettings, setOriginalSettings] = useState<SiteSettings | null>(null);
  const [uploadingCategoryIdx, setUploadingCategoryIdx] = useState<number | null>(null);
  const [isUploadingInstagram, setIsUploadingInstagram] = useState(false);

  const supabaseReady = isSupabaseConfigured();

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    const data = await getSettings();
    setOriginalSettings(data);
    
    try {
      if (data.homepage_categories) {
        setCategories(JSON.parse(data.homepage_categories));
      }
      if (data.homepage_instagram) {
        setInstagramImages(JSON.parse(data.homepage_instagram));
      }
    } catch (e) {
      console.error('Failed to parse homepage settings JSON', e);
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSave = async () => {
    if (!originalSettings) return;
    
    setIsSaving(true);
    const newSettings = {
      ...originalSettings,
      homepage_categories: JSON.stringify(categories),
      homepage_instagram: JSON.stringify(instagramImages),
    };
    
    const result = await saveSettings(newSettings);
    setIsSaving(false);
    
    if (result.error) {
      alert(`Error saving settings: ${result.error}`);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Upload failed');
      return data.url;
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to upload image');
      return null;
    }
  };

  // Category Handlers
  const addCategory = () => {
    setCategories([...categories, { name: '', description: '', img: '', href: '/shop' }]);
  };

  const removeCategory = (index: number) => {
    const newCats = [...categories];
    newCats.splice(index, 1);
    setCategories(newCats);
  };

  const updateCategory = (index: number, field: keyof Category, value: string) => {
    const newCats = [...categories];
    newCats[index] = { ...newCats[index], [field]: value };
    setCategories(newCats);
  };

  const handleCategoryImgUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingCategoryIdx(index);
    const url = await uploadImage(e.target.files[0]);
    if (url) updateCategory(index, 'img', url);
    setUploadingCategoryIdx(null);
  };

  // Instagram Handlers
  const handleInstagramUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploadingInstagram(true);
    const url = await uploadImage(e.target.files[0]);
    if (url) {
      setInstagramImages([...instagramImages, url]);
    }
    setIsUploadingInstagram(false);
  };

  const removeInstagramImage = (index: number) => {
    const newImages = [...instagramImages];
    newImages.splice(index, 1);
    setInstagramImages(newImages);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
        <Loader2 size={24} className="animate-spin" />
        <span className="text-sm font-medium">Loading homepage settings...</span>
      </div>
    );
  }

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-accent transition-colors bg-white";

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Homepage Sections</h1>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
              <CheckCircle size={16} /> Saved
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving || !supabaseReady}
            className="flex items-center gap-2 bg-brand-primary text-white font-bold px-6 py-2.5 rounded-lg hover:bg-[#1a251d] transition-colors shadow-sm disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save Changes
          </button>
        </div>
      </div>

      {!supabaseReady && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>Read-only mode:</strong> Settings cannot be saved without Supabase configuration.
          </p>
        </div>
      )}

      {/* Shop by Category */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Shop by Category</h2>
          <button onClick={addCategory} className="flex items-center gap-1.5 text-sm font-bold text-brand-primary hover:text-[#1a251d]">
            <PlusCircle size={16} /> Add Category
          </button>
        </div>

        <div className="space-y-4">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex flex-col md:flex-row gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50 items-start">
              {/* Image Upload Area */}
              <div className="w-full md:w-32 flex flex-col gap-2">
                <div className="relative aspect-square w-full rounded-lg border-2 border-dashed border-gray-300 bg-white overflow-hidden flex items-center justify-center">
                  {cat.img ? (
                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="text-gray-300" size={24} />
                  )}
                  {uploadingCategoryIdx === idx && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <Loader2 className="animate-spin text-brand-primary" size={20} />
                    </div>
                  )}
                </div>
                <label className="cursor-pointer text-xs font-bold text-center text-gray-600 hover:text-brand-primary py-1 border border-gray-200 rounded bg-white">
                  {cat.img ? 'Change' : 'Upload'} Image
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleCategoryImgUpload(idx, e)} />
                </label>
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Name</label>
                  <input type="text" value={cat.name} onChange={(e) => updateCategory(idx, 'name', e.target.value)} className={inputClass} placeholder="e.g. Rudraksha Beads" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Description (Origin / Use for)</label>
                  <input type="text" value={cat.description} onChange={(e) => updateCategory(idx, 'description', e.target.value)} className={inputClass} placeholder="e.g. Sacred Origin" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-600 mb-1">Link (href)</label>
                  <input type="text" value={cat.href} onChange={(e) => updateCategory(idx, 'href', e.target.value)} className={inputClass} placeholder="e.g. /shop?category=beads" />
                </div>
              </div>

              <button onClick={() => removeCategory(idx)} className="text-red-500 hover:text-red-700 p-2 md:self-center" title="Remove">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          {categories.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No categories added yet.</p>}
        </div>
      </div>

      {/* Our Instagram */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Our Instagram Marquee</h2>
          <label className="flex items-center gap-1.5 text-sm font-bold text-brand-primary hover:text-[#1a251d] cursor-pointer">
            {isUploadingInstagram ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            Add Image
            <input type="file" accept="image/*" className="hidden" onChange={handleInstagramUpload} disabled={isUploadingInstagram} />
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {instagramImages.map((img, idx) => (
            <div key={idx} className="relative group aspect-square rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
              <img src={img} alt="Instagram" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => removeInstagramImage(idx)} className="bg-white text-red-600 p-2 rounded-full hover:scale-110 transition-transform">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        {instagramImages.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No Instagram images added yet.</p>}
      </div>
    </div>
  );
}
