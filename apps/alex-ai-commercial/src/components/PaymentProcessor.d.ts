interface PaymentProcessorProps {
    tier: 'basic' | 'premium' | 'enterprise';
    price: number;
    onSuccess: () => void;
    onError: (error: string) => void;
}
export default function PaymentProcessor({ tier, price, onSuccess, onError }: PaymentProcessorProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=PaymentProcessor.d.ts.map