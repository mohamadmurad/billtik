import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { RouterIcon, UsersIcon } from 'lucide-react';
import { t } from '@/hooks/useTranslation';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ routersCount, clientsCount, profilesCount }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {/* Clients Card */}
                    <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                    <UsersIcon className="h-5 w-5" /> {/* Replace with your icon component */}
                                    <span className="text-sm font-medium tracking-wider uppercase">{t('attributes.clients.title')}</span>
                                </div>
                                <div className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">{clientsCount}</div>
                            </div>
                            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                                <UsersIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" /> {/* Icon with background */}
                            </div>
                        </div>
                        {/*<div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">*/}
                        {/*    <ArrowUpIcon className="h-4 w-4 text-green-500" /> /!* Replace with your trend icon *!/*/}
                        {/*    <span className="ml-1">12% from last month</span> /!* Optional trend indicator *!/*/}
                        {/*</div>*/}
                    </div>

                    {/* Profiles Card */}
                    <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                    <RouterIcon className="h-5 w-5" /> {/* Replace with your icon component */}
                                    <span className="text-sm font-medium tracking-wider uppercase">{t('attributes.profiles.title')}</span>
                                </div>
                                <div className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">{profilesCount}</div>
                            </div>
                            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                                <RouterIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" /> {/* Icon with background */}
                            </div>
                        </div>
                        {/*<div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">*/}
                        {/*    <ArrowUpIcon className="h-4 w-4 text-green-500" /> /!* Replace with your trend icon *!/*/}
                        {/*    <span className="ml-1">12% from last month</span> /!* Optional trend indicator *!/*/}
                        {/*</div>*/}
                    </div>

                    {/* Routers Card */}
                    <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                    <RouterIcon className="h-5 w-5" /> {/* Replace with your icon component */}
                                    <span className="text-sm font-medium tracking-wider uppercase">{t('attributes.admin.routers.title')}</span>
                                </div>
                                <div className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">{routersCount}</div>
                            </div>
                            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                                <RouterIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" /> {/* Icon with background */}
                            </div>
                        </div>
                        {/*<div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">*/}
                        {/*    <ArrowUpIcon className="h-4 w-4 text-green-500" /> /!* Replace with your trend icon *!/*/}
                        {/*    <span className="ml-1">12% from last month</span> /!* Optional trend indicator *!/*/}
                        {/*</div>*/}
                    </div>
                </div>

                {/* Additional content area */}
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
