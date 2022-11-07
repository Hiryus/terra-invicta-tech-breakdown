async function selectFile() {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = () => resolve(input.files[0]);
        input.click();
    });
}

function unzip(input) {
    const compressed = new Uint8Array(input);
    const rawData = pako.inflate(compressed);
    return new TextDecoder().decode(rawData);
}

const app = Vue.createApp({
    data() {
        return {
            loading: true,
            opened: [],
            tree: null,
            search: '',
        };
    },

    created() {
        buildTree()
            .then(tree => {
                this.tree = tree;
                this.loading = false;
            })
            .catch(console.error);
    },

    computed: {
        roles() {
            const roles = this.technologies
                .filter(tech => typeof tech.role === 'string' && tech.role.length > 0)
                .reduce((roles, tech) => roles.add(tech.role), new Set());
            return Array.from(roles).sort();
        },
        technologies() {
            if (this.search.length < 3) {
                return Object.values(this.tree.data);
            }
            return Object.values(this.tree.data).filter(x => typeof x.displayName === 'string' && x.displayName.toLowerCase().includes(this.search.toLowerCase()));
        }
    },

    methods: {
        getDescription(project) {
            if (project.description) {
                return project.description;
            }
            if (project.summary && project.summary.match(/<[a-z]+>/i)) {
                return `Unlock module ${project.summary}.`;
            }
            if (project.summary) {
                return project.summary;
            }
            return null;
        },
        async loadSave() {
            // Read file
            const file = await selectFile();
            const contents = await file.arrayBuffer();
            const string = unzip(contents);

            // Parse data
            // NB: the save may contains the symbol "Infinity" which is not a valid JSON value.
            // Since we don't care about the data where this happens, we monkey-replace the value by a valid integer.
            const data = JSON.parse(string.replaceAll('Infinity', 1));
            const knownTechnologgies = data.gamestates['PavonisInteractive.TerraInvicta.TIGlobalResearchState'][0].Value.finishedTechsNames;
            const knownProjects = data.gamestates['PavonisInteractive.TerraInvicta.TIFactionState'][0].Value.finishedProjectNames;

            // Update tech tree
            // NB: We only add completed techs/projects here, we don't reset those which were known before
            for (const dataName of [...knownTechnologgies, ...knownProjects]) {
                this.tree.get(dataName).known = true;
            }
        },
        open(url) {
            window.open(url, '_blank').focus();
        },
        techByRole(role) {
            return this.technologies
                .filter(x => x.role === role)
                .sort((a, b) => this.tree.getMissingScience(a.dataName) - this.tree.getMissingScience(b.dataName));
        },
        toggle(role) {
            if (this.opened.includes(role)) {
                const idx = this.opened.indexOf(role);
                this.opened.splice(idx, 1); 
            } else {
                this.opened.push(role);
            }
        },
    }
});

app.mount('#app');
