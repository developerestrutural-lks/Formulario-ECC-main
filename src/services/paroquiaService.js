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
<<<<<<< HEAD
            'https://app.seg.inf.br/sge/api/tela/listByOne',
=======
            'https://app.seg.inf.br/novo/api/tela/listByOne',
>>>>>>> 9286d87521e6c5edf01f1c21e41b21493537c98b
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