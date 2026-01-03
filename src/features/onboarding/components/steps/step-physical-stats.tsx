import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/text';
import { Button } from '@/components/button';
import { Surface } from '@/components/surface';
import type { OnboardingStepProps } from '../../types/onboarding.types';
import { BottomSheet } from '@/components/bottom-sheet';
import { HeightSelectorSheet } from '@/components/height-selector-sheet';
import { WeightSelectorSheet } from '@/components/weight-selector-sheet';
import { AgeSelectorSheet } from '@/components/age-selector-sheet';

export function StepPhysicalStats({
  data,
  updateData,
  goToNext,
  goToPrevious,
}: OnboardingStepProps) {
  const [ageSheetOpen, setAgeSheetOpen] = React.useState(false);
  const [weightSheetOpen, setWeightSheetOpen] = React.useState(false);
  const [heightSheetOpen, setHeightSheetOpen] = React.useState(false);

  const isValid =
    data.age !== null && data.weight !== null && data.height !== null;

  const ages = Array.from({ length: 83 }, (_, i) => i + 18); // 18-100
  const weights = Array.from({ length: 151 }, (_, i) => i + 40); // 40-190 kg
  const heights = Array.from({ length: 121 }, (_, i) => i + 140); // 140-260 cm

  return (
    <View className='flex-1 justify-between py-8'>
      <View>
        <Text className='text-4xl font-black uppercase mb-4'>
          Physical Stats
        </Text>
        <Text className='text-muted-foreground mb-8'>
          Help us personalize your workout recommendations.
        </Text>

        <View className='gap-4'>
          {/* Age Selector */}
          <AgeSelectorSheet
            value={data.age || 25}
            onChange={(age, close) => {
              updateData({ age });
              close();
            }}
            trigger={
              <Surface className='p-4 border-2 border-border'>
                <Text className='text-xs text-muted-foreground mb-1 uppercase'>
                  Age
                </Text>
                <Text className='text-2xl font-bold'>
                  {data.age || 'Select age'}
                </Text>
              </Surface>
            }
          />

          {/* Weight Selector */}
          <WeightSelectorSheet
            value={data.weight || 70}
            onChange={(weight, close) => {
              updateData({ weight });
              close();
            }}
            trigger={
              <Surface className='p-4 border-2 border-border'>
                <Text className='text-xs text-muted-foreground mb-1 uppercase'>
                  Weight
                </Text>
                <Text className='text-2xl font-bold'>
                  {data.weight ? `${data.weight} kg` : 'Select weight'}
                </Text>
              </Surface>
            }
          />

          {/* Height Selector */}
          <HeightSelectorSheet
            trigger={
              <Surface className='p-4 border-2 border-border'>
                <Text className='text-xs text-muted-foreground mb-1 uppercase'>
                  Height
                </Text>
                <Text className='text-2xl font-bold'>
                  {data.height ? `${data.height} cm` : 'Select height'}
                </Text>
              </Surface>
            }
            value={data.height || 170}
            onChange={(height, close) => {
              updateData({ height });
              close();
            }}
          />
        </View>
      </View>

      <View className='gap-3'>
        <Button size='lg' onPress={goToNext} disabled={!isValid}>
          <Text className='text-primary-foreground font-bold text-lg'>
            Continue
          </Text>
        </Button>
        <Button size='lg' variant='secondary' onPress={goToPrevious}>
          <Text className='text-secondary-foreground font-bold text-lg'>
            Back
          </Text>
        </Button>
      </View>

      {/* Age Bottom Sheet */}
      <BottomSheet
        isVisible={ageSheetOpen}
        onClose={() => setAgeSheetOpen(false)}
        title='Select Age'
        snapPoints={[0.6]}
      >
        <View className='px-4 gap-2'>
          {ages.map((age) => (
            <Pressable
              key={age}
              onPress={() => {
                updateData({ age });
                setAgeSheetOpen(false);
              }}
            >
              <Surface className='p-4'>
                <Text className='text-lg font-bold'>{age}</Text>
              </Surface>
            </Pressable>
          ))}
        </View>
      </BottomSheet>

      {/* Weight Bottom Sheet */}
      <BottomSheet
        isVisible={weightSheetOpen}
        onClose={() => setWeightSheetOpen(false)}
        title='Select Weight (kg)'
        snapPoints={[0.6]}
      >
        <View className='px-4 gap-2'>
          {weights.map((weight) => (
            <Pressable
              key={weight}
              onPress={() => {
                updateData({ weight });
                setWeightSheetOpen(false);
              }}
            >
              <Surface className='p-4'>
                <Text className='text-lg font-bold'>{weight} kg</Text>
              </Surface>
            </Pressable>
          ))}
        </View>
      </BottomSheet>

      {/* Height Bottom Sheet */}
      <BottomSheet
        isVisible={heightSheetOpen}
        onClose={() => setHeightSheetOpen(false)}
        title='Select Height (cm)'
        snapPoints={[0.9]}
      >
        <View className='px-4 gap-2'>
          {heights.map((height) => (
            <Pressable
              key={height}
              onPress={() => {
                updateData({ height });
                setHeightSheetOpen(false);
              }}
            >
              <Surface className='p-4'>
                <Text className='text-lg font-bold'>{height} cm</Text>
              </Surface>
            </Pressable>
          ))}
        </View>
      </BottomSheet>
    </View>
  );
}
