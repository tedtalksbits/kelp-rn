import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import * as SelectPrimitive from '@rn-primitives/select';
import { withUniwind } from 'uniwind';
import { Check, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useHaptics } from './use-haptics';

// If you already have these utilities in your library, keep your versions.
function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(' ');
}

const StyledChevronDown = withUniwind(ChevronDown);
const StyledChevronUp = withUniwind(ChevronUp);
const StyledCheck = withUniwind(Check);

type RootProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>;
type TriggerProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Trigger
>;
type ValueProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>;
type PortalProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Portal
>;
type OverlayProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Overlay
>;
type ContentProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Content
>;
type ViewportProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Viewport
>;
type ItemProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>;
type ItemTextProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.ItemText
>;
type LabelProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>;
type GroupProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Group>;
type SeparatorProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Separator
>;
type ScrollUpButtonProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.ScrollUpButton
>;
type ScrollDownButtonProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.ScrollDownButton
>;

const Select = SelectPrimitive.Root;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  TriggerProps & { className?: string; chevronClassName?: string }
>(({ className, chevronClassName, children, disabled, ...props }, ref) => {
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      disabled={disabled}
      className={cn(
        // Trigger container
        'flex-row items-center justify-between gap-2',
        'h-12 px-3 rounded-xl border border-border bg-background',
        // States
        disabled && 'opacity-50',
        className
      )}
      {...props}
    >
      <View className='flex-1'>{children as React.ReactNode}</View>

      <StyledChevronDown
        size={18}
        className={cn('text-muted-foreground', chevronClassName)}
      />
    </SelectPrimitive.Trigger>
  );
});
SelectTrigger.displayName = 'SelectTrigger';

const SelectValue = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Value>,
  ValueProps & { className?: string; placeholderClassName?: string }
>(({ className, placeholderClassName, placeholder, ...props }, ref) => {
  // rn-primitives Value supports placeholder prop :contentReference[oaicite:1]{index=1}
  return (
    <SelectPrimitive.Value
      ref={ref}
      placeholder={placeholder}
      className={cn('text-base text-foreground', className)}
      // On web, radix handles placeholder styling; on native it renders text.
      // If you want separate placeholder styling on native, you can wrap Value
      // with your own logic. Keeping it simple here.
      {...props}
    />
  );
});
SelectValue.displayName = 'SelectValue';

const SelectPortal = SelectPrimitive.Portal;

const SelectOverlay = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Overlay>,
  OverlayProps & { className?: string }
>(({ className, ...props }, ref) => {
  return (
    <SelectPrimitive.Overlay
      ref={ref}
      // For native, absolute fill is common in examples :contentReference[oaicite:2]{index=2}
      style={StyleSheet.absoluteFill}
      className={cn('bg-black/50', className)}
      {...props}
    />
  );
});
SelectOverlay.displayName = 'SelectOverlay';

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  ContentProps & {
    className?: string;
    viewportClassName?: string;
    overlayClassName?: string;
    portalProps?: PortalProps;
  }
>(
  (
    {
      className,
      viewportClassName,
      overlayClassName,
      portalProps,
      children,
      sideOffset = 8,
      align = 'start',
      side = 'bottom',
      ...props
    },
    ref
  ) => {
    return (
      <SelectPortal {...portalProps}>
        <SelectOverlay className={overlayClassName}>
          <SelectPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            align={align}
            side={side}
            className={cn(
              'min-w-70 overflow-hidden rounded-xl bg-popover p-4',
              'shadow-lg',
              className
            )}
            {...props}
          >
            {/* <SelectScrollUpButton /> */}

            <SelectPrimitive.Viewport className={cn('p-1', viewportClassName)}>
              {children}
            </SelectPrimitive.Viewport>

            {/* <SelectScrollDownButton /> */}
          </SelectPrimitive.Content>
        </SelectOverlay>
      </SelectPortal>
    );
  }
);
SelectContent.displayName = 'SelectContent';

const SelectGroup = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Group>,
  GroupProps & { className?: string; itemClassName?: string }
>(({ className, itemClassName, children, ...props }, ref) => {
  return (
    <SelectPrimitive.Group
      ref={ref}
      className={cn('py-1', className)}
      {...props}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child) && child.type === SelectItem) {
          const childrenArray = React.Children.toArray(children);
          const isLast = index === childrenArray.length - 1;

          return React.cloneElement(child, {
            className: cn(
              !isLast && 'border-b border-border/50',
              itemClassName,
              (child.props as { className?: string }).className
            ),
          } as any);
        }
        return child;
      })}
    </SelectPrimitive.Group>
  );
});
SelectGroup.displayName = 'SelectGroup';

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  LabelProps & { className?: string }
>(({ className, ...props }, ref) => {
  return (
    <SelectPrimitive.Label
      ref={ref}
      className={cn(
        'px-2 py-1 text-xs font-semibold text-muted-foreground',
        className
      )}
      {...props}
    />
  );
});
SelectLabel.displayName = 'SelectLabel';

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  ItemProps & { className?: string; indicatorClassName?: string }
>(({ className, indicatorClassName, children, ...props }, ref) => {
  const { selection } = useHaptics();
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        'relative flex-row items-center rounded-lg px-2 py-3',
        'active:bg-accent',
        className
      )}
      onPress={(e) => {
        selection();
        props.onPress?.(e);
      }}
      {...props}
    >
      <View className='flex-1'>
        <SelectPrimitive.ItemText className='text-foreground' />
      </View>

      {/* ItemIndicator shows when selected :contentReference[oaicite:3]{index=3} */}
      <SelectPrimitive.ItemIndicator className={cn('ml-2', indicatorClassName)}>
        <StyledCheck size={18} className='text-foreground' />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
});
SelectItem.displayName = 'SelectItem';

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  SeparatorProps & { className?: string }
>(({ className, ...props }, ref) => {
  return (
    <SelectPrimitive.Separator
      ref={ref}
      className={cn('my-1 h-px bg-border', className)}
      {...props}
    />
  );
});
SelectSeparator.displayName = 'SelectSeparator';

/**
 * Scroll buttons:
 * - On web they map to Radix scroll buttons
 * - On native rn-primitives only renders children (so we provide a simple UI anyway) :contentReference[oaicite:4]{index=4}
 */
const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  ScrollUpButtonProps & { className?: string }
>(({ className, children, ...props }, ref) => {
  return (
    <SelectPrimitive.ScrollUpButton
      className={cn('items-center justify-center py-2', className)}
      {...props}
    >
      {children ?? (
        <StyledChevronUp size={18} className='text-muted-foreground' />
      )}
    </SelectPrimitive.ScrollUpButton>
  );
});
SelectScrollUpButton.displayName = 'SelectScrollUpButton';

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  ScrollDownButtonProps & { className?: string }
>(({ className, children, ...props }, ref) => {
  return (
    <SelectPrimitive.ScrollDownButton
      className={cn('items-center justify-center py-2', className)}
      {...props}
    >
      {children ?? (
        <StyledChevronDown size={18} className='text-muted-foreground' />
      )}
    </SelectPrimitive.ScrollDownButton>
  );
});
SelectScrollDownButton.displayName = 'SelectScrollDownButton';

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
