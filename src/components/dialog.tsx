import * as React from 'react';
import {
  Modal,
  View,
  Pressable,
  type ViewProps,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { X } from 'lucide-react-native';
import { cn } from '@/libs/utils';
import { withUniwind } from 'uniwind';
import { Text } from './text';

const StyledX = withUniwind(X);

// --- Context ---
interface DialogContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const DialogContext = React.createContext<DialogContextType>(
  {} as DialogContextType
);

// --- Root ---
const Dialog = ({
  children,
  open,
  onOpenChange,
}: React.PropsWithChildren<DialogContextType>) => {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
};

// --- Trigger ---
interface DialogTriggerProps extends React.ComponentPropsWithoutRef<
  typeof Pressable
> {
  asChild?: boolean;
}

const DialogTrigger = React.forwardRef<View, DialogTriggerProps>(
  ({ children, onPress, asChild = false, ...props }, ref) => {
    const { onOpenChange } = React.useContext(DialogContext);

    const handleOpen = (e: any) => {
      onOpenChange(true);
      onPress?.(e);
    };

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        onPress: handleOpen,
        ...props, // Pass down any other props if needed
      });
    }

    return (
      <Pressable ref={ref} onPress={handleOpen} {...props}>
        {children}
      </Pressable>
    );
  }
);
DialogTrigger.displayName = 'DialogTrigger';

// --- Content Portal (The Modal) ---
const DialogContent = React.forwardRef<View, ViewProps>(
  ({ className, children, ...props }, ref) => {
    const { open, onOpenChange } = React.useContext(DialogContext);

    return (
      <Modal
        transparent
        visible={open}
        animationType='fade'
        onRequestClose={() => onOpenChange(false)}
      >
        {/* Backdrop - Tap to close */}
        <TouchableWithoutFeedback onPress={() => onOpenChange(false)}>
          <View className='absolute inset-0 bg-black/80 z-50' />
        </TouchableWithoutFeedback>

        {/* Dialog Panel - Centered */}
        <View className='flex-1 items-center justify-center p-4'>
          <TouchableWithoutFeedback>
            {/* Empty Touch handler to stop propagation so clicking the modal doesn't close it */}
            <View
              ref={ref}
              className={cn(
                'w-full max-w-lg gap-4 rounded-xl bg-accent p-6 shadow-lg z-50',
                className
              )}
              {...props}
            >
              {children}

              {/* Close Button */}
              <Pressable
                className='absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none'
                onPress={() => onOpenChange(false)}
              >
                <StyledX className='h-4 w-4 text-muted-foreground' size={24} />
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    );
  }
);
DialogContent.displayName = 'DialogContent';

// --- Header/Title/Desc ---
const DialogHeader = ({ className, ...props }: ViewProps) => (
  <View
    className={cn('flex-col gap-1.5 text-center sm:text-left', className)}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }: ViewProps) => (
  <View
    className={cn(
      'flex-col-reverse sm:flex-row sm:justify-end sm:gap-2',
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  Text,
  React.ComponentPropsWithoutRef<typeof Text>
>(({ className, ...props }, ref) => (
  <Text
    className={cn(
      'font-semibold leading-none tracking-tight text-foreground',
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef<
  Text,
  React.ComponentPropsWithoutRef<typeof Text>
>(({ className, ...props }, ref) => (
  <Text className={cn('text-sm text-muted-foreground', className)} {...props} />
));
DialogDescription.displayName = 'DialogDescription';

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
