import axios from 'axios'

const ERRO_API_URL = 'https://app.seg.inf.br/sge/api/ecc/erro'

async function registrarErro({erro, nome, cpf, email}) {
    try {
        await axios.post(ERRO_API_URL, {
            erro: String(erro ?? ''),
            nome: nome || '',
            cpf: cpf || '',
            email: email || ''
        })
    } catch (e) {
        console.error('Erro ao registrar log de erro:', e);
    }
}

async function mensagemDaResposta(response) {
    try {
        const corpo = await response.json();
        return corpo?.detalhe || corpo?.erro || response.statusText;
    } catch (e) {
        return response.statusText;
    }
}

export default {
    registrarErro,
    mensagemDaResposta
}
