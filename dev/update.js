const fsp = require('fs').promises;
const path = require('path');

const SRC_LOCALIZATION = 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Terra Invicta\\TerraInvicta_Data\\StreamingAssets\\Localization\\en';
const SRC_TEMPLATES = 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Terra Invicta\\TerraInvicta_Data\\StreamingAssets\\Templates';

const DST_LOCALIZATION = './app/game/localization';
const DST_TEMPLATES = './app/game/templates';

async function main() {
    for (const name of await fsp.readdir(DST_LOCALIZATION)) {
        const srcPath = path.join(SRC_LOCALIZATION, name);
        const dstPath = path.join(DST_LOCALIZATION, name);
        await fsp.copyFile(srcPath, dstPath);
        console.log(`File localization/${name} copied.`);
    }
    for (const name of await fsp.readdir(DST_TEMPLATES)) {
        const srcPath = path.join(SRC_TEMPLATES, name);
        const dstPath = path.join(DST_TEMPLATES, name);
        await fsp.copyFile(srcPath, dstPath);
        console.log(`File templates/${name} copied.`);
    }
}

main().catch(console.error);
