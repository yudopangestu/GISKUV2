# README – Standalone qgis2web Export

The map retains its qgis2web layers, styles, and documents and is publicly
accessible. No account or sign-in is required to view the map or its files.

## Publishing on a Website

Netlify uses netlify.toml to prepare the dist directory and deploy the map.
The former /login and /login.html addresses redirect to the map. Only site assets are
published; application source, dependencies, and internal files are excluded.

## Development

Use Netlify development on port 8889 to serve the application locally.
Site assets are copied into dist as part of deployment; do not publish the
repository root directly.
