import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/libs/utils';
import { Button } from './button';
import { BottomSheet, useBottomSheet } from './bottom-sheet';
import { Surface } from './surface';
import { View, Pressable, ScrollView } from 'react-native';
import { Text } from './text';

const EquipmentOptions = [
  {
    label: 'Sledge Hammer',
    value: 'hammer',
    img: '/images/equipments/machine.png',
  },
  {
    label: 'Elliptical Machine',
    value: 'elliptical machine',
    img: '/images/equipments/elliptical-machine.png',
  },
  {
    label: 'Medicine Ball',
    value: 'medicine ball',
    img: '/images/equipments/ball.png',
  },
  {
    label: 'Stepmill Machine',
    value: 'stepmill machine',
    img: '/images/equipments/stepmill-machine.png',
  },
  { label: 'Roller', value: 'roller', img: '/images/equipments/roller.png' },
  {
    label: 'Bodyweight',
    value: 'bodyweight',
    img: '/images/equipments/bodyweight.png',
  },
  { label: 'Tire', value: 'tire', img: '/images/equipments/tire.png' },
  {
    label: 'Dumbbell',
    value: 'dumbbell',
    img: '/images/equipments/dumbbell.png',
  },
  {
    label: 'Resistance Band',
    value: 'resistance band',
    img: '/images/equipments/band.png',
  },
  {
    label: 'Olympic Barbell',
    value: 'olympic barbell',
    img: '/images/equipments/barbell.png',
  },
  {
    label: 'Bosu Ball',
    value: 'bosu ball',
    img: '/images/equipments/bosu-ball.png',
  },
  {
    label: 'Upper Body Ergometer',
    value: 'upper body ergometer',
    img: '/images/equipments/ube.png',
  },
  {
    label: 'Smith Machine',
    value: 'smith machine',
    img: '/images/equipments/smith-machine.png',
  },
  { label: 'Rope', value: 'rope', img: '/images/equipments/jump-rope.png' },
  {
    label: 'Stability Ball',
    value: 'stability ball',
    img: '/images/equipments/ball2.png',
  },
  {
    label: 'Sled Machine',
    value: 'sled machine',
    img: '/images/equipments/sled-machine.png',
  },
  {
    label: 'Stationary Bike',
    value: 'stationary bike',
    img: '/images/equipments/stationary-bike.png',
  },
  {
    label: 'Wheel Roller',
    value: 'wheel roller',
    img: '/images/equipments/roller.png',
  },
  { label: 'Barbell', value: 'barbell', img: '/images/equipments/barbell.png' },
  {
    label: 'Weights',
    value: 'weighted',
    img: '/images/equipments/weight.png',
  },
  {
    label: 'Kettlebell',
    value: 'kettlebell',
    img: '/images/equipments/kettlebell.png',
  },
  {
    label: 'Cable',
    value: 'cable',
    img: '/images/equipments/cable-machine.png',
  },
] as const;

export type EquipmentValue = (typeof EquipmentOptions)[number]['value'];

export function GymEquipmentSelectorSheet({
  trigger,
  handleConfirm,
  value,
  onChange,
}: {
  trigger?: React.ReactElement;
  handleConfirm?: (equipment: string[]) => void;
  value: string[]; // array of selected equipment
  onChange: (equipment: string[], close: () => void) => void;
}) {
  const { isVisible, open, close } = useBottomSheet();
  const scrollViewRef = useRef<ScrollView>(null);
  const selectedEquipmentRefs = useRef<{ [key: string]: View | null }>({});

  // Auto-scroll to the first selected item when sheet opens
  useEffect(() => {
    if (!isVisible || value.length === 0) return;

    const firstSelected = value[0];
    if (!selectedEquipmentRefs.current[firstSelected]) return;

    const timer = setTimeout(() => {
      if (
        selectedEquipmentRefs.current[firstSelected] &&
        scrollViewRef.current
      ) {
        selectedEquipmentRefs.current[firstSelected]?.measureLayout(
          scrollViewRef.current as any,
          (x, y) => {
            scrollViewRef.current?.scrollTo({
              y: y - 150,
              animated: true,
            });
          },
          () => {}
        );
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isVisible, value]);

  // For text display in the trigger
  const displayLabel =
    value.length === 0
      ? 'Select Equipment'
      : value
          .map((v) => EquipmentOptions.find((o) => o.value === v)?.label)
          .filter(Boolean)
          .join(', ');

  const toggleEquipment = (equipment: string) => {
    if (value.includes(equipment)) {
      onChange(
        value.filter((v) => v !== equipment),
        close
      );
    } else {
      onChange([...value, equipment], close);
    }
  };

  const confirm = () => {
    handleConfirm?.(value);
    close();
  };

  const triggerElement = React.cloneElement(
    trigger ?? (
      <Surface className='p-2'>
        <Text className='text-lg'>{displayLabel}</Text>
      </Surface>
    ),
    {
      onPress: open,
    }
  );

  return (
    <>
      {triggerElement}

      <BottomSheet
        isVisible={isVisible}
        onClose={close}
        title='Select Equipment'
        description='Choose all equipment used for this exercise.'
        snapPoints={[0.95]}
      >
        <ScrollView
          ref={scrollViewRef}
          className='flex-1 -mx-4 bg-popover'
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className='p-2'>
            {EquipmentOptions.map((opt) => {
              const isSelected = value.includes(opt.value);

              return (
                <Pressable
                  key={opt.value}
                  ref={(ref) => {
                    selectedEquipmentRefs.current[opt.value] = ref;
                  }}
                  className={cn(
                    'w-full py-3 px-3 transition border-b border-border',
                    'active:bg-muted',
                    isSelected && 'bg-primary'
                  )}
                  onPress={() => toggleEquipment(opt.value)}
                >
                  <Text
                    className={cn(
                      'text-lg font-bold italic text-center',
                      isSelected && 'text-primary-foreground text-3xl'
                    )}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {handleConfirm && (
          <Button
            onPress={confirm}
            size='lg'
            className='w-full my-4 bg-primary'
          >
            <Text className='text-primary-foreground'>Confirm Equipment</Text>
          </Button>
        )}
      </BottomSheet>
    </>
  );
}
