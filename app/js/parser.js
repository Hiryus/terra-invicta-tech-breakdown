class Parser {
    static async loadTranslations(url) {
        // Fetch data
        const response = await fetch(url);
        const data = await response.text();

        // Parse data line by line
        return data.split('\n')
            .map((line) => line.match(/^[^.=]+\.([^.=]+)\.([^.=]+)=([^\/]+)(\/\/.+)*$/ims))
            .filter((match) => match != null)
            .map(([_, type, key, value]) => ({ type, key, value: value.trim() }));
    }

    static async loadTemplates(url) {
        const response = await fetch(url);
        return await response.json();
    }
}
