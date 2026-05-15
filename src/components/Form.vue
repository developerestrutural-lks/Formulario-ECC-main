<template>
  <div class="container mt-4">

    <!-- Cabeçalho -->
    <div class="cabecalho">
      <img src="@/assets/logo_grupo_acao.png" alt="Ícone" class="icone"/>
      <h4>ENCONTRO DE CASAIS COM CRISTO</h4>
      <button class="btn btn-primary" @click="finalizarQuestionario">
        Finalizar Questionário
      </button>
    </div>

    <!-- Abas de navegação -->
    <ul class="nav nav-tabs">
      <li class="nav-item" v-for="tab in tabs" :key="tab.id">
        <button
            v-if="tab.libera"
            type="button"
            class="nav-link"
            :class="{ active: activeTab === tab.id }"
            style="font-weight: bold; font-size: 14pt;"
            @click="tentarMudarAba(tab.id)"
        >
          {{ tab.label }}
        </button>
      </li>
    </ul>

    <!-- Conteúdo das abas -->
    <div class="tab-content mt-3">

      <TabCadastro
          v-if="activeTab === 'cadastro'"
          :registros="registros"
          :erros="erros"
          :com-conjuge="comConjuge"
          :profissao="profissao"
          :sexo="sexo"
          :estado-civil="estadoCivil"
          @buscar-cpf="getCpfDetails"
      />

      <TabFoto
          v-if="activeTab === 'foto'"
          :registros="registros"
          :com-conjuge="comConjuge"
          @upload="handleFileUpload"
      />

      <TabEndereco
          v-if="activeTab === 'endereco'"
          :registros="registros"
          :campos-bloqueados="camposBloqueados"
      />

      <TabReligiao
          v-if="activeTab === 'religiao'"
          :registros="registros"
          :com-conjuge="comConjuge"
          :religiao="religiao"
          :paroquia="paroquia"
      />

      <TabHabilidades
          v-if="activeTab === 'habilidades'"
          :registros="registros"
          :com-conjuge="comConjuge"
      />

      <TabAutorizacao
          v-if="activeTab === 'autorizacao'"
          :registros="registros"
          :com-conjuge="comConjuge"
      />

      <TabEtapas
          v-if="activeTab === 'etapas'"
          :registros="registros"
          :paroquia="paroquia"
          @limpar-fez-ecc="limparFezECC"
          @limpar-fazer-ecc="limparFazerECC"
      />

      <TabEquipes
          v-if="activeTab === 'equipes_trabalho'"
          :registros="registros"
          :com-conjuge="comConjuge"
      />

      <TabEquipesEtapa1
          v-if="activeTab === 'equipes_etapa1'"
          :registros="registros"
      />

    </div>
  </div>
</template>

<script>
import {useFormECC} from '@/composables/useFormECC';
import TabCadastro from './TabCadastro.vue';
import TabFoto from './TabFoto.vue';
import TabEndereco from './TabEndereco.vue';
import TabReligiao from './TabReligiao.vue';
import TabHabilidades from './TabHabilidades.vue';
import TabAutorizacao from './TabAutorizacao.vue';
import TabEtapas from './TabEtapas.vue';
import TabEquipes from './TabEquipes.vue';
import TabEquipesEtapa1 from './TabEquipesEtapa1.vue';

export default {
  name: 'FormECC',
  components: {
    TabCadastro,
    TabFoto,
    TabEndereco,
    TabReligiao,
    TabHabilidades,
    TabAutorizacao,
    TabEtapas,
    TabEquipes,
    TabEquipesEtapa1,
  },
  setup() {
    const {
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
    } = useFormECC();

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
  },
  data() {
    return {
      // Listas de domínios
      profissao: [],
      sexo: ['Masculino', 'Feminino'],
      estadoCivil: ['Casado(a)', 'Solteiro(a)', 'Viúvo(a)', 'Divorciado(a)', 'União Estável'],
      religiao: [],
      paroquia: [],
      camposBloqueados: false,
    };
  },
  methods: {
    finalizarQuestionario() {
      this.salvar(true, true);
      this.finalizarFormulario(this.$router);
    },
    handleFileUpload(tipo, event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = e => {
        const mapa = {
          fotoPrincipal: 'pessoa_foto',
          fotoConjuge: 'foto_conjuge',
          fotoCasal: 'pessoa_foto_casal',
        };
        const campo = mapa[tipo];
        if (campo) {
          this.registros.item[campo] = e.target.result;
          const img = document.getElementById(campo);
          if (img) img.src = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    },
    async salvar(validar = true, finalizar = false) {
      if (validar && !this.validarCamposObrigatorios(true)) return;
      this.ajustarGeneroPrincipal();
      // ... lógica de salvar (DECLARE SQL) permanece aqui
    },
  },
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

body {
  background-color: #f8f9fa;
}

.container {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, .1);
  max-width: 1000px;
  margin-top: 20px;
}

.form-label {
  font-weight: bold;
}

.cabecalho {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
}

.cabecalho h4 {
  flex: 1;
  text-align: center;
}

.icone {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.btn-primary {
  background-color: #007bff;
  border: none;
  transition: background .3s ease-in-out;
}

.btn-primary:hover {
  background-color: #0056b3;
}
</style>