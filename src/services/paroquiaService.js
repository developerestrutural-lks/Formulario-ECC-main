import axios from 'axios'

const paroquias = {
    lista: [],
    carregado: false
}

async function carregar() {
    try {
        const response = await axios.get('https://app.seg.inf.br/sge/api/ecc/paroquia')

        paroquias.lista = response.data;
        paroquias.carregado = true;
    } catch (error) {
        console.error('Erro ao carregar domínios:', error);
    }
}

function getParoquias() {
    return paroquias.lista.map(item => item.NOME);
}

function init() {
    carregar();
}

init();

export default {
    getParoquias,
}