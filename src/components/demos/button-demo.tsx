import { View } from 'react-native';

import { ChevronDown } from 'lucide-react-native';
import { withUniwind } from 'uniwind';
import { Button } from '../button';
import { Text } from '../text';

// Styled Icon for Button
const StyledChevronDown = withUniwind(ChevronDown);

export default function ButtonDemo() {
  return (
    <View>
      {/* Page Title */}
      <Text className='mb-4 text-2xl font-bold'>Button</Text>
      <View className='items-center justify-center gap-4 p-4'>
        {/* Default Primary */}
        <Button onPress={() => console.log('Pressed')} size={'lg'}>
          Default Button
        </Button>

        {/* Secondary */}
        <Button variant='secondary' size={'lg'}>
          Secondary Action
        </Button>

        {/* Destructive */}
        <Button variant='destructive'>Delete Account</Button>

        {/* Outline */}
        <Button variant='outline'>Cancel</Button>

        {/* Ghost (Great for minimal actions) */}
        <Button variant='ghost'>Click me</Button>

        {/* Icon Button with Lucide */}
        <Button variant='outline' size='icon'>
          {/* Make sure to style your icon with uniwind if needed */}
          <StyledChevronDown className='text-foreground' size={24} />
        </Button>
      </View>
    </View>
  );
}
