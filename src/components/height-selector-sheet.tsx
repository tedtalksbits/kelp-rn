import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/libs/utils';
import { Button } from './button';
import { BottomSheet, useBottomSheet } from './bottom-sheet';
import { Surface } from './surface';
import { View, Pressable, ScrollView, Modal, Dimensions } from 'react-native';
import { Text } from './text';
import { GlassView } from 'expo-glass-effect';
import { withUniwind } from 'uniwind';
import { X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

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

const StyledGlassView = withUniwind(GlassView);
const StyledXIcon = withUniwind(X);

const SCREEN_HEIGHT = Dimensions.get('window').height;

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
              y: y - SCREEN_HEIGHT / 2 + 100, // center the item
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
            {/* Unit toggle */}
            <StyledGlassView className='flex flex-row bg-foreground/10 rounded-lg overflow-hidden w-1/2 mx-auto'>
              <Button
                variant={unit === 'ft-in' ? 'default' : 'ghost'}
                className='flex-1'
                onPress={() => setUnit('ft-in')}
              >
                <Text
                  className={
                    unit === 'ft-in'
                      ? 'text-primary-foreground'
                      : 'text-foreground'
                  }
                >
                  ft / in
                </Text>
              </Button>
              <Button
                variant={unit === 'cm' ? 'default' : 'ghost'}
                className='flex-1'
                onPress={() => setUnit('cm')}
              >
                <Text
                  className={
                    unit === 'cm'
                      ? 'text-primary-foreground'
                      : 'text-foreground'
                  }
                >
                  cm
                </Text>
              </Button>
            </StyledGlassView>
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
                            'w-full text-center transition-all ease-in-out duration-200 py-2 flex-row items-center',
                            {
                              'relative border-primary py-4': isSelected,
                            }
                          )}
                          onPress={() => onChange(cm, close)}
                        >
                          <Text
                            className={cn('text-2xl text-center flex-1', {
                              'text-primary text-4xl font-bold': isSelected,
                            })}
                          >
                            {cm}
                            {isSelected && (
                              <Text className='ml-1 text-sm'> cm</Text>
                            )}
                          </Text>
                          <View
                            className={cn(
                              'h-px w-6 bg-foreground/80 absolute right-0',
                              {
                                // longer line for numbers divisble by 10
                                'w-12': cm % 10 === 0,
                              }
                            )}
                          ></View>
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
                            'w-full text-center transition-all ease-in-out duration-200 py-2 flex-row items-center',
                            {
                              'relative border-primary py-4': isSelected,
                            }
                          )}
                          onPress={() => onChange(cm, close)}
                        >
                          <Text
                            className={cn('text-2xl text-center flex-1', {
                              'text-primary text-4xl font-bold': isSelected,
                            })}
                          >
                            {label}
                            {isSelected && (
                              <Text className='ml-1 text-sm'> ({cm} cm)</Text>
                            )}
                          </Text>
                          <View
                            className={cn(
                              'h-px w-6 bg-foreground/80 absolute right-0',
                              {
                                // longer line for every foot
                                'w-12': label.endsWith(`' 0"`),
                              }
                            )}
                          />
                        </Pressable>
                      );
                    })}
                  </>
                )}
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
                height: 200,
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
                height: 200,
                zIndex: 10,
              }}
            />
          </View>

          {handleConfirm && (
            <Button
              onPress={confirmHeight}
              size='lg'
              className='w-full my-4 bg-primary'
            >
              <Text className='text-primary-foreground'>Confirm Height</Text>
            </Button>
          )}
        </View>
      </Modal>
    </>
  );
}
