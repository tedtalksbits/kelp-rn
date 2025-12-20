import { View } from 'react-native';
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/accordion';
import { Text } from '../text';
import { Surface } from '../surface';
export default function AccordionDemo() {
  return (
    <View>
      <Text className='mb-4 text-2xl font-bold'>Accordion</Text>
      <View className='gap-8'>
        <Accordion type='single' collapsible>
          <AccordionItem value='item-1'>
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              <Text className='text-muted-foreground'>
                Yes. It adheres to the WAI-ARIA design pattern.
              </Text>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='item-2'>
            <AccordionTrigger>Is it styled?</AccordionTrigger>
            <AccordionContent>
              <Text className='text-muted-foreground'>
                Yes. It comes with default styles that matches the other
                components' aesthetic. These can be easily customized.
              </Text>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Surface>
          <Accordion type='single' collapsible>
            <AccordionItem value='item-1'>
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                <Text className='text-muted-foreground'>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </Text>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value='item-2'>
              <AccordionTrigger>Is it styled?</AccordionTrigger>
              <AccordionContent>
                <Text className='text-muted-foreground'>
                  Yes. It comes with default styles that matches the other
                  components' aesthetic. These can be easily customized.
                </Text>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Surface>
      </View>
    </View>
  );
}
