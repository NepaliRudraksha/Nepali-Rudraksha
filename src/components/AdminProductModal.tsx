'use client';

import Image from '@/components/ImageKitImage';
import { Product } from '@/data/products';
import { StoreCategory } from '@/lib/api';
import { Loader2, Save, X, Upload, Image as ImageIcon, Trash } from 'lucide-react';

interface AdminProductModalProps {
  show: boolean;
  onClose: () => void;
  isEditing: boolean;
  categories: StoreCategory[];
  editingProduct: any;
  isSaving: boolean;
  isUploadingImage: boolean;
  onImageUpload: (file: File) => Promise<void>;
  onSave: () => void;
  onImageChange: (url: string) => void;
  onImageRemove: () => void;
  onFormChange: (field: string, value: any) => void;
}

export default function AdminProductModal({
  show,
  onClose,
  isEditing,
  categories,
  editingProduct,
  isSaving,
  isUploadingImage,
  onImageUpload,
  onImageChange,
  onImageRemove,
  onFormChange,
  onSave,
}: AdminProductModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h3 className="text-lg font-bold text-gray-800">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) => onFormChange('name', e.target.value)}
                placeholder="e.g. 5 Mukhi Rudraksha"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Price (₹) <span className="text-gray-400 font-normal">0 for "On Enquiry"</span>
              </label>
              <input
                type="number"
                value={editingProduct.price}
                onChange={(e) => onFormChange('price', Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Category *</label>
              <select
                value={editingProduct.category}
                onChange={(e) => onFormChange('category', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-accent bg-white"
              >
                <option value="">Select a category</option>
                {editingProduct.category && !categories.some((category) => category.id === editingProduct.category) && (
                  <option value={editingProduct.category}>Uncategorized</option>
                )}
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Origin</label>
              <select
                value={editingProduct.origin || ''}
                onChange={(e) => onFormChange('origin', e.target.value || undefined)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-accent bg-white"
              >
                <option value="">None</option>
                <option value="nepali">Nepali</option>
                <option value="indonesian">Indonesian</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Mukhi <span className="text-gray-400 font-normal">(number of faces)</span>
              </label>
              <input
                type="number"
                min={1}
                max={21}
                value={editingProduct.mukhi || ''}
                onChange={(e) => onFormChange('mukhi', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="e.g. 5"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Rating (1–5)</label>
              <input
                type="number"
                min={1}
                max={5}
                value={editingProduct.rating}
                onChange={(e) => onFormChange('rating', Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Reviews Count</label>
              <input
                type="number"
                value={editingProduct.reviewsCount}
                onChange={(e) => onFormChange('reviewsCount', Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-accent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Product Image</label>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {editingProduct.image ? (
                      <Image
                        src={editingProduct.image}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon size={24} />
                      </div>
                    )}
                    {editingProduct.image && (
                      <button
                        type="button"
                        onClick={onImageRemove}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      >
                        <Trash size={10} />
                      </button>
                    )}
                  </div>
                  <div className="flex-1 flex items-center">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) onImageUpload(file);
                        }}
                        disabled={false}
                        className="sr-only"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          const fileInput = e.currentTarget.previousElementSibling;
                          if (fileInput instanceof HTMLInputElement) {
                            fileInput.click();
                          }
                        }}
                        className="w-full py-2.5 px-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Upload size={16} />
                        Upload Image
                      </button>
                    </label>
                  </div>
                </div>
                <input
                  type="url"
                  value={editingProduct.image || ''}
                  onChange={(e) => onImageChange(e.target.value)}
                  placeholder="Or enter image URL manually: https://..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-accent"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={editingProduct.description || ''}
                onChange={(e) => onFormChange('description', e.target.value)}
                placeholder="Product description..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-accent resize-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Benefits{' '}
                <span className="text-gray-400 font-normal">(one per line)</span>
              </label>
              <textarea
                rows={3}
                value={editingProduct.benefits}
                onChange={(e) => onFormChange('benefits', e.target.value)}
                placeholder={'Enhances focus\nBrings peace\nAttracts prosperity'}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-accent resize-none font-mono"
              />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex shrink-0 items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingProduct.isBestseller || false}
                  onChange={(e) => onFormChange('isBestseller', e.target.checked)}
                  className="w-4 h-4 accent-brand-accent"
                />
                <span className="text-sm font-medium text-gray-700">Bestseller</span>
              </label>
              <label className="flex shrink-0 items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingProduct.isNew || false}
                  onChange={(e) => onFormChange('isNew', e.target.checked)}
                  className="w-4 h-4 accent-brand-accent"
                />
                <span className="whitespace-nowrap text-sm font-medium text-gray-700">New Arrival</span>
              </label>
              <label className="flex shrink-0 items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingProduct.isFeatured || false}
                  onChange={(e) => onFormChange('isFeatured', e.target.checked)}
                  className="w-4 h-4 accent-brand-accent"
                />
                <span className="text-sm font-medium text-gray-700">Featured</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={false}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-brand-primary text-white rounded-lg hover:bg-[#1a251d] transition-colors disabled:opacity-60"
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
}
