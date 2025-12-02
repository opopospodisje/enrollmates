import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import Heading from '@/components/heading';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({ children, breadcrumbs = [], pageTitle = '', pageDescription = '', }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[]; pageTitle?: string; pageDescription?: string }>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />                
                <div className='p-6'>
                    {pageTitle && <Heading title={pageTitle} description={pageDescription} />}
                    {children}
                </div>
            </AppContent>
        </AppShell>
    );
}
