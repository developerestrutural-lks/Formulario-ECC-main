<template>
  <div>
    <div class="mb-3">
      <label class="form-label text-dark text-start" for="cep">CEP:</label>
      <input class="form-control" id="cep" type="text" inputmode="numeric"
             v-model="registros.item.pessoa_cep" v-mask="'#####-###'" autocomplete="postal-code"
             placeholder="00000-000"/>
      <small class="form-text text-muted">Após digitar o CEP, ele faz a busca automática.</small>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark text-start" for="endereco">Endereço Residencial:</label>
      <input class="form-control" type="text" v-model="registros.item.pessoa_endereco" id="endereco"
             :disabled="camposBloqueados" autocomplete="street-address"/>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark text-start" for="complemento">Complemento:</label>
      <input class="form-control" type="text" v-model="registros.item.pessoa_complemento" id="complemento"
             placeholder="Apartamento, bloco, casa, ponto de referência..."/>
      <small class="form-text text-muted">Campo opcional.</small>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark text-start" for="bairro">Bairro:</label>
      <input class="form-control" type="text" v-model="registros.item.pessoa_bairro" id="bairro"
             :disabled="camposBloqueados"/>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark text-start" for="cidade">Cidade:</label>
      <input class="form-control" type="text" v-model="registros.item.pessoa_cidade" id="cidade"
             :disabled="camposBloqueados"/>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark text-start" for="uf">UF:</label>
      <input class="form-control" type="text" v-model="registros.item.pessoa_uf" id="uf"
             :disabled="camposBloqueados" maxlength="2"/>
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