import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as DropdownMenuPrimitive from '@rn-primitives/dropdown-menu';

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(' ');
}

type RootProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Root
>;
type TriggerProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Trigger
>;
type PortalProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Portal
>;
type OverlayProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Overlay
>;
type ContentProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Content
>;
type ItemProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Item
>;
type GroupProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Group
>;
type LabelProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Label
>;
type SeparatorProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Separator
>;

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Trigger>,
  TriggerProps & { className?: string }
>(({ className, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Trigger
      ref={ref}
      className={cn(className)}
      {...props}
    />
  );
});
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuOverlay = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Overlay>,
  OverlayProps & { className?: string }
>(({ className, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Overlay
      ref={ref}
      style={StyleSheet.absoluteFill}
      className={cn('bg-black/30', className)}
      {...props}
    />
  );
});
DropdownMenuOverlay.displayName = 'DropdownMenuOverlay';

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  ContentProps & {
    className?: string;
    overlayClassName?: string;
    portalProps?: PortalProps;
  }
>(
  (
    {
      className,
      overlayClassName,
      portalProps,
      sideOffset = 8,
      align = 'start',
      side = 'bottom',
      ...props
    },
    ref
  ) => {
    return (
      <DropdownMenuPortal {...portalProps}>
        <DropdownMenuOverlay className={overlayClassName} />

        <DropdownMenuPrimitive.Content
          ref={ref}
          sideOffset={sideOffset}
          align={align}
          side={side}
          className={cn(
            'min-w-55 overflow-hidden rounded-2xl bg-accent p-4 shadow-lg',
            className
          )}
          {...props}
        />
      </DropdownMenuPortal>
    );
  }
);
DropdownMenuContent.displayName = 'DropdownMenuContent';

const DropdownMenuGroup = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Group>,
  GroupProps & { className?: string }
>(({ className, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Group
      ref={ref}
      className={cn('py-1', className)}
      {...props}
    />
  );
});
DropdownMenuGroup.displayName = 'DropdownMenuGroup';

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  LabelProps & { className?: string }
>(({ className, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Label
      ref={ref}
      className={cn(
        'px-2 py-1 text-xs font-semibold text-muted-foreground',
        className
      )}
      {...props}
    />
  );
});
DropdownMenuLabel.displayName = 'DropdownMenuLabel';

type DropdownMenuItemComponentProps = ItemProps & {
  className?: string;
  inset?: boolean;
  textClassName?: string;
  rightSlot?: React.ReactNode;
};

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemComponentProps
>(
  (
    {
      className,
      inset,
      textClassName,
      rightSlot,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <DropdownMenuPrimitive.Item
        ref={ref}
        disabled={disabled}
        className={cn(
          'flex-row items-center rounded-xl px-2 py-2',
          'active:bg-accent',
          disabled && 'opacity-50',
          inset && 'pl-8',
          className
        )}
        {...props}
      >
        {/* No ItemText primitive — we render Text ourselves */}
        <Text className={cn('flex-1 text-sm text-foreground', textClassName)}>
          {typeof children === 'string' || typeof children === 'number'
            ? children
            : null}
        </Text>

        {/* If you want richer children than string, pass them via `rightSlot` or wrap with your own content */}
        {typeof children !== 'string' && typeof children !== 'number' ? (
          <View className='flex-1'>{children as React.ReactNode}</View>
        ) : null}

        {rightSlot ? <View className='ml-2'>{rightSlot}</View> : null}
      </DropdownMenuPrimitive.Item>
    );
  }
);
DropdownMenuItem.displayName = 'DropdownMenuItem';

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  SeparatorProps & { className?: string }
>(({ className, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Separator
      ref={ref}
      className={cn('my-1 h-px bg-border', className)}
      {...props}
    />
  );
});
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
};
