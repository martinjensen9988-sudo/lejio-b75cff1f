import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface VehicleImage {
  id: string;
  vehicle_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export const useVehicleImages = (vehicleId?: string) => {
  const [images, setImages] = useState<VehicleImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getStoragePathFromPublicUrl = (publicUrl: string) => {
    // Expected: https://.../storage/v1/object/public/vehicle-images/<path>
    const marker = '/storage/v1/object/public/vehicle-images/';
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) return null;
    return decodeURIComponent(publicUrl.slice(idx + marker.length));
  };

  const fetchImages = useCallback(async () => {
    if (!vehicleId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('vehicle_images')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setImages((data || []) as VehicleImage[]);
    } catch (error) {
      console.error('Error fetching vehicle images:', error);
    } finally {
      setIsLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!vehicleId) return null;

    // Require authentication (Storage write policies are authenticated)
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      toast.error('Du skal være logget ind for at uploade billeder');
      return null;
    }

    // Helpful diagnostics for ownership/RLS issues
    try {
      const [{ data: userData }, { data: vehicleRow }] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from('vehicles').select('owner_id').eq('id', vehicleId).maybeSingle(),
      ]);

      const currentUserId = userData?.user?.id;
      const ownerId = (vehicleRow as any)?.owner_id as string | undefined;

      if (currentUserId && ownerId && currentUserId !== ownerId) {
        console.warn('[vehicle-images] Upload blocked: not owner', {
          vehicleId,
          currentUserId,
          ownerId,
        });
        toast.error('Du er logget ind med en anden konto end ejeren af bilen');
        return null;
      }
    } catch (e) {
      // Ignore diagnostics errors
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Kun billedfiler er tilladt');
      return null;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Billedet må max være 5MB');
      return null;
    }

    try {
      const fileExt = file.name.split('.').pop();
      // Store images under vehicleId/ so Storage RLS can validate ownership
      const fileName = `${vehicleId}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

      // Preflight: check backend permission (helps debug RLS)
      try {
        const { data: canUpload, error: canUploadErr } = await supabase.rpc(
          'can_manage_vehicle_image_path' as any,
          { object_name: fileName } as any
        );
        console.log('[vehicle-images] can_manage_vehicle_image_path', {
          vehicleId,
          fileName,
          canUpload,
          canUploadErr,
        });
      } catch (e) {
        console.log('[vehicle-images] can_manage_vehicle_image_path preflight failed', e);
      }

      const { error: uploadError } = await supabase.storage
        .from('vehicle-images')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('vehicle-images')
        .getPublicUrl(fileName);

      // Get max display_order
      const maxOrder = images.length > 0 
        ? Math.max(...images.map(img => img.display_order)) 
        : -1;

      // Insert into database
      const { data, error } = await supabase
        .from('vehicle_images')
        .insert({
          vehicle_id: vehicleId,
          image_url: publicUrl,
          display_order: maxOrder + 1,
        })
        .select()
        .single();

      if (error) throw error;

      setImages(prev => [...prev, data as VehicleImage]);
      toast.success('Billede uploadet!');
      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      const msg = typeof (error as any)?.message === 'string' ? (error as any).message : '';
      if (msg.toLowerCase().includes('row violates row-level security')) {
        toast.error('Du har ikke rettighed til at uploade billeder til dette køretøj');
      } else {
        toast.error('Kunne ikke uploade billede');
      }
      return null;
    }
  };

  const deleteImage = async (imageId: string) => {
    try {
      // Require authentication (Storage delete policies are authenticated)
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error('Du skal være logget ind for at slette billeder');
        return false;
      }

      const image = images.find(img => img.id === imageId);
      if (!image) return false;

      // Extract storage path from URL
      const filePath = getStoragePathFromPublicUrl(image.image_url);
      if (!filePath) {
        toast.error('Kunne ikke finde filstien for billedet');
        return false;
      }

      // Delete from storage
      await supabase.storage
        .from('vehicle-images')
        .remove([filePath]);

      // Delete from database
      const { error } = await supabase
        .from('vehicle_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      setImages(prev => prev.filter(img => img.id !== imageId));
      toast.success('Billede slettet');
      return true;
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Kunne ikke slette billede');
      return false;
    }
  };

  const reorderImages = async (newOrder: { id: string; display_order: number }[]) => {
    try {
      for (const item of newOrder) {
        await supabase
          .from('vehicle_images')
          .update({ display_order: item.display_order })
          .eq('id', item.id);
      }

      // Update local state
      setImages(prev => {
        const updated = [...prev];
        for (const item of newOrder) {
          const img = updated.find(i => i.id === item.id);
          if (img) img.display_order = item.display_order;
        }
        return updated.sort((a, b) => a.display_order - b.display_order);
      });

      return true;
    } catch (error) {
      console.error('Reorder error:', error);
      toast.error('Kunne ikke omarrangere billeder');
      return false;
    }
  };

  return {
    images,
    isLoading,
    uploadImage,
    deleteImage,
    reorderImages,
    refetch: fetchImages,
  };
};
