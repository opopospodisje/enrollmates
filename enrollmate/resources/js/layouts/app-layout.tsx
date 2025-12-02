import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    pageTitle?: string;
    pageDescription?: string;
}

export default ({ children, breadcrumbs, pageTitle, pageDescription, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} pageTitle={pageTitle} pageDescription={pageDescription} {...props}>
        {children}
    </AppLayoutTemplate>
);
