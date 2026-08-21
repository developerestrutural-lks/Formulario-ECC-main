<template>
  <div>
    <ChecklistCard :items="equipes" :registros-item="registros.item">
      <template #label>
        <label class="form-label text-dark mb-3">
          Selecione as equipes que você(s) se enquadra(m) — {{ registros.item.pessoa_nome }}
          <span v-if="comConjuge.includes(registros.item.pessoa_estado_civil)">
            e {{ registros.item.conjuge_nome }}
          </span>:
        </label>
      </template>
    </ChecklistCard>
  </div>
</template>

<script>
import ChecklistCard from './ChecklistCard.vue';

const EQUIPES = [
  {valor: '658', label: 'Secretaria', campo: 'equipe_secretaria'},
  {valor: '659', label: 'Cozinha', campo: 'equipe_cozinha'},
  {valor: '660', label: 'Compras', campo: 'equipe_compras'},
  {valor: '661', label: 'Visitação', campo: 'equipe_visitacao'},
  {valor: '662', label: 'Acolhida', campo: 'equipe_acolhida'},
  {valor: '663', label: 'Café e Minimercado', campo: 'equipe_cafe_minimercado'},
  {valor: '664', label: 'Liturgia e Vigília', campo: 'equipe_liturgia_vigilia'},
  {valor: '665', label: 'Ordem e Limpeza', campo: 'equipe_ordem_limpeza'},
  {valor: '720', label: 'Palestras', campo: 'equipe_palestras'},
  {valor: '721', label: 'Equipe de Sala - Canto', campo: 'equipe_sala_canto'},
  {valor: '722', label: 'Boa Vontade', campo: 'equipe_boa_vontade'},
];

export default {
  name: 'TabEquipes',
  components: {ChecklistCard},
  props: {
    registros: {type: Object, required: true},
    comConjuge: {type: Array, required: true},
  },
  data() {
    return {equipes: EQUIPES};
  },
};
</script>