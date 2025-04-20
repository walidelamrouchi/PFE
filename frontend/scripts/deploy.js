
const fs = require('fs');
const path = require('path');

// Ensure _redirects file exists for Netlify SPA routing
const redirectsContent = "/* /index.html 200";
const redirectsPath = path.join(__dirname, '..', 'public', '_redirects');

fs.writeFileSync(redirectsPath, redirectsContent);
console.log('Created _redirects file for Netlify SPA routing');

// Add any other deployment preparation here if needed
console.log('Deployment preparation complete!');
