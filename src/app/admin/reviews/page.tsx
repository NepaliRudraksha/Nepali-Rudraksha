'use client';

import { useState, useEffect } from 'react';
import { getApprovedReviewsForAdmin, getPendingReviews, approveReview, deleteReview, Review, updateReview } from '@/lib/api';
import { getProducts, Product } from '@/lib/api';
import { CheckCircle, XCircle, Loader2, Pencil, Save, Star } from 'lucide-react';
import Link from 'next/link';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [approvedReviews, setApprovedReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    const [fetchedReviews, fetchedApprovedReviews, fetchedProducts] = await Promise.all([
      getPendingReviews(),
      getApprovedReviewsForAdmin(),
      getProducts()
    ]);
    
    setReviews(fetchedReviews);
    setApprovedReviews(fetchedApprovedReviews);
    
    const productMap: Record<string, Product> = {};
    fetchedProducts.forEach(p => {
      productMap[p.id] = p;
    });
    setProducts(productMap);
    
    setIsLoading(false);
  }

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    const res = await approveReview(id);
    if (!res.error) {
      const approvedReview = reviews.find((review) => review.id === id);
      setReviews(reviews.filter(r => r.id !== id));
      if (approvedReview) {
        setApprovedReviews([{ ...approvedReview, is_approved: true }, ...approvedReviews]);
      }
    } else {
      alert('Error approving review: ' + res.error);
    }
    setActionLoading(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    setActionLoading(id);
    const res = await deleteReview(id);
    if (!res.error) {
      setReviews(reviews.filter(r => r.id !== id));
      setApprovedReviews(approvedReviews.filter(r => r.id !== id));
      if (editingReview?.id === id) setEditingReview(null);
    } else {
      alert('Error deleting review: ' + res.error);
    }
    setActionLoading(null);
  };

  const handleUpdate = async () => {
    if (!editingReview) return;
    if (!editingReview.name.trim() || !editingReview.comment.trim()) {
      alert('Reviewer name and comment are required.');
      return;
    }

    setActionLoading(editingReview.id);
    const res = await updateReview(editingReview.id, {
      name: editingReview.name.trim(),
      rating: editingReview.rating,
      comment: editingReview.comment.trim(),
    });
    setActionLoading(null);

    if (res.error) {
      alert('Error updating review: ' + res.error);
      return;
    }

    setApprovedReviews(approvedReviews.map((review) => (
      review.id === editingReview.id ? editingReview : review
    )));
    setEditingReview(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-brand-accent w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 md:p-6 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Pending Reviews</h2>
          <p className="text-sm text-gray-500 mt-1">Approve or reject customer reviews before they appear on the site.</p>
        </div>
        <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shrink-0">
          {reviews.length} Pending
        </span>
      </div>

      {reviews.length === 0 ? (
        <div className="p-12 text-center text-gray-500">
          <Star className="mx-auto text-gray-300 mb-3" size={48} />
          <p>No pending reviews to approve.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-3 md:p-4 font-semibold hidden sm:table-cell">Product</th>
                <th className="p-3 md:p-4 font-semibold">Reviewer</th>
                <th className="p-3 md:p-4 font-semibold hidden md:table-cell">Rating</th>
                <th className="p-3 md:p-4 font-semibold">Comment</th>
                <th className="p-3 md:p-4 font-semibold hidden lg:table-cell">Date</th>
                <th className="p-3 md:p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reviews.map(review => {
                const product = products[review.product_id];
                return (
                  <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 md:p-4 text-sm hidden sm:table-cell">
                      {product ? (
                        <Link href={`/shop/${product.id}`} className="font-medium text-brand-primary hover:underline line-clamp-1" target="_blank">
                          {product.name}
                        </Link>
                      ) : (
                        <span className="text-gray-400 italic">Unknown Product</span>
                      )}
                    </td>
                    <td className="p-3 md:p-4 text-sm font-medium text-gray-800">{review.name}</td>
                    <td className="p-3 md:p-4 hidden md:table-cell">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={13} className={star <= review.rating ? "fill-brand-accent text-brand-accent" : "text-gray-300"} />
                        ))}
                      </div>
                    </td>
                    <td className="p-3 md:p-4 text-sm text-gray-600 italic max-w-xs truncate">"{review.comment}"</td>
                    <td className="p-3 md:p-4 text-xs text-gray-500 hidden lg:table-cell">
                      {new Date(review.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 md:p-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleApprove(review.id)}
                        disabled={actionLoading === review.id}
                        className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors inline-flex items-center"
                        title="Approve Review"
                      >
                        {actionLoading === review.id ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        disabled={actionLoading === review.id}
                        className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors inline-flex items-center"
                        title="Delete Review"
                      >
                        {actionLoading === review.id ? <Loader2 size={18} className="animate-spin" /> : <XCircle size={18} />}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col items-start justify-between gap-3 border-b border-gray-200 bg-gray-50 p-4 md:flex-row md:items-center md:p-6">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Homepage Reviews</h2>
            <p className="mt-1 text-sm text-gray-500">Approved reviews currently eligible to appear on the homepage.</p>
          </div>
          <span className="shrink-0 whitespace-nowrap rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
            {approvedReviews.length} Approved
          </span>
        </div>

        {editingReview && (
          <div className="grid gap-3 border-b border-gray-200 bg-brand-light/30 p-4 md:grid-cols-[1fr_120px_2fr_auto] md:items-end md:p-6">
            <div>
              <label className="mb-1 block text-xs font-bold text-gray-600">Reviewer</label>
              <input
                value={editingReview.name}
                onChange={(event) => setEditingReview({ ...editingReview, name: event.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-gray-600">Rating</label>
              <select
                value={editingReview.rating}
                onChange={(event) => setEditingReview({ ...editingReview, rating: Number(event.target.value) })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-accent"
              >
                {[1, 2, 3, 4, 5].map((rating) => <option key={rating} value={rating}>{rating} star{rating === 1 ? '' : 's'}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-gray-600">Comment</label>
              <textarea
                value={editingReview.comment}
                onChange={(event) => setEditingReview({ ...editingReview, comment: event.target.value })}
                rows={2}
                className="w-full resize-y rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-accent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                disabled={actionLoading === editingReview.id}
                className="inline-flex items-center gap-1 rounded-lg bg-brand-primary px-3 py-2 text-sm font-bold text-white disabled:opacity-50"
              >
                {actionLoading === editingReview.id ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                Save
              </button>
              <button onClick={() => setEditingReview(null)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-bold text-gray-600">Cancel</button>
            </div>
          </div>
        )}

        {approvedReviews.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Star className="mx-auto mb-3 text-gray-300" size={48} />
            <p>No approved reviews are available for the homepage.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <th className="hidden p-3 font-semibold sm:table-cell md:p-4">Product</th>
                  <th className="p-3 font-semibold md:p-4">Reviewer</th>
                  <th className="hidden p-3 font-semibold md:table-cell md:p-4">Rating</th>
                  <th className="p-3 font-semibold md:p-4">Comment</th>
                  <th className="p-3 text-right font-semibold md:p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {approvedReviews.map((review) => {
                  const product = products[review.product_id];
                  return (
                    <tr key={review.id} className="transition-colors hover:bg-gray-50">
                      <td className="hidden p-3 text-sm sm:table-cell md:p-4">
                        {product ? <span className="font-medium text-brand-primary">{product.name}</span> : <span className="italic text-gray-400">Unknown Product</span>}
                      </td>
                      <td className="p-3 text-sm font-medium text-gray-800 md:p-4">{review.name}</td>
                      <td className="hidden p-3 md:table-cell md:p-4">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={13} className={star <= review.rating ? 'fill-brand-accent text-brand-accent' : 'text-gray-300'} />)}
                        </div>
                      </td>
                      <td className="max-w-xs truncate p-3 text-sm italic text-gray-600 md:p-4">&ldquo;{review.comment}&rdquo;</td>
                      <td className="space-x-2 whitespace-nowrap p-3 text-right md:p-4">
                        <button
                          onClick={() => setEditingReview({ ...review })}
                          disabled={actionLoading === review.id}
                          className="inline-flex rounded-lg bg-blue-50 p-2 text-blue-600 transition-colors hover:bg-blue-100 disabled:opacity-50"
                          title="Edit homepage review"
                        >
                          <Pencil size={17} />
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          disabled={actionLoading === review.id}
                          className="inline-flex rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                          title="Delete homepage review"
                        >
                          {actionLoading === review.id ? <Loader2 size={17} className="animate-spin" /> : <XCircle size={17} />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
