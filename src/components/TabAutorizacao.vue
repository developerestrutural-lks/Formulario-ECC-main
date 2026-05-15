<template>
  <div>
    <label class="form-label text-dark mb-3">Impressão no Quadrante:</label>

    <div class="form-check mb-3">
      <input class="form-check-input" type="checkbox" id="imprimirEmail"
             v-model="registros.item.pessoa_email_autorizado" true-value="S" false-value="N"/>
      <label class="form-check-label text-dark" for="imprimirEmail">Autorizo Imprimir Email</label>
    </div>

    <div class="form-check mb-3">
      <input class="form-check-input" type="checkbox" id="imprimirCelular"
             v-model="registros.item.pessoa_celular_autorizado" true-value="S" false-value="N"/>
      <label class="form-check-label text-dark" for="imprimirCelular">Autorizo Imprimir Celular</label>
    </div>

    <div class="form-check mb-3">
      <input class="form-check-input" type="checkbox" id="imprimirTelefoneFixo"
             v-model="registros.item.tel_residencial_autorizado" true-value="S" false-value="N"/>
      <label class="form-check-label text-dark" for="imprimirTelefoneFixo">Autorizo Imprimir Telefone Fixo</label>
    </div>

    <template v-if="comConjuge.includes(registros.item.pessoa_estado_civil)">
      <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" id="imprimirEmailConjuge"
               v-model="registros.item.conjuge_email_autorizado" true-value="S" false-value="N"/>
        <label class="form-check-label text-dark" for="imprimirEmailConjuge">
          Autorizo Imprimir Email Cônjuge
        </label>
      </div>

      <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" id="imprimirCelularConjuge"
               v-model="registros.item.conjuge_celular_autorizado" true-value="S" false-value="N"/>
        <label class="form-check-label text-dark" for="imprimirCelularConjuge">
          Autorizo Imprimir Celular Cônjuge
        </label>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'TabAutorizacao',
  props: {
    registros: {type: Object, required: true},
    comConjuge: {type: Array, required: true},
  },
};
</script>