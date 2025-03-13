import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

let translations: Record<string, any> = {}; // Store translations globally

const getNestedTranslation = (obj: any, path: string, fallback = path): string => {
    return path.split('.').reduce((acc, key) => acc && acc[key] ? acc[key] : fallback, obj);
};

// **Global translation function**
export const t = (key: string, replacements: Record<string, string> = {}): string => {
    let translation = getNestedTranslation(translations, key);
    Object.keys(replacements).forEach((placeholder) => {
        translation = translation.replace(`:${placeholder}`, replacements[placeholder]);
    });

    return translation;
};

// **Hook to initialize translations**
export function useTranslation() {
    const { translations: pageTranslations } = usePage<SharedData>().props;

    if (Object.keys(translations).length === 0) {
        translations = pageTranslations; // Set translations once
    }

    return { t };
}
