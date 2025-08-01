import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
const FeatureCard = ({
                         icon,
                         title,
                         text,
                     }: {
    icon: string
    title: string
    text: string
}) => (
    <div className="bg-white p-6 rounded-2xl shadow border text-center">
        <div className="text-4xl mb-2">{icon}</div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{text}</p>
    </div>
)
export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="min-h-screen bg-white text-gray-800 flex flex-col">
            {/* Hero */}
            <section className="px-6 py-24 text-center bg-gradient-to-b from-indigo-600 to-indigo-500 text-white">
                <h1 className="text-5xl font-bold mb-4">Simplify Your ISP Business</h1>
                <p className="text-lg mb-6">
                    Manage PPPoE clients, routers, and usage with ease — all in one SaaS.
                </p>
                <div className="flex justify-center gap-4">
                    <Link
                        href="/login"
                        className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold shadow hover:bg-gray-100 transition"
                    >
                        Login
                    </Link>
                    <a
                        href="#features"
                        className="underline hover:text-indigo-200 text-white/90"
                    >
                        View Features
                    </a>
                </div>
            </section>

            {/* Features */}
            <section
                id="features"
                className="px-6 py-16 max-w-6xl mx-auto w-full text-center"
            >
                <h2 className="text-3xl font-bold mb-8">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <FeatureCard
                        icon="🛠️"
                        title="Router Sync"
                        text="Automatically sync PPP secrets from MikroTik routers."
                    />
                    <FeatureCard
                        icon="📈"
                        title="Client Dashboards"
                        text="Clients log in via subdomains to see usage and info."
                    />
                    <FeatureCard
                        icon="🔒"
                        title="Secure Auth"
                        text="Scoped login for companies, employees, and subscribers."
                    />
                </div>
            </section>

            {/* CTA */}
            <section className="bg-gray-100 px-6 py-20 text-center">
                <h3 className="text-2xl font-semibold mb-4">
                    Ready to get started?
                </h3>
                <p className="mb-6 text-gray-700">
                    Log in to your portal or reach out to request a demo.
                </p>
                <Link
                    href="/login"
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow hover:bg-indigo-700 transition"
                >
                    Get Started
                </Link>
            </section>

            {/* Footer */}
            <footer className="text-sm text-center py-6 text-gray-500 mt-auto">
                © {new Date().getFullYear()} YourSaaSName. All rights reserved.
            </footer>
        </div>
    );
}
