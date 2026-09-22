'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCategories, getSettings, HomepageInstagramImage, isSupabaseConfigured, parseHomepageInstagramImages, saveCategories, saveSettings, SiteSettings, StoreCategory } from '@/lib/api';
import { Save, Loader2, CheckCircle, AlertCircle, PlusCircle, Trash2, Image as ImageIcon, Upload } from 'lucide-react';
import Image from '@/components/ImageKitImage';

interface UploadedImage {
  url: string;
  fileId: string;
}

export default function AdminHomepageSettings() {
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [instagramImages, setInstagramImages] = useState<HomepageInstagramImage[]>([]);
  const [originalSettings, setOriginalSettings] = useState<SiteSettings | null>(null);
  const [uploadingCategoryIdx, setUploadingCategoryIdx] = useState<number | null>(null);
  const [uploadingInstagramIdx, setUploadingInstagramIdx] = useState<number | null>(null);

  const supabaseReady = isSupabaseConfigured();

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    const [settings, categoryData] = await Promise.all([getSettings(), getCategories()]);
    setOriginalSettings(settings);
    setCategories(categoryData);
    
    setInstagramImages(parseHomepageInstagramImages(settings.homepage_instagram));
    
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
      homepage_instagram: JSON.stringify(instagramImages),
    };

    const result = await saveSettings(newSettings);
    if (result.error) {
      setIsSaving(false);
      alert(`Error saving settings: ${result.error}`);
      return;
    }

    setOriginalSettings(newSettings);
    const categoryResult = await saveCategories(categories);
    setIsSaving(false);

    if (categoryResult.error) {
      alert(`Instagram images were saved. Categories could not be saved: ${categoryResult.error}`);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const uploadImage = async (
    file: File,
    purpose: 'homepage-instagram' | 'product',
  ): Promise<UploadedImage | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('purpose', purpose);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Upload failed');
      if (typeof data.url !== 'string' || typeof data.fileId !== 'string') {
        throw new Error('Upload completed without ImageKit file information.');
      }
      return { url: data.url, fileId: data.fileId };
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to upload image');
      return null;
    }
  };

  const deleteImageFromImageKit = async (fileId: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId }),
      });
      if (!response.ok) {
        const data: unknown = await response.json();
        throw new Error(
          typeof data === 'object' && data !== null && typeof (data as Record<string, unknown>).error === 'string'
            ? (data as Record<string, string>).error
            : 'ImageKit deletion failed.',
        );
      }
      return true;
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete image from ImageKit');
      return false;
    }
  };

  const saveInstagramImages = async (
    images: HomepageInstagramImage[],
    fileIdsToDelete: string[],
  ): Promise<boolean> => {
    if (!originalSettings) return false;

    const newSettings = {
      ...originalSettings,
      homepage_instagram: JSON.stringify(images),
    };
    const result = await saveSettings(newSettings);
    if (result.error) {
      alert(`Error saving Instagram images: ${result.error}`);
      return false;
    }

    setOriginalSettings(newSettings);
    const deletionResults = await Promise.all(
      fileIdsToDelete.map((fileId) => deleteImageFromImageKit(fileId)),
    );
    if (deletionResults.some((wasDeleted) => !wasDeleted)) {
      alert('The homepage was updated, but one or more old ImageKit files could not be deleted.');
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    return true;
  };

  const addCategory = () => {
    setCategories((currentCategories) => [
      ...currentCategories,
      {
        id: crypto.randomUUID(),
        name: '',
        description: '',
        image: '',
        href: '/shop',
        display_order: currentCategories.length + 1,
      },
    ]);
  };

  const removeCategory = (index: number) => {
    setCategories((currentCategories) => currentCategories.filter((_, categoryIndex) => categoryIndex !== index));
  };

  const updateCategory = (index: number, field: 'name' | 'description' | 'image' | 'href', value: string) => {
    setCategories((currentCategories) => currentCategories.map((category, categoryIndex) => (
      categoryIndex === index ? { ...category, [field]: value } : category
    )));
  };

  const handleCategoryImgUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingCategoryIdx(index);
    const uploadedImage = await uploadImage(e.target.files[0], 'product');
    if (uploadedImage) updateCategory(index, 'image', uploadedImage.url);
    setUploadingCategoryIdx(null);
  };

  const handleAddInstagramImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingInstagramIdx(-1);
    const uploadedImage = await uploadImage(file, 'homepage-instagram');
    if (uploadedImage) {
      const nextImages = [...instagramImages, uploadedImage];
      const wasSaved = await saveInstagramImages(nextImages, []);
      if (wasSaved) {
        setInstagramImages(nextImages);
      } else {
        await deleteImageFromImageKit(uploadedImage.fileId);
      }
    }
    setUploadingInstagramIdx(null);
    event.target.value = '';
  };

  const handleReplaceInstagramImage = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingInstagramIdx(index);
    const uploadedImage = await uploadImage(file, 'homepage-instagram');
    if (uploadedImage) {
      const previousImage = instagramImages[index];
      const nextImages = instagramImages.map((image, imageIndex) => (
        imageIndex === index ? uploadedImage : image
      ));
      const wasSaved = await saveInstagramImages(
        nextImages,
        previousImage?.fileId ? [previousImage.fileId] : [],
      );
      if (wasSaved) {
        setInstagramImages(nextImages);
      } else {
        await deleteImageFromImageKit(uploadedImage.fileId);
      }
    }
    setUploadingInstagramIdx(null);
    event.target.value = '';
  };

  const removeInstagramImage = async (index: number) => {
    const imageToRemove = instagramImages[index];
    if (!imageToRemove) return;

    setUploadingInstagramIdx(index);
    const nextImages = instagramImages.filter((_, imageIndex) => imageIndex !== index);
    const wasSaved = await saveInstagramImages(
      nextImages,
      imageToRemove.fileId ? [imageToRemove.fileId] : [],
    );
    if (wasSaved) setInstagramImages(nextImages);
    setUploadingInstagramIdx(null);
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
            <div key={cat.id} className="flex flex-col md:flex-row gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50 items-start">
              {/* Image Upload Area */}
              <div className="w-full md:w-32 flex flex-col gap-2">
                <div className="relative aspect-square w-full rounded-lg border-2 border-dashed border-gray-300 bg-white overflow-hidden flex items-center justify-center">
                  {cat.image ? (
                    <Image src={cat.image} alt={cat.name} fill className="object-cover" />
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
                  {cat.image ? 'Change' : 'Upload'} Image
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

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Instagram Images</h2>
            <p className="mt-1 text-sm text-gray-500">Manage the images shown in the homepage Instagram marquee.</p>
          </div>
          <label className="flex items-center gap-1.5 cursor-pointer text-sm font-bold text-brand-primary hover:text-[#1a251d]">
            {uploadingInstagramIdx === -1 ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            Add Image
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleAddInstagramImage} disabled={uploadingInstagramIdx !== null} />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {instagramImages.map((image, index) => (
            <div key={`${image.url}-${index}`} className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              <div className="relative aspect-square">
                <Image src={image.url} alt={`Instagram image ${index + 1}`} fill className="object-cover" />
                {uploadingInstagramIdx === index && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                    <Loader2 className="animate-spin text-brand-primary" size={24} />
                  </div>
                )}
              </div>
              <div className="flex gap-2 border-t border-gray-200 p-2">
                <label className="flex-1 cursor-pointer rounded-md border border-gray-200 bg-white px-2 py-1.5 text-center text-xs font-bold text-gray-600 hover:text-brand-primary">
                  Replace
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(event) => handleReplaceInstagramImage(index, event)} disabled={uploadingInstagramIdx !== null} />
                </label>
                <button type="button" onClick={() => removeInstagramImage(index)} disabled={uploadingInstagramIdx !== null} className="rounded-md border border-red-200 px-2 text-red-600 hover:bg-red-50 disabled:opacity-50" title={`Delete Instagram image ${index + 1}`}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        {instagramImages.length === 0 && <p className="py-6 text-center text-sm text-gray-500">No Instagram images. Add one to display it on the homepage.</p>}
      </div>

    </div>
  );
}
