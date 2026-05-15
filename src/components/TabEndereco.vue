<template>
  <div>
    <div class="mb-3">
      <label class="form-label text-dark" for="cep">CEP:</label>
      <input class="form-control" id="cep" type="text"
             v-model="registros.item.pessoa_cep" v-mask="'#####-###'"/>
      <small class="form-text text-muted">Após digitar o CEP, a busca é feita automaticamente.</small>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark" for="endereco">Endereço Residencial:</label>
      <input class="form-control" id="endereco" type="text"
             v-model="registros.item.pessoa_endereco" :disabled="camposBloqueados"/>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark" for="complemento">Complemento:</label>
      <input class="form-control" id="complemento" type="text"
             v-model="registros.item.pessoa_complemento"/>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark" for="bairro">Bairro:</label>
      <input class="form-control" id="bairro" type="text"
             v-model="registros.item.pessoa_bairro" :disabled="camposBloqueados"/>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark" for="cidade">Cidade:</label>
      <input class="form-control" id="cidade" type="text"
             v-model="registros.item.pessoa_cidade" :disabled="camposBloqueados"/>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark" for="uf">UF:</label>
      <input class="form-control" id="uf" type="text"
             v-model="registros.item.pessoa_uf" :disabled="camposBloqueados"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabEndereco',
  props: {
    registros: {type: Object, required: true},
    camposBloqueados: {type: Boolean, default: false},
  },
};
</script>