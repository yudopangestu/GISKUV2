export async function digestIdentifier(value: string): Promise<string> {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value.trim().toLowerCase()));
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function isAllowedEmail(email: unknown): Promise<boolean> {
    return typeof email === 'string' && await digestIdentifier(email) === '9b0e4155c2287fe24946439f093dc313c24c8ea025a3b55968b0687f93179e07';
}

export async function isAllowedUsername(username: unknown): Promise<boolean> {
    return typeof username === 'string' && await digestIdentifier(username) === 'b9ade6292ae0ed81a262a2806c8f5a62911c2c88d6ef3f55c8a912f3d9da418a';
}
