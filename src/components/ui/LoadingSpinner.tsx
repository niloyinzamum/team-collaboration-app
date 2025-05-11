interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
  }
  
  export function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-8 w-8',
      lg: 'h-12 w-12'
    };
  
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div 
          className={`${sizeClasses[size]} animate-spin rounded-full 
          border-2 border-black/20 border-t-black`}
        />
      </div>
    );
  }