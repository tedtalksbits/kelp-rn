import * as React from 'react';
import {
  View,
  Text,
  Pressable,
  type ViewProps,
  type PressableProps,
  LayoutChangeEvent,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  useDerivedValue,
  runOnUI,
} from 'react-native-reanimated';
import { ChevronDown } from 'lucide-react-native';
import { cn } from '@/libs/utils';
import { withUniwind } from 'uniwind';

// --- 1. Icon Setup ---
const StyledChevronDown = withUniwind(ChevronDown);

// --- 2. Contexts ---
type AccordionContextType = {
  value: string | undefined;
  onValueChange: (value: string) => void;
};
const AccordionContext = React.createContext<AccordionContextType>(
  {} as AccordionContextType
);

type AccordionItemContextType = {
  value: string;
};
const AccordionItemContext = React.createContext<AccordionItemContextType>(
  {} as AccordionItemContextType
);

// --- 3. Components ---

// ROOTS
interface AccordionProps extends ViewProps {
  type?: 'single';
  defaultValue?: string;
  collapsible?: boolean;
}

const Accordion = React.forwardRef<View, AccordionProps>(
  ({ children, className, type = 'single', defaultValue, ...props }, ref) => {
    const [value, setValue] = React.useState<string | undefined>(defaultValue);

    const onValueChange = React.useCallback(
      (newValue: string) => {
        if (type === 'single') {
          setValue((prev) => (prev === newValue ? undefined : newValue));
        }
      },
      [type]
    );

    const childrenArray = React.Children.toArray(children);
    const styledChildren = childrenArray.map((child, index) => {
      if (React.isValidElement<{ className?: string }>(child)) {
        const isLast = index === childrenArray.length - 1;
        return React.cloneElement(child, {
          ...(typeof child.props === 'object' && child.props !== null
            ? child.props
            : {}),
          className: cn(
            child.props.className,
            !isLast && 'border-b border-border'
          ),
        } as any);
      }
      return child;
    });

    return (
      <AccordionContext.Provider value={{ value, onValueChange }}>
        <View ref={ref} className={cn('gap-2', className)} {...props}>
          {styledChildren}
        </View>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = 'Accordion';

// ITEM
interface AccordionItemProps extends ViewProps {
  value: string;
}

const AccordionItem = React.forwardRef<View, AccordionItemProps>(
  ({ children, className, value, ...props }, ref) => {
    return (
      <AccordionItemContext.Provider value={{ value }}>
        <View
          ref={ref}
          className={cn('border-border overflow-hidden', className)}
          {...props}
        >
          {children}
        </View>
      </AccordionItemContext.Provider>
    );
  }
);
AccordionItem.displayName = 'AccordionItem';

// TRIGGER
interface AccordionTriggerProps extends Omit<PressableProps, 'children'> {
  children: React.ReactNode;
}

const AccordionTrigger = React.forwardRef<View, AccordionTriggerProps>(
  ({ children, className, ...props }, ref) => {
    const { value: selectedValue, onValueChange } =
      React.useContext(AccordionContext);
    const { value: itemValue } = React.useContext(AccordionItemContext);

    const isOpen = selectedValue === itemValue;
    const progress = useDerivedValue(() =>
      isOpen
        ? withTiming(1, { duration: 250 })
        : withTiming(0, { duration: 200 })
    );

    const chevronStyle = useAnimatedStyle(() => ({
      transform: [{ rotate: `${progress.value * 180}deg` }],
    }));

    return (
      <Pressable
        ref={ref}
        onPress={() => onValueChange(itemValue)}
        className={cn(
          'flex-row items-center justify-between py-4 font-medium transition-all active:opacity-70',
          className
        )}
        {...props}
      >
        <Text className='text-sm font-medium text-foreground flex-1'>
          {children}
        </Text>
        <Animated.View style={chevronStyle}>
          <StyledChevronDown
            className='text-muted-foreground h-4 w-4 shrink-0'
            size={18}
          />
        </Animated.View>
      </Pressable>
    );
  }
);
AccordionTrigger.displayName = 'AccordionTrigger';

// CONTENT
const AccordionContent = React.forwardRef<View, ViewProps>(
  ({ children, className, ...props }, ref) => {
    const { value: selectedValue } = React.useContext(AccordionContext);
    const { value: itemValue } = React.useContext(AccordionItemContext);

    const isOpen = selectedValue === itemValue;
    const height = useSharedValue(0);

    const progress = useDerivedValue(() =>
      isOpen
        ? withTiming(1, { duration: 250 })
        : withTiming(0, { duration: 200 })
    );

    const bodyStyle = useAnimatedStyle(() => ({
      height: height.value * progress.value,
      opacity: progress.value,
    }));

    // We measure the inner content height
    const onLayout = (event: LayoutChangeEvent) => {
      height.value = event.nativeEvent.layout.height;
    };

    return (
      <Animated.View style={[{ overflow: 'hidden' }, bodyStyle]}>
        <View
          onLayout={onLayout}
          className={cn('pb-4 pt-0 absolute w-full', className)} // absolute to measure true height without affecting layout initially
        >
          <View ref={ref} {...props}>
            {children}
          </View>
        </View>
      </Animated.View>
    );
  }
);
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
