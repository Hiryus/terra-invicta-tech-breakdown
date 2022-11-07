class Tree {
    constructor() {
        this.data = {};
    }

    addTechnology(source, type) {
        this.data[source.dataName] = source;
        this.data[source.dataName].type = type;
        this.data[source.dataName].prereqs = source.prereqs.filter(p => p.length > 0);
        this.data[source.dataName].known = false;
        this.data[source.dataName].role = (type === 'project') ? source.AI_projectRole : source.AI_techRole;
    }

    get(dataName) {
        if (this.data[dataName] == null) {
            throw new Error(`Unknown technology '${dataName}'.`);
        }
        return this.data[dataName];
    }

    /**
     * Return the list of requirements (dataNames) to unlock given technology (roughly ordered).
     */
    getAllRequirements(dataName) {
        const tech = this.get(dataName);
        // List all requirements
        const requirements = tech.prereqs.reduce((list, prereqName) => {
            list.push(prereqName);
            return list.concat(this.getAllRequirements(prereqName));
        }, []);
        // Deduplicate and sort
        return Array.from(new Set(requirements)).sort((a, b) => this.getLevel(a) - this.getLevel(b));
    }

    /**
     * Return the status of the given technology:
     * - "known" (already researched),
     * - "available" (can be researched now),
     * - "locked" (you need to research all requirements first).
     */
    getStatus(dataName) {
        const tech = this.get(dataName);
        if (tech.known) {
            return 'known';
        }
        const prereqsKnown = tech.prereqs.every((name) => this.get(name).known);
        return prereqsKnown ? 'available' : 'locked';
    }

    /**
     * Return the tech. level of the given technology, starting at 1 and increasing by one for each requirement deps.
     */
    getLevel(dataName) {
        const tech = this.get(dataName);
        return 1 + tech.prereqs.reduce((max, prereqName) => Math.max(max, this.getLevel(prereqName)), 0);
    }

    /**
     * Return the science points required to unlock given tech and all unknown prerequisites.
     */
    getMissingScience(dataName) {
        const tech = this.get(dataName);
        if (tech.known) {
            return 0;
        }

        const prereqsCost = tech.prereqs.reduce((total, prereqName) => total + this.getMissingScience(prereqName), 0);
        return prereqsCost + tech.researchCost ;
    }

    /**
     * Return the science points required to unlock given tech and all prerequisites (including those already known/unlocked).
     */
    getTotalScience(dataName) {
        const tech = this.get(dataName);
        const prereqsCost = tech.prereqs.reduce((total, prereqName) => total + this.getTotalScience(prereqName), 0);
        return prereqsCost + tech.researchCost ;
    }

    setTranslation(dataName, type, value) {
        if (dataName in this.data) {
            this.data[dataName][type] = value;
        }
    }
}

async function loadJSON(url) {
    const response = await fetch(url);
    return await response.json();
}

async function loadTranslation(url) {
    // Fetch data
    const response = await fetch(url);
    const data = await response.text();

    // Parse data line by line
    return data.split('\n')
        .map((line) => line.split(/[.=]/, 4))
        .filter((array) => array.length === 4)
        .map(([_, type, key, value]) => ({ type, key, value }));
}

async function buildTree() {
    const tree = new Tree();

    const projects = await loadJSON('game/TIProjectTemplate.json');
    for (const project of projects) {
        project.prereqs = project.prereqs.filter(x => typeof x === 'string' && x.length > 0);
        tree.addTechnology(project, 'project');
    }
    const projectsTranslation = await loadTranslation('game/TIProjectTemplate.en');
    for (const { type, key, value } of projectsTranslation) {
        tree.setTranslation(key, type, value);
    }

    const technologies = await loadJSON('game/TITechTemplate.json');
    for (const technology of technologies) {
        technology.prereqs = technology.prereqs.filter(x => typeof x === 'string' && x.length > 0);
        tree.addTechnology(technology, 'technology');
    }
    const technologiesTranslation = await loadTranslation('game/TITechTemplate.en');
    for (const { type, key, value } of technologiesTranslation) {
        tree.setTranslation(key, type, value);
    }
    
    return tree;
}
