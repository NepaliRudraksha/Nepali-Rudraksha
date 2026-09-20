'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSettings, saveSettings, isSupabaseConfigured, SiteSettings } from '@/lib/api';
import { Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const defaultSettings: SiteSettings = {
  store_name: 'Nepali Rudraksha',
  store_email: 'info@nepalirudraksha.com',
  store_phone: '+91 98765 43210',
  store_address: 'Kathmandu, Nepal',
  currency: 'INR',
  tax_rate: '0',
  free_shipping_min: '500',
  shipping_rate: '0',
  show_bestseller: 'true',
  show_new_arrivals: 'true',
  maintenance_mode: 'false',
  homepage_categories: '[]',
  homepage_instagram: '[]',
};

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const supabaseReady = isSupabaseConfigured();

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    const data = await getSettings();
    setSettings(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    // Boolean settings are stored as 'true'/'false' strings in the DB
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? String(checked) : value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const result = await saveSettings(settings);
    setIsSaving(false);
    if (result.error) {
      alert(`Error saving settings: ${result.error}`);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const inputClass =
    'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-accent transition-colors bg-white';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
        <Loader2 size={24} className="animate-spin" />
        <span className="text-sm font-medium">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Supabase warning */}
      {!supabaseReady && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>Read-only mode:</strong> Settings cannot be saved without Supabase configuration.
          </p>
        </div>
      )}

      {/* Store Information */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-5 pb-3 border-b border-gray-100">
          Store Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Store Name</label>
            <input
              type="text"
              name="store_name"
              value={settings.store_name}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Contact Email</label>
            <input
              type="email"
              name="store_email"
              value={settings.store_email}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Phone Number</label>
            <input
              type="tel"
              name="store_phone"
              value={settings.store_phone}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Business Address</label>
            <input
              type="text"
              name="store_address"
              value={settings.store_address}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Pricing & Shipping */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-5 pb-3 border-b border-gray-100">
          Pricing &amp; Shipping
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Currency</label>
            <select
              name="currency"
              value={settings.currency}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Tax Rate (%)</label>
            <input
              type="number"
              name="tax_rate"
              value={settings.tax_rate}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Free Shipping Minimum (₹)
            </label>
            <input
              type="number"
              name="free_shipping_min"
              value={settings.free_shipping_min}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Default Shipping Rate (₹)
            </label>
            <input
              type="number"
              name="shipping_rate"
              value={settings.shipping_rate}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-5 pb-3 border-b border-gray-100">
          Display Settings
        </h2>
        <div className="space-y-4">
          {[
            {
              name: 'show_bestseller',
              label: 'Show Bestseller Badges',
              desc: 'Display "Bestseller" badge on eligible products',
            },
            {
              name: 'show_new_arrivals',
              label: 'Show New Arrival Badges',
              desc: 'Display "New" badge on recently added products',
            },
            {
              name: 'maintenance_mode',
              label: 'Maintenance Mode',
              desc: 'Put the store in maintenance mode (shows a coming soon page to visitors)',
            },
          ].map((toggle) => (
            <label
              key={toggle.name}
              className="flex items-start gap-4 cursor-pointer group p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="mt-0.5">
                <input
                  type="checkbox"
                  name={toggle.name}
                  checked={settings[toggle.name as keyof SiteSettings] === 'true'}
                  onChange={handleChange}
                  className="w-4 h-4 accent-brand-accent mt-0.5"
                />
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">{toggle.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{toggle.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>



      {/* Save Button */}
      <div className="flex items-center justify-end gap-4">
        {saved && (
          <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
            <CheckCircle size={16} />
            Settings saved successfully!
          </div>
        )}
        <button
          onClick={handleSave}
          disabled={isSaving || !supabaseReady}
          className="flex items-center gap-2 bg-brand-primary text-white font-bold px-6 py-3 rounded-lg hover:bg-[#1a251d] transition-colors disabled:opacity-60 shadow-sm"
          title={!supabaseReady ? 'Supabase is not configured' : ''}
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
