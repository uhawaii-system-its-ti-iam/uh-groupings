import React from 'react';
import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

const spinnerVariants = cva('flex-col items-center justify-center', {
    variants: {
        show: {
            true: 'flex',
            false: 'hidden'
        }
    },
    defaultVariants: {
        show: true
    }
});

const loaderVariants = cva('animate-spin text-white stroke-[0.7]', {
    variants: {
        size: {
            xs: 'size-4',
            sm: 'size-6',
            default: 'size-8',
            lg: 'w-[9rem] h-[9rem]'
        }
    },
    defaultVariants: {
        size: 'lg'
    }
});

interface SpinnerContentProps extends VariantProps<typeof spinnerVariants>, VariantProps<typeof loaderVariants> {
    className?: string;
    children?: React.ReactNode;
}

export const Spinner = ({ size, show, children, className }: SpinnerContentProps) => {
    return (
        <span className={spinnerVariants({ show })} role="status">
            <Loader2 className={cn(loaderVariants({ size }), className)} />
            {children}
        </span>
    );
};
