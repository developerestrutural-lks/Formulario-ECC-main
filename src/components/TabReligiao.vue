<template>
  <div>
    <label class="form-label text-dark mb-3">
      Informações de religião de {{ registros.item.pessoa_nome }}:
    </label>

    <!-- Religião da Pessoa -->
    <div class="mb-3">
      <label class="form-label text-dark" for="religiao">Religião:</label>
      <multiselect
          v-model="registros.item.pessoa_religiao" :options="religiao"
          :searchable="true" :close-on-select="true" :taggable="true"
          placeholder="Selecione ou pesquise..." id="religiao"
          @tag="e => { religiao.push(e); registros.item.pessoa_religiao = e }"
      />
    </div>

    <div class="form-check mb-3">
      <input class="form-check-input" type="checkbox" id="batizado"
             v-model="registros.item.pessoa_sacramento_batismo" true-value="S" false-value="N"/>
      <label class="form-check-label text-dark" for="batizado">Batizado</label>
    </div>

    <div class="form-check mb-3">
      <input class="form-check-input" type="checkbox" id="primeiraComunhao"
             v-model="registros.item.pessoa_sacramento_eucaristia" true-value="S" false-value="N"/>
      <label class="form-check-label text-dark" for="primeiraComunhao">Primeira Comunhão</label>
    </div>

    <div class="form-check mb-3">
      <input class="form-check-input" type="checkbox" id="crismado"
             v-model="registros.item.pessoa_sacramento_crisma" true-value="S" false-value="N"/>
      <label class="form-check-label text-dark" for="crismado">Crismado</label>
    </div>

    <div class="form-check mb-3">
      <input class="form-check-input" type="checkbox" id="atuanteIgreja"
             v-model="registros.item.pessoa_atuante_igreja" true-value="S" false-value="N"/>
      <label class="form-check-label text-dark" for="atuanteIgreja">Atuante na Igreja</label>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark" for="paroquia">Paróquia que Frequenta:</label>
      <multiselect
          v-model="registros.item.pessoa_paroquia" :options="paroquia"
          :searchable="true" :close-on-select="true" :taggable="true"
          placeholder="Selecione ou pesquise..." id="paroquia"
          @tag="e => { paroquia.push(e); registros.item.pessoa_paroquia = e }"
      />
    </div>

    <div class="mb-3">
      <label class="form-label text-dark" for="movimento">Movimento que Pertence:</label>
      <input class="form-control" id="movimento" type="text"
             v-model="registros.item.pessoa_movimento_pertencente"/>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark" for="pastorais">Pastorais ou Serviços:</label>
      <input class="form-control" id="pastorais" type="text"
             v-model="registros.item.pessoa_pastorais_ou_servicos"/>
    </div>

    <div class="form-check mb-3">
      <input class="form-check-input" type="checkbox" id="casamentoCivil"
             v-model="registros.item.pessoa_casamento_civil" true-value="S" false-value="N"/>
      <label class="form-check-label text-dark" for="casamentoCivil">Casamento Civil</label>
    </div>

    <div class="form-check mb-3">
      <input class="form-check-input" type="checkbox" id="casamentoReligioso"
             v-model="registros.item.pessoa_casamento_religioso" true-value="S" false-value="N"/>
      <label class="form-check-label text-dark" for="casamentoReligioso">Casamento Religioso</label>
    </div>

    <!-- Religião do Cônjuge -->
    <template v-if="comConjuge.includes(registros.item.pessoa_estado_civil)">
      <h5 class="mt-4 mb-3">Religião do Cônjuge ({{ registros.item.conjuge_nome }})</h5>

      <div class="mb-3">
        <label class="form-label text-dark" for="religiaoConjuge">Religião:</label>
        <multiselect
            v-model="registros.item.conjuge_religiao" :options="religiao"
            :searchable="true" :close-on-select="true" :taggable="true"
            placeholder="Selecione ou pesquise..." id="religiaoConjuge"
            @tag="e => { religiao.push(e); registros.item.conjuge_religiao = e }"
        />
      </div>

      <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" id="conjugeBatizado"
               v-model="registros.item.conjuge_sacramento_batismo" true-value="S" false-value="N"/>
        <label class="form-check-label text-dark" for="conjugeBatizado">Batizado</label>
      </div>

      <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" id="conjugePrimeiraComunhao"
               v-model="registros.item.conjuge_sacramento_eucaristia" true-value="S" false-value="N"/>
        <label class="form-check-label text-dark" for="conjugePrimeiraComunhao">Primeira Comunhão</label>
      </div>

      <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" id="conjugeCrismado"
               v-model="registros.item.conjuge_sacramento_crisma" true-value="S" false-value="N"/>
        <label class="form-check-label text-dark" for="conjugeCrismado">Crismado</label>
      </div>

      <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" id="conjugeAtuanteIgreja"
               v-model="registros.item.conjuge_atuante_igreja" true-value="S" false-value="N"/>
        <label class="form-check-label text-dark" for="conjugeAtuanteIgreja">Atuante na Igreja</label>
      </div>

      <div class="mb-3">
        <label class="form-label text-dark" for="conjugeParoquia">Paróquia que Frequenta:</label>
        <multiselect
            v-model="registros.item.conjuge_paroquia" :options="paroquia"
            :searchable="true" :close-on-select="true" :taggable="true"
            placeholder="Selecione ou pesquise..." id="conjugeParoquia"
            @tag="e => { paroquia.push(e); registros.item.conjuge_paroquia = e }"
        />
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'TabReligiao',
  props: {
    registros: {type: Object, required: true},
    comConjuge: {type: Array, required: true},
    religiao: {type: Array, required: true},
    paroquia: {type: Array, required: true},
  },
};
</script>