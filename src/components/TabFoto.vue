<template>
  <div>
    <div class="mb-3">
      <label class="form-label text-dark" for="fotoPrincipal">Foto da Pessoa:</label>
      <input class="form-control" id="fotoPrincipal" type="file"
             accept="image/*" @change="$emit('upload', 'fotoPrincipal', $event)"/>
      <img v-show="registros.item.pessoa_foto" id="pessoa_foto"
           alt="Foto Principal" width="200" height="200" class="img-thumbnail rounded mt-2"/>
    </div>

    <template v-if="comConjuge.includes(registros.item.pessoa_estado_civil)">
      <div class="mb-3">
        <label class="form-label text-dark" for="fotoConjuge">Foto do Cônjuge:</label>
        <input class="form-control" id="fotoConjuge" type="file"
               @change="$emit('upload', 'fotoConjuge', $event)"/>
        <img v-show="registros.item.foto_conjuge" id="foto_conjuge"
             alt="Foto Cônjuge" width="200" height="200" class="img-thumbnail rounded mt-2"/>
      </div>

      <div class="mb-3">
        <label class="form-label text-dark" for="fotoCasal">Foto do Casal:</label>
        <input class="form-control" id="fotoCasal" type="file"
               @change="$emit('upload', 'fotoCasal', $event)"/>
        <img v-show="registros.item.pessoa_foto_casal" id="pessoa_foto_casal"
             alt="Foto Casal" width="200" height="200" class="img-thumbnail rounded mt-2"/>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'TabFoto',
  props: {
    registros: {type: Object, required: true},
    comConjuge: {type: Array, required: true},
  },
  emits: ['upload'],
};
</script>