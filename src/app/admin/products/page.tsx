'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Product } from '@/data/products';
import { getProducts, createProduct, updateProduct, deleteProduct, isSupabaseConfigured } from '@/lib/api';
import { PlusCircle, Pencil, Trash2, Search, Filter, ChevronDown, X, Save, Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

type EditableProduct = Omit<Product, 'benefits'> & { benefits: string };

const emptyForm: EditableProduct = {
  id: '',
  name: '',
  price: 0,
  category: 'beads',
  origin: undefined,
  rating: 5,
  reviewsCount: 0,
  isBestseller: false,
  isNew: false,
  image: '',
  description: '',
  benefits: '',
  mukhi: undefined,
};

type Toast = { type: 'success' | 'error'; message: string };

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<EditableProduct>(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const supabaseReady = isSupabaseConfigured();

  const showToast = (type: Toast['type'], message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    const data = await getProducts();
    setProducts(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const openAddModal = () => {
    setEditingProduct({ ...emptyForm, id: `product-${Date.now()}` });
    setIsEditing(false);
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct({
      ...product,
      benefits: product.benefits ? product.benefits.join('\n') : '',
      origin: product.origin,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editingProduct.name || !editingProduct.id) return;
    setIsSaving(true);

    const productToSave: Product = {
      ...editingProduct,
      benefits: editingProduct.benefits
        ? editingProduct.benefits.split('\n').filter((b) => b.trim())
        : [],
      price: Number(editingProduct.price),
      rating: Number(editingProduct.rating),
      reviewsCount: Number(editingProduct.reviewsCount),
      mukhi: editingProduct.mukhi ? Number(editingProduct.mukhi) : undefined,
    };

    let result: { error: string | null };

    if (isEditing) {
      result = await updateProduct(productToSave.id, productToSave);
    } else {
      result = await createProduct(productToSave);
    }

    if (result.error) {
      showToast('error', `Failed to save: ${result.error}`);
    } else {
      showToast('success', isEditing ? 'Product updated successfully!' : 'Product added successfully!');
      await loadProducts();
      setShowModal(false);
    }

    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    const result = await deleteProduct(id);
    if (result.error) {
      showToast('error', `Failed to delete: ${result.error}`);
    } else {
      showToast('success', 'Product deleted successfully!');
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
    setDeleteConfirmId(null);
    setIsDeleting(null);
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-sm font-medium transition-all ${
            toast.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
          ) : (
            <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
          )}
          {toast.message}
        </div>
      )}

      {/* Supabase Warning */}
      {!supabaseReady && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>Read-only mode:</strong> Supabase is not configured. Changes won't be persisted. Add{' '}
            <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
            <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your{' '}
            <code className="bg-amber-100 px-1 rounded">.env.local</code> file.
          </p>
        </div>
      )}

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Products</h2>
          <p className="text-sm text-gray-500">{products.length} total products</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadProducts}
            className="flex items-center gap-2 text-gray-500 border border-gray-200 font-bold px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            title="Refresh"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-brand-primary text-white font-bold px-5 py-2.5 rounded-lg hover:bg-[#1a251d] transition-colors shadow-sm"
          >
            <PlusCircle size={18} />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 flex-1">
          <Search size={16} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-sm"
          />
        </div>
        <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="outline-none text-sm bg-transparent"
          >
            <option value="all">All Categories</option>
            <option value="beads">Beads</option>
            <option value="mala">Malas</option>
            <option value="special">Special</option>
          </select>
          <ChevronDown size={14} className="text-gray-400" />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex items-center justify-center gap-3 text-gray-400">
            <Loader2 size={24} className="animate-spin" />
            <span className="text-sm font-medium">Loading products...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Product</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Price</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Rating</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-light rounded-lg overflow-hidden flex-shrink-0 relative">
                          <Image
                            src={
                              product.image ||
                              'https://images.unsplash.com/photo-1620857908861-1c3905007328?q=80&w=80&auto=format&fit=crop'
                            }
                            alt={product.name}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 leading-tight">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="capitalize text-gray-600">{product.category}</span>
                      {product.origin && (
                        <span className="ml-1 text-xs text-gray-400">({product.origin})</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {product.price > 0 ? `₹${product.price.toLocaleString()}` : 'On Enquiry'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-brand-accent font-bold">★ {product.rating || 5}</span>
                      <span className="text-gray-400 text-xs ml-1">({product.reviewsCount || 0})</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {product.isBestseller && (
                          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                            Bestseller
                          </span>
                        )}
                        {product.isNew && (
                          <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                            New
                          </span>
                        )}
                        {!product.isBestseller && !product.isNew && (
                          <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                            Standard
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        {deleteConfirmId === product.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(product.id)}
                              disabled={isDeleting === product.id}
                              className="text-xs bg-red-600 text-white px-2 py-1 rounded font-bold hover:bg-red-700 disabled:opacity-60 flex items-center gap-1"
                            >
                              {isDeleting === product.id ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : null}
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded font-bold hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(product.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProducts.length === 0 && (
              <div className="py-16 text-center text-gray-400">
                <p className="font-medium">No products found.</p>
                <p className="text-sm">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-gray-800">
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
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
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="e.g. 5 Mukhi Rudraksha"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Price (₹) <span className="text-gray-400 font-normal">0 for &quot;On Enquiry&quot;</span>
                  </label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        category: e.target.value as Product['category'],
                      })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-accent bg-white"
                  >
                    <option value="beads">Beads</option>
                    <option value="mala">Mala</option>
                    <option value="special">Special</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Origin</label>
                  <select
                    value={editingProduct.origin || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        origin: (e.target.value as Product['origin']) || undefined,
                      })
                    }
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
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        mukhi: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
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
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, rating: Number(e.target.value) })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Reviews Count</label>
                  <input
                    type="number"
                    value={editingProduct.reviewsCount}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, reviewsCount: Number(e.target.value) })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-accent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={editingProduct.image || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-accent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editingProduct.description || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, description: e.target.value })
                    }
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
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, benefits: e.target.value })
                    }
                    placeholder={'Enhances focus\nBrings peace\nAttracts prosperity'}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-accent resize-none font-mono"
                  />
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isBestseller || false}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, isBestseller: e.target.checked })
                      }
                      className="w-4 h-4 accent-brand-accent"
                    />
                    <span className="text-sm font-medium text-gray-700">Bestseller</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isNew || false}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, isNew: e.target.checked })
                      }
                      className="w-4 h-4 accent-brand-accent"
                    />
                    <span className="text-sm font-medium text-gray-700">New Arrival</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 sticky bottom-0 bg-white">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 text-sm font-bold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !editingProduct.name}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-brand-primary text-white rounded-lg hover:bg-[#1a251d] transition-colors disabled:opacity-60"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {isSaving ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
