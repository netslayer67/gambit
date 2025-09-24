import React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { X } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// 🛡️ Sanitizer: buang tag HTML & whitespace
const sanitizeText = (value = '') => String(value).replace(/<[^>]*>?/gm, '').trim();

const ToastProvider = ToastPrimitives.Provider;

// 📍 Toast Viewport: top stacked di mobile, bottom-right grid di desktop
const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
    <ToastPrimitives.Viewport
        ref={ref}
        className={cn(
            'fixed z-[9999] flex max-h-screen w-full flex-col-reverse p-4 top-0',
            'sm:top-auto sm:bottom-6 sm:right-6 sm:w-auto sm:flex-col sm:max-w-[420px] gap-3',
            'pointer-events-none',
            className
        )}
        {...props}
    />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

// 🎨 Surface Variants — glass base + token colors
const toastSurface = cva(
    [
        'group relative pointer-events-auto flex items-start gap-4 overflow-hidden rounded-2xl',
        'border backdrop-blur-lg shadow-liquid',
        'transition-all duration-[320ms] ease-in-out',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
    ].join(' '),
    {
        variants: {
            variant: {
                default:
                    'bg-[hsl(var(--glass))] border-[hsl(var(--border))] text-[hsl(var(--foreground))]',
                destructive:
                    'bg-[hsl(var(--glass))] border-[hsl(var(--error))] text-[hsl(var(--foreground))]',
                success:
                    'bg-[hsl(var(--glass))] border-[hsl(var(--success))] text-[hsl(var(--foreground))]',
                info:
                    'bg-[hsl(var(--glass))] border-[hsl(var(--info))] text-[hsl(var(--foreground))]',
                compact:
                    'bg-[hsl(var(--glass))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] px-3 py-2 gap-2',
            },
            size: {
                sm: 'p-2',
                normal: 'p-4',
                lg: 'p-6',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'normal',
        },
    }
);

// 🧩 Toast Root
const Toast = React.forwardRef(({ className, variant, size, children, ...props }, ref) => (
    <ToastPrimitives.Root
        ref={ref}
        className={cn(toastSurface({ variant, size }), className)}
        {...props}
    >
        {children}
    </ToastPrimitives.Root>
));
Toast.displayName = ToastPrimitives.Root.displayName;

// 🔠 Title
const ToastTitle = React.forwardRef(({ className, children, ...props }, ref) => (
    <ToastPrimitives.Title
        ref={ref}
        className={cn('text-sm font-semibold leading-tight tracking-tight', className)}
        {...props}
    >
        {sanitizeText(children)}
    </ToastPrimitives.Title>
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

// 📄 Description
const ToastDescription = React.forwardRef(({ className, children, ...props }, ref) => (
    <ToastPrimitives.Description
        ref={ref}
        className={cn(
            'text-sm opacity-90 leading-snug text-[hsl(var(--muted))] max-w-[36ch] truncate',
            className
        )}
        {...props}
    >
        {sanitizeText(children)}
    </ToastPrimitives.Description>
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

// ❌ Close Button
const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
    <ToastPrimitives.Close
        ref={ref}
        className={cn(
            'absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full',
            'transition-opacity duration-[320ms] ease-in-out opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
            'bg-[hsl(var(--glass))] border border-[hsl(var(--border))]',
            'hover:scale-105 active:scale-95',
            className
        )}
        aria-label="Close"
        {...props}
    >
        <X className="h-4 w-4" />
    </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

// 🎬 Action Button
const ToastAction = React.forwardRef(({ className, children, ...props }, ref) => (
    <ToastPrimitives.Action
        ref={ref}
        className={cn(
            'inline-flex items-center justify-center rounded-lg border px-3 py-1 text-sm font-medium',
            'transition-all duration-[320ms] ease-in-out',
            'border-[hsl(var(--border))] bg-transparent',
            'hover:bg-[hsl(var(--primary)/0.08)] focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))]',
            className
        )}
        {...props}
    >
        {sanitizeText(children)}
    </ToastPrimitives.Action>
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

// 📱 Compact Icon-Only Action (mobile UX)
const IconOnlyAction = React.forwardRef(({ className, children, 'aria-label': ariaLabel, ...props }, ref) => (
    <ToastPrimitives.Action
        ref={ref}
        className={cn(
            'inline-flex h-8 w-8 items-center justify-center rounded-full',
            'bg-[hsl(var(--glass))] border border-[hsl(var(--border))]',
            'transition-all duration-[320ms] ease-in-out hover:scale-[1.05] active:scale-95',
            className
        )}
        aria-label={ariaLabel}
        {...props}
    >
        {children}
    </ToastPrimitives.Action>
));
IconOnlyAction.displayName = 'IconOnlyAction';

export {
    Toast,
    ToastProvider,
    ToastViewport,
    ToastTitle,
    ToastDescription,
    ToastClose,
    ToastAction,
    IconOnlyAction,
};

export default React.memo(Toast);
