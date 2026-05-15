<template>
  <div>
    <!-- Sub-abas por etapa -->
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item" v-for="tab in tabsEtapa" :key="tab.id">
        <button
            v-if="tab.libera"
            type="button"
            class="nav-link"
            :class="{ active: etapaAtiva === tab.id }"
            @click="mudarEtapa(tab.id)"
        >
          {{ tab.label }}
        </button>
      </li>
    </ul>

    <!-- Delega para o componente EquipeTrabalho já existente no projeto -->
    <EquipeTrabalho
        :etapa="etapaAtiva"
        :registros="registros.item"
        :pessoa-nome="registros.item.pessoa_nome"
        :conjuge-nome="registros.item.conjuge_nome"
        :estado-civil="registros.item.pessoa_estado_civil"
        @atualizarRegistros="receberRegistros"
    />
  </div>
</template>

<script>
import EquipeTrabalho from '@/views/EquipeTrabalho.vue';

export default {
  name: 'TabEquipesEtapa1',
  components: {EquipeTrabalho},
  props: {
    registros: {type: Object, required: true},
  },
  emits: ['atualizar-registros'],
  data() {
    return {
      etapaAtiva: 'etapa1',
      tabsEtapa: [
        {id: 'etapa1', label: 'Etapa 1', libera: false},
        {id: 'etapa2', label: 'Etapa 2', libera: false},
        {id: 'etapa3', label: 'Etapa 3', libera: false},
      ],
    };
  },
  methods: {
    mudarEtapa(novaEtapa) {
      this.etapaAtiva = novaEtapa;
    },
    receberRegistros({etapas, dados}) {
      this.$emit('atualizar-registros', {etapas, dados});
    },
    // Chamado pelo Form.vue quando os dados são carregados para habilitar as sub-abas corretas
    atualizarTabsEtapa(fezEtapa1, fezEtapa2, fezEtapa3) {
      this.tabsEtapa[0].libera = fezEtapa1 === 'S';
      this.tabsEtapa[1].libera = fezEtapa2 === 'S';
      this.tabsEtapa[2].libera = fezEtapa3 === 'S';

      // Ativa a primeira etapa disponível
      const primeira = this.tabsEtapa.find(t => t.libera);
      if (primeira) this.etapaAtiva = primeira.id;
    },
  },
};
</script>