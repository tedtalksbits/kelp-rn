import * as React from 'react';
import {
  Modal,
  View,
  Pressable,
  type ViewProps,
  TouchableWithoutFeedback,
} from 'react-native';
import { cn } from '@/libs/utils';

// Context
interface PopoverContextProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const PopoverContext = React.createContext<PopoverContextProps>(
  {} as PopoverContextProps
);

// Root
const Popover = ({
  children,
  open,
  onOpenChange,
}: React.PropsWithChildren<PopoverContextProps>) => (
  <PopoverContext.Provider value={{ open, onOpenChange }}>
    {children}
  </PopoverContext.Provider>
);

// Trigger
interface PopoverTriggerProps extends React.ComponentPropsWithoutRef<
  typeof Pressable
> {
  asChild?: boolean;
}
const PopoverTrigger = React.forwardRef<View, PopoverTriggerProps>(
  ({ children, onPress, asChild = false, ...props }, ref) => {
    const { onOpenChange } = React.useContext(PopoverContext);

    const handleOpen = (e: any) => {
      onOpenChange(true);
      onPress?.(e);
    };

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        onPress: handleOpen,
        ...props,
      });
    }

    return (
      <Pressable ref={ref} onPress={handleOpen} {...props}>
        {children}
      </Pressable>
    );
  }
);
PopoverTrigger.displayName = 'PopoverTrigger';

// Content
const PopoverContent = React.forwardRef<View, ViewProps>(
  ({ className, children, ...props }, ref) => {
    const { open, onOpenChange } = React.useContext(PopoverContext);

    return (
      <Modal
        transparent
        visible={open}
        animationType='fade'
        onRequestClose={() => onOpenChange(false)}
      >
        <TouchableWithoutFeedback onPress={() => onOpenChange(false)}>
          <View className='flex-1 bg-black/10 items-center justify-center p-4'>
            <TouchableWithoutFeedback>
              <View
                ref={ref}
                className={cn(
                  'z-50 min-w-[8rem] rounded-md border border-border bg-popover p-4 shadow-md outline-none animate-in fade-in-0 zoom-in-95',
                  className
                )}
                {...props}
              >
                {children}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
);
PopoverContent.displayName = 'PopoverContent';

export { Popover, PopoverTrigger, PopoverContent };
