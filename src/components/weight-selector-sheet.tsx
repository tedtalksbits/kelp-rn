import { useEffect, useRef, useState } from 'react';
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

type UnitMode = 'kg' | 'lbs';

const StyledGlassView = withUniwind(GlassView);
const StyledXIcon = withUniwind(X);

const KG_MIN = 30;
const KG_MAX = 200;

const LBS_MIN = 70;
const LBS_MAX = 440;

const kgToLbs = (kg: number) => Math.round(kg * 2.20462);
const lbsToKg = (lbs: number) => Math.round(lbs * 0.45359237);

const SCREEN_HEIGHT = Dimensions.get('window').height;

export function WeightSelectorSheet({
  trigger,
  handleConfirm,
  value, // stored in kg
  onChange,
}: {
  trigger?: React.ReactNode;
  handleConfirm?: (kg: number) => void;
  value: number;
  onChange: (kg: number, close: () => void) => void;
}) {
  const { isVisible, open, close } = useBottomSheet();
  const [unit, setUnit] = useState<UnitMode>('kg');

  // temporary selection for the sheet UI
  const [tempKg, setTempKg] = useState<number>(value);
  const [tempLbs, setTempLbs] = useState<number>(kgToLbs(value));

  const scrollViewRef = useRef<ScrollView>(null);
  const selectedWeightRefs = useRef<{ [key: number]: View | null }>({});

  const triggerLabel = unit === 'kg' ? `${tempKg} kg` : `${tempLbs} lbs`;

  // Auto-scroll to selected weight when sheet opens or unit changes
  useEffect(() => {
    if (!isVisible) return;

    const currentValue = unit === 'kg' ? tempKg : tempLbs;
    if (!selectedWeightRefs.current[currentValue]) return;

    const timer = setTimeout(() => {
      if (selectedWeightRefs.current[currentValue] && scrollViewRef.current) {
        selectedWeightRefs.current[currentValue]?.measureLayout(
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
  }, [unit, isVisible, tempKg, tempLbs]);

  const confirm = () => {
    onChange(tempKg, close);
    handleConfirm?.(tempKg);
    close();
  };

  return (
    <>
      {trigger ? (
        <Pressable onPress={open}>{trigger}</Pressable>
      ) : (
        <Pressable onPress={open}>
          <Surface className='p-2'>
            <Text className='text-lg'>
              {tempKg ? triggerLabel : 'Add weight'}
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
            {/* Unit toggle */}
            <StyledGlassView className='flex flex-row bg-foreground/10 rounded-lg overflow-hidden w-1/2 mx-auto'>
              <Button
                variant={unit === 'kg' ? 'default' : 'ghost'}
                className='flex-1'
                onPress={() => setUnit('kg')}
              >
                <Text
                  className={
                    unit === 'kg'
                      ? 'text-primary-foreground'
                      : 'text-foreground'
                  }
                >
                  kg
                </Text>
              </Button>
              <Button
                variant={unit === 'lbs' ? 'default' : 'ghost'}
                className='flex-1'
                onPress={() => setUnit('lbs')}
              >
                <Text
                  className={
                    unit === 'lbs'
                      ? 'text-primary-foreground'
                      : 'text-foreground'
                  }
                >
                  lbs
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
                {unit === 'kg' &&
                  Array.from(
                    { length: KG_MAX - KG_MIN + 1 },
                    (_, i) => KG_MIN + i
                  ).map((kg) => {
                    const isSelected = kg === tempKg;
                    return (
                      <Pressable
                        key={kg}
                        ref={(ref) => {
                          selectedWeightRefs.current[kg] = ref;
                        }}
                        className={cn(
                          'w-full text-center transition-all ease-in-out duration-200 py-2 flex-row items-center',
                          isSelected && 'relative border-primary py-4'
                        )}
                        onPress={() => {
                          setTempKg(kg);
                          setTempLbs(kgToLbs(kg));
                          onChange(kg, close);
                        }}
                      >
                        <Text
                          className={cn('text-2xl text-center flex-1', {
                            'text-primary text-4xl font-bold': isSelected,
                          })}
                        >
                          {kg}{' '}
                          {isSelected && (
                            <Text className='ml-1 text-sm'> kg</Text>
                          )}
                        </Text>
                        <View
                          className={cn(
                            'h-px w-6 bg-foreground/80 absolute right-0',
                            {
                              // longer line for numbers divisble by 10
                              'w-12': kg % 10 === 0,
                            }
                          )}
                        ></View>
                      </Pressable>
                    );
                  })}

                {unit === 'lbs' &&
                  Array.from(
                    { length: LBS_MAX - LBS_MIN + 1 },
                    (_, i) => LBS_MIN + i
                  ).map((lbs) => {
                    const isSelected = lbs === tempLbs;
                    return (
                      <Pressable
                        key={lbs}
                        ref={(ref) => {
                          selectedWeightRefs.current[lbs] = ref;
                        }}
                        className={cn(
                          'w-full text-center py-2 transition-all ease-in-out duration-200 flex-row items-center',
                          isSelected && 'border-primary py-4'
                        )}
                        onPress={() => {
                          setTempLbs(lbs);
                          setTempKg(lbsToKg(lbs));
                          onChange(lbsToKg(lbs), close);
                        }}
                      >
                        <Text
                          className={cn('text-2xl text-center flex-1', {
                            'text-primary text-4xl font-bold': isSelected,
                          })}
                        >
                          {lbs}
                          {isSelected && (
                            <Text className='ml-1 text-sm'>lbs</Text>
                          )}
                        </Text>
                        <View
                          className={cn(
                            'h-px w-6 bg-foreground/80 absolute right-0',
                            {
                              // longer line for numbers divisble by 10
                              'w-12': lbs % 10 === 0,
                            }
                          )}
                        ></View>
                      </Pressable>
                    );
                  })}
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
              onPress={confirm}
              size='lg'
              className='w-full my-4 bg-primary'
            >
              <Text className='text-primary-foreground'>Confirm Weight</Text>
            </Button>
          )}
        </View>
      </Modal>
    </>
  );
}
