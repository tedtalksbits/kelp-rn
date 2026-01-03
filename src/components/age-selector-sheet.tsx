import { Button } from './button';
import { BottomSheet, useBottomSheet } from './bottom-sheet';
import { Input } from './input';
import { useEffect, useRef, useState } from 'react';
import { View, Pressable, ScrollView, Modal, Dimensions } from 'react-native';
import { Text } from './text';
import { cn } from '@/libs/utils';
import { Surface } from './surface';
import { withUniwind } from 'uniwind';
import { GlassView } from 'expo-glass-effect';
import { X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const StyledGlassView = withUniwind(GlassView);
const StyledXIcon = withUniwind(X);
export function AgeSelectorSheet({
  trigger,
  handleConfirm,
  value,
  onChange,
}: {
  trigger?: React.ReactNode;
  handleConfirm?: (age: number) => void;
  value: number;
  onChange: (age: number, close: () => void) => void;
}) {
  const { isVisible, open, close } = useBottomSheet();
  const scrollViewRef = useRef<ScrollView>(null);
  const selectedAgeRefs = useRef<{ [key: number]: View | null }>({});

  const confirmAge = () => {
    handleConfirm?.(value);
    close();
  };

  const AGE_MIN = 10;
  const AGE_MAX = 100;

  const SCREEN_HEIGHT = Dimensions.get('window').height;

  // Scroll to selected age when sheet opens or value changes
  useEffect(() => {
    if (!isVisible || !selectedAgeRefs.current[value]) return;

    const timer = setTimeout(() => {
      // Use measureLayout to get the position of the selected item
      if (selectedAgeRefs.current[value] && scrollViewRef.current) {
        selectedAgeRefs.current[value]?.measureLayout(
          scrollViewRef.current as any,
          (x, y) => {
            scrollViewRef.current?.scrollTo({
              y: y - SCREEN_HEIGHT / 2 + 100, // center the item
              animated: true,
            });
          },
          () => {}
        );
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isVisible, value]);

  return (
    <>
      {trigger ? (
        <Pressable onPress={open}>{trigger}</Pressable>
      ) : (
        <Pressable onPress={open}>
          <Surface className='p-2'>
            <Text className='text-lg'>
              {value ? `${value} years` : 'Select Age'}
            </Text>
          </Surface>
        </Pressable>
      )}

      <Modal
        visible={isVisible}
        onRequestClose={close}
        animationType='slide'
        presentationStyle='pageSheet'
        className='bg-popover flex-1 relative'
      >
        <View className='flex-1 bg-popover'>
          {/* Header */}
          <View className='p-4 fixed top-0 left-0 right-0 z-10 border-b border-border'>
            <Text className='text-2xl font-bold text-center'>Select Age</Text>
            {/* close button */}
            <StyledGlassView
              onTouchEnd={close}
              className='absolute top-4 right-4 p-2 rounded-full bg-foreground/10'
            >
              <StyledXIcon size={24} className='text-foreground' />
            </StyledGlassView>
          </View>
          <View className='flex-1 relative'>
            <ScrollView
              ref={scrollViewRef}
              className='flex-1 -mx-4 bg-popover'
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
            >
              <View className='p-2'>
                {Array.from(
                  { length: AGE_MAX - AGE_MIN + 1 },
                  (_, i) => AGE_MIN + i
                ).map((age) => (
                  <Pressable
                    key={age}
                    ref={(ref) => {
                      selectedAgeRefs.current[age] = ref;
                    }}
                    className={cn(
                      'w-full text-center transition-all ease-in-out duration-200 py-2 flex-row items-center',
                      {
                        'relative border-primary py-4': age === value,
                      }
                    )}
                    onPress={() => onChange(age, close)}
                  >
                    <Text
                      className={cn('text-2xl text-center flex-1', {
                        'text-primary text-4xl font-bold': age === value,
                      })}
                    >
                      {age}
                      {age === value && (
                        <Text className='ml-1 text-sm'> years</Text>
                      )}
                    </Text>
                    <View
                      className={cn(
                        'h-px w-6 bg-foreground/80 absolute right-0',
                        {
                          // longer line for every foot
                          'w-12': age % 10 === 0,
                        }
                      )}
                    />
                  </Pressable>
                ))}
              </View>
            </ScrollView>
            {/* Top gradient overlay - darker at top, fading to transparent */}
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.8)', 'transparent']}
              pointerEvents='none'
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 300,
                zIndex: 10,
              }}
            />

            {/* Bottom gradient overlay - transparent fading to darker at bottom */}
            <LinearGradient
              colors={['transparent', 'rgba(0, 0, 0, 0.8)']}
              pointerEvents='none'
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 300,
                zIndex: 10,
              }}
            />
          </View>
          {handleConfirm && (
            <Button
              onPress={confirmAge}
              size='lg'
              className='w-full my-4 bg-primary'
            >
              <Text className='text-primary-foreground'>Confirm Age</Text>
            </Button>
          )}
        </View>
      </Modal>
    </>
  );
}
