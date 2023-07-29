class Parser {
    static async loadTranslations(filename) {
        // Fetch data
        const response = await fetch(`game/localization/${filename}.en`);
        const data = await response.text();

        // Parse data line by line
        return data.split('\n')
            .map((line) => line.match(/^[^.=]+\.([^.=]+)\.([^.=]+)=([^\/]+)(\/\/.+)*$/ims))
            .filter((match) => match != null)
            .map(([_, type, key, value]) => ({ type, key, value: value.trim() }));
    }

    static async loadTemplates(filename) {
        const response = await fetch(`game/templates/${filename}.json`);
        try {
            return await response.json();
        } catch (err) {
            throw Error(`failed to parse template file ${filename}.json: ${err}`)
        }
    }
}
