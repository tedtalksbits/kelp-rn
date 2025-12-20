import { View } from 'react-native';
import React from 'react';
import { ActionSheet } from '../action-sheet';
import { ShareIcon } from 'lucide-react-native';
import { Text } from '../text';
import { Button } from '../button';

export default function ActionSheetDemo() {
  const [isVisible, setIsVisible] = React.useState(false);
  const handleShare = () => {
    console.log('Share action selected');
    setIsVisible(false);
  };
  const handleDelete = () => {
    console.log('Delete action selected');
    setIsVisible(false);
  };
  return (
    <View>
      {/* Page Title */}
      <Text className='mb-4 text-2xl font-bold'>Action Sheet </Text>

      <ActionSheet
        visible={isVisible}
        onClose={() => setIsVisible(false)}
        title='Choose an action'
        message='Select one of the options below'
        options={[
          {
            title: 'Share',
            onPress: handleShare,
            icon: <ShareIcon />,
          },
          {
            title: 'Delete',
            onPress: handleDelete,
            destructive: true,
          },
        ]}
      />

      <Button onPress={() => setIsVisible(true)} size={'lg'}>
        Open Action Sheet
      </Button>
    </View>
  );
}
