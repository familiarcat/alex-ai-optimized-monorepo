import React from 'react';
export interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
}
export declare const Button: React.FC<ButtonProps>;
export interface CardProps {
    children: React.ReactNode;
    title?: string;
    className?: string;
}
export declare const Card: React.FC<CardProps>;
declare const _default: {
    Button: React.FC<ButtonProps>;
    Card: React.FC<CardProps>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map