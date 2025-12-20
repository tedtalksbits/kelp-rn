import {
  Avatar,
  AvatarFallback,
  AvatarFallbackText,
  AvatarImage,
} from '../avatar';
import { View } from 'react-native';
import { Text } from '../text';

export default function AvatarDemo() {
  return (
    <View>
      {/* Page Title */}
      <Text className='mb-4 text-2xl font-bold'>Avatar</Text>
      <View className='items-center justify-center gap-4'>
        {/* 1. Working Image */}
        <Avatar>
          <AvatarImage source={{ uri: 'https://github.com/shadcn.png' }} />
          {/* We place fallback behind; if image loads opaque, it covers it. 
            If image fails (returns null), this is visible. 
            Note: In RN Flexbox, you might want to wrap this logic or use absolute positioning if you want them strictly stacked without condition.
            
            BETTER PATTERN FOR RN: */}
          <View className='absolute inset-0 -z-10 h-full w-full items-center justify-center rounded-full bg-muted'>
            <AvatarFallbackText>CN</AvatarFallbackText>
          </View>
        </Avatar>

        {/* 2. Missing Image (Fallback shows) */}
        <Avatar>
          <AvatarFallback>
            <AvatarFallbackText>JD</AvatarFallbackText>
          </AvatarFallback>
        </Avatar>
      </View>
    </View>
  );
}
