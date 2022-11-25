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
            // Data
            effects: new Effects(),
            modules: new Modules(),
            tree: new Tree(),
            // Filters
            loading: true,
            opened: [],
            search: '',
            pinned: [],
            description: false,
            requirements: true,
            // Drag and drop
            draggedName: null,
            showShadow: false,
            shadowIndex: 0,
        };
    },

    async created() {
        try {
            await Promise.all([
                this.effects.load(),
                this.modules.load(),
                this.tree.load(),
            ]);
            this.loading = false;
            this.loadPinned();
        } catch (err) {
            console.error(err);
        }
    },

    computed: {
        roles() {
            const roles = this.technologies
                .filter(tech => typeof tech.role === 'string' && tech.role.length > 0)
                .reduce((roles, tech) => roles.add(tech.role), new Set());
            return Array.from(roles).sort();
        },
        pinnedTechnologies() {
            return this.pinned.map(x => this.tree.get(x));
        },
        technologies() {
            if (this.search.length < 3) {
                return Object.values(this.tree.data);
            }
            return Object.values(this.tree.data).filter(x => typeof x.displayName === 'string' && x.displayName.toLowerCase().includes(this.search.toLowerCase()));
        }
    },

    methods: {
        capitalize(value) {
            if (typeof value !== 'string' || value.length <1) {
                return value;
            }
            return value.charAt(0).toUpperCase() + value.slice(1);
        },
        dragsendHandler(ev) {
            this.draggedName = null;
            this.showShadow = false;
        },
        dragstartHandler(ev, dataName) {
            this.draggedName = dataName;
            ev.dataTransfer.setData("application/tech-data-name", dataName);
        },
        dragoverHandler(ev, position) {
            ev.preventDefault();
            ev.dataTransfer.dropEffect = "move";

            this.shadowIndex = position;
            this.showShadow = true;
        },
        dropHandler(ev) {
            ev.preventDefault();
            const dataName = ev.dataTransfer.getData("application/tech-data-name");

            const fromIndex = this.pinned.indexOf(dataName);
            const toIndex = (this.shadowIndex > fromIndex) ? this.shadowIndex - 1 : this.shadowIndex;

            this.pinned.splice(fromIndex, 1);
            this.pinned.splice(toIndex, 0, dataName);
            this.savePinned();
        },
        loadPinned() {
            const data = localStorage.getItem('pinned');
            if (data) {
                this.pinned = JSON.parse(data);
            }
        },
        async loadSave() {
            try {
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
            } catch (err) {
                console.error(err);
            }
        },
        open(url) {
            window.open(url, '_blank').focus();
        },
        pin(dataName) {
            this.pinned.push(dataName);
            this.savePinned();
        },
        savePinned() {
            const data = JSON.stringify(this.pinned);
            localStorage.setItem('pinned', data);
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
        unpin(dataName) {
            this.pinned = this.pinned.filter((x) => x !== dataName);
        },
    }
});

app.mount('#app');
