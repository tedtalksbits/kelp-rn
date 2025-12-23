import { useEffect, useRef, useState } from 'react';
import { cn } from '@/libs/utils';
import { Button } from './button';
import { BottomSheet, useBottomSheet } from './bottom-sheet';
import { Surface } from './surface';
import { View, Pressable, ScrollView } from 'react-native';
import { Text } from './text';

type UnitMode = 'kg' | 'lbs';

const KG_MIN = 30;
const KG_MAX = 200;

const LBS_MIN = 70;
const LBS_MAX = 440;

const kgToLbs = (kg: number) => Math.round(kg * 2.20462);
const lbsToKg = (lbs: number) => Math.round(lbs * 0.45359237);

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
              y: y - 150,
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

      <BottomSheet
        isVisible={isVisible}
        onClose={close}
        title='Select Your Weight'
        description='Stored internally as kilograms'
        snapPoints={[0.75]}
      >
        {/* Unit toggle */}
        <View className='flex flex-row gap-2 mb-4'>
          <Button
            variant={unit === 'kg' ? 'default' : 'outline'}
            className='flex-1'
            onPress={() => setUnit('kg')}
          >
            <Text
              className={
                unit === 'kg' ? 'text-primary-foreground' : 'text-foreground'
              }
            >
              kg
            </Text>
          </Button>
          <Button
            variant={unit === 'lbs' ? 'default' : 'outline'}
            className='flex-1'
            onPress={() => setUnit('lbs')}
          >
            <Text
              className={
                unit === 'lbs' ? 'text-primary-foreground' : 'text-foreground'
              }
            >
              lbs
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
                      'w-full text-center py-2 transition',
                      isSelected && 'border-primary py-4'
                    )}
                    onPress={() => {
                      setTempKg(kg);
                      setTempLbs(kgToLbs(kg));
                    }}
                  >
                    <Text
                      className={cn('text-2xl text-center', {
                        'text-primary text-4xl': isSelected,
                      })}
                    >
                      {kg} kg
                    </Text>
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
                      'w-full text-center py-2 transition',
                      isSelected && 'border-primary py-4'
                    )}
                    onPress={() => {
                      setTempLbs(lbs);
                      setTempKg(lbsToKg(lbs));
                    }}
                  >
                    <Text
                      className={cn('text-2xl text-center', {
                        'text-primary text-4xl': isSelected,
                      })}
                    >
                      {lbs} lbs
                      {isSelected && (
                        <Text className='ml-2 text-sm opacity-70'>
                          {' '}
                          ({lbsToKg(lbs)} kg)
                        </Text>
                      )}
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
            <Text className='text-primary-foreground'>Confirm Weight</Text>
          </Button>
        )}
      </BottomSheet>
    </>
  );
}
