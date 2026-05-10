import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img 
            {...props} 
            src="/img/tplogotxt.png" 
            alt="Tails & Paws Icon" 
            className={`object-contain ${props.className}`} 
        />
    );
}