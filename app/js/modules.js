class Modules {
    constructor() {
        this.data = {};
        this.byProject = {};
    }

    addModules(data, wikiLink) {
        for (const source of data) {
            this.addModule(source, wikiLink);
        }
    }
    addModule(source, wikiLink) {
        this.data[source.dataName] = source;
        this.data[source.dataName].wiki = wikiLink;
        this.indexModule(source);
    }
    indexModule(source) {
        if (typeof source.requiredProjectName !== 'string' || source.requiredProjectName.length === 0) {
            return; // no requirement, so no index
        }
        if (!Array.isArray(this.byProject[source.requiredProjectName])) {
            this.byProject[source.requiredProjectName] = [];
        }
        this.byProject[source.requiredProjectName].push(source);
    }

    addTranslation(dataName, type, value) {
        if (dataName in this.data) {
            this.data[dataName][type] = value;
        }
    }

    get(dataName) {
        if (this.data[dataName] == null) {
            throw new Error(`Unknown module '${dataName}'.`);
        }
        return this.data[dataName];
    }

    getProjectModules(requiredProjectName) {
        return this.byProject[requiredProjectName] || [];
    }

    async load() {
        // Load templates
        await Promise.all([
            Parser.loadTemplates('TIBatteryTemplate').then((data) => this.addModules(data, 'https://hoodedhorse.com/wiki/Terra_Invicta/Spaceships#Battery')),
            Parser.loadTemplates('TIDriveTemplate').then((data) => this.addModules(data, 'https://hoodedhorse.com/wiki/Terra_Invicta/Spaceships#Drive')),
            Parser.loadTemplates('TIGunTemplate').then((data) => this.addModules(data, 'https://hoodedhorse.com/wiki/Terra_Invicta/Spaceships#Guns')),
            Parser.loadTemplates('TIHabModuleTemplate').then((data) => this.addModules(data, 'https://hoodedhorse.com/wiki/Terra_Invicta/Habs')),
            Parser.loadTemplates('TIHeatSinkTemplate').then((data) => this.addModules(data, 'https://hoodedhorse.com/wiki/Terra_Invicta/Spaceships#Heat_Sink')),
            Parser.loadTemplates('TILaserWeaponTemplate').then((data) => this.addModules(data, 'https://hoodedhorse.com/wiki/Terra_Invicta/Spaceships#Lasers')),
            Parser.loadTemplates('TIMagneticGunTemplate').then((data) => this.addModules(data, 'https://hoodedhorse.com/wiki/Terra_Invicta/Spaceships#Magnetic_Weapons')),
            Parser.loadTemplates('TIMissileTemplate').then((data) => this.addModules(data, 'https://hoodedhorse.com/wiki/Terra_Invicta/Spaceships#Missiles')),
            Parser.loadTemplates('TIParticleWeaponTemplate').then((data) => this.addModules(data, 'https://hoodedhorse.com/wiki/Terra_Invicta/Spaceships#Particle_Weapons')),
            Parser.loadTemplates('TIPlasmaWeaponTemplate').then((data) => this.addModules(data, 'https://hoodedhorse.com/wiki/Terra_Invicta/Spaceships#Plasma_Weapons')),
            Parser.loadTemplates('TIPowerPlantTemplate').then((data) => this.addModules(data, 'https://hoodedhorse.com/wiki/Terra_Invicta/Spaceships#Power_Plant')),
            Parser.loadTemplates('TIRadiatorTemplate').then((data) => this.addModules(data, 'https://hoodedhorse.com/wiki/Terra_Invicta/Spaceships#Radiator')),
            Parser.loadTemplates('TIShipArmorTemplate').then((data) => this.addModules(data, 'https://hoodedhorse.com/wiki/Terra_Invicta/Spaceships#Armor')),
            Parser.loadTemplates('TIShipHullTemplate').then((data) => this.addModules(data, 'https://hoodedhorse.com/wiki/Terra_Invicta/Spaceships#Hull')),
            Parser.loadTemplates('TIUtilityModuleTemplate').then((data) => this.addModules(data, 'https://hoodedhorse.com/wiki/Terra_Invicta/Spaceships#Utility_Modules')),
        ]);

        // Load translations
        await Promise.all([
            Parser.loadTranslations('TIBatteryTemplate').then(({ type, key, value }) => this.addTranslation(key, type, value)),
            Parser.loadTranslations('TIDriveTemplate').then(({ type, key, value }) => this.addTranslation(key, type, value)),
            Parser.loadTranslations('TIGunTemplate').then(({ type, key, value }) => this.addTranslation(key, type, value)),
            Parser.loadTranslations('TIHabModuleTemplate').then(({ type, key, value }) => this.addTranslation(key, type, value)),
            Parser.loadTranslations('TIHeatSinkTemplate').then(({ type, key, value }) => this.addTranslation(key, type, value)),
            Parser.loadTranslations('TILaserWeaponTemplate').then(({ type, key, value }) => this.addTranslation(key, type, value)),
            Parser.loadTranslations('TIMagneticGunTemplate').then(({ type, key, value }) => this.addTranslation(key, type, value)),
            Parser.loadTranslations('TIMissileTemplate').then(({ type, key, value }) => this.addTranslation(key, type, value)),
            Parser.loadTranslations('TIParticleWeaponTemplate').then(({ type, key, value }) => this.addTranslation(key, type, value)),
            Parser.loadTranslations('TIPlasmaWeaponTemplate').then(({ type, key, value }) => this.addTranslation(key, type, value)),
            Parser.loadTranslations('TIPowerPlantTemplate').then(({ type, key, value }) => this.addTranslation(key, type, value)),
            Parser.loadTranslations('TIRadiatorTemplate').then(({ type, key, value }) => this.addTranslation(key, type, value)),
            Parser.loadTranslations('TIShipArmorTemplate').then(({ type, key, value }) => this.addTranslation(key, type, value)),
            Parser.loadTranslations('TIShipHullTemplate').then(({ type, key, value }) => this.addTranslation(key, type, value)),
            Parser.loadTranslations('TIUtilityModuleTemplate').then(({ type, key, value }) => this.addTranslation(key, type, value)),
        ]);
    }
}
