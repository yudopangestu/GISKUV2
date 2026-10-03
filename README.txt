# README – Standalone qgis2web Export

The map retains its qgis2web layers, styles, and documents, with authenticated
access provided by Netlify Identity. Opening local files directly does not
provide access control; serve the application through Netlify.

## Publishing on a Website

Netlify uses netlify.toml to prepare the dist directory and deploy the login
page, Identity functions, and edge access checks. Only public site assets are
published; application source, dependencies, and internal files are excluded.

## Account setup

After deployment, open /login.html and choose "Aktivasi akun pertama kali".
Enter the authorized user ID and email, choose a password, and confirm the
account using the email link. Then sign in using the user ID and password.
The "Lupa kata sandi?" link supports password recovery. Identity invitations
are also supported. Passwords are never prefilled or committed to source.

Only the configured account can register, sign in, or retrieve map files.
Other accounts are denied even if they obtain an Identity session. Identifier
fingerprints are stored in netlify/lib/account.ts; they are not password hashes.
Identity stores and verifies passwords. No application database is needed.

## Development

Install dependencies with npm install. Use Netlify development on port 8889
to emulate Identity, Functions, and Edge Functions. The browser scripts are
prepared as part of deployment; do not publish the repository root directly.
