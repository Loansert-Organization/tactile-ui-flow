import React, { useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfileContext } from '@/contexts/ProfileContext';
import { toast } from 'sonner';

interface AvatarUploaderProps {
  avatarUrl: string | null;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({ avatarUrl }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const { profile, updateProfile } = useProfileContext();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${profile.id}_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      await updateProfile({ avatar_url: data.publicUrl });
    } catch (err:any) {
      console.error(err);
      toast.error('Avatar upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <img
        src={avatarUrl || '/placeholder.svg'}
        alt="avatar"
        className="w-24 h-24 rounded-full object-cover border"
      />
      <button
        onClick={()=>fileRef.current?.click()}
        className="text-sm text-blue-500 hover:underline disabled:opacity-50"
        disabled={uploading}
      >{uploading?'Uploading...':'Change Avatar'}</button>
      <input type="file" accept="image/*" hidden ref={fileRef} onChange={handleUpload} />
    </div>
  );
}; 