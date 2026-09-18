'use client';

import { useState, useEffect } from 'react';
import { getPendingReviews, approveReview, deleteReview, Review } from '@/lib/api';
import { getProducts, Product } from '@/lib/api';
import { CheckCircle, XCircle, Loader2, Star } from 'lucide-react';
import Link from 'next/link';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    const [fetchedReviews, fetchedProducts] = await Promise.all([
      getPendingReviews(),
      getProducts()
    ]);
    
    setReviews(fetchedReviews);
    
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
      setReviews(reviews.filter(r => r.id !== id));
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
    } else {
      alert('Error deleting review: ' + res.error);
    }
    setActionLoading(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-brand-accent w-8 h-8" />
      </div>
    );
  }

  return (
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
  );
}
