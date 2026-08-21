<template>
  <div class="mb-3">
    <label class="form-label text-dark" :for="id">
      {{ label }}:<span class="text-danger" aria-label="campo obrigatório">*</span>
    </label>

    <div class="input-group">
      <input :id="id" class="form-control" :disabled="disabled" type="text"
             inputmode="numeric" v-model="localValue" v-mask="'###.###.###-##'"
             :aria-invalid="!!erro" :aria-describedby="`${id}-ajuda ${id}-erro`"
             @keyup.enter="aoBuscar" :placeholder="placeholder"/>

      <button :disabled="disabled || loading" class="btn btn-outline-primary" type="button"
              @click="aoBuscar" :aria-label="buscarAriaLabel">
        <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        {{ loading ? 'Buscando...' : 'Buscar CPF' }}
      </button>
    </div>
    <small :id="`${id}-ajuda`" class="form-text text-muted">{{ helpText }}</small>

    <div v-if="erro" :id="`${id}-erro`" class="text-danger mt-1" role="alert">
      <span aria-hidden="true">⚠️</span> {{ erro }}
    </div>
    <div v-if="validado" class="text-success mt-1">
      <span aria-hidden="true">✓</span> {{ successText }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'CpfInput',
  props: {
    id: {type: String, required: true},
    modelValue: {type: String, default: ''},
    label: {type: String, default: 'CPF'},
    disabled: {type: Boolean, default: false},
    loading: {type: Boolean, default: false},
    erro: {type: String, default: ''},
    validado: {type: Boolean, default: false},
    successText: {type: String, default: 'CPF validado com sucesso'},
    helpText: {
      type: String,
      default: 'Digite o CPF e clique em "Buscar CPF" para preencher os dados automaticamente.',
    },
    buscarAriaLabel: {type: String, default: 'Buscar dados pelo CPF informado'},
    placeholder: {type: String, default: '000.000.000-00'},
  },
  emits: ['update:modelValue', 'buscar'],
  computed: {
    localValue: {
      get() {
        return this.modelValue;
      },
      set(valor) {
        this.$emit('update:modelValue', valor);
      },
    },
  },
  methods: {
    aoBuscar() {
      if (this.disabled || this.loading) return;
      this.$emit('buscar');
    },
  },
};
</script>