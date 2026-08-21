<template>
  <div>
    <slot name="label"></slot>
    <div class="form-check mb-3" v-for="item in items" :key="item.campo">
      <input class="form-check-input" type="checkbox" :id="item.campo"
             v-model="registrosItem[item.campo]" :true-value="item.valor" :false-value="null"/>
      <label class="form-check-label text-dark" :for="item.campo">{{ item.label }}</label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChecklistCard',
  props: {
    items: {type: Array, required: true},
    registrosItem: {type: Object, required: true},
  },
};
</script>