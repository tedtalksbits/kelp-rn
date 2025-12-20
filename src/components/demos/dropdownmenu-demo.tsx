import * as React from 'react';
import { View } from 'react-native';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../dropdown-menu';
import { Text } from '../text';

export function DropdownMenuDemo() {
  const [compact, setCompact] = React.useState(false);

  return (
    <View>
      <Text className='mb-4 text-2xl font-bold'>Dropdown Menu </Text>

      <DropdownMenu>
        <DropdownMenuTrigger className='h-12 px-4 rounded-xl items-center justify-center bg-accent'>
          <Text className='text-foreground font-medium'>Open menu</Text>
        </DropdownMenuTrigger>

        <DropdownMenuContent className='w-64' side='top'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onPress={() => console.log('Edit')}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onPress={() => console.log('Duplicate')}>
            Duplicate
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onPress={() => console.log('Delete')}
            textClassName='text-destructive'
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </View>
  );
}
