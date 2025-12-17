import axios from 'axios'

const paroquias = {
    lista: [],
    carregado: false
}

async function carregar() {
    let query = `SELECT id, nome, sigla
                FROM sge_paroquia
                ORDER BY nome`;
    try {
        const queryPayload = { query: query }
        const response = await axios.post(
            'https://app.seg.inf.br/novo/api/tela/listByOne',
            queryPayload,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )

        paroquias.lista = response.data;
        paroquias.carregado = true;
    } catch (error) {
        console.error('Erro ao carregar domínios:', error);
    }
}

function getParoquias() {
    return paroquias.lista.map(item => item.nome);
}
function init() {
    carregar();
}

init();

export default {
    getParoquias,
}