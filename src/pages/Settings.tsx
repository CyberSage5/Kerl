import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Save, User, Mail, Key } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  user_type: string;
}

function Settings() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
      setFormData(prev => ({
        ...prev,
        full_name: data.full_name || '',
        email: user?.email || ''
      }));
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updates = {
        id: user?.id,
        full_name: formData.full_name,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user?.id);

      if (error) throw error;

      // Update password if provided
      if (formData.current_password && formData.new_password) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: formData.new_password
        });

        if (passwordError) throw passwordError;
      }

      // Reset password fields
      setFormData(prev => ({
        ...prev,
        current_password: '',
        new_password: '',
        confirm_password: ''
      }));

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center">
            <h1 className="text-xl font-bold text-white">Account Settings</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-6">
            {/* Profile Section */}
            <div className="rounded-lg bg-slate-800 p-6">
              <h2 className="mb-6 text-lg font-semibold text-white">Profile Information</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-slate-300">
                    Full Name
                  </label>
                  <div className="mt-1 flex rounded-lg border border-slate-600 bg-slate-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                    <span className="flex items-center pl-3">
                      <User className="h-5 w-5 text-slate-400" />
                    </span>
                    <input
                      type="text"
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="block w-full border-0 bg-transparent px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-0"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                    Email Address
                  </label>
                  <div className="mt-1 flex rounded-lg border border-slate-600 bg-slate-700">
                    <span className="flex items-center pl-3">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </span>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      disabled
                      className="block w-full border-0 bg-transparent px-3 py-2 text-slate-400 focus:outline-none focus:ring-0"
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    Contact support to change your email address
                  </p>
                </div>

                <div>
                  <h3 className="mb-4 text-sm font-medium text-slate-300">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="current_password" className="block text-sm font-medium text-slate-300">
                        Current Password
                      </label>
                      <div className="mt-1 flex rounded-lg border border-slate-600 bg-slate-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                        <span className="flex items-center pl-3">
                          <Key className="h-5 w-5 text-slate-400" />
                        </span>
                        <input
                          type="password"
                          id="current_password"
                          value={formData.current_password}
                          onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                          className="block w-full border-0 bg-transparent px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-0"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="new_password" className="block text-sm font-medium text-slate-300">
                        New Password
                      </label>
                      <div className="mt-1 flex rounded-lg border border-slate-600 bg-slate-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                        <span className="flex items-center pl-3">
                          <Key className="h-5 w-5 text-slate-400" />
                        </span>
                        <input
                          type="password"
                          id="new_password"
                          value={formData.new_password}
                          onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                          className="block w-full border-0 bg-transparent px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-0"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirm_password" className="block text-sm font-medium text-slate-300">
                        Confirm New Password
                      </label>
                      <div className="mt-1 flex rounded-lg border border-slate-600 bg-slate-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                        <span className="flex items-center pl-3">
                          <Key className="h-5 w-5 text-slate-400" />
                        </span>
                        <input
                          type="password"
                          id="confirm_password"
                          value={formData.confirm_password}
                          onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                          className="block w-full border-0 bg-transparent px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-0"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Account Type */}
            <div className="rounded-lg bg-slate-800 p-6">
              <h2 className="mb-4 text-lg font-semibold text-white">Account Type</h2>
              <div className="flex items-center justify-between rounded-lg border border-slate-700 p-4">
                <div>
                  <p className="font-medium text-white">
                    {profile?.user_type === 'developer' ? 'Developer Account' : 'API Consumer Account'}
                  </p>
                  <p className="text-sm text-slate-400">
                    {profile?.user_type === 'developer'
                      ? 'You can create and manage API documentation'
                      : 'You can view and interact with API documentation'}
                  </p>
                </div>
                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400">
                  {profile?.user_type === 'developer' ? 'Developer' : 'Consumer'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Settings;