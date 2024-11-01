class Agente {
    constructor(nombre, rol, habilidades, imagen) {
        this.nombre = nombre;
        this.rol = rol;
        this.habilidades = habilidades;
        this.imagen = imagen;
    }

    render() {
        return `
            <div class="agent">
                <img src="${this.imagen}" alt="${this.nombre}">
                <h2>${this.nombre}</h2>
                <p><strong>Rol:</strong> ${this.rol}</p>
                <ul>
                    ${this.habilidades.map(habilidad => `<li>${habilidad}</li>`).join('')}
                </ul>
            </div>
        `;
    }
}

async function getAgents() {
    try {
        const response = await fetch('https://valorant-api.com/v1/agents');
        const data = await response.json();
        
        const agentes = data.data
            .filter(agent => agent.isPlayableCharacter)
            .map(agent => new Agente(
                agent.displayName,
                agent.role.displayName,
                agent.abilities.map(ability => ability.displayName),
                agent.displayIcon
            ));
        return agentes;
    } catch (error) {
        console.error("Error al obtener los agentes:", error);
        return [];
    }
}

async function displayAgents(agents) {
    const container = document.getElementById('agents-container');
    container.innerHTML = agents.map(agent => agent.render()).join('');
}

getAgents().then(displayAgents);

document.getElementById('search').addEventListener('input', async (event) => {
    const searchQuery = event.target.value.toLowerCase();
    const allAgents = await getAgents();

    const filteredAgents = allAgents.filter(agent =>
        agent.nombre.toLowerCase().includes(searchQuery)
    );

    displayAgents(filteredAgents);
});
