import { Button } from './button';
import { BottomSheet, useBottomSheet } from './bottom-sheet';
import { Input } from './input';
import { useEffect, useRef, useState } from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { Text } from './text';
import { cn } from '@/libs/utils';
import { Surface } from './surface';

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
              y: y - 150, // offset to center the item
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

      <BottomSheet
        isVisible={isVisible}
        onClose={close}
        title='Select Your Age'
        description='Please select your age to personalize your experience.'
        snapPoints={[0.75]}
      >
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
                  'text-center transition-all ease-in-out duration-200 w-full py-2',
                  {
                    'relative  border-primary py-4': age === value,
                  }
                )}
                onPress={() => onChange(age, close)}
              >
                <Text
                  className={cn('text-2xl text-center', {
                    'text-primary text-5xl': age === value,
                  })}
                >
                  {age}
                  {age === value && (
                    <Text className='ml-1 text-sm'> years</Text>
                  )}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
        {handleConfirm && (
          <Button
            onPress={confirmAge}
            size='lg'
            className='w-full my-4 bg-primary'
          >
            <Text className='text-primary-foreground'>Confirm Age</Text>
          </Button>
        )}
      </BottomSheet>
    </>
  );
}
