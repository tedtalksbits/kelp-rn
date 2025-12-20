import { useWindowDimensions, View } from 'react-native';
import React from 'react';
import * as SelectPrimitive from '@rn-primitives/select';
import { StyleSheet } from 'react-native';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../select';
import * as TablePrimitive from '@rn-primitives/table';
import * as PopoverPrimitive from '@rn-primitives/popover';
import { Text } from '../text';
import { Popover, PopoverContent, PopoverTrigger } from '../popover-primitive';
import { Button } from '../button';
import { Input } from '../input';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

export default function SelectDemo() {
  const [value, setValue] = React.useState<{ value: string; label: string }>();
  return (
    <View>
      {/* Page Title */}
      <Text className='mb-4 text-2xl font-bold'>Select </Text>

      <Select value={value} onValueChange={setValue}>
        <SelectTrigger>
          <SelectValue placeholder='Select a fruit' />
        </SelectTrigger>

        <SelectContent side='bottom' align='center'>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value='apple' label='Apple' className='rounded-none'>
              Apple
            </SelectItem>
            <SelectItem value='banana' label='Banana' className='rounded-none'>
              Banana
            </SelectItem>
            <SelectItem
              value='blueberry'
              label='Blueberry'
              className='rounded-none'
            >
              Blueberry
            </SelectItem>
            <SelectItem value='grape' label='Grape' className='rounded-none'>
              Grape
            </SelectItem>
            <SelectItem value='kiwi' label='Kiwi' className='rounded-none'>
              Kiwi
            </SelectItem>
            <SelectItem value='mango' className='rounded-none' label='Mango'>
              Mango
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* <View>
        <Popover>
          <PopoverTrigger>
            <Text className='text-foreground'>Open</Text>
          </PopoverTrigger>

          <PopoverContent className='w-72'>
            <View className='gap-2'>
              <Text className='text-base font-semibold text-foreground'>
                Quick actions
              </Text>
              <Text className='text-sm text-muted-foreground'>
                Put any content here — menu, form fields, etc.
              </Text>
            </View>
          </PopoverContent>
        </Popover>
      </View> */}
    </View>
  );
}

const KeyboardAvoidingContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { height } = useWindowDimensions();

  const { progress } = useReanimatedKeyboardAnimation();

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: progress.value === 1 ? -height * 0.15 : 0 }],
    };
  });

  return <Animated.View style={rStyle}>{children}</Animated.View>;
};
