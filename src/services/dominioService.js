import axios from 'axios'

const dominios = {
    lista: [],
    carregado: false
}

async function carregar() {
    try {
        const response = await axios.get('https://app.seg.inf.br/sge/api/ecc/dominio')

        dominios.lista = response.data;
        dominios.carregado = true;
    } catch (error) {
        console.error('Erro ao carregar domínios:', error);
    }
}

function getPorTipo(tipo) {
    return dominios.lista.filter(d => d.DOMINIO === tipo).map(d => d.NOME);
}

function getEstadoCivil() {
    return getPorTipo('ESTADO_CIVIL');
}

function getProfissoes() {
    return getPorTipo('PROFISSAO');
}

function getReligioes() {
    return getPorTipo('RELIGIAO');
}

function getSexo() {
    return getPorTipo('SEXO');
}

function init() {
    carregar();
}

init();

export default {
    carregar,
    getPorTipo,
    getEstadoCivil,
    getProfissoes,
    getReligioes,
    getSexo
}