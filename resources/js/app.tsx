import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        const page = resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')) as any;
        
        page.then((module: any) => {
            const pageName = name.toLowerCase();
            
            if (pageName === 'home') {
                module.default.layout = null;
            } 
            else if (pageName === 'admin/login') {
                module.default.layout = (page: any) => <AuthLayout children={page} />;
            }
            else if (pageName === 'auth/profile' ||
                    pageName === 'auth/medical-record' ||
                    pageName === 'auth/pets-history' ) {
                module.default.layout = null; 
            }
            else if (pageName.startsWith('auth/')) {
                module.default.layout = (page: any) => <AuthLayout children={page} />;
            } 
            else if (pageName.startsWith('settings/')) {
                module.default.layout = (page: any) => <AppLayout children={<SettingsLayout children={page} />} />;
            } 
            else {
                module.default.layout = (page: any) => <AppLayout children={page} />;
            }
        });

        return page;
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

initializeTheme();