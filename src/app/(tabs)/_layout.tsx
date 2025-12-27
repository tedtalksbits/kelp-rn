import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Home, Dumbbell, User } from 'lucide-react-native';
import { useCSSVariable } from 'uniwind';
import { GlassView } from 'expo-glass-effect';

export default function TabLayout() {
  const primaryColor = useCSSVariable('--color-primary');
  const mutedColor = useCSSVariable('--color-muted-foreground');
  // const backgroundColor = useCSSVariable('--color-background');
  // const borderColor = useCSSVariable('--color-border');
  return (
    <View className='flex-1 bg-background'>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: primaryColor as string,
          tabBarInactiveTintColor: mutedColor as string,
          tabBarStyle: {
            position: 'absolute',
            borderTopWidth: 0,
            elevation: 0,
            backgroundColor: 'transparent',
          },
          tabBarBackground: () =>
            Platform.OS === 'ios' ? (
              <BlurView
                intensity={80}
                tint='dark'
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  overflow: 'hidden',
                }}
              />
            ) : null,
        }}
      >
        <Tabs.Screen
          name='index'
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name='workouts/index'
          options={{
            title: 'Workouts',
            tabBarIcon: ({ color, size }) => (
              <Dumbbell size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name='profile/index'
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}
