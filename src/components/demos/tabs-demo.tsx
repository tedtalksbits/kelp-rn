import { Tabs, TabsContent, TabsList, TabsTrigger } from '../tabs';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../card';
import { View } from 'react-native';
import { useState } from 'react';
import { Text } from '../text';

export default function TabsDemo() {
  const [activeTab, setActiveTab] = useState('account');
  const [value, setValue] = useState('overview');

  return (
    <View>
      {/* Page Title */}
      <Text className='mb-4 text-2xl font-bold'>Tabs </Text>
      <View className='gap-16'>
        <View>
          <Text className='mb-2 font-medium'>Default Tabs</Text>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='w-full'
          >
            <TabsList className='w-full'>
              <TabsTrigger value='account'>Account</TabsTrigger>
              <TabsTrigger value='password'>Password</TabsTrigger>
              <TabsTrigger value='billing'>Billing</TabsTrigger>
            </TabsList>

            <TabsContent value='account'>
              <View className='p-4'>
                <Text className='text-foreground'>Account content</Text>
              </View>
            </TabsContent>

            <TabsContent value='password'>
              <View className='p-4'>
                <Text className='text-foreground'>Password content</Text>
              </View>
            </TabsContent>

            <TabsContent value='billing'>
              <View className='p-4'>
                <Text className='text-foreground'>Billing content</Text>
              </View>
            </TabsContent>
          </Tabs>
        </View>
        <View>
          <Text className='my-4 font-medium'>Scrollable Underline Tabs</Text>
          <Tabs value={value} onValueChange={setValue}>
            <TabsList
              variant='underline'
              scrollable
              // in scrollable mode, you usually want variable-width tabs
              equalWidth={false}
              className='w-full'
              scrollViewClassName='px-2'
            >
              <TabsTrigger
                variant='underline'
                equalWidth={false}
                value='overview'
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                variant='underline'
                equalWidth={false}
                value='workouts'
              >
                Workouts
              </TabsTrigger>
              <TabsTrigger
                variant='underline'
                equalWidth={false}
                value='nutrition'
              >
                Nutrition
              </TabsTrigger>
              <TabsTrigger variant='underline' equalWidth={false} value='sleep'>
                Sleep
              </TabsTrigger>
              <TabsTrigger
                variant='underline'
                equalWidth={false}
                value='hydration'
              >
                Hydration
              </TabsTrigger>
              <TabsTrigger
                variant='underline'
                equalWidth={false}
                value='settings'
              >
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value='overview'>
              <View className='p-4 mt-4'>
                <Text className='text-foreground'>Overview content</Text>
              </View>
            </TabsContent>

            <TabsContent value='workouts'>
              <View className='p-4 mt-4'>
                <Text className='text-foreground'>Workouts content</Text>
              </View>
            </TabsContent>

            <TabsContent value='nutrition'>
              <View className='p-4 mt-4'>
                <Text className='text-foreground'>Nutrition content</Text>
              </View>
            </TabsContent>

            <TabsContent value='sleep'>
              <View className='p-4 mt-4'>
                <Text className='text-foreground'>Sleep content</Text>
              </View>
            </TabsContent>

            <TabsContent value='settings'>
              <View className='p-4 mt-4'>
                <Text className='text-foreground'>Settings content</Text>
              </View>
            </TabsContent>
          </Tabs>
        </View>
      </View>
    </View>
  );
}
