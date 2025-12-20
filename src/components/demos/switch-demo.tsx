import React from 'react';
import { View } from 'react-native';
import { Switch } from '../switch';
import { Text } from '../text';
import { Card, CardContent } from '../card';
import { Surface } from '../surface';

export const SwitchDemo = () => {
  const [toggleStates, setToggleStates] = React.useState({
    notifications: false,
    darkMode: false,
    autoUpdate: false,
  });
  return (
    <View>
      {/* Page Title */}
      <Text className='mb-4 text-2xl font-bold'>Switch </Text>
      <Surface className='gap-4' divider='y'>
        <View className='flex flex-row items-center gap-4 justify-between'>
          <View className='flex-1 max-w-[70%]'>
            <Text className='font-semibold'>Enable notifications</Text>
            <Text className='text-muted-foreground flex-wrap'>
              Receieve push notifications about your account activity
            </Text>
          </View>
          <View>
            <Switch
              value={toggleStates.notifications}
              onValueChange={(value) =>
                setToggleStates((prev) => ({
                  ...prev,
                  notifications: value,
                }))
              }
            />
          </View>
        </View>
        <View className='flex flex-row items-center gap-4 justify-between'>
          <View className='flex-1 max-w-[70%]'>
            <Text className='font-semibold'>Dark mode</Text>
            <Text className='text-muted-foreground flex-wrap'>
              Switch between light and dark mode themes
            </Text>
          </View>
          <View>
            <Switch
              value={toggleStates.darkMode}
              onValueChange={(value) =>
                setToggleStates((prev) => ({
                  ...prev,
                  darkMode: value,
                }))
              }
            />
          </View>
        </View>
        <View className='flex flex-row items-center gap-4 justify-between'>
          <View className='flex-1 max-w-[70%]'>
            <Text className='font-semibold'>Auto-update</Text>
            <Text className='text-muted-foreground flex-wrap'>
              Automatically download and install updates
            </Text>
          </View>
          <View>
            <Switch
              value={toggleStates.autoUpdate}
              onValueChange={(value) =>
                setToggleStates((prev) => ({
                  ...prev,
                  autoUpdate: value,
                }))
              }
            />
          </View>
        </View>
      </Surface>
    </View>
  );
};
