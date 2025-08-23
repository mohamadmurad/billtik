export function getInitials(name: string | null) {
    if (!name) {
        return 'NA';
    }
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

export async function copyToClipboard(text: string|undefined|null) {
    try {
        if (text) await navigator.clipboard.writeText(text);
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
}
