'use client';

import { useState } from 'react';
import { Button } from '@/components/button';
import { Loader2, Upload, X, User } from 'lucide-react-native';
import { supabase } from '@/libs/supabase/supabase';
import { useUpdateProfile } from '../hooks/use-profile';
import { View, Pressable, Alert, Image } from 'react-native';
// import { Image } from 'expo-image';
import { Text } from '@/components/text';
import * as ImagePicker from 'expo-image-picker';
import { decode as base64ToArrayBuffer } from 'base64-arraybuffer';

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl: string | null;
  onUploadComplete: (url: string) => void;
}

export function AvatarUpload({
  userId,
  currentAvatarUrl,
  onUploadComplete,
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl);

  const updateUserProfile = useUpdateProfile();

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera roll permissions to upload an avatar.'
      );
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true, // Important for ArrayBuffer conversion
      exif: false,
    });

    if (!result.canceled && result.assets[0]) {
      await handleImageUpload(result.assets[0]);
    }
  };

  const takePhoto = async () => {
    // Request permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera permissions to take a photo.'
      );
      return;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true, // Important for ArrayBuffer conversion
      exif: false,
    });

    if (!result.canceled && result.assets[0]) {
      await handleImageUpload(result.assets[0]);
    }
  };

  const showImageOptions = () => {
    Alert.alert('Upload Avatar', 'Choose an option', [
      {
        text: 'Take Photo',
        onPress: takePhoto,
      },
      {
        text: 'Choose from Library',
        onPress: pickImage,
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const handleImageUpload = async (asset: ImagePicker.ImagePickerAsset) => {
    if (!asset.base64) {
      Alert.alert('Error', 'Failed to process image');
      return;
    }

    // Validate file size (max 5MB)
    if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
      Alert.alert('Error', 'File size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      // Infer file extension and mime type
      const mime = asset.mimeType || 'image/jpeg';
      let ext = 'jpg';
      if (mime.includes('png')) ext = 'png';
      else if (mime.includes('webp')) ext = 'webp';
      else if (mime.includes('heic')) ext = 'heic';
      else if (mime.includes('jpeg')) ext = 'jpg';

      // Convert base64 to ArrayBuffer
      const bytes = base64ToArrayBuffer(asset.base64);

      const profileDir = `${userId}/profile`;
      const filePath = `${profileDir}/avatar.${ext}`;

      // Clean up any existing avatars in the profile directory
      try {
        const { data: existingFiles } = await supabase.storage
          .from('kelp-user-avatars')
          .list(profileDir);

        if (existingFiles && existingFiles.length > 0) {
          const filesToDelete = existingFiles.map(
            (file) => `${profileDir}/${file.name}`
          );
          await supabase.storage
            .from('kelp-user-avatars')
            .remove(filesToDelete);
        }
      } catch (cleanupError) {
        console.warn('Error cleaning up old avatars:', cleanupError);
        // Continue with upload even if cleanup fails
      }

      // Upload to Supabase Storage using ArrayBuffer
      const { error: uploadError } = await supabase.storage
        .from('kelp-user-avatars')
        .upload(filePath, bytes, {
          contentType: mime,
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('kelp-user-avatars').getPublicUrl(filePath);

      // Update user profile to prevent orphaned files
      await updateUserProfile.mutateAsync({
        userId,
        updates: { avatar_url: publicUrl },
      });

      const urlWithCacheBust = `${publicUrl}?t=${Date.now()}`;

      setPreviewUrl(urlWithCacheBust);
      onUploadComplete(urlWithCacheBust);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      Alert.alert('Error', 'Failed to upload avatar. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    Alert.alert(
      'Remove Avatar',
      'Are you sure you want to remove your avatar?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clean up all files in the user's profile directory
              const profileDir = `${userId}/profile`;
              const { data: existingFiles } = await supabase.storage
                .from('kelp-user-avatars')
                .list(profileDir);

              if (existingFiles && existingFiles.length > 0) {
                const filesToDelete = existingFiles.map(
                  (file) => `${profileDir}/${file.name}`
                );
                await supabase.storage
                  .from('kelp-user-avatars')
                  .remove(filesToDelete);
              }

              setPreviewUrl(null);
              onUploadComplete('');

              await updateUserProfile.mutateAsync({
                userId,
                updates: { avatar_url: null },
              });
            } catch (error) {
              console.error('Error removing avatar:', error);
              Alert.alert(
                'Error',
                'Failed to remove avatar. Please try again.'
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View className='flex flex-col gap-2 items-center'>
      <Pressable
        onPress={showImageOptions}
        disabled={uploading}
        className='relative'
      >
        {uploading ? (
          <View className='relative w-24 h-24 rounded-full overflow-hidden bg-secondary border-2 border-border flex items-center justify-center'>
            <Loader2 size={24} color='#a3e635' className='animate-spin' />
          </View>
        ) : (
          <>
            <View className='relative w-24 h-24 rounded-full overflow-hidden bg-secondary border-2 border-border'>
              {previewUrl ? (
                <Image
                  source={{ uri: previewUrl }}
                  className='w-full h-full'
                  resizeMode='cover'
                />
              ) : (
                <View className='w-full h-full flex items-center justify-center'>
                  <User size={48} color='#71717a' />
                </View>
              )}
            </View>
            <View className='absolute bottom-0 right-0 bg-black/60 rounded-full p-1 m-2'>
              <Upload size={16} color='#ffffff' />
            </View>
          </>
        )}
      </Pressable>

      {previewUrl && (
        <Button
          variant='ghost'
          size='sm'
          onPress={handleRemove}
          disabled={uploading}
        >
          <View className='flex flex-row items-center gap-2'>
            <X size={16} color='#ef4444' />
            <Text>Remove</Text>
          </View>
        </Button>
      )}

      <Text className='text-[10px] text-muted-foreground'>
        JPG, PNG or GIF. Max 5MB.
      </Text>
    </View>
  );
}
