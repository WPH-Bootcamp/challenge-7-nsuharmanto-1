import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../features/store';
import { getAvatar } from '../utils/getAvatar';
import { logout, setUser } from '../features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import React, { useState, useEffect } from 'react';
import axios from '../services/api/axios';
import { X, Camera } from 'lucide-react';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [handphone, setHandphone] = useState(user?.phone || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [profileErrors, setProfileErrors] = useState<{
    name?: string;
    email?: string;
    handphone?: string;
    avatar?: string;
  }>({});

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setHandphone(user?.phone || '');
    setAvatarPreview(null);
    setAvatarFile(null);
  }, [user]);

  if (!user) return null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setProfileErrors((prev) => ({
        ...prev,
        avatar: 'Only image files are allowed',
      }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setProfileErrors((prev) => ({
        ...prev,
        avatar: 'Max file size is 5MB',
      }));
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setProfileErrors((prev) => ({ ...prev, avatar: '' }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: typeof profileErrors = {};
    if (!name.trim()) errors.name = 'Name is required';
    if (!email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Invalid email';
    if (!handphone.trim()) errors.handphone = 'Handphone number is required';
    setProfileErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoadingProfile(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', handphone);
      if (avatarFile) formData.append('avatar', avatarFile);

      await axios.put(
        `${baseUrl}/api/auth/profile`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const { data } = await axios.get(
        `${baseUrl}/api/auth/profile`
      );
      dispatch(setUser(data.data));

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
        duration: 3000,
        variant: 'default',
      });
      setAvatarPreview(null);
      setAvatarFile(null);
      setIsDialogOpen(false); 
    } catch {
      toast({
        title: 'Update failed',
        description: 'Failed to update your profile. Please try again.',
        duration: 3000,
        variant: 'destructive',
      });
    }
    setLoadingProfile(false);
  };

  const validateProfileField = (field: 'name' | 'email' | 'handphone', value: string) => {
    let error = '';
    if (field === 'name') {
      if (!value.trim()) error = 'Name is required';
    }
    if (field === 'email') {
      if (!value.trim()) error = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email';
    }
    if (field === 'handphone') {
      if (!value.trim()) error = 'Handphone number is required';
    }
    setProfileErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <Header solid />
      <main
        className="flex-1 w-full flex flex-col md:flex-row
        md:items-start
        md:justify-start
        px-4
        md:px-[clamp(1rem,8vw,120px)]
        py-[clamp(1.5rem,4vw,3rem)]
        md:py-[clamp(2.5rem,6vw,4rem)]
        bg-[#fafafa]
        transition-all"
      >
        <div className="w-full flex flex-col md:flex-row gap-8 mt-[48px] mb-[197px]">
          <aside
            className="hidden md:flex flex-col bg-white rounded-2xl shadow-[0_4px_24px_0_rgba(0,0,0,0.06)] p-6 min-w-[240px] max-w-[260px] h-max mr-0 md:mr-8"
            style={{ marginRight: 32 }}
          >
            <div className="flex flex-row items-center mb-6 gap-3 w-max">
              <img
                src={getAvatar(user || undefined)}
                alt={user?.name || 'User'}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div className="relative group">
                <div
                  className="font-bold text-lg text-gray-900 truncate max-w-[140px] cursor-pointer"
                >
                  {user?.name}
                </div>
                <div
                  className="absolute left-1/2 -translate-x-1/2 -top-7 z-10
                    pointer-events-none
                    opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100
                    transition-all duration-200 ease-in-out
                    px-3 py-1 rounded bg-gray-700 text-white text-xs font-semibold
                    truncate max-w-[180px] shadow-lg"
                >
                  {user?.name}
                </div>
              </div>
            </div>
            <div className="border-b border-gray-300 mt-3 mb-3 md:mt-0 md:mb-6" />
            <button
              className="flex items-center gap-3 text-text-md font-medium text-left text-gray-950 mb-6"
              onClick={() => navigate('/address')}
            >
              <img
                src="/icons/delivery_address.svg"
                alt="Delivery Address"
                width={24}
                height={24}
                className="inline-block"
              />
              <span className="text-base">Delivery Address</span>
            </button>
            <button
              className="flex items-center gap-3 text-text-md font-medium text-left text-gray-950 mb-6"
              onClick={() => navigate('/orders')}
            >
              <img
                src="/icons/my_orders.svg"
                alt="My Orders"
                width={24}
                height={24}
                className="inline-block"
              />
              <span className="text-base">My Orders</span>
            </button>
            <button
              className="flex items-center gap-3 text-text-md font-medium text-left text-gray-950 hover:text-red-600"
              onClick={() => {
                navigate("/", { replace: true });
                dispatch(logout());
                localStorage.removeItem("token");
                localStorage.removeItem("user_address");
                localStorage.removeItem("user_area");
                localStorage.removeItem("user_lat");
                localStorage.removeItem("user_lng");
              }}
            >
              <img src="/icons/logout.svg" alt="Logout" width={24} height={24} className="inline-block" />
              <span className="text-base">Logout</span>
            </button>
          </aside>
          <section className="flex-1 flex flex-col items-center md:items-start">
            <h2 className="font-extrabold text-2xl md:text-3xl text-gray-900 mb-6 w-full md:w-auto">
              Profile
            </h2>
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-[0_4px_24px_0_rgba(0,0,0,0.06)] p-6 flex flex-col items-start">
              <div className="relative w-20 h-20 mb-4 self-start">
                <img
                  src={avatarPreview || getAvatar(user || undefined)}
                  alt={user?.name || 'User'}
                  className="w-20 h-20 rounded-full object-cover"
                />
              </div>
              <div className="w-full flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-950">Name</span>
                  <span className="font-bold text-gray-950">{user?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-950">Email</span>
                  <span className="font-bold text-gray-950">{user?.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-950">Handphone Number</span>
                  <span className="font-bold text-gray-950">{user?.phone || '-'}</span>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-primary text-white font-semibold h-11 rounded-full text-base hover:bg-red-700 transition mt-4"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      Update Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white shadow-lg border-none max-w-[95vw] w-full md:max-w-lg">
                    <div className="flex items-center justify-between mb-2">
                      <DialogHeader>
                        <DialogTitle>Update Profile</DialogTitle>
                      </DialogHeader>
                      <DialogClose asChild>
                        <button
                          type="button"
                          className="rounded-md p-1 hover:bg-gray-300 focus:outline-none"
                          aria-label="Close"
                        >
                          <X className="w-6 h-6 text-gray-900" />
                        </button>
                      </DialogClose>
                    </div>
                    <form onSubmit={handleUpdateProfile} className="space-y-4 mt-2">
                      <div className="flex flex-col items-start">
                        <div className="relative w-20 h-20 mb-2">
                          <img
                            src={avatarPreview || getAvatar(user || undefined)}
                            alt={user?.name || 'User'}
                            className="w-20 h-20 rounded-full object-cover"
                          />
                          <label
                            htmlFor="avatar-upload"
                            className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow cursor-pointer border border-gray-200"
                            title="Change avatar"
                          >
                            <Camera className="w-5 h-5 text-gray-700" />
                            <input
                              id="avatar-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleAvatarChange}
                            />
                          </label>
                        </div>
                        {profileErrors.avatar && (
                          <div className="w-full text-center text-primary text-sm font-semibold">
                            {profileErrors.avatar}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                          type="text"
                          className={`w-full border rounded-xl p-2 pr-10 shadow focus:ring-1 focus:shadow-md focus:ring-gray-500 focus:outline-none ${
                            profileErrors.name ? 'border-primary bg-red-50' : 'border-gray-300'
                          }`}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          onBlur={(e) => validateProfileField('name', e.target.value)}
                        />
                        {profileErrors.name && (
                          <div className="w-full mt-1 text-left text-primary text-sm font-semibold">
                            {profileErrors.name}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                          type="email"
                          className={`w-full border rounded-xl p-2 pr-10 shadow focus:ring-1 focus:shadow-md focus:ring-gray-500 focus:outline-none ${
                            profileErrors.email ? 'border-primary bg-red-50' : 'border-gray-300'
                          }`}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onBlur={(e) => validateProfileField('email', e.target.value)}
                        />
                        {profileErrors.email && (
                          <div className="w-full mt-1 text-left text-primary text-sm font-semibold">
                            {profileErrors.email}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Handphone Number</label>
                        <input
                          type="text"
                          className={`w-full border rounded-xl p-2 pr-10 shadow focus:ring-1 focus:shadow-md focus:ring-gray-500 focus:outline-none ${
                            profileErrors.handphone ? 'border-primary bg-red-50' : 'border-gray-300'
                          }`}
                          value={handphone}
                          onChange={(e) => setHandphone(e.target.value)}
                          onBlur={(e) => validateProfileField('handphone', e.target.value)}
                        />
                        {profileErrors.handphone && (
                          <div className="w-full mt-1 text-left text-primary text-sm font-semibold">
                            {profileErrors.handphone}
                          </div>
                        )}
                      </div>
                      <DialogFooter className="gap-2 mt-4 flex flex-row justify-end">
                        <DialogClose asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="h-10 px-6 rounded-full font-semibold text-base hover:bg-gray-300 transition"
                            disabled={loadingProfile}
                          >
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button
                          type="submit"
                          className="h-10 px-6 bg-primary text-white rounded-full font-semibold text-base hover:bg-red-700 transition"
                          disabled={loadingProfile}
                        >
                          {loadingProfile ? 'Saving...' : 'Save'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}