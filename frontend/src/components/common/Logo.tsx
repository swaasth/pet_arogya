import Image from 'next/image';

interface LogoProps {
  variant?: 'full' | 'symbol';
  className?: string;
}

export function Logo({ variant = 'full', className = '' }: LogoProps) {
  const src = variant === 'full' 
    ? '/images/logo/logo-full.svg'
    : '/images/logo/logo-symbol.svg';

  return (
    <Image
      src={src}
      alt="Platform Logo"
      width={variant === 'full' ? 150 : 40}
      height={variant === 'full' ? 50 : 40}
      className={className}
      priority
    />
  );
} 