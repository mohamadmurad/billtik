import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

let translations: Record<string, any> = {}; // Store translations globally

const getNestedTranslation = (obj: any, path: string, fallback = path): string => {
    return path.split('.').reduce((acc, key) => (acc && acc[key] ? acc[key] : fallback), obj);
};

// Hydrate from global or from Inertia's initial page JSON if available
const tryHydrateTranslations = (): void => {
    if (translations && Object.keys(translations).length > 0) return;

    // SSR or browser global
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const g: any = (typeof globalThis !== 'undefined' ? globalThis : {}) as any;
        if (g.__TRANSLATIONS__ && typeof g.__TRANSLATIONS__ === 'object') {
            translations = g.__TRANSLATIONS__;
            return;
        }
    } catch {}

    // Browser: read from Inertia root element's data-page
    try {
        if (typeof document !== 'undefined') {
            const el = document.getElementById('app');
            // @ts-expect-error data-page is injected by Inertia
            const pageData = el?.dataset?.page as string | undefined;
            if (pageData) {
                const page = JSON.parse(pageData);
                if (page?.props?.translations && typeof page.props.translations === 'object') {
                    translations = page.props.translations;
                }
            }
        }
    } catch {}
};

// **Global translation function**
export const t = (key: string, replacements: Record<string, string> = {}): string => {
    tryHydrateTranslations();

    let translation = getNestedTranslation(translations, key);

    // Ensure we operate on a string
    if (typeof translation !== 'string') {
        translation = key;
    }

    Object.keys(replacements).forEach((placeholder) => {
        translation = translation.replace(`:${placeholder}`, replacements[placeholder]);
    });

    return translation;
};

// **Hook to initialize/sync translations**
export function useTranslation() {
    const { translations: pageTranslations } = usePage<SharedData>().props;

    if (pageTranslations && pageTranslations !== translations) {
        translations = pageTranslations; // Always sync with current page
        // Also expose globally for early access (first render) and SSR
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis as any).__TRANSLATIONS__ = translations;
    }

    return { t };
}
