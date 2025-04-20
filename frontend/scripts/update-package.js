
const fs = require('fs');
const path = require('path');

// Read the package.json file
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add the predeploy script if it doesn't exist
if (!packageJson.scripts.predeploy) {
  packageJson.scripts.predeploy = "node scripts/deploy.js";
}

// Add the deploy script if it doesn't exist
if (!packageJson.scripts.deploy) {
  packageJson.scripts.deploy = "npm run predeploy && npm run build";
}

// Write the updated package.json file
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('Updated package.json with deployment scripts');
