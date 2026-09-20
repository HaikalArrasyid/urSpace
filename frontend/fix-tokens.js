const fs = require('fs');
const path = require('path');

const dirToWalk = path.join(__dirname, 'app');
const componentsDir = path.join(__dirname, 'components');

const replaceRules = [
    // Colors
    { regex: /bg-\[#F9F9F9\]/g, replace: 'bg-background' },
    { regex: /bg-white/g, replace: 'bg-surface' },
    { regex: /text-gray-900/g, replace: 'text-text-primary' },
    { regex: /text-gray-800/g, replace: 'text-text-primary' },
    { regex: /text-gray-700/g, replace: 'text-text-secondary' },
    { regex: /text-gray-600/g, replace: 'text-text-secondary' },
    { regex: /text-gray-500/g, replace: 'text-text-secondary' },
    { regex: /text-gray-400/g, replace: 'text-text-secondary' },
    { regex: /text-gray-300/g, replace: 'text-text-secondary opacity-70' },
    { regex: /text-gray-200/g, replace: 'text-text-secondary opacity-50' },
    
    { regex: /bg-gray-100/g, replace: 'bg-badge-bg' },
    { regex: /bg-gray-50/g, replace: 'bg-badge-bg' },
    { regex: /bg-gray-200/g, replace: 'bg-border' },
    
    { regex: /border-gray-100/g, replace: 'border-border' },
    { regex: /border-gray-200/g, replace: 'border-border' },
    { regex: /border-gray-300/g, replace: 'border-border' },
    
    { regex: /bg-red-50/g, replace: 'bg-error/10' },
    { regex: /border-red-100/g, replace: 'border-error/20' },
    { regex: /border-red-200/g, replace: 'border-error/30' },
    { regex: /border-red-500/g, replace: 'border-error' },
    { regex: /text-red-[0-9]{3}/g, replace: 'text-error' },
    
    { regex: /bg-green-50/g, replace: 'bg-success/10' },
    { regex: /border-green-200/g, replace: 'border-success/30' },
    { regex: /text-green-[0-9]{3}/g, replace: 'text-success' },
    
    { regex: /bg-[#1A1A1A]/g, replace: 'bg-surface' },
    { regex: /border-gray-800/g, replace: 'border-border' },

    // Shadows
    { regex: /shadow-\[0_8px_30px_rgb\(0,0,0,0\.0[0-9]\)\]/g, replace: 'shadow-none' },
    { regex: /shadow-sm/g, replace: 'shadow-none' },
    { regex: /shadow-md/g, replace: 'shadow-none' },
    { regex: /shadow-lg/g, replace: 'shadow-floating' },
    { regex: /shadow-xl/g, replace: 'shadow-floating' },
    { regex: /shadow-2xl/g, replace: 'shadow-floating' },
    { regex: /shadow-primary\/[0-9]{2}/g, replace: '' },
    { regex: /shadow-black\/[0-9]{2}/g, replace: '' },

    // "hover:text-brand-dark" to text-primary
    { regex: /text-brand-dark/g, replace: 'text-text-primary' },
    
    // Ensure primary consistency
    { regex: /bg-yellow-[45]00/g, replace: 'bg-primary' },
    { regex: /hover:bg-yellow-[56]00/g, replace: 'hover:bg-primary-hover' },
    { regex: /hover:bg-\[#E5BE00\]/g, replace: 'hover:bg-primary-hover' },
    { regex: /text-yellow-[4567]00/g, replace: 'text-primary' },
];

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let newContent = content;
            for (const rule of replaceRules) {
                newContent = newContent.replace(rule.regex, rule.replace);
            }
            if (content !== newContent) {
                // Ensure duplicate classes like "shadow-none shadow-none" are handled simply
                newContent = newContent.replace(/shadow-none shadow-none/g, 'shadow-none');
                newContent = newContent.replace(/  +/g, ' ');
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

if (fs.existsSync(dirToWalk)) processDir(dirToWalk);
if (fs.existsSync(componentsDir)) processDir(componentsDir);
console.log("Done refactoring UI tokens.");
