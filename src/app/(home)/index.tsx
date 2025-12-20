import { Avatar } from '@/components/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/card';
import { Checkbox } from '@/components/checkbox';
import AccordionDemo from '@/components/demos/accordion-demo';
import ActionSheetDemo from '@/components/demos/actionsheet-demo';
import AvatarDemo from '@/components/demos/avatar-demo';
import BottomSheetDemo from '@/components/demos/bottomsheet-demo';
import ButtonDemo from '@/components/demos/button-demo';
import CardDemo from '@/components/demos/card-demo';
import CheckBoxDemo from '@/components/demos/checkbox-demo';
import DialogDemo from '@/components/demos/dialog-demo';
import { DropdownMenuDemo } from '@/components/demos/dropdownmenu-demo';
import SelectDemo from '@/components/demos/select-demo';
import SkeletonDemo from '@/components/demos/skeleton-demo';
import { SwitchDemo } from '@/components/demos/switch-demo';
import TabsDemo from '@/components/demos/tabs-demo';
import { ScreenScrollView } from '@/components/screen-scroll-view';
import { Switch } from '@/components/switch';
import { Text } from '@/components/text';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, ScrollView, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function App() {
  const [checked, setChecked] = React.useState(false);
  return (
    <ScreenScrollView>
      <View className='gap-48 py-4'>
        <AccordionDemo />
        <ActionSheetDemo />
        <BottomSheetDemo />
        <ButtonDemo />
        <AvatarDemo />
        <CardDemo />
        <TabsDemo />
        <SkeletonDemo />
        <DialogDemo />
        <CheckBoxDemo />
        <SwitchDemo />
        <SelectDemo />
        <DropdownMenuDemo />
      </View>

      <StatusBar style='light' />
    </ScreenScrollView>
  );
}
