import {reactive, ref} from 'vue';

export function useFormECC() {

    const token = ref(null);

    const registros = reactive({
        item: {},
        cpf_validado: false,
        cpf_nao_encontrado: false,
    });

    const erros = reactive({});

    const comConjuge = ['Casado(a)', 'União Estável'];

    const activeTab = ref('cadastro');

    const tabs = reactive([
        {id: 'cadastro', label: '1. Cadastro', libera: true},
        {id: 'foto', label: '2. Foto', libera: true},
        {id: 'endereco', label: '3. Endereço', libera: true},
        {id: 'religiao', label: '4. Religião', libera: true},
        {id: 'habilidades', label: '5. Habilidades', libera: true},
        {id: 'autorizacao', label: '6. Autorização', libera: true},
        {id: 'etapas', label: '7. Etapas ECC', libera: true},
        {id: 'equipes_trabalho', label: '8. Equipes', libera: false},
        {id: 'equipes_etapa1', label: '9. Etapa 1', libera: false},
    ]);

    function tentarMudarAba(novaAbaId) {
        if (novaAbaId !== activeTab.value) {
            if (!validarCamposObrigatorios(true)) return;
        }
        activeTab.value = novaAbaId;
    }

    const camposObrigatoriosPorAba = {
        cadastro: [
            {key: 'pessoa_cpf', label: 'CPF'},
            {key: 'pessoa_nome', label: 'Nome Completo'},
            {key: 'pessoa_nascimento', label: 'Data de Nascimento'},
            {key: 'pessoa_celular', label: 'Celular'},
            {key: 'pessoa_email', label: 'E-mail'},
            {key: 'pessoa_sexo', label: 'Sexo'},
            {key: 'pessoa_estado_civil', label: 'Estado Civil'},
        ],
    };

    function validarCamposObrigatorios(alertar = false) {
        Object.keys(erros).forEach(k => delete erros[k]);
        const aba = activeTab.value;
        const campos = camposObrigatoriosPorAba[aba] || [];
        const faltando = [];

        campos.forEach(campo => {
            const deveValidar = typeof campo.requiredIf === 'function' ? campo.requiredIf() : true;
            if (!deveValidar) return;
            const valor = registros.item[campo.key];
            if (!valor || !valor.toString().trim()) {
                erros[campo.key] = `O campo ${campo.label} é obrigatório.`;
                faltando.push(campo.label);
            }
        });

        if (faltando.length > 0) {
            if (alertar) alert('Por favor, preencha os seguintes campos obrigatórios:\n- ' + faltando.join('\n- '));
            return false;
        }
        return true;
    }

    function limparFezECC() {
        if (registros.item.fazerECC === 'S') {
            registros.item.fezECC = 'N';
        }
    }

    function limparFazerECC() {
        if (registros.item.fezECC === 'S') {
            registros.item.fazerECC = 'N';
            tabs[7].libera = !!registros.item.pessoa_perfil_equipe_indicada_id;
        } else {
            tabs[7].libera = false;
        }
    }

    function ajustarGeneroPrincipal() {
        const estadoCivil = registros.item.pessoa_estado_civil;
        if (comConjuge.includes(estadoCivil)) {
            if (registros.item.pessoa_sexo === 'Masculino') {
                registros.item.conjuge_sexo = 'Feminino';
            } else if (registros.item.pessoa_sexo === 'Feminino') {
                registros.item.conjuge_sexo = 'Masculino';
            }
        }
    }

    async function getToken() {
        const consumerKey = 'c7Vrg3pZ6KH8eGi5ep0oRjgf8HUa';
        const consumerSecret = 'QDi1uNPzdBGC4arVJX4tL5vPVYYa';
        const credentials = btoa(`${consumerKey}:${consumerSecret}`);

        const response = await fetch('https://gateway.apiserpro.serpro.gov.br/token', {
            method: 'POST',
            headers: {
                Authorization: `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'grant_type=client_credentials',
        });
        token.value = await response.json();
    }

    function formatarData(data) {
        const dia = data.substring(0, 2);
        const mes = data.substring(2, 4);
        const ano = data.substring(4, 8);
        return `${ano}-${mes}-${dia}`;
    }

    async function getCpfDetails(isPessoa = true) {
        await getToken();
        const cpf = isPessoa
            ? registros.item.pessoa_cpf
            : registros.item.conjuge_cpf;

        try {
            const res = await fetch(
                `https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v2/cpf/${cpf.replace(/\D/g, '')}`,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token.value.access_token}`,
                    },
                }
            );

            if (!res.ok) {
                registros.cpf_nao_encontrado = true;
                return;
            }

            const data = await res.json();
            registros.cpf_nao_encontrado = false;
            registros.cpf_validado = true;

            if (isPessoa) {
                registros.item.pessoa_nome = data.nome;
                registros.item.pessoa_apelido = data.nome.split(' ').shift();
                registros.item.pessoa_cpf = data.ni;
                registros.item.pessoa_nascimento = formatarData(data.nascimento);
                registros.item.pessoa_cpf_ativo = 'S';
            } else {
                registros.item.conjuge_nome = data.nome;
                registros.item.conjuge_apelido = data.nome.split(' ').shift();
                registros.item.conjuge_cpf = data.ni;
                registros.item.conjuge_nascimento = formatarData(data.nascimento);
                registros.item.conjuge_cpf_ativo = 'S';
            }
        } catch (err) {
            console.error('Erro na consulta CPF:', err);
        }
    }

    function finalizarFormulario(router) {
        sessionStorage.setItem('formularioFinalizado', 'true');
        router.replace('/end');
    }

    return {
        registros,
        erros,
        tabs,
        activeTab,
        comConjuge,
        tentarMudarAba,
        validarCamposObrigatorios,
        limparFezECC,
        limparFazerECC,
        ajustarGeneroPrincipal,
        getCpfDetails,
        finalizarFormulario,
    };
}