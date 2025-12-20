import React, { useState } from 'react';
import { View } from 'react-native';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../dialog';
import { Button } from '../button';
import { Input } from '../input';
import { Text } from '../text';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { ScrollView } from 'react-native-gesture-handler';

export default function DialogDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View>
      {/* Page Title */}
      <Text className='mb-4 text-2xl font-bold'>Dialog</Text>
      <View className='items-center justify-center'>
        {/* 1. Wrap everything in Dialog and pass the state */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          {/* 2. The Trigger (Button that opens the modal) */}
          <DialogTrigger asChild>
            <Button variant='outline'>Edit Profile</Button>
          </DialogTrigger>

          {/* 3. The Modal Content */}
          <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={24}>
            <DialogContent className='sm:max-w-106.25'>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>

              {/* Form Content */}
              <ScrollView
                contentContainerClassName='pt-3'
                showsVerticalScrollIndicator={false}
                bounces={false}
                keyboardShouldPersistTaps='handled'
              >
                <View className='gap-4 py-4'>
                  <View className='gap-2'>
                    <Text className='text-sm font-medium text-foreground'>
                      Name
                    </Text>
                    <Input defaultValue='Pedro Duarte' autoFocus />
                  </View>
                  <View className='gap-2'>
                    <Text className='text-sm font-medium text-foreground'>
                      Username
                    </Text>
                    <Input defaultValue='@peduarte' />
                  </View>
                </View>
              </ScrollView>

              <DialogFooter>
                <Button onPress={() => setIsOpen(false)}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </KeyboardAvoidingView>
        </Dialog>
      </View>
    </View>
  );
}
