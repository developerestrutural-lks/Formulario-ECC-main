<template>
  <div class="container mt-4">
    <ToastContainer/>

    <div class="cabecalho">
      <img src="@/assets/logo_grupo_acao.png" alt="Logotipo Grupo Ação" class="icone">
      <h4>ENCONTRO DE CASAIS COM CRISTO</h4>
      <!-- Passagem parâmetro listar dados e salvar -->
      <button class="btn btn-primary" @click="validarPessoaImportacao(); salvar(true, true); finalizarFormulario()"
              @keypress.enter="listarDados(false); salvar(true); finalizarFormulario()">Finalizar Questionário
      </button>
    </div>

    <!-- Carregamento inicial dos dados (domínios + registro existente) -->
    <div v-if="carregandoInicial" class="loading-inicial" role="status" aria-live="polite">
      <span class="spinner-border" aria-hidden="true"></span>
      <span>Carregando formulário...</span>
    </div>

    <template v-else>
    <!-- Indicador de salvamento automático (acessível) -->
    <div class="status-salvamento" aria-live="polite" aria-atomic="true">
      <span v-if="salvando" class="text-primary">
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Salvando suas respostas...
      </span>
      <span v-else-if="ultimoSalvamento" class="text-success">
        ✓ Salvo automaticamente às {{ ultimoSalvamento }}
      </span>
    </div>

    <!-- Barra de progresso para o usuário acompanhar -->
    <div class="progresso-info mb-2" aria-hidden="true">
      <small>
        Etapa <strong>{{ indiceAbaAtual + 1 }}</strong> de <strong>{{ tabsLiberadas.length }}</strong>
        ({{ percentualProgresso }}% concluído)
      </small>
    </div>
    <div class="progress mb-3" style="height: 8px;" role="progressbar"
         :aria-valuenow="percentualProgresso" aria-valuemin="0" aria-valuemax="100"
         :aria-label="`Progresso do formulário: ${percentualProgresso}%`">
      <div class="progress-bar bg-success" :style="{ width: percentualProgresso + '%' }"></div>
    </div>

    <!-- Abas -->
    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item" v-for="tab in tabs" :key="tab.id" role="presentation">
        <button type="button" class="nav-link" :class="{ active: activeTab === tab.id }"
                style="font-weight: bold; font-size: 14pt;" @click="tentarMudarAba(tab.id)" v-if="tab.libera"
                role="tab" :aria-selected="activeTab === tab.id" :aria-controls="`painel-${tab.id}`">
          {{ tab.label }}
        </button>
      </li>
    </ul>

    <!-- Aba Cadastro -->
    <div class="tab-content mt-3">
      <div class="tab-pane fade show active" v-if="activeTab === 'cadastro'" id="painel-cadastro" role="tabpanel">
        <form @submit.prevent novalidate>
          <TabCadastro :registros="registros" :erros="erros" :com-conjuge="comConjuge"
                       :profissao="profissao" :sexo="sexo" :estado-civil="estadoCivil"
                       :buscando-cpf-pessoa="buscandoCpfPessoa" :buscando-cpf-conjuge="buscandoCpfConjuge"
                       @buscar-cpf-pessoa="getCpfDetails(true)"
                       @buscar-cpf-conjuge="getCpfDetails(false, true)"/>
        </form>
      </div>
    </div>

    <!-- Aba Foto -->
    <div v-show="activeTab === 'foto'" id="painel-foto" role="tabpanel">
      <form @submit.prevent novalidate>
        <TabFoto :registros="registros" :com-conjuge="comConjuge" @upload="handleFileUpload"/>
      </form>
    </div>

    <!-- Aba Endereço -->
    <div v-if="activeTab === 'endereco'" id="painel-endereco" role="tabpanel">
      <form @submit.prevent novalidate>
        <TabEndereco :registros="registros" :campos-bloqueados="camposBloqueados"/>
      </form>
    </div>

    <!-- Aba Religião -->
    <div v-if="activeTab === 'religiao'" id="painel-religiao" role="tabpanel">
      <form @submit.prevent novalidate>
        <TabReligiao :registros="registros" :com-conjuge="comConjuge" :religiao="religiao" :paroquia="paroquia"/>
      </form>
    </div>

    <!-- Aba Habilidades ECC -->
    <div v-if="activeTab === 'habilidades'" id="painel-habilidades" role="tabpanel">
      <form @submit.prevent novalidate>
        <TabHabilidades :registros="registros" :com-conjuge="comConjuge"/>
      </form>
    </div>

    <!-- Aba Autorização -->
    <div v-if="activeTab === 'autorizacao'" id="painel-autorizacao" role="tabpanel">
      <form @submit.prevent novalidate>
        <TabAutorizacao :registros="registros" :com-conjuge="comConjuge"/>
      </form>
    </div>

    <!-- Aba Etapas ECC -->
    <div v-if="activeTab === 'etapas'" id="painel-etapas" role="tabpanel">
      <form @submit.prevent novalidate>
        <TabEtapas :registros="registros" :paroquia="paroquia"
                   @limpar-fez-ecc="limparFezECC" @limpar-fazer-ecc="limparFazerECC"/>
      </form>
    </div>

    <!-- Aba Equipe gostaria -->
    <div v-if="activeTab === 'equipes_trabalho'" id="painel-equipes-trabalho" role="tabpanel">
      <form @submit.prevent novalidate>
        <TabEquipes :registros="registros" :com-conjuge="comConjuge"/>
      </form>
    </div>

    <!-- Aba Equipe que Trabalhou -->
    <div v-if="activeTab === 'equipes_que_trabalhou'" id="painel-equipes-trabalhou" role="tabpanel">
      <TabEquipesQueTrabalhou :registros="registros" :tabs-etapa="tabsEtapa" :etapa-tab="etapaTab"
                               @mudar-etapa="mudarAbaEtapa" @atualizar-registros="receberRegistros"/>
    </div>

    <div class="text-end mt-3">
      <button v-if="indiceAbaAtual > 0" type="button" class="btn btn-outline-secondary me-2" @click="voltarAba">
        ← Voltar
      </button>
      <button v-if="deveExibirBotao" type="button" class="btn btn-primary"
              @click="isUltimaTabLiberada ? finalizarQuestionario() : salvarEAvancar()"
              @keypress.enter="isUltimaTabLiberada ? finalizarQuestionario() : salvarEAvancar()">
        {{ isUltimaTabLiberada ? '✓ Finalizar Questionário' : 'Avançar →' }}
      </button>
    </div>
    </template>
  </div>
</template>

<script>
import dominioService from '@/services/dominioService';
import paroquiaService from '@/services/paroquiaService';
import erroService from '@/services/erroService';
import heic2any from 'heic2any';
import {showToast} from '@/composables/toast';
import TabCadastro from '@/components/TabCadastro.vue';
import TabFoto from '@/components/TabFoto.vue';
import TabEndereco from '@/components/TabEndereco.vue';
import TabReligiao from '@/components/TabReligiao.vue';
import TabHabilidades from '@/components/TabHabilidades.vue';
import TabAutorizacao from '@/components/TabAutorizacao.vue';
import TabEtapas from '@/components/TabEtapas.vue';
import TabEquipes from '@/components/TabEquipes.vue';
import TabEquipesQueTrabalhou from '@/components/TabEquipesQueTrabalhou.vue';
import ToastContainer from '@/components/ToastContainer.vue';

export default {
  name: 'Form',
  components: {
    TabCadastro,
    TabFoto,
    TabEndereco,
    TabReligiao,
    TabHabilidades,
    TabAutorizacao,
    TabEtapas,
    TabEquipes,
    TabEquipesQueTrabalhou,
    ToastContainer,
  },
  data() {
    return {
      token: {},
      cpfData: {},
      user: {},
      API_URL: 'https://app.seg.inf.br/sge/api/tela/',
      ECC_API_URL: 'https://app.seg.inf.br/sge/api/ecc/pessoa/',
      RASCUNHO_OFFLINE_KEY: 'formulario_ecc_rascunho_offline',
      intervalId: null,
      registrosOriginais: {},
      carregandoInicial: true,
      buscandoCpfPessoa: false,
      buscandoCpfConjuge: false,
      estadoCivil: [],
      profissao: [],
      religiao: [],
      paroquia: [],
      sexo: [],
      habilidades: [],
      habilidadesSelecionadas: [],
      equipes: [],
      equipesSelecionadas: [],
      comConjuge: ['CASADO (A)', 'UNIÃO ESTÁVEL', 'SEGUNDA UNIÃO'],
      activeTab: 'cadastro',
      // Indicadores visuais de salvamento automático
      salvando: false,
      ultimoSalvamento: null,
      tabs: [
        {id: 'cadastro', label: 'Cadastro', libera: true},
        {id: 'foto', label: 'Foto', libera: true},
        {id: 'endereco', label: 'Endereço', libera: true},
        {id: 'religiao', label: 'Religião', libera: true},
        {id: 'habilidades', label: 'Habilidades', libera: true},
        {id: 'autorizacao', label: 'Autorização', libera: false},
        {id: 'etapas', label: 'Etapas ECC', libera: true},
        {id: 'equipes_trabalho', label: 'Equipes que Gostaria', libera: false},
        {id: 'equipes_que_trabalhou', label: 'Equipes que Trabalhou', libera: false},
      ],
      etapaTab: 'etapa1',
      tabsEtapa: [
        {id: 'etapa1', label: 'Etapa 1', libera: false},
        {id: 'etapa2', label: 'Etapa 2', libera: false},
        {id: 'etapa3', label: 'Etapa 3', libera: false},
      ],
      registros: {
        cpf_nao_encontrado: false,
        cpf_validado: false,
        cpf_validado_conjuge: false,
        item: {
          pessoa_sacramento_batismo: 'N',
          pessoa_sacramento_eucaristia: 'N',
          pessoa_sacramento_crisma: 'N',
          pessoa_atuante_igreja: 'N',
          conjuge_sacramento_batismo: 'N',
          conjuge_sacramento_eucaristia: 'N',
          conjuge_sacramento_crisma: 'N',
          conjuge_atuante_igreja: 'N',
          pessoa_casamento_civil: 'N',
          pessoa_casamento_religioso: 'N',
          pessoa_email_autorizado: 'N',
          pessoa_celular_autorizado: 'N',
          conjuge_email_autorizado: 'N',
          conjuge_celular_autorizado: 'N',
          tel_residencial_autorizado: 'N',
          habilidade_cantar: 'N',
          habilidade_cozinhar: 'N',
          habilidade_eletronica: 'N',
          habilidade_falar_em_publico: 'N',
          habilidade_ministro_eucaristia: 'N',
          habilidade_coordenar_grupos: 'N',
          habilidade_informatica: 'N',
          habilidade_tocar_violao: 'N',
          habilidade_servir_cafe: 'N',
          habilidade_desenho: 'N',
          habilidade_limpeza: 'N',
          habilidade_liturgia: 'N',
          conjuge_habilidade_cantar: 'N',
          conjuge_habilidade_cozinhar: 'N',
          conjuge_habilidade_eletronica: 'N',
          conjuge_habilidade_falar_em_publico: 'N',
          conjuge_habilidade_ministro_eucaristia: 'N',
          conjuge_habilidade_coordenar_grupos: 'N',
          conjuge_habilidade_informatica: 'N',
          conjuge_habilidade_tocar_violao: 'N',
          conjuge_habilidade_servir_cafe: 'N',
          conjuge_habilidade_desenho: 'N',
          conjuge_habilidade_limpeza: 'N',
          conjuge_habilidade_liturgia: 'N',
          pessoa_nome: '',
          pessoa_nascimento: '',
          pessoa_cpf: '',
          pessoa_celular: '',
          pessoa_email: '',
          pessoa_sexo: '',
          pessoa_estado_civil: '',
          conjuge_nome: '',
          conjuge_nascimento: '',
          conjuge_cpf: '',
          conjuge_celular: '',
          conjuge_email: '',
          conjuge_sexo: '',
          pessoa_cep: '',
          pessoa_endereco: '',
          pessoa_bairro: '',
          pessoa_cidade: '',
          pessoa_uf: '',
          pessoa_complemento: '',
          equipe_secretaria: '',
          equipe_cozinha: '',
          equipe_compras: '',
          equipe_visitacao: '',
          equipe_acolhida: '',
          equipe_cafe_minimercado: '',
          equipe_liturgia_vigilia: '',
          equipe_ordem_limpeza: '',
          equipe_palestras: '',
          equipe_equipe_sala_canto: '',
          equipe_boa_vontade: '',
          pessoa_perfil_habilidade_id: "",
          pessoa_perfil_equipe_indicada_id: "",
          fezECC: '',
          pessoa_etapa_1: '',
          pessoa_etapa_2: '',
          pessoa_etapa_3: '',
          pessoa_etapa_1_nucleo_sigla: '',
          pessoa_etapa_2_nucleo_sigla: '',
          pessoa_etapa_3_nucleo_sigla: '',
          pessoa_etapa_1_numero: '',
          pessoa_etapa_2_numero: '',
          pessoa_etapa_3_numero: '',
          pessoa_etapa_1_data_inicio: '',
          pessoa_etapa_2_data_inicio: '',
          pessoa_etapa_3_data_inicio: '',
          pessoa_etapa_1_local: '',
          pessoa_etapa_2_local: '',
          pessoa_etapa_3_local: '',
          etapa1_funcoes_sala_casal_apresentador: '',
          etapa1_funcoes_sala_casal_boa_vontade: '',
          etapa1_funcoes_sala_canto: '',
          etapa1_funcoes_sala_som_projecao: '',
          etapa1_funcoes_sala_recepcao_palestrantes: '',
          etapa2_funcoes_sala_casal_apresentador: '',
          etapa2_funcoes_sala_casal_boa_vontade: '',
          etapa2_funcoes_sala_canto: '',
          etapa2_funcoes_sala_recepcao_palestrantes: '',
          etapa2_funcoes_sala_som_projecao: '',
          etapa3_funcoes_sala_casal_apresentador: '',
          etapa3_funcoes_sala_casal_boa_vontade: '',
          etapa3_funcoes_sala_som_projecao: '',
          etapa3_funcoes_sala_canto: ''
        },
        info: this.$route?.state?.info || {},
      },
      erros: {},
      debounceTimeout: null,
      camposBloqueados: false,
      etapaModalAberta: null,
      pessoaNascimentoFormatada: '',
    };
  },
  async created() {
    console.log('creted')
    this.getToken();
    await Promise.all([this.carregarDominio(), this.listarDados()]);
    this.aplicarRascunhoLocalPendente();
    this.carregandoInicial = false;
  },
  watch: {
    'registros.item.pessoa_cep'(newCep) {
      clearTimeout(this.debounceTimeout);

      const cepStr = newCep || '';
      const cepSemMascara = cepStr.replace(/\D/g, '');

      if (cepSemMascara.length === 8) {
        this.debounceTimeout = setTimeout(() => {
          this.getCep();
        }, 250);
      } else if (cepSemMascara.length === 0) {
        this.limparEndereco(false);
      }
    },
    'registros.item.pessoa_etapa_1'(val) {
      this.tabsEtapa[0].libera = val === 'S';
    },
    'registros.item.pessoa_etapa_2'(val) {
      this.tabsEtapa[1].libera = val === 'S';
    },
    'registros.item.pessoa_etapa_3'(val) {
      this.tabsEtapa[2].libera = val === 'S';
    },
    'registros.item.pessoa_nascimento'(novaData) {
      if (novaData instanceof Date) {
        this.pessoaNascimentoFormatada = format(novaData, 'yyyy-MM-dd');
      } else {
        this.pessoaNascimentoFormatada = '';
      }
    },
    'registros.cpf_nao_encontrado': function (val) {
      if (val) {
        setTimeout(() => {
          this.registros.cpf_nao_encontrado = false
        }, 10000);
      }
    },
  },
  mounted() {
    window.addEventListener('beforeunload', this.avisarSaidaSemSalvar);
    window.addEventListener('online', this.reenviarRascunhoPendente);
    this.intervalId = setInterval(() => {
      if (!this.registros.item.pessoa_nome || !this.registros.item.pessoa_cpf) {
        console.log('Nome e CPF são obrigatórios para salvar.');
        return;
      }

      if (this.houveAlteracoes() && Object.keys(this.registrosOriginais).length > 0) {
        console.log('Alteração detectada. Registro será salvo.');
        return this.salvar(false, false);
      }
    }, 60000);
  },
  beforeUnmount() {
    window.removeEventListener('beforeunload', this.avisarSaidaSemSalvar);
    window.removeEventListener('online', this.reenviarRascunhoPendente);
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
  computed: {
    ultimaEtapaLiberada() {
      const liberadas = this.tabsEtapa.filter(tab => tab.libera);
      return liberadas.length ? liberadas[liberadas.length - 1].id : null;
    },
    equipesQueTrabalhouLiberada() {
      return this.tabs.find(tab => tab.id === 'equipes_que_trabalhou')?.libera === true;
    },
    tabsLiberadas() {
      return this.tabs.filter(tab => tab.libera);
    },
    indiceAbaAtual() {
      return this.tabsLiberadas.findIndex(tab => tab.id === this.activeTab);
    },
    percentualProgresso() {
      if (this.tabsLiberadas.length === 0) return 0;
      return Math.round(((this.indiceAbaAtual + 1) / this.tabsLiberadas.length) * 100);
    },
    isUltimaTabLiberada() {
      const idx = this.tabsLiberadas.findIndex(tab => tab.id === this.activeTab);
      return idx === this.tabsLiberadas.length - 1;
    },
    deveExibirBotao() {
      if (!this.equipesQueTrabalhouLiberada) {
        return true;
      }

      if (this.activeTab === 'equipes_que_trabalhou') {
        const etapa = this.tabsEtapa.find(et => et.id === this.etapaTab);
        return etapa?.libera === true;
      }

      return true;
    },
  },
  methods: {
    sexoDisponivel(campoExcluir) {
      return this.sexo.filter(s => s !== this.registros.item[campoExcluir]);
    },

    // ====== VALIDAÇÕES AUXILIARES ======
    validarFormatoEmail(email) {
      if (!email) return false;
      // RFC 5322 simplificado
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      return regex.test(email.trim());
    },
    validarCpf(cpf) {
      if (!cpf) return false;
      const numeros = cpf.replace(/\D/g, '');

      if (numeros.length !== 11) return false;

      // Rejeita CPFs com todos os dígitos iguais
      if (/^(\d)\1{10}$/.test(numeros)) return false;

      // Validação dos dígitos verificadores
      let soma = 0;
      for (let i = 0; i < 9; i++) {
        soma += parseInt(numeros.charAt(i)) * (10 - i);
      }
      let resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(numeros.charAt(9))) return false;

      soma = 0;
      for (let i = 0; i < 10; i++) {
        soma += parseInt(numeros.charAt(i)) * (11 - i);
      }
      resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(numeros.charAt(10))) return false;

      return true;
    },
    validarCelular(celular) {
      if (!celular) return false;
      const numeros = celular.replace(/\D/g, '');
      // 11 dígitos (DDD + 9 dígitos)
      return numeros.length === 11;
    },
    validarDataNascimento(data) {
      if (!data) return false;
      const dt = new Date(data);
      if (isNaN(dt.getTime())) return false;
      const hoje = new Date();
      // Não pode ser no futuro
      if (dt > hoje) return false;
      // Idade máxima razoável: 120 anos
      const idadeMaxima = new Date();
      idadeMaxima.setFullYear(idadeMaxima.getFullYear() - 120);
      if (dt < idadeMaxima) return false;
      return true;
    },

    // PADRAO
    async salvar(alertar = false, tem_id = false) {
      const valido = this.validarCamposObrigatorios(alertar);
      if (!valido) return false;

      this.salvando = true;

      if (this.registros.item.pessoa_estado_civil === 'Solteiro') {
        this.registros.item.conjuge_nome = '';
        this.registros.item.conjuge_apelido = '';
        this.registros.item.conjuge_nascimento = '';
        this.registros.item.pessoa_foto_casal = '';
        this.registros.item.conjuge_profissao = '';
        this.registros.item.conjuge_cpf = '';
        this.registros.item.apelido_casal = '';
        this.registros.item.pessoa_data_casamento = '';
        this.registros.item.conjuge_email = '';
        this.registros.item.conjuge_celular = '';
        this.registros.item.conjuge_sacramento_batismo = '';
        this.registros.item.conjuge_sacramento_eucaristia = ''
        this.registros.item.conjuge_sacramento_crisma = '';
        this.registros.item.conjuge_casamento_civil = '';
        this.registros.item.conjuge_atuante_igreja = '';
        this.registros.item.conjuge_movimento_pertencente = '';
        this.registros.item.conjuge_pastorais_ou_servicos = '';
        this.registros.item.conjuge_seita_ideologia_religiao = '';
        this.registros.item.conjuge_entidade_pertencente = '';
      }

      this.getIP();

      this.registros.item.resposta_id = this.gerarIdDezDigitos();

      await this.validarPessoaImportacao();

      if (this.pessoaNascimentoFormatada) {
        this.registros.item.pessoa_nascimento = this.pessoaNascimentoFormatada
      }

      this.ajustarGeneroPrincipal();

      this.registros.item.formulario_id = 145;

      if (!this.registros.item?.apelido_casal && this.comConjuge.includes(this.registros.item.pessoa_estado_civil)) {
        const nomePessoa = this.registros.item?.pessoa_nome?.split(' ')[0] ?? '';
        const nomeConjuge = this.registros.item?.conjuge_nome?.split(' ')[0] ?? '';
        this.registros.item.apelido_casal = `${nomePessoa} e ${nomeConjuge}`;
      }

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.registros.item)
      }

      // return
      await fetch(this.ECC_API_URL + 'salvar', requestOptions)
          .then(async response => {
            if (!response.ok) {
              throw new Error(await erroService.mensagemDaResposta(response));
            }
            return response.json();
          })
          .then(data => {
            console.log('data', data);
            this.salvando = false;
            if (data?.id) {
              this.registros.item.id = data.id;
            }
            const agora = new Date();
            this.ultimoSalvamento = agora.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit'
            });
            this.limparRascunhoLocal();

            if (alertar) {
              return this.$router.replace('/end')
            }
          })
          .catch(error => {
            this.salvando = false;
            console.log('Erro na chamada à API:', error);
            erroService.registrarErro({
              erro: 'Erro ao salvar: ' + error,
              nome: this.registros.item.pessoa_nome,
              cpf: this.registros.item.pessoa_cpf,
              email: this.registros.item.pessoa_email
            });
            this.salvarRascunhoLocal();

            if (error instanceof TypeError || !navigator.onLine) {
              return showToast('Sem conexão com a internet. Suas respostas foram salvas neste dispositivo e serão enviadas automaticamente quando a conexão voltar.', 'warning', 10000);
            }
            return showToast('Erro ao salvar: ' + error, 'error', 8000);
          })
    },
    salvarRascunhoLocal() {
      try {
        localStorage.setItem(this.RASCUNHO_OFFLINE_KEY, JSON.stringify({
          item: this.registros.item,
          salvoEm: new Date().toISOString()
        }));
      } catch (e) {
        console.error('Erro ao salvar rascunho local:', e);
      }
    },
    limparRascunhoLocal() {
      localStorage.removeItem(this.RASCUNHO_OFFLINE_KEY);
    },
    aplicarRascunhoLocalPendente() {
      const bruto = localStorage.getItem(this.RASCUNHO_OFFLINE_KEY);
      if (!bruto) {
        return;
      }

      try {
        const rascunho = JSON.parse(bruto);
        if (rascunho?.item) {
          this.registros.item = {...this.registros.item, ...rascunho.item};
          showToast('Encontramos respostas não enviadas neste dispositivo (salvas offline). Elas foram restauradas.', 'warning', 10000);
          if (navigator.onLine) {
            this.salvar(false, false);
          }
        }
      } catch (e) {
        console.error('Erro ao restaurar rascunho local:', e);
      }
    },
    reenviarRascunhoPendente() {
      if (!localStorage.getItem(this.RASCUNHO_OFFLINE_KEY)) {
        return;
      }
      showToast('Conexão restabelecida. Reenviando respostas pendentes...', 'info', 5000);
      this.salvar(false, false);
    },
    async listarDados() {
      const rawUser = sessionStorage.getItem('user');
      let dados = rawUser ? JSON.parse(rawUser) : {};
      const celular = sessionStorage.getItem('celular');
      const encodedEmail = sessionStorage.getItem('email');
      if (encodedEmail) {
        dados.email = encodedEmail;
      }

      let criterio;
      if (this.registros.item.pessoa_email || dados?.email || encodedEmail) {
        criterio = {email: this.registros.item.pessoa_email || (dados?.email ?? encodedEmail)};
      } else if (celular) {
        criterio = {celular};
      } else {
        criterio = {
          nome: this.registros.pessoa_nome ?? dados?.nome,
          cpf: this.registros.pessoa_cpf ?? dados?.cpf,
        };
      }

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(criterio)
      }

      await fetch(this.ECC_API_URL + 'buscar', requestOptions)
          .then(async response => {
            if (!response.ok) {
              throw new Error(await erroService.mensagemDaResposta(response));
            }
            return response.status === 204 ? null : response.json();
          })
          .then(resultado => {
            if (resultado) {
              this.registros.item = resultado;
              if (resultado.pessoa_cpf?.length >= 11 && resultado.pessoa_nascimento !== null) {
                this.registros.cpf_validado = true;
                console.log('this.registros.cpf_validado', this.registros.cpf_validado);
              }

              if (resultado.conjuge_cpf?.length >= 11 && resultado.conjuge_nascimento !== null) {
                this.registros.cpf_validado_conjuge = true;
                console.log('this.registros.cpf_validado_conjuge', this.registros.cpf_validado_conjuge);
              }

              if (resultado.pessoa_etapa_1 === 'S' || resultado.pessoa_etapa_2 === 'S' || resultado.pessoa_etapa_3 === 'S') {
                setTimeout(() => {
                  this.registros.item.fezECC = 'S';

                  if (this.registros.item.fezECC = 'S' && this.registros.item.pessoa_perfil_equipe_indicada_id) {
                    this.tabs[7].libera = true;
                  } else {
                    this.tabs[7].libera = false;
                  }

                  if (this.registros.item.fezECC = 'S') {
                    this.tabs[8].libera = true;
                  } else {
                    this.tabs[8].libera = false;
                  }

                }, 100);
              }
              const mapaHabilidades = {
                '306': 'habilidade_cantar',
                '308': 'habilidade_tocar_violao',
                '632': 'habilidade_falar_em_publico',
                '633': 'habilidade_ministro_eucaristia',
                '634': 'habilidade_servir_cafe',
                '635': 'habilidade_desenho',
                '636': 'habilidade_limpeza',
                '643': 'habilidade_liturgia',
                '647': 'habilidade_cozinhar',
                '648': 'habilidade_informatica',
                '649': 'habilidade_coordenar_grupos',
                '6522': 'habilidade_eletronica',
              };

              Object.values({...mapaHabilidades}).forEach(campo => {
                if (!this.registros.item.hasOwnProperty(campo)) {
                  this.registros.item[campo] = null;
                }
              });

              const idsPessoa = resultado.pessoa_perfil_habilidade_id?.split(',').map(id => id.trim()) || [];
              idsPessoa.forEach(id => {
                const campo = mapaHabilidades[id];
                if (campo) {
                  this.registros.item[campo] = id;
                }
              });

              const idsConjuge = resultado.conjuge_perfil_habilidade_id?.split(',').map(id => id.trim()) || [];
              idsConjuge.forEach(id => {
                const campo = mapaHabilidades[id];
                if (campo) {
                  this.registros.item[`conjuge_${campo}`] = id;
                }
              });

              const mapaEquipes = {
                '658': 'equipe_secretaria',
                '659': 'equipe_cozinha',
                '660': 'equipe_compras',
                '661': 'equipe_visitacao',
                '662': 'equipe_acolhida',
                '663': 'equipe_cafe_minimercado',
                '664': 'equipe_liturgia_vigilia',
                '665': 'equipe_ordem_limpeza',
                '720': 'equipe_palestras',
                '721': 'equipe_sala_canto',
                '722': 'equipe_boa_vontade',
              };

              Object.values({...mapaEquipes}).forEach(campo => {
                if (!this.registros.item.hasOwnProperty(campo)) {
                  this.registros.item[campo] = null;
                }
              });

              const idsPessoaEquipe = resultado.pessoa_perfil_equipe_indicada_id?.split(',').map(id => id.trim()) || [];
              idsPessoaEquipe.forEach(id => {
                const campoEquipe = mapaEquipes[id];
                if (campoEquipe) {
                  this.registros.item[campoEquipe] = id;
                }
              });

              const idsConjugeEquipe = resultado.conjuge_perfil_equipe_indicada_id?.split(',').map(id => id.trim()) || [];
              idsConjugeEquipe.forEach(id => {
                const campoEquipe = mapaEquipes[id];
                if (campoEquipe) {
                  this.registros.item[`conjuge_${campoEquipe}`] = id;
                }
              });

              this.setImagemInput();
              this.registrosOriginais = JSON.parse(JSON.stringify(this.registros.item));
            } else {
              this.registros.item = {
                pessoa_nome: this.registros.pessoa_nome || dados?.nome || '',
                pessoa_cpf: this.registros.pessoa_cpf || dados?.cpf || '',
                pessoa_email: this.registros.pessoa_email || dados?.email || '',
              }
              this.registrosOriginais = JSON.parse(JSON.stringify(this.registros.item));
            }
          })
          .catch(error => {
            console.log('Erro na chamada à API:', error);
            erroService.registrarErro({
              erro: 'Erro ao buscar dados: ' + error,
              nome: this.registros.item.pessoa_nome || dados?.nome,
              cpf: this.registros.item.pessoa_cpf || dados?.cpf,
              email: this.registros.item.pessoa_email || dados?.email
            });
            return;
          })
    },
    async validarPessoaImportacao() {
      const rawUser = sessionStorage.getItem('user');
      let dados = rawUser ? JSON.parse(rawUser) : {};
      const encodedEmail = sessionStorage.getItem('email');
      if (encodedEmail) {
        dados.email = encodedEmail;
      }

      const criterio = (this.registros.item.pessoa_email || dados?.email || encodedEmail)
          ? {email: this.registros.item.pessoa_email || (dados?.email ?? encodedEmail)}
          : {
            nome: dados?.nome ?? (this.registros.item.pessoa_nome ?? ''),
            cpf: dados?.cpf ?? (this.registros.item?.pessoa_cpf ?? ''),
          };

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(criterio)
      }

      await fetch(this.ECC_API_URL + 'id-existente', requestOptions)
          .then(async response => {
            if (!response.ok) {
              throw new Error(await erroService.mensagemDaResposta(response));
            }
            return response.json();
          })
          .then(data => {
            if (data?.id) {
              this.registros.item.id = data.id;
            }
          })
          .catch(error => {
            console.log('Erro na chamada à API:', error);
            erroService.registrarErro({
              erro: 'Erro ao validar importação: ' + error,
              nome: dados?.nome ?? this.registros.item.pessoa_nome,
              cpf: dados?.cpf ?? this.registros.item?.pessoa_cpf,
              email: this.registros.item.pessoa_email || dados?.email || encodedEmail
            });
          })
    },
    async carregarDominio() {
      await dominioService.carregar();
      this.estadoCivil = dominioService.getEstadoCivil();
      this.profissao = dominioService.getProfissoes();
      this.religiao = dominioService.getReligioes();
      this.sexo = dominioService.getSexo();
      this.paroquia = paroquiaService.getParoquias();
    },
    ajustarGeneroPrincipal() {
      if (this.registros.item.pessoa_sexo === 'FEMININO') {
        const campos = [
          'nome',
          'apelido',
          'nascimento',
          'cpf',
          'celular',
          'email',
          'profissao',
          'sexo'
        ];

        campos.forEach(campo => {
          const pessoaKey = `pessoa_${campo}`;
          const conjugeKey = `conjuge_${campo}`;

          const temp = this.registros.item[pessoaKey];
          this.registros.item[pessoaKey] = this.registros.item[conjugeKey];
          this.registros.item[conjugeKey] = temp;
        });
      }
    },

    // ARQUIVOS
    async handleFileUpload(field, event) {
      let file = event?.target?.files?.[0];
      if (!file) return;

      // Validação de tamanho de arquivo (10 MB)
      const TAMANHO_MAX = 10 * 1024 * 1024;
      if (file.size > TAMANHO_MAX) {
        showToast('A imagem é muito grande. O tamanho máximo permitido é 10 MB.', 'warning');
        event.target.value = '';
        return;
      }

      let metaDados = this.metaDadosImage(file);

      const precisaConverter = [
        'image/webp',
        'image/png',
        'image/heic',
        'image/heif'
      ]

      if (precisaConverter.includes(file.type)) {
        file = await this.converterParaJpeg(file);
        console.log('file convertido', file);

        metaDados = this.metaDadosImage(file);
      }

      if (field === 'fotoPrincipal') {
        this.registros.item.pessoa_foto = metaDados.nameUUID;
        document.getElementById('pessoa_foto').src = URL.createObjectURL(metaDados.file);
      }
      if (field === 'fotoConjuge') {
        this.registros.item.foto_conjuge = metaDados.nameUUID;
        document.getElementById('foto_conjuge').src = URL.createObjectURL(metaDados.file);
      }
      if (field === 'fotoCasal') {
        this.registros.item.pessoa_foto_casal = metaDados.nameUUID;
        document.getElementById('pessoa_foto_casal').src = URL.createObjectURL(metaDados.file);
      }
      this.uploadImagem(metaDados);
    },
    metaDadosImage(event) {
      let document = event;

      let {name: fileName, type: baseType} = document || {};
      let extension = fileName.split('.').pop();
      let chaveUUID = this.createUUID();
      let nameUUID = chaveUUID + "." + extension;
      let titulo = document.name;

      return {
        file: document,
        fileName: fileName,
        baseType: baseType,
        extension: extension,
        nameUUID: nameUUID,
        chaveUUID: chaveUUID
      }
    },
    async uploadImagem(dados) {
      const formData = new FormData();
      formData.append('file', dados.file, `${dados.nameUUID}`);
      const response = await fetch("https://app.seg.inf.br/oci/upload", {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("content-type");
      console.log('contentType', contentType);
    },
    createUUID() {
      let dt = new Date().getTime()

      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (dt + Math.random() * 16) % 16 | 0
        dt = Math.floor(dt / 16)
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
      })

      return uuid
    },
    async getArquivo(arquivo) {
      try {
        const response = await fetch(`https://app.seg.inf.br/oci/getObject?file=${arquivo}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        if (response.ok) {
          return await response.text();
        } else if (response.status === 404) {
          return 'https://dummyimage.com/128x128/cfd8dc/546e7a&text=Sem+foto';
        } else {
          return 'https://dummyimage.com/128x128/cfd8dc/546e7a&text=Sem+foto';
        }
      } catch (error) {
        return null;
      }
    },
    setImagemInput() {
      if (this.registros.item.pessoa_foto) {
        let url = this.getArquivo(this.registros.item.pessoa_foto);
        url.then(r => {
          if (r) {
            document.getElementById('pessoa_foto').src = r;
          }
        })
      } else {
        this.arquivoUrl = 'https://dummyimage.com/128x128/cfd8dc/546e7a&text=Sem+foto'
      }

      if (this.registros.item.foto_conjuge) {
        let url = this.getArquivo(this.registros.item.foto_conjuge);
        url.then(r => {
          if (r) {
            document.getElementById('foto_conjuge').src = r;
          }
        })
      } else {
        this.arquivoUrl = 'https://dummyimage.com/128x128/cfd8dc/546e7a&text=Sem+foto'
      }

      if (this.registros.item.pessoa_foto_casal) {
        let url = this.getArquivo(this.registros.item.pessoa_foto_casal);
        url.then(r => {
          if (r) {
            document.getElementById('pessoa_foto_casal').src = r;
          }
        })
      } else {
        this.arquivoUrl = 'https://dummyimage.com/128x128/cfd8dc/546e7a&text=Sem+foto'
      }
    },
    async converterParaJpeg(file) {
      if (file.type === 'image/heic' || file.type === 'image/heif') {
        const blob = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.9
        })

        return new File([blob], this.trocarExtensao(file.name, 'jpg'), {
          type: 'image/jpeg'
        })
      }

      return new Promise((resolve) => {
        const img = new Image()
        const reader = new FileReader()

        reader.onload = (e) => {
          img.src = e.target.result
        }

        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height

          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0)

          canvas.toBlob(
              (blob) => {
                resolve(
                    new File([blob], this.trocarExtensao(file.name, 'jpg'), {
                      type: 'image/jpeg'
                    })
                )
              },
              'image/jpeg',
              0.9
          )
        }

        reader.readAsDataURL(file)
      })
    },
    trocarExtensao(nome, novaExtensao) {
      return nome.replace(/\.[^.]+$/, '') + '.' + novaExtensao
    },

    // AUXILIARES
    // Limpa os campos de endereço vindos do CEP. Com cepNaoEncontrado=true zera também o
    // CEP e o complemento, para que um CEP inválido não fique preenchido nem seja salvo.
    limparEndereco(cepNaoEncontrado) {
      if (cepNaoEncontrado) {
        this.registros.item.pessoa_cep = '';
        this.registros.item.pessoa_complemento = '';
      }
      this.registros.item.pessoa_endereco = '';
      this.registros.item.pessoa_bairro = '';
      this.registros.item.pessoa_cidade = '';
      this.registros.item.pessoa_uf = '';
      this.camposBloqueados = false;
    },
    async getCep() {
      await fetch(`https://viacep.com.br/ws/${this.registros.item.pessoa_cep}/json/`)
          .then(response => response.json())
          .then(data => {
            if (data.erro) {
              this.limparEndereco(true);
              showToast('CEP não encontrado. Verifique se digitou corretamente.', 'warning');
              return;
            }
            let {logradouro, localidade: cidade, bairro, cep, uf} = data;

            this.registros.item.pessoa_endereco = logradouro;
            this.registros.item.pessoa_cidade = cidade || 'Brasilia';
            this.registros.item.pessoa_bairro = bairro;
            this.registros.item.pessoa_cep = cep;
            this.registros.item.pessoa_uf = uf;

            this.camposBloqueados = true;
          })
          .catch(err => {
            console.error('Erro ao buscar CEP:', err);
          });
    },
    houveAlteracoes() {
      return JSON.stringify(this.registros.item) !== JSON.stringify(this.registrosOriginais);
    },
    avisarSaidaSemSalvar(event) {
      if (this.houveAlteracoes() && Object.keys(this.registrosOriginais).length > 0) {
        event.preventDefault();
        event.returnValue = '';
      }
    },
    async getIP() {
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        this.registros.item.ip_maquina_usuario = data.ip;
      } catch (err) {
        console.error('Erro ao buscar IP:', err);
      }
    },
    gerarIdDezDigitos() {
      return Math.floor(1000000000 + Math.random() * 9000000000);
    },
    voltarAba() {
      const idx = this.indiceAbaAtual;
      if (idx > 0) {
        this.activeTab = this.tabsLiberadas[idx - 1].id;
        if (typeof window !== 'undefined') {
          window.scrollTo({top: 0, behavior: 'smooth'});
        }
      }
    },
    salvarEAvancar() {
      const valido = this.validarCamposObrigatorios(true);
      if (!valido) return;

      this.salvar(false, false);

      if (this.activeTab === 'equipes_que_trabalhou' && this.equipesQueTrabalhouLiberada) {
        const etapasLiberadas = this.tabsEtapa.filter(tab => tab.libera);
        const currentIndex = etapasLiberadas.findIndex(tab => tab.id === this.etapaTab);
        const nextIndex = currentIndex + 1;

        if (nextIndex < etapasLiberadas.length) {
          this.etapaTab = etapasLiberadas[nextIndex].id;
        }
        return;
      }

      const tabsLiberadas = this.tabs.filter(tab => tab.libera);
      const currentIndex = tabsLiberadas.findIndex(tab => tab.id === this.activeTab);
      const nextIndex = currentIndex + 1;

      if (nextIndex < tabsLiberadas.length) {
        this.activeTab = tabsLiberadas[nextIndex].id;
        // rolar para o topo ao mudar de aba (importante em mobile)
        if (typeof window !== 'undefined') {
          window.scrollTo({top: 0, behavior: 'smooth'});
        }
      }
    },
    validarCamposObrigatorios(alertar = false) {
      this.erros = {};
      const camposObrigatorios = [];

      const campos = [
        {key: 'pessoa_nome', label: 'Nome Completo'},
        {
          key: 'pessoa_nascimento',
          label: 'Data de Nascimento',
          //   validacaoExtra: (valor) => {
          //     if (valor && !this.validarDataNascimento(valor)) {
          //       return 'A data de nascimento informada não é válida.';
          //     }
          //     return null;
          //   }
        },
        {
          key: 'pessoa_cpf',
          label: 'CPF',
          //   validacaoExtra: (valor) => {
          //     if (valor && !this.validarCpf(valor)) {
          //       return 'O CPF informado não é válido. Verifique os números.';
          //     }
          //     return null;
          //   }
        },
        {
          key: 'pessoa_celular',
          label: 'Celular',
          validacaoExtra: (valor) => {
            if (valor && !this.validarCelular(valor)) {
              return 'O celular deve conter DDD + 9 dígitos.';
            }
            return null;
          }
        },
        {
          key: 'pessoa_email',
          label: 'E-mail',
          validacaoExtra: (valor) => {
            if (valor && !this.validarFormatoEmail(valor)) {
              return 'Digite um e-mail válido (ex: nome@exemplo.com).';
            }
            return null;
          }
        },
        {key: 'pessoa_sexo', label: 'Sexo'},
        {key: 'pessoa_estado_civil', label: 'Estado Civil'},
        {
          key: 'conjuge_nome',
          label: 'Nome do Cônjuge',
          requiredIf: () => this.comConjuge.includes(this.registros.item.pessoa_estado_civil),
        },
        {
          key: 'conjuge_nascimento',
          label: 'Data de Nascimento do Cônjuge',
          requiredIf: () => this.comConjuge.includes(this.registros.item.pessoa_estado_civil),
          //   validacaoExtra: (valor) => {
          //     if (valor && !this.validarDataNascimento(valor)) {
          //       return 'A data de nascimento informada não é válida.';
          //     }
          //     return null;
          //   }
        },
        {
          key: 'conjuge_cpf',
          label: 'CPF do Cônjuge',
          requiredIf: () => this.comConjuge.includes(this.registros.item.pessoa_estado_civil),
          //   validacaoExtra: (valor) => {
          //     if (valor && !this.validarCpf(valor)) {
          //       return 'O CPF do cônjuge não é válido.';
          //     }
          //     // Validação cruzada: CPF da pessoa e do cônjuge não podem ser iguais
          //     const cpfPessoa = (this.registros.item.pessoa_cpf || '').replace(/\D/g, '');
          //     const cpfConjuge = (valor || '').replace(/\D/g, '');
          //     if (cpfPessoa && cpfConjuge && cpfPessoa === cpfConjuge) {
          //       return 'O CPF do cônjuge não pode ser igual ao seu CPF.';
          //     }
          //     return null;
          //   }
        },
        {
          key: 'conjuge_celular',
          label: 'Celular do Cônjuge',
          requiredIf: () => this.comConjuge.includes(this.registros.item.pessoa_estado_civil),
          validacaoExtra: (valor) => {
            if (valor && !this.validarCelular(valor)) {
              return 'O celular do cônjuge deve conter DDD + 9 dígitos.';
            }
            return null;
          }
        },
        {
          key: 'conjuge_email',
          label: 'E-mail do Cônjuge',
          requiredIf: () => this.comConjuge.includes(this.registros.item.pessoa_estado_civil),
          validacaoExtra: (valor) => {
            if (valor && !this.validarFormatoEmail(valor)) {
              return 'Digite um e-mail válido para o cônjuge.';
            }
            return null;
          }
        },
        {
          key: 'conjuge_sexo',
          label: 'Sexo do Cônjuge',
          requiredIf: () => this.comConjuge.includes(this.registros.item.pessoa_estado_civil),
        },
      ];

      campos.forEach(campo => {
        const deveValidar = typeof campo.requiredIf === 'function' ? campo.requiredIf() : true;
        if (deveValidar) {
          const valor = this.registros.item[campo.key];

          // Validação de obrigatoriedade
          if (!valor || !valor.toString().trim()) {
            this.erros[campo.key] = `O campo "${campo.label}" é obrigatório.`;
            camposObrigatorios.push(campo.label);
            return;
          }

          // Validação extra (formato)
          if (typeof campo.validacaoExtra === 'function') {
            const erroExtra = campo.validacaoExtra(valor);
            if (erroExtra) {
              this.erros[campo.key] = erroExtra;
              camposObrigatorios.push(`${campo.label}: ${erroExtra}`);
            }
          }
        }
      });

      if (camposObrigatorios.length > 0) {
        if (alertar) {
          showToast('Por favor, corrija os seguintes itens:\n\n• ' + camposObrigatorios.join('\n• '), 'warning', 10000);
          // Focar no primeiro campo com erro (acessibilidade)
          this.$nextTick(() => {
            const primeiroErro = document.querySelector(
                '[aria-invalid="true"], .text-danger ~ input, .text-danger ~ select'
            );
            if (primeiroErro && typeof primeiroErro.focus === 'function') {
              primeiroErro.focus();
              primeiroErro.scrollIntoView({behavior: 'smooth', block: 'center'});
            }
          });
        }
        return false;
      }

      return true;
    },
    async tentarMudarAba(novaAbaId) {
      if (novaAbaId !== this.activeTab) {
        const valido = this.validarCamposObrigatorios(true);
        if (!valido) return;
      }

      this.activeTab = novaAbaId;
    },
    async mudarAbaEtapa(novaAbaId) {
      if (novaAbaId !== this.etapaTab) {
        const valido = this.validarCamposObrigatorios(true);
        if (!valido) return;
      }

      this.etapaTab = novaAbaId;
    },
    finalizarQuestionario() {
      this.salvar(true, true);
      this.finalizarFormulario();
    },
    limparFezECC() {
      if (this.registros.item.fazerECC === 'S') {
        this.registros.item.fezECC = 'N';
      }
    },
    limparFazerECC() {
      if (this.registros.item.fezECC === 'S') {

        this.registros.item.fazerECC = 'N';
        if (this.registros.item.pessoa_perfil_equipe_indicada_id) {
          this.tabs[7].libera = true;

        } else {
          this.tabs[7].libera = false;
        }
      } else {
        this.tabs[7].libera = false;
      }
    },
    finalizarFormulario() {
      sessionStorage.setItem('formularioFinalizado', 'true');
      this.$router.replace('/end');
    },
    receberRegistros({etapas, dados}) {
      Object.keys(dados).forEach(key => {
        this.registros[key] = dados[key];
      });
    },

    // BUSCAR CPF E DETALHES
    async getToken() {
      const consumerKey = "c7Vrg3pZ6KH8eGi5ep0oRjgf8HUa";
      const consumerSecret = "QDi1uNPzdBGC4arVJX4tL5vPVYYa";
      const credentials = btoa(`${consumerKey}:${consumerSecret}`);

      await fetch("https://gateway.apiserpro.serpro.gov.br/token", {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      })
          .then((response) => response.json())
          .then((data) => {
            this.token = data;
          })
          .catch((err) => console.error(err));
    },
    async getCpfDetails(item = false, conjuge = false) {
      let cpf;
      if (!conjuge) {
        cpf = this.registros.item.pessoa_cpf;
      } else {
        cpf = this.registros.item.conjuge_cpf;
      }

      // Validação de formato antes da consulta
      if (!cpf || cpf.replace(/\D/g, '').length !== 11) {
        showToast('Digite um CPF completo (11 dígitos) antes de buscar.', 'warning');
        return;
      }

      if (!this.validarCpf(cpf)) {
        showToast('O CPF informado não é válido. Verifique os números digitados.', 'warning');
        return;
      }

      if (!conjuge) {
        this.buscandoCpfPessoa = true;
      } else {
        this.buscandoCpfConjuge = true;
      }

      try {
        await this.getToken();

        const res = await fetch(
            `https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v2/cpf/${cpf.replace(/\D/g, '')}`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${this.token.access_token}`,
              },
            }
        );

        if (!res.ok) {
          this.registros.cpf_nao_encontrado = true;
          return;
        }

        const data = await res.json();
        if (item && !conjuge) {
          this.registros.cpf_nao_encontrado = false;
          this.registros.cpf_validado = true;
          this.registros.item.pessoa_nome = data.nome;
          this.registros.item.pessoa_apelido = data.nome.split(' ').shift();
          this.registros.item.pessoa_cpf = data.ni;
          this.registros.item.pessoa_nascimento = this.formatarData(data.nascimento);
          this.registros.item.pessoa_cpf_ativo = "S";
        } else {
          this.registros.cpf_nao_encontrado = false;
          this.registros.cpf_validado_conjuge = true;
          this.registros.item.conjuge_nome = data.nome;
          this.registros.item.conjuge_apelido = data.nome.split(' ').shift();
          this.registros.item.conjuge_cpf = data.ni;
          this.registros.item.conjuge_nascimento = this.formatarData(data.nascimento);
          this.registros.item.conjuge_cpf_ativo = "S";
        }
      } catch (err) {
        console.error("Erro na consulta CPF:", err);
      } finally {
        if (!conjuge) {
          this.buscandoCpfPessoa = false;
        } else {
          this.buscandoCpfConjuge = false;
        }
      }
    },
    formatarData(data) {
      const dia = data.substring(0, 2);
      const mes = data.substring(2, 4);
      const ano = data.substring(4, 8);

      return `${ano}-${mes}-${dia}`;
    },
  }
};
</script>

<style scoped>
/* ============ ALERTA CÔNJUGE ============ */
.conjuge-alert {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #E6F1FB;
  border: 1px solid #B5D4F4;
  border-left: 4px solid #185FA5;
  border-radius: 8px;
  padding: 16px 18px;
  margin: 16px 0;
  color: #0C447C;
}

.conjuge-alert__icon {
  flex-shrink: 0;
  color: #185FA5;
  margin-top: 2px;
}

.conjuge-alert__title {
  margin: 0 0 4px;
  font-weight: 600;
  font-size: 1rem;
  color: #0C447C;
}

.conjuge-alert__text {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #0C447C;
}

/* ============ CARREGAMENTO INICIAL ============ */
.loading-inicial {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px 16px;
  color: #495057;
  font-size: 1rem;
}

/* ============ STATUS SALVAMENTO ============ */
.status-salvamento {
  min-height: 1.5em;
  font-size: 0.85rem;
  margin-bottom: 8px;
  text-align: right;
}

/* ============ PROGRESSO ============ */
.progresso-info {
  color: #495057;
}

.progress {
  border-radius: 999px;
  background-color: #e9ecef;
}

.progress-bar {
  transition: width 0.4s ease;
}

/* ============ TRANSIÇÕES ============ */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* ============ ACESSIBILIDADE: FOCO VISÍVEL ============ */
.form-control:focus,
.btn:focus,
.nav-link:focus,
input[type="checkbox"]:focus {
  outline: 2px solid #0d6efd;
  outline-offset: 2px;
}

/* ============ ACESSIBILIDADE: MOVIMENTO REDUZIDO ============ */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* ============ INDICADORES DE OBRIGATÓRIO ============ */
.text-danger[aria-invalid] {
  font-weight: 500;
}

/* ============ ESTRUTURA EXISTENTE (mantida) ============ */
body {
  background-color: #f8f9fa;
}

.container {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
  margin-top: 20px;
}

.form-label {
  font-weight: bold;
}

.login-container {
  height: 100vh;
  background: linear-gradient(to right, #007bff, #6610f2);
}

.login-card {
  background: #fff;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
}

.btn-primary {
  background-color: #007bff;
  border: none;
  transition: background 0.3s ease-in-out;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.cabecalho {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.icone {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.cabecalho h4 {
  flex: 1;
  text-align: center;
  margin: 0;
}

/* ============ RESPONSIVO ============ */
@media (max-width: 768px) {
  .container {
    padding: 16px;
    margin: 8px;
  }

  .cabecalho {
    flex-direction: column;
    text-align: center;
  }

  .cabecalho h4 {
    font-size: 1.1rem;
  }

  .icone {
    width: 60px;
    height: 60px;
  }

  .nav-tabs {
    overflow-x: auto;
    flex-wrap: nowrap;
    -webkit-overflow-scrolling: touch;
  }

  .nav-tabs .nav-link {
    white-space: nowrap;
  }

  .input-group {
    flex-wrap: nowrap;
  }
}
</style>