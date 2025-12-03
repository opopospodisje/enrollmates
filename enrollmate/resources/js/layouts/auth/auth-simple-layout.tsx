import logo from '@/assets/logo/logo.png';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="relative flex items-center justify-center bg-white p-10">
                <div className="flex flex-col items-center gap-6">
                    <img src={logo} alt="School Logo" className="h-52 w-52 md:h-60 md:w-60 object-contain" />
                    <div className="text-center">
                        <p className="text-2xl md:text-3xl font-bold text-neutral-700">Welcome to</p>
                        <h1 className="text-5xl md:text-6xl font-black text-red-600">Enroll_Mate</h1>
                    </div>
                </div>
                <PlaceholderPattern className="absolute left-6 bottom-6 h-24 w-24 text-red-600 opacity-60" variant="dots" corner="bottom-left" />
            </div>
            <div className="relative flex items-center justify-center bg-[#6f2222] p-10 text-white">
                <PlaceholderPattern className="absolute right-6 top-6 h-24 w-24 text-white opacity-60" variant="dots" corner="top-right" />
                <div className="w-full max-w-md">
                    <div className="space-y-2 text-center mb-6">
                        <h1 className="text-2xl font-semibold">{title}</h1>
                        <p className="text-sm text-neutral-200">{description}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
