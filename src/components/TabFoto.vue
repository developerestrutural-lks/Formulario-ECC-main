<template>
  <div>
    <div class="alert alert-info" role="note">
      <small>
        <strong>Dica:</strong> envie fotos recentes e bem iluminadas.
        Formatos aceitos: JPG, PNG, HEIC ou WEBP.
      </small>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark text-start" for="fotoPrincipal">Foto da Pessoa:</label>
      <input class="form-control" type="file" @change="$emit('upload', 'fotoPrincipal', $event)"
             accept="image/*" id="fotoPrincipal" aria-describedby="ajuda-foto-principal"/>
      <small id="ajuda-foto-principal" class="form-text text-muted">
        Escolha uma foto sua para o cadastro.
      </small>
      <img v-show="registros.item.pessoa_foto" alt="Pré-visualização da sua foto" id="pessoa_foto"
           width="200" height="200" class="img-thumbnail rounded mt-2"/>
    </div>

    <div v-if="comConjuge.includes(registros.item.pessoa_estado_civil)">
      <div class="mb-3">
        <label class="form-label text-dark text-start" for="fotoConjuge">Foto do Cônjuge:</label>
        <input class="form-control" type="file" @change="$emit('upload', 'fotoConjuge', $event)"
               accept="image/*" id="fotoConjuge"/>
        <img v-show="registros.item.foto_conjuge" alt="Pré-visualização da foto do cônjuge" id="foto_conjuge"
             width="200" height="200" class="img-thumbnail rounded mt-2">
      </div>

      <div class="mb-3">
        <label class="form-label text-dark text-start" for="fotoCasal">Foto do Casal:</label>
        <input class="form-control" type="file" @change="$emit('upload', 'fotoCasal', $event)"
               accept="image/*" id="fotoCasal"/>
        <img v-show="registros.item.pessoa_foto_casal" alt="Pré-visualização da foto do casal"
             id="pessoa_foto_casal" width="200" height="200" class="img-thumbnail rounded mt-2">
      </div>
    </div>
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