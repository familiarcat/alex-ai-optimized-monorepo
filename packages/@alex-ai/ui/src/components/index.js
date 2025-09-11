"use strict";
// @alex-ai/ui components
// React components for Alex AI applications
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = exports.Button = void 0;
const react_1 = __importDefault(require("react"));
const Button = ({ children, onClick, variant = 'primary', size = 'medium', disabled = false }) => {
    const baseClasses = 'px-4 py-2 rounded font-medium transition-colors';
    const variantClasses = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
        danger: 'bg-red-600 text-white hover:bg-red-700'
    };
    const sizeClasses = {
        small: 'px-2 py-1 text-sm',
        medium: 'px-4 py-2',
        large: 'px-6 py-3 text-lg'
    };
    const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`;
    return react_1.default.createElement('button', {
        className: buttonClasses,
        onClick,
        disabled
    }, children);
};
exports.Button = Button;
const Card = ({ children, title, className = '' }) => {
    const cardClasses = `bg-white rounded-lg shadow-md p-6 ${className}`;
    return react_1.default.createElement('div', { className: cardClasses }, [
        title && react_1.default.createElement('h3', {
            key: 'title',
            className: 'text-lg font-semibold mb-4'
        }, title),
        children
    ]);
};
exports.Card = Card;
exports.default = {
    Button: exports.Button,
    Card: exports.Card
};
//# sourceMappingURL=index.js.map