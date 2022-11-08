class Parser {
    static async loadTranslations(filenmae) {
        // Fetch data
        const response = await fetch(`game/localization/${filenmae}.en`);
        const data = await response.text();

        // Parse data line by line
        return data.split('\n')
            .map((line) => line.match(/^[^.=]+\.([^.=]+)\.([^.=]+)=([^\/]+)(\/\/.+)*$/ims))
            .filter((match) => match != null)
            .map(([_, type, key, value]) => ({ type, key, value: value.trim() }));
    }

    static async loadTemplates(filenmae) {
        const response = await fetch(`game/templates/${filenmae}.json`);
        return await response.json();
    }
}
