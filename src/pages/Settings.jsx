import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Upload, Camera, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function Settings() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    const savedWallet = localStorage.getItem('kmail_wallet');
    if (savedWallet) {
      setWalletAddress(savedWallet);
    }
  }, []);

  // Fetch user profile
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', walletAddress],
    queryFn: async () => {
      if (!walletAddress) return null;
      const profiles = await base44.entities.User.filter({ wallet_address: walletAddress });
      return profiles[0] || null;
    },
    enabled: !!walletAddress
  });

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.display_name || '');
      setBio(userProfile.bio || '');
      setProfilePhoto(userProfile.profile_photo || '');
    }
  }, [userProfile]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      if (userProfile) {
        return base44.entities.User.update(userProfile.id, data);
      } else {
        return base44.entities.User.create({ ...data, wallet_address: walletAddress });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success('Profile updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update profile');
    }
  });

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setProfilePhoto(file_url);
      toast.success('Photo uploaded successfully!');
    } catch (err) {
      toast.error('Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    updateProfileMutation.mutate({
      display_name: displayName,
      bio: bio,
      profile_photo: profilePhoto
    });
  };

  if (!walletAddress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Please connect your wallet first</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69506fa02c99223b93dc5a26/449cf3baf_image.png)' }}>
      <div className="min-h-screen bg-black/60 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to={createPageUrl('Mail')}>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-cyan-500/20">
                <ArrowLeft className="w-5 h-5 text-cyan-400" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-cyan-400">Settings</h1>
          </div>

          {/* Profile Card */}
          <div className="bg-gray-900 rounded-xl border border-cyan-500/30 shadow-[0_0_30px_rgba(0,217,255,0.2)] p-8">
            <h2 className="text-xl font-semibold text-white mb-6">Profile Settings</h2>

            {/* Profile Photo */}
            <div className="flex items-center gap-6 mb-8">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-cyan-500/30">
                  <AvatarImage src={profilePhoto} />
                  <AvatarFallback className="bg-gray-800 text-cyan-400 text-3xl">
                    {displayName?.charAt(0) || walletAddress?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                <label htmlFor="photo-upload" className="absolute bottom-0 right-0 p-2 bg-cyan-500 rounded-full cursor-pointer hover:bg-cyan-400 shadow-[0_0_15px_rgba(0,217,255,0.5)] transition-all">
                  <Camera className="w-5 h-5 text-black" />
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium mb-1">Profile Photo</p>
                <p className="text-gray-400 text-sm mb-3">
                  {isUploading ? 'Uploading...' : 'Click the camera icon to upload a new photo'}
                </p>
                {profilePhoto && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setProfilePhoto('')}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    Remove Photo
                  </Button>
                )}
              </div>
            </div>

            {/* Wallet Address */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-cyan-400 mb-2">
                Wallet Address
              </label>
              <Input
                value={walletAddress}
                disabled
                className="bg-gray-800 border-cyan-500/30 text-gray-400 cursor-not-allowed"
              />
            </div>

            {/* Display Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-cyan-400 mb-2">
                Display Name
              </label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
                className="bg-gray-800 border-cyan-500/30 text-white focus:border-cyan-500"
              />
            </div>

            {/* Bio */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-cyan-400 mb-2">
                Bio
              </label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell others about yourself..."
                rows={4}
                className="bg-gray-800 border-cyan-500/30 text-white focus:border-cyan-500 resize-none"
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={updateProfileMutation.isPending}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-8 shadow-[0_0_20px_rgba(0,217,255,0.5)] hover:shadow-[0_0_30px_rgba(0,217,255,0.7)]"
              >
                {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                <Save className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}