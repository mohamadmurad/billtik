import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
import {  useTranslation } from '@/hooks/useTranslation';
export default function AuthLayout({ children, title, description, ...props }: { children: React.ReactNode; title: string; description: string }) {
   useTranslation();
    return (
        <AuthLayoutTemplate title={title} description={description} {...props}>
            {children}
        </AuthLayoutTemplate>
    );
}
