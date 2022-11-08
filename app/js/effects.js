class Effects {
    constructor() {
        this.data = {};
    }

    get(dataName) {
        if (this.data[dataName] == null) {
            throw new Error(`Unknown effect '${dataName}'.`);
        }
        return this.data[dataName];
    }

    getDescription(dataName) {
        const effect = this.get(dataName);
        if (typeof effect.description !== 'string' || effect.description.length < 1) {
            return effect.displayName || `${dataName} (no info)`;
        }
        return effect.description
            .replace(/^-/, '') // remove leading dash if any
            .replace('{0}', effect.value)
            .replace('{3}', `${effect.value * 100}%`)
            .replace('{4}', `${100 - effect.value * 100}%`)
            .replace('{8}', `${Math.round((effect.value - 1) * 100)}%`)
            .replace('{14}', '[your faction]')
            .replace('{18}', `${(1 - effect.value) * 100}%`)
            .replace('{19}', Math.abs(effect.value));
    }

    async load() {
        // Fetch data
        const [templates, transaltions] = await Promise.all([
            Parser.loadTemplates('game/TIEffectTemplate.json'),
            Parser.loadTranslations('game/TIEffectTemplate.en'),
        ]);

        // Load template
        for (const effect of templates) {
            this.data[effect.dataName] = effect;
        }

        // Load translations
        for (const { type, key, value } of transaltions) {
            if (key in this.data) {
                this.data[key][type] = value;
            }
        }
    }
}
