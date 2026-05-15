<template>
  <div>
    <div class="form-check mb-3">
      <input class="form-check-input" type="checkbox" id="fazerECC"
             v-model="registros.item.fazerECC" true-value="S" false-value="N"
             @change="$emit('limpar-fez-ecc')"/>
      <label class="form-check-label text-dark" for="fazerECC">Deseja fazer o ECC?</label>
    </div>

    <div class="form-check mb-3">
      <input class="form-check-input" type="checkbox" id="fezECC"
             v-model="registros.item.fezECC" true-value="S" false-value="N"
             @change="$emit('limpar-fazer-ecc')"/>
      <label class="form-check-label text-dark" for="fezECC">Já fez o ECC?</label>
    </div>

    <template v-if="registros.item.fezECC === 'S'">
      <label class="form-label text-dark mb-2">Qual Etapa?</label>

      <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" id="etapa1"
               v-model="registros.item.pessoa_etapa_1" true-value="S" false-value="N"/>
        <label class="form-check-label text-dark" for="etapa1">1ª Etapa</label>
      </div>

      <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" id="etapa2"
               v-model="registros.item.pessoa_etapa_2" true-value="S" false-value="N"/>
        <label class="form-check-label text-dark" for="etapa2">2ª Etapa</label>
      </div>

      <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" id="etapa3"
               v-model="registros.item.pessoa_etapa_3" true-value="S" false-value="N"/>
        <label class="form-check-label text-dark" for="etapa3">3ª Etapa</label>
      </div>
    </template>

    <!-- Dados da Etapa selecionada (componente reutilizável) -->
    <DadosEtapa
        v-if="registros.item.pessoa_etapa_1 === 'S'"
        numero="1"
        :registros="registros"
        :paroquia="paroquia"
        prefixo="pessoa_etapa_1"
    />

    <DadosEtapa
        v-if="registros.item.pessoa_etapa_2 === 'S'"
        numero="2"
        :registros="registros"
        :paroquia="paroquia"
        prefixo="pessoa_etapa_2"
    />

    <DadosEtapa
        v-if="registros.item.pessoa_etapa_3 === 'S'"
        numero="3"
        :registros="registros"
        :paroquia="paroquia"
        prefixo="pessoa_etapa_3"
    />
  </div>
</template>

<script>
import DadosEtapa from './DadosEtapa.vue';

export default {
  name: 'TabEtapas',
  components: {DadosEtapa},
  props: {
    registros: {type: Object, required: true},
    paroquia: {type: Array, required: true},
  },
  emits: ['limpar-fez-ecc', 'limpar-fazer-ecc'],
};
</script>