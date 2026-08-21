<template>
  <div>
    <form @submit.prevent novalidate>
      <ul class="nav nav-tabs" role="tablist">
        <li class="nav-item" v-for="tabEt in tabsEtapa" :key="`${tabEt.id}_${tabEt.label}`" role="presentation">
          <button type="button" class="nav-link" :class="{ active: etapaTab === tabEt.id }"
                  @click="$emit('mudar-etapa', tabEt.id)" v-if="tabEt.libera" role="tab"
                  :aria-selected="etapaTab === tabEt.id">
            {{ tabEt.label }}
          </button>
        </li>
      </ul>
      <br>
      <EquipeTrabalho :etapa="etapaTab" :registros="registros.item" @atualizarRegistros="e => $emit('atualizar-registros', e)"
                      :pessoa-nome="registros.item.pessoa_nome" :conjuge-nome="registros.item.conjuge_nome"
                      :estado-civil="registros.item.pessoa_estado_civil"/>
    </form>
  </div>
</template>

<script>
import EquipeTrabalho from '@/views/EquipeTrabalho.vue';

export default {
  name: 'TabEquipesQueTrabalhou',
  components: {
    EquipeTrabalho,
  },
  props: {
    registros: {type: Object, required: true},
    tabsEtapa: {type: Array, required: true},
    etapaTab: {type: String, required: true},
  },
  emits: ['mudar-etapa', 'atualizar-registros'],
};
</script>