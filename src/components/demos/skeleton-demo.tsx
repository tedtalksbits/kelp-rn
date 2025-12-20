import { View } from 'react-native';
import React from 'react';
import { Skeleton } from '../skeleton';
import { Text } from '../text';

const SkeletonDemo = () => {
  return (
    <View>
      {/* Page Title */}
      <Text className='mb-4 text-2xl font-bold'>Skeleton </Text>
      <View className='flex flex-row items-center gap-4'>
        <Skeleton className='h-12 w-12 rounded-full' />
        <View className='gap-2'>
          <Skeleton className='h-4 w-62.5' />
          <Skeleton className='h-4 w-50' />
        </View>
      </View>
    </View>
  );
};

export default SkeletonDemo;
