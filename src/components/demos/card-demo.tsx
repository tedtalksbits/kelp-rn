import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../card';
import { Button } from '../button';
import { View } from 'react-native';
import { Brackets, ShoppingBag } from 'lucide-react-native';
import { withUniwind } from 'uniwind';
import { Text } from '../text';

const StyledBrackets = withUniwind(ShoppingBag);

export default function CardDemo() {
  return (
    <View>
      {/* Page Title */}
      <Text className='mb-4 text-2xl font-bold'>Card </Text>
      <View className='gap-8'>
        <Card>
          <CardHeader>
            <CardTitle>Create project</CardTitle>
            <CardDescription>
              Deploy your new project in one-click.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Text className='text-foreground'>Project Name: My App</Text>
          </CardContent>
          <CardFooter className='flex-row justify-between'>
            <Button variant='outline'>Cancel</Button>
            <Button>Deploy</Button>
          </CardFooter>
        </Card>

        <Card>
          <View className='gap-4'>
            <CardHeader>
              <View className='gap-1 mb-2'>
                <CardTitle className='text-pink-400'>$450</CardTitle>
                <CardTitle>Living room Sofa</CardTitle>
              </View>
              <CardDescription>
                This sofa is perfect for modern tropical spaces, baroque
                inspired spaces.
              </CardDescription>
            </CardHeader>
            <CardFooter className='gap-3'>
              <Button>Buy now</Button>
              <Button
                variant='ghost'
                className='items-center'
                icon={<StyledBrackets size={16} className='text-muted' />}
              >
                Test
              </Button>
            </CardFooter>
          </View>
        </Card>
      </View>
    </View>
  );
}
