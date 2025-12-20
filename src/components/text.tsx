import { Text as TextComponent } from 'react-native';
import React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/libs/utils';
const textVariants = cva('text-base text-foreground', {
  variants: {
    variant: {
      largeTitle: 'text-[39px] font-normal leading-[48px]',
      title1: 'text-[31px] font-normal leading-[39px]',
      title2: 'text-[24px] font-normal leading-[30px]',
      title3: 'text-[22px] font-normal leading-[28px]',
      headline: 'text-[17px] font-semibold leading-[24px]',
      body: 'text-[17px] font-normal leading-[24px]',
      callout: 'text-[15px] font-normal leading-[21px]',
      subhead: 'text-[13px] font-normal leading-[19px]',
      footnote: 'text-[12px] font-normal leading-[17px]',
      caption1: 'text-[11px] font-normal leading-[15px]',
      caption2: 'text-[10px] font-normal leading-[12px]',
      link: 'text-blue-500 underline',
    },
  },
});
interface TextProps
  extends
    React.ComponentPropsWithRef<typeof TextComponent>,
    VariantProps<typeof textVariants> {}

const Text = ({ children, className, variant, ...props }: TextProps) => {
  return (
    <TextComponent
      ref={props.ref}
      className={cn(textVariants({ variant }), className)}
      {...props}
    >
      {children}
    </TextComponent>
  );
};

export { Text };
