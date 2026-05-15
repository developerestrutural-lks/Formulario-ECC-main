<template>
  <div class="border-start border-primary ps-3 mb-4">
    <h6 class="text-primary mb-3">Dados da {{ numero }}ª Etapa</h6>

    <div class="mb-3">
      <label class="form-label text-dark">Número da {{ numero }}ª Etapa:</label>
      <input class="form-control" type="number"
             v-model="registros.item[`${prefixo}_numero`]"/>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark">Data de Início da {{ numero }}ª Etapa:</label>
      <input class="form-control" type="date"
             v-model="registros.item[`${prefixo}_data_inicio`]"/>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark">Local da {{ numero }}ª Etapa:</label>
      <input class="form-control" type="text"
             v-model="registros.item[`${prefixo}_local`]"/>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark">Paróquia do ECC da {{ numero }}ª Etapa:</label>
      <multiselect
          v-model="registros.item[`${prefixo}_nucleo_sigla`]"
          :options="paroquia"
          :searchable="true" :close-on-select="true" :taggable="true"
          placeholder="Selecione ou pesquise..."
          @tag="e => { paroquia.push(e); registros.item[`${prefixo}_nucleo_sigla`] = e }"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'DadosEtapa',
  props: {
    registros: {type: Object, required: true},
    paroquia: {type: Array, required: true},
    numero: {type: String, required: true}, // '1', '2' ou '3'
    prefixo: {type: String, required: true}, // 'pessoa_etapa_1', etc.
  },
};
</script>