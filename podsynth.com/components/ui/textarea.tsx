import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, onChange, ...props }, forwardedRef) => {
    const internalRef = React.useRef<HTMLTextAreaElement>(null);

    React.useImperativeHandle(forwardedRef, () => internalRef.current!);

    const adjustHeight = () => {
      const textarea = internalRef.current;
      if (textarea !== null) {
        textarea.style.height = 'auto'; // Reset height to get a proper scrollHeight
        textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight
      }
    };

    React.useEffect(() => {
      adjustHeight();
      window.addEventListener('resize', adjustHeight);
      return () => window.removeEventListener('resize', adjustHeight);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) {
        onChange(e);
      }
      adjustHeight();
    };

    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-hidden",
          className
        )}
        {...props}
        ref={internalRef}
        onChange={handleInputChange}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
