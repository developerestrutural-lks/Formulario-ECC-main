<template>
  <div>
    <label class="form-label text-dark text-start fw-bold">Impressão no Quadrante:</label>
    <small class="form-text text-muted d-block mb-3">
      Marque quais informações você autoriza que apareçam no material impresso de divulgação.
    </small>

    <div class="form-check mb-3">
      <input class="form-check-input" type="checkbox" v-model="registros.item.pessoa_email_autorizado"
             id="imprimirEmail" true-value="S" false-value="N"/>
      <label class="form-check-label text-dark text-start" for="imprimirEmail">Autorizo Imprimir Email</label>
    </div>

    <div class="form-check mb-3">
      <input class="form-check-input" type="checkbox" v-model="registros.item.pessoa_celular_autorizado"
             id="imprimirCelular" true-value="S" false-value="N"/>
      <label class="form-check-label text-dark text-start" for="imprimirCelular">Autorizo Imprimir Celular</label>
    </div>

    <div>
      <div class="form-check mb-3" v-if="comConjuge.includes(registros.item.pessoa_estado_civil)">
        <input class="form-check-input" type="checkbox" v-model="registros.item.conjuge_email_autorizado"
               id="imprimirEmailConjuge" true-value="S" false-value="N"/>
        <label class="form-check-label text-dark text-start" for="imprimirEmailConjuge">
          Autorizo Imprimir Email do Cônjuge
        </label>
      </div>

      <div class="form-check mb-3" v-if="comConjuge.includes(registros.item.pessoa_estado_civil)">
        <input class="form-check-input" type="checkbox" v-model="registros.item.conjuge_celular_autorizado"
               id="imprimirCelularConjuge" true-value="S" false-value="N"/>
        <label class="form-check-label text-dark text-start" for="imprimirCelularConjuge">
          Autorizo Imprimir Celular do Cônjuge
        </label>
      </div>
    </div>

    <div class="form-check mb-3">
      <input class="form-check-input" type="checkbox" v-model="registros.item.tel_residencial_autorizado"
             id="imprimirTelefoneFixo" true-value="S" false-value="N"/>
      <label class="form-check-label text-dark text-start" for="imprimirTelefoneFixo">
        Autorizo Imprimir Telefone Fixo
      </label>
    </div>
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