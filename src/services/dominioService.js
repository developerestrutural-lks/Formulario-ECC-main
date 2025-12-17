import axios from 'axios'

const dominios = {
    lista: [],
    carregado: false
}

async function carregar() {
    let query = `SELECT *
                FROM sge_dominio
                WHERE entidade_id IN (0, 12)
                ORDER BY dominio, nome, nvl(sigla, nome)`;
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

        dominios.lista = response.data;
        dominios.carregado = true;
    } catch (error) {
        console.error('Erro ao carregar domínios:', error);
    }
}

function getPorTipo(tipo) {
    return dominios.lista.filter(d => d.dominio === tipo).map(d => d.nome);
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