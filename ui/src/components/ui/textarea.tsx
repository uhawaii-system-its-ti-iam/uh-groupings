import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
    return (
        <textarea
            className={cn(
                `flex min-h-[80px] w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm
                    placeholder:text-slate-500 focus-visible:border-blue-300 focus-visible:outline-none 
                    focus-visible:ring-[3.5px] focus-visible:ring-blue-200 disabled:cursor-not-allowed 
                    disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950
                    dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 transition ease-in-out`,
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Textarea.displayName = 'Textarea';

export { Textarea };
