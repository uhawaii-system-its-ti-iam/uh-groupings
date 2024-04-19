import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/components/ui/utils';

const buttonVariants = cva(
    `inline-flex items-center justify-center whitespace-nowrap rounded-[0.25rem] text-base font-normal ring-offset-white
        transition-colors ease-in-out duration-150 focus-visible:outline-none focus-visible:ring-2 
        focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 
        dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300`,
    {
        variants: {
            variant: {
                default: `bg-[#6fa9be] border-transparent text-slate-50 [text-shadow:_0_1px_1px_#444] bg-gradient-to-b
                    from-[#7db1c4] to-[#5a9cb4] border hover:from-green-blue hover:to-green-blue
                    border-x-black/[.0.1] border-t-black/[.0.1] border-b-black/[.0.25]`,
                destructive: `bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50
                    dark:hover:bg-red-900/90`,
                outline: `border border-green-blue bg-white hover:bg-green-blue hover:text-white text-uh-teal`,
                secondary: `border border-transparent bg-[#f8f9fa] text-[#212529] hover:bg-uh-blue4 hover:text-white`,
                ghost: `hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50`,
                link: `text-slate-900 underline-offset-4 hover:underline dark:text-slate-50`,
            },
            size: {
                default: 'h-10 px-2.5 py-2',
                sm: 'h-9 px-2',
                lg: 'h-12 px-4 text-xl',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button'
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
