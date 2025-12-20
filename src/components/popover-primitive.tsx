import * as React from 'react';
import { StyleSheet, Platform } from 'react-native';
import * as PopoverPrimitive from '@rn-primitives/popover';

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(' ');
}

type RootProps = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>;
type TriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Trigger
>;
type PortalProps = React.ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Portal
>;
type OverlayProps = React.ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Overlay
>;
type ContentProps = React.ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Content
>;
type CloseProps = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Close>;

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  TriggerProps & { className?: string }
>(({ className, ...props }, ref) => {
  return (
    <PopoverPrimitive.Trigger ref={ref} className={cn(className)} {...props} />
  );
});
PopoverTrigger.displayName = 'PopoverTrigger';

const PopoverPortal = PopoverPrimitive.Portal;

const PopoverOverlay = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Overlay>,
  OverlayProps & { className?: string }
>(({ className, ...props }, ref) => {
  return (
    <PopoverPrimitive.Overlay
      ref={ref}
      style={StyleSheet.absoluteFill}
      className={cn('bg-black/40', className)}
      {...props}
    />
  );
});
PopoverOverlay.displayName = 'PopoverOverlay';

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
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
      align = 'center',
      side = 'bottom',
      ...props
    },
    ref
  ) => {
    return (
      <PopoverPortal {...portalProps}>
        {/* ✅ sibling overlay */}
        <PopoverOverlay className={overlayClassName} />

        <PopoverPrimitive.Content
          ref={ref}
          sideOffset={sideOffset}
          align={align}
          side={side}
          // A shadcn-ish popover surface
          className={cn(
            'min-w-[220px] overflow-hidden rounded-2xl border border-border bg-popover p-3 shadow-lg',
            className
          )}
          {...props}
        />
      </PopoverPortal>
    );
  }
);
PopoverContent.displayName = 'PopoverContent';

const PopoverClose = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Close>,
  CloseProps & { className?: string }
>(({ className, ...props }, ref) => {
  return (
    <PopoverPrimitive.Close ref={ref} className={cn(className)} {...props} />
  );
});
PopoverClose.displayName = 'PopoverClose';

export { Popover, PopoverTrigger, PopoverContent, PopoverClose };
