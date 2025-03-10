import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                `flex h-10 w-full rounded border border-slate-300 bg-white px-3 py-2
                    text-base ring-offset-white file:border-0 file:bg-transparent file:text-base
                    file:font-medium placeholder:text-slate-500 focus-visible:border-blue-300 
                    focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-blue-200
                    disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800
                    dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400
                    dark:focus-visible:ring-slate-300 transition ease-in-out`,
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = 'Input';

export { Input };
