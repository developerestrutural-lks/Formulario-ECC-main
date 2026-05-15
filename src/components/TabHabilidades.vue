<template>
  <div>
    <!-- Habilidades da Pessoa -->
    <label class="form-label text-dark mb-3">
      Selecione as habilidades que você se enquadra — {{ registros.item.pessoa_nome }}:
    </label>

    <div class="form-check mb-3" v-for="hab in habilidadesPessoa" :key="hab.id">
      <input
          class="form-check-input"
          type="checkbox"
          :id="hab.campo"
          v-model="registros.item[hab.campo]"
          :true-value="hab.valor"
          :false-value="null"
      />
      <label class="form-check-label text-dark" :for="hab.campo">{{ hab.label }}</label>
    </div>

    <!-- Habilidades do Cônjuge -->
    <template v-if="comConjuge.includes(registros.item.pessoa_estado_civil)">
      <label class="form-label text-dark mt-4 mb-3">
        Selecione as habilidades que se enquadra (CÔNJUGE) — {{ registros.item.conjuge_nome }}:
      </label>

      <div class="form-check mb-3" v-for="hab in habilidadesConjuge" :key="hab.id">
        <input
            class="form-check-input"
            type="checkbox"
            :id="hab.campo"
            v-model="registros.item[hab.campo]"
            :true-value="hab.valor"
            :false-value="null"
        />
        <label class="form-check-label text-dark" :for="hab.campo">{{ hab.label }}</label>
      </div>
    </template>
  </div>
</template>

<script>
const HABILIDADES = [
  {valor: '306', label: 'Cantar', campo: 'habilidade_cantar'},
  {valor: '647', label: 'Cozinhar', campo: 'habilidade_cozinhar'},
  {valor: '6522', label: 'Eletrônica', campo: 'habilidade_eletronica'},
  {valor: '632', label: 'Falar em Público', campo: 'habilidade_falar_em_publico'},
  {valor: '633', label: 'Ministro Extraordinário da Eucaristia', campo: 'habilidade_ministro_eucaristia'},
  {valor: '649', label: 'Coordenar Grupos', campo: 'habilidade_coordenar_grupos'},
  {valor: '648', label: 'Informática', campo: 'habilidade_informatica'},
  {valor: '308', label: 'Tocar Violão', campo: 'habilidade_tocar_violao'},
  {valor: '634', label: 'Servir Café', campo: 'habilidade_servir_cafe'},
  {valor: '635', label: 'Desenhar', campo: 'habilidade_desenho'},
  {valor: '636', label: 'Limpeza', campo: 'habilidade_limpeza'},
  {valor: '643', label: 'Atos Litúrgicos', campo: 'habilidade_liturgia'},
];

export default {
  name: 'TabHabilidades',
  props: {
    registros: {type: Object, required: true},
    comConjuge: {type: Array, required: true},
  },
  computed: {
    habilidadesPessoa() {
      return HABILIDADES;
    },
    habilidadesConjuge() {
      return HABILIDADES.map(h => ({
        ...h,
        campo: `conjuge_${h.campo}`,
      }));
    },
  },
};
</script>