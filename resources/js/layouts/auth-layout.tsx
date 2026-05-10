import AppLogo from '@/components/app-logo';
import { Link } from '@inertiajs/react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-6 px-6">
            <div className="mb-6 scale-120 transform origin-center">
                <Link href="/">
                    <AppLogo />
                </Link>
            </div>
            <div className="w-full bg-white p-8 md:p-10 shadow-2xl border border-gray-100 sm:max-w-2xl rounded-[3rem]">
                {children}
            </div>
        </div>
    );
}