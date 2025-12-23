import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/libs/utils';
import { Button } from './button';
import { BottomSheet, useBottomSheet } from './bottom-sheet';
import { Surface } from './surface';
import { View, Pressable, ScrollView } from 'react-native';
import { Text } from './text';

type HeightSelectorSheetProps = {
  trigger?: React.ReactNode;
  handleConfirm?: (heightCm: number) => void;
  value: number; // stored as cm
  onChange: (heightCm: number, close: () => void) => void;
};

type UnitMode = 'ft-in' | 'cm';

const CM_MIN = 120; // 120 cm ~ 3'11"
const CM_MAX = 220; // 220 cm ~ 7'3"

const FEET_MIN = 4;
const FEET_MAX = 7;

// Convert cm to closest feet/inches
function cmToFeetInches(cm: number) {
  const totalInches = cm / 2.54;
  const roundedInches = Math.round(totalInches);
  const feet = Math.floor(roundedInches / 12);
  const inches = roundedInches % 12;
  return { feet, inches };
}

// Convert feet/inches to cm
function feetInchesToCm(feet: number, inches: number) {
  const totalInches = feet * 12 + inches;
  return Math.round(totalInches * 2.54);
}

export function HeightSelectorSheet({
  trigger,
  handleConfirm,
  value,
  onChange,
}: HeightSelectorSheetProps) {
  const { isVisible, open, close } = useBottomSheet();
  const [unit, setUnit] = useState<UnitMode>('ft-in');
  const scrollViewRef = useRef<ScrollView>(null);
  const selectedHeightRefs = useRef<{ [key: number]: View | null }>({});

  const confirmHeight = () => {
    handleConfirm?.(value);
    close();
  };

  const normalizedValue = Number.isFinite(value) ? Math.round(value) : 180;

  // Precompute ft/in options list
  const feetInchesOptions = useMemo(() => {
    const list: { label: string; cm: number; feet: number; inches: number }[] =
      [];
    for (let ft = FEET_MIN; ft <= FEET_MAX; ft++) {
      for (let inch = 0; inch < 12; inch++) {
        const cm = feetInchesToCm(ft, inch);
        if (cm < CM_MIN || cm > CM_MAX) continue;
        list.push({
          label: `${ft}' ${inch}"`,
          cm,
          feet: ft,
          inches: inch,
        });
      }
    }
    return list;
  }, []);

  // Scroll to selected height when sheet opens or unit changes
  useEffect(() => {
    if (!isVisible || !selectedHeightRefs.current[normalizedValue]) return;

    const timer = setTimeout(() => {
      if (
        selectedHeightRefs.current[normalizedValue] &&
        scrollViewRef.current
      ) {
        selectedHeightRefs.current[normalizedValue]?.measureLayout(
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
  }, [unit, isVisible, normalizedValue]);

  const displayValue = normalizedValue
    ? (() => {
        if (unit === 'cm') {
          return `${normalizedValue} cm`;
        }
        const { feet, inches } = cmToFeetInches(normalizedValue);
        return `${feet}' ${inches}"`;
      })()
    : 'Select Height';

  return (
    <>
      {trigger ? (
        <Pressable onPress={open}>{trigger}</Pressable>
      ) : (
        <Pressable onPress={open}>
          <Surface className='p-2'>
            <Text className='text-lg'>{displayValue}</Text>
          </Surface>
        </Pressable>
      )}

      <BottomSheet
        isVisible={isVisible}
        onClose={close}
        title='Select Your Height'
        description="Choose your preferred unit. We'll store it as centimeters."
        snapPoints={[0.75]}
      >
        {/* Unit toggle */}
        <View className='flex flex-row gap-2 mb-4'>
          <Button
            variant={unit === 'ft-in' ? 'default' : 'outline'}
            className='flex-1'
            onPress={() => setUnit('ft-in')}
          >
            <Text
              className={
                unit === 'ft-in' ? 'text-primary-foreground' : 'text-foreground'
              }
            >
              ft / in
            </Text>
          </Button>
          <Button
            variant={unit === 'cm' ? 'default' : 'outline'}
            className='flex-1'
            onPress={() => setUnit('cm')}
          >
            <Text
              className={
                unit === 'cm' ? 'text-primary-foreground' : 'text-foreground'
              }
            >
              cm
            </Text>
          </Button>
        </View>

        <ScrollView
          ref={scrollViewRef}
          className='flex-1 -mx-4 bg-popover'
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className='p-2'>
            {unit === 'cm' ? (
              <>
                {Array.from(
                  { length: CM_MAX - CM_MIN + 1 },
                  (_, i) => CM_MIN + i
                ).map((cm) => {
                  const isSelected = normalizedValue === cm;
                  return (
                    <Pressable
                      key={cm}
                      ref={(ref) => {
                        selectedHeightRefs.current[cm] = ref;
                      }}
                      className={cn(
                        'w-full text-center transition-all ease-in-out duration-200 py-2',
                        {
                          'relative border-primary py-4': isSelected,
                        }
                      )}
                      onPress={() => onChange(cm, close)}
                    >
                      <Text
                        className={cn('text-2xl text-center', {
                          'text-primary text-4xl': isSelected,
                        })}
                      >
                        {cm}
                        {isSelected && (
                          <Text className='ml-1 text-sm'> cm</Text>
                        )}
                      </Text>
                    </Pressable>
                  );
                })}
              </>
            ) : (
              <>
                {feetInchesOptions.map(({ cm, label }) => {
                  const isSelected = normalizedValue === cm;
                  return (
                    <Pressable
                      key={label}
                      ref={(ref) => {
                        selectedHeightRefs.current[cm] = ref;
                      }}
                      className={cn(
                        'w-full text-center transition-all ease-in-out duration-200 py-2',
                        {
                          'relative border-primary py-4': isSelected,
                        }
                      )}
                      onPress={() => onChange(cm, close)}
                    >
                      <Text
                        className={cn('text-2xl text-center', {
                          'text-primary text-4xl': isSelected,
                        })}
                      >
                        {label}
                        {isSelected && (
                          <Text className='ml-1 text-sm'> ({cm} cm)</Text>
                        )}
                      </Text>
                    </Pressable>
                  );
                })}
              </>
            )}
          </View>
        </ScrollView>

        {handleConfirm && (
          <Button
            onPress={confirmHeight}
            size='lg'
            className='w-full my-4 bg-primary'
          >
            <Text className='text-primary-foreground'>Confirm Height</Text>
          </Button>
        )}
      </BottomSheet>
    </>
  );
}
