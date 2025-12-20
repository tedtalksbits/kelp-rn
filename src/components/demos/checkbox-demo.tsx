import { View } from 'react-native';
import React from 'react';
import { Checkbox } from '../checkbox';
import { Surface } from '../surface';
import { Text } from '../text';

export default function CheckBoxDemo() {
  const [checkStates, setCheckStates] = React.useState({
    newsletter: false,
    marketing: false,
    terms: false,
  });
  return (
    <View>
      <Text className='mb-4 text-2xl font-bold'>Checkbox</Text>
      <View className='gap-8'>
        <Surface className='gap-4' divider='y'>
          <View className='flex flex-row items-start gap-4'>
            <Checkbox
              checked={checkStates.newsletter}
              onCheckedChange={(value) =>
                setCheckStates((prev) => ({
                  ...prev,
                  newsletter: value,
                }))
              }
            />
            <View className='flex-1 gap-1'>
              <Text className='font-semibold'>Subscribe to newsletter</Text>
              <Text className='text-muted-foreground flex-wrap'>
                Get the latest news and updates delivered to your inbox
              </Text>
            </View>
          </View>
          <View className='flex flex-row items-start gap-4'>
            <Checkbox
              checked={checkStates.marketing}
              onCheckedChange={(value) =>
                setCheckStates((prev) => ({
                  ...prev,
                  marketing: value,
                }))
              }
            />
            <View className='flex-1 gap-1'>
              <Text className='font-semibold'>Receive marketing emails</Text>
              <Text className='text-muted-foreground flex-wrap'>
                Get updates about new features and promotions
              </Text>
            </View>
          </View>
          <View className='flex flex-row items-start gap-4'>
            <Checkbox
              checked={checkStates.terms}
              onCheckedChange={(value) =>
                setCheckStates((prev) => ({
                  ...prev,
                  terms: value,
                }))
              }
            />
            <View className='flex-1 gap-1'>
              <Text className='font-semibold'>
                Agree to terms and conditions
              </Text>
              <Text className='text-muted-foreground flex-wrap'>
                I have read and agree to the terms and conditions
              </Text>
            </View>
          </View>
        </Surface>
      </View>
    </View>
  );
}
