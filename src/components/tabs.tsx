import * as React from 'react';
import { ScrollView, Text, View } from 'react-native';
import * as TabsPrimitive from '@rn-primitives/tabs';

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(' ');
}

type Variant = 'pill' | 'underline';
type Size = 'sm' | 'md' | 'lg';

type TabsRootProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>;
type TabsListProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>;
type TabsTriggerProps = React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.Trigger
>;
type TabsContentProps = React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.Content
>;

const listBaseByVariant: Record<Variant, string> = {
  pill: 'rounded-2xl bg-muted p-1',
  underline: 'border-b border-border',
};

const triggerBaseByVariant: Record<Variant, string> = {
  pill: 'rounded-xl',
  underline: 'rounded-none',
};

const triggerActiveByVariant: Record<Variant, string> = {
  pill: 'bg-background shadow',
  underline: 'border-b-2 border-foreground',
};

const triggerInactiveByVariant: Record<Variant, string> = {
  pill: 'bg-transparent',
  underline: 'border-b-2 border-transparent',
};

const triggerPaddingBySize: Record<Size, string> = {
  sm: 'px-2 py-1.5',
  md: 'px-3 py-2',
  lg: 'px-4 py-2.5',
};

const textSizeBySize: Record<Size, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

// Context for scrollable tabs
type ScrollableTabsContextValue = {
  scrollViewRef: React.RefObject<ScrollView | null> | null;
  registerTrigger: (
    value: string,
    layout: { x: number; width: number }
  ) => void;
};

const ScrollableTabsContext = React.createContext<ScrollableTabsContextValue>({
  scrollViewRef: null,
  registerTrigger: () => {},
});

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsRootProps & { className?: string }
>(({ className, ...props }, ref) => {
  return <TabsPrimitive.Root ref={ref} className={cn(className)} {...props} />;
});
Tabs.displayName = 'Tabs';

type TabsListComponentProps = TabsListProps & {
  className?: string;
  variant?: Variant;
  size?: Size;
  /** When true, list becomes horizontally scrollable */
  scrollable?: boolean;
  /** Passed to ScrollView when scrollable */
  scrollViewClassName?: string;
  /** If true, triggers default to equal widths in non-scrollable mode */
  equalWidth?: boolean;
};

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListComponentProps
>(
  (
    {
      className,
      variant = 'pill',
      size = 'md',
      scrollable = false,
      scrollViewClassName,
      equalWidth = true,
      ...props
    },
    ref
  ) => {
    const scrollViewRef = React.useRef<ScrollView>(null);
    const triggerLayoutsRef = React.useRef<
      Map<string, { x: number; width: number }>
    >(new Map());
    const root = TabsPrimitive.useRootContext();

    const registerTrigger = React.useCallback(
      (value: string, layout: { x: number; width: number }) => {
        triggerLayoutsRef.current.set(value, layout);
      },
      []
    );

    // Auto-scroll when active value changes
    React.useEffect(() => {
      if (!scrollable || !root.value) return;

      const layout = triggerLayoutsRef.current.get(root.value);
      if (layout && scrollViewRef.current) {
        // Center the active trigger in the viewport
        scrollViewRef.current.scrollTo({
          x: layout.x - 50, // Add some padding/offset
          animated: true,
        });
      }
    }, [root.value, scrollable]);

    const contextValue = React.useMemo(
      () => ({
        scrollViewRef,
        registerTrigger,
      }),
      [registerTrigger]
    );

    const list = (
      <TabsPrimitive.List
        ref={ref}
        className={cn(
          'flex-row items-center',
          listBaseByVariant[variant],
          className
        )}
        {...props}
      />
    );

    if (!scrollable) return list;

    // Scrollable: wrap the List in a horizontal ScrollView.
    return (
      <ScrollableTabsContext.Provider value={contextValue}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          className={cn('flex-row', scrollViewClassName)}
          contentContainerClassName={cn(
            // For underline variant, allow natural width; for pill, keep padding
            variant === 'underline' ? 'gap-6' : 'gap-1',
            // When scrollable, equalWidth should generally be false
            equalWidth ? 'flex-grow' : undefined
          )}
        >
          {list}
        </ScrollView>
      </ScrollableTabsContext.Provider>
    );
  }
);
TabsList.displayName = 'TabsList';

type TabsTriggerComponentProps = TabsTriggerProps & {
  className?: string;
  textClassName?: string;
  variant?: Variant;
  size?: Size;
  /** When true, triggers stretch equally (segmented control feel) */
  equalWidth?: boolean;
  children: React.ReactNode;
};

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerComponentProps
>(
  (
    {
      className,
      textClassName,
      variant = 'pill',
      size = 'md',
      equalWidth = true,
      children,
      disabled,
      value,
      ...props
    },
    ref
  ) => {
    const root = TabsPrimitive.useRootContext();
    const scrollableContext = React.useContext(ScrollableTabsContext);
    const isActive = root.value === value;
    const viewRef = React.useRef<View>(null);

    // Measure and register trigger layout for scrolling
    React.useEffect(() => {
      if (viewRef.current && scrollableContext.scrollViewRef) {
        viewRef.current.measureLayout(
          scrollableContext.scrollViewRef.current as any,
          (x, y, width, height) => {
            scrollableContext.registerTrigger(value, { x, width });
          },
          () => {} // Error callback
        );
      }
    }, [value, scrollableContext]);

    return (
      <TabsPrimitive.Trigger
        ref={(node) => {
          viewRef.current = node as View;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        disabled={disabled}
        value={value}
        className={cn(
          'items-center justify-center',
          // equal width segmented feel (only really desired for non-scrollable/pill)
          equalWidth ? 'flex-1' : 'shrink-0',
          triggerBaseByVariant[variant],
          triggerPaddingBySize[size],
          disabled && 'opacity-50',
          isActive
            ? triggerActiveByVariant[variant]
            : triggerInactiveByVariant[variant],
          // Underline variant needs a little vertical alignment
          variant === 'underline' ? 'pb-2' : undefined,
          className
        )}
        {...props}
      >
        {typeof children === 'string' || typeof children === 'number' ? (
          <Text
            className={cn(
              'font-medium',
              textSizeBySize[size],
              isActive ? 'text-foreground' : 'text-muted-foreground',
              textClassName
            )}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </TabsPrimitive.Trigger>
    );
  }
);
TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  TabsContentProps & { className?: string }
>(({ className, ...props }, ref) => {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn('mt-3', className)}
      {...props}
    />
  );
});
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };

// working version with improvements

// import * as React from 'react';
// import { ScrollView, Text, type LayoutChangeEvent } from 'react-native';
// import * as TabsPrimitive from '@rn-primitives/tabs';

// function cn(...classes: Array<string | undefined | null | false>) {
//   return classes.filter(Boolean).join(' ');
// }

// type Variant = 'pill' | 'underline';
// type Size = 'sm' | 'md' | 'lg';

// const listBaseByVariant: Record<Variant, string> = {
//   pill: 'rounded-2xl bg-muted p-1',
//   underline: 'border-b border-border',
// };

// const triggerBaseByVariant: Record<Variant, string> = {
//   pill: 'rounded-xl',
//   underline: 'rounded-none',
// };

// const triggerActiveByVariant: Record<Variant, string> = {
//   pill: 'bg-background shadow',
//   underline: 'border-b-2 border-foreground',
// };

// const triggerInactiveByVariant: Record<Variant, string> = {
//   pill: 'bg-transparent',
//   underline: 'border-b-2 border-transparent',
// };

// const triggerPaddingBySize: Record<Size, string> = {
//   sm: 'px-2 py-1.5',
//   md: 'px-3 py-2',
//   lg: 'px-4 py-2.5',
// };

// const textSizeBySize: Record<Size, string> = {
//   sm: 'text-xs',
//   md: 'text-sm',
//   lg: 'text-base',
// };

// type Layout = { x: number; width: number };

// type ScrollableTabsContextValue = {
//   variant: Variant;
//   size: Size;
//   equalWidth: boolean;
//   scrollable: boolean;
//   registerTrigger: (value: string, layout: Layout) => void;
// };

// const ScrollableTabsContext =
//   React.createContext<ScrollableTabsContextValue | null>(null);

// type TabsRootProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>;
// type TabsListProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>;
// type TabsTriggerProps = React.ComponentPropsWithoutRef<
//   typeof TabsPrimitive.Trigger
// >;
// type TabsContentProps = React.ComponentPropsWithoutRef<
//   typeof TabsPrimitive.Content
// >;

// const Tabs = TabsPrimitive.Root;

// type TabsListComponentProps = TabsListProps & {
//   className?: string;
//   variant?: Variant;
//   size?: Size;
//   scrollable?: boolean;
//   scrollViewClassName?: string;
//   equalWidth?: boolean;
//   autoScrollToActive?: boolean;
//   autoScrollPadding?: number;
// };

// const TabsList = React.forwardRef<
//   React.ElementRef<typeof TabsPrimitive.List>,
//   TabsListComponentProps
// >(
//   (
//     {
//       className,
//       variant = 'pill',
//       size = 'md',
//       scrollable = false,
//       scrollViewClassName,
//       equalWidth = true,
//       autoScrollToActive = true,
//       autoScrollPadding = 24,
//       ...props
//     },
//     ref
//   ) => {
//     const root = TabsPrimitive.useRootContext();
//     const scrollRef = React.useRef<ScrollView>(null);
//     const layoutsRef = React.useRef<Record<string, Layout>>({});
//     const [viewportWidth, setViewportWidth] = React.useState(0);

//     const registerTrigger = React.useCallback(
//       (value: string, layout: Layout) => {
//         layoutsRef.current[value] = layout;
//       },
//       []
//     );

//     React.useEffect(() => {
//       if (!scrollable || !autoScrollToActive) return;
//       const layout = layoutsRef.current[root.value];
//       if (!layout || !viewportWidth) return;

//       const center = layout.x + layout.width / 2;
//       const targetX = Math.max(0, center - viewportWidth / 2);

//       scrollRef.current?.scrollTo({ x: targetX, animated: true });
//     }, [root.value, scrollable, autoScrollToActive, viewportWidth]);

//     const list = (
//       <TabsPrimitive.List
//         ref={ref}
//         className={cn(
//           'flex-row items-center',
//           listBaseByVariant[variant],
//           className
//         )}
//         {...props}
//       />
//     );

//     if (!scrollable) return list;

//     const ctxValue: ScrollableTabsContextValue = {
//       variant,
//       size,
//       equalWidth,
//       scrollable,
//       registerTrigger,
//     };

//     return (
//       <ScrollableTabsContext.Provider value={ctxValue}>
//         <ScrollView
//           ref={scrollRef}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           className={cn('flex-row', scrollViewClassName)}
//           contentContainerClassName={cn(
//             'px-2',
//             variant === 'underline' ? 'gap-6' : 'gap-1'
//           )}
//           onLayout={(e) => setViewportWidth(e.nativeEvent.layout.width)}
//         >
//           {list}
//         </ScrollView>
//       </ScrollableTabsContext.Provider>
//     );
//   }
// );
// TabsList.displayName = 'TabsList';

// type TabsTriggerComponentProps = TabsTriggerProps & {
//   className?: string;
//   textClassName?: string;
//   variant?: Variant;
//   size?: Size;
//   equalWidth?: boolean;
//   children: React.ReactNode;
// };

// const TabsTrigger = React.forwardRef<
//   React.ElementRef<typeof TabsPrimitive.Trigger>,
//   TabsTriggerComponentProps
// >(
//   (
//     {
//       className,
//       textClassName,
//       variant: variantProp,
//       size: sizeProp,
//       equalWidth: equalWidthProp,
//       children,
//       disabled,
//       value,
//       onLayout,
//       ...props
//     },
//     ref
//   ) => {
//     const root = TabsPrimitive.useRootContext();
//     const ctx = React.useContext(ScrollableTabsContext);

//     const variant = variantProp ?? ctx?.variant ?? 'pill';
//     const size = sizeProp ?? ctx?.size ?? 'md';
//     const equalWidth = equalWidthProp ?? ctx?.equalWidth ?? true;

//     const isActive = root.value === value;

//     const handleLayout = (e: LayoutChangeEvent) => {
//       // Only register when inside scrollable list (ctx exists and scrollable true)
//       if (ctx?.scrollable) {
//         ctx.registerTrigger(value, {
//           x: e.nativeEvent.layout.x,
//           width: e.nativeEvent.layout.width,
//         });
//       }
//       onLayout?.(e);
//     };

//     return (
//       <TabsPrimitive.Trigger
//         ref={ref}
//         value={value}
//         disabled={disabled}
//         onLayout={handleLayout}
//         className={cn(
//           'items-center justify-center',
//           equalWidth ? 'flex-1' : 'shrink-0',
//           triggerBaseByVariant[variant],
//           triggerPaddingBySize[size],
//           disabled && 'opacity-50',
//           isActive
//             ? triggerActiveByVariant[variant]
//             : triggerInactiveByVariant[variant],
//           variant === 'underline' ? 'pb-2' : undefined,
//           className
//         )}
//         {...props}
//       >
//         {typeof children === 'string' || typeof children === 'number' ? (
//           <Text
//             className={cn(
//               'font-medium',
//               textSizeBySize[size],
//               isActive ? 'text-foreground' : 'text-muted-foreground',
//               textClassName
//             )}
//           >
//             {children}
//           </Text>
//         ) : (
//           children
//         )}
//       </TabsPrimitive.Trigger>
//     );
//   }
// );
// TabsTrigger.displayName = 'TabsTrigger';

// const TabsContent = TabsPrimitive.Content;

// export { Tabs, TabsList, TabsTrigger, TabsContent };
