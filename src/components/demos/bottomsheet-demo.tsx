import { View } from 'react-native';

import React from 'react';
import { Text } from '../text';
import { Button } from '../button';
import { BottomSheet, useBottomSheet } from '../bottom-sheet';
import { withUniwind } from 'uniwind';
import { Ionicons } from '@expo/vector-icons';
const StyledIonicons = withUniwind(Ionicons);
export default function BottomSheetDemo() {
  const { isVisible, open, close } = useBottomSheet();
  return (
    <View>
      {/* Page Title */}
      <Text className='mb-4 text-2xl font-bold'>Bottom Sheet </Text>

      <Button onPress={open}>Open Bottom Sheet</Button>

      <BottomSheet
        isVisible={isVisible}
        onClose={close}
        title='Settings'
        description='Adjust your preferences'
        snapPoints={[0.6, 0.9]}
      >
        <View className='gap-2'>
          <View className='flex-row items-center gap-3 p-3 rounded-lg'>
            <View className='size-10 items-center justify-center rounded-full bg-sky-500/10'>
              <StyledIonicons
                name='share-social'
                size={20}
                className='text-sky-500'
              />
            </View>
            <View className='flex-1'>
              <Text className='text-base font-medium text-foreground'>
                Share Link
              </Text>
              <Text className='text-xs text-muted-foreground'>
                Send via messaging app
              </Text>
            </View>
          </View>
          <View className='flex-row items-center gap-3 p-3 rounded-lg'>
            <View className='size-10 items-center justify-center rounded-full bg-amber-500/10'>
              <StyledIonicons
                name='copy-outline'
                size={20}
                className='text-amber-500'
              />
            </View>
            <View className='flex-1'>
              <Text className='text-base font-medium text-foreground'>
                Copy Link
              </Text>
              <Text className='text-xs text-muted-foreground'>
                Copy to clipboard
              </Text>
            </View>
          </View>
          <View className='flex-row items-center gap-3 p-3 rounded-lg'>
            <View className='size-10 items-center justify-center rounded-full bg-emerald-500/10'>
              <StyledIonicons
                name='download-outline'
                size={20}
                className='text-emerald-500'
              />
            </View>
            <View className='flex-1'>
              <Text className='text-base font-medium text-foreground'>
                Save Offline
              </Text>
              <Text className='text-xs text-muted-foreground'>
                Download for later
              </Text>
            </View>
          </View>
        </View>
        <View className='mt-auto'>
          <Button variant='ghost' className='bg-accent' onPress={close}>
            Close Bottom Sheet
          </Button>
        </View>
      </BottomSheet>
    </View>
  );
}
