<template>
  <div>
    <label class="form-label text-dark text-start fw-bold">
      Selecione as informações de religião de {{ registros.item.pessoa_nome || 'você' }}:
    </label>

    <div class="mb-3">
      <label class="form-label text-dark text-start" for="religiao"> Religião: </label>
      <multiselect v-model="registros.item.pessoa_religiao" :options="religiao"
                   placeholder="Selecione ou pesquise..." :searchable="true" :close-on-select="true" id="religiao"
                   :show-labels="false" :taggable="true"
                   @tag="e => { religiao.push(e); registros.item.pessoa_religiao = e }"/>
      <small class="form-text text-muted">Você pode selecionar uma religião ou digitar uma nova.</small>
    </div>

    <div class="form-check mb-3">
      <input class="form-check-input" type="checkbox" v-model="registros.item.pessoa_sacramento_batismo"
             id="batizado" true-value="S" false-value="N"/>
      <label class="form-check-label text-dark" for="batizado">Batizado</label>
    </div>

    <div class="form-check mb-3">
      <input class="form-check-input" type="checkbox" v-model="registros.item.pessoa_sacramento_eucaristia"
             id="primeiraComunhao" true-value="S" false-value="N"/>
      <label class="form-check-label text-dark text-start" for="primeiraComunhao">Primeira Comunhão</label>
    </div>

    <div class="form-check mb-3">
      <input class="form-check-input" type="checkbox" v-model="registros.item.pessoa_sacramento_crisma"
             id="crismado" true-value="S" false-value="N"/>
      <label class="form-check-label text-dark text-start" for="crismado">Crismado</label>
    </div>

    <div class="form-check mb-3">
      <input class="form-check-input" type="checkbox" v-model="registros.item.pessoa_atuante_igreja"
             id="atuanteIgreja" true-value="S" false-value="N"/>
      <label class="form-check-label text-dark text-start" for="atuanteIgreja">Atuante na Igreja</label>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark text-start" for="paroquia"> Paróquia que Frequenta: </label>
      <multiselect v-model="registros.item.pessoa_paroquia" :options="paroquia"
                   placeholder="Selecione ou pesquise..." :searchable="true" :close-on-select="true" id="paroquia"
                   :show-labels="false" :taggable="true"
                   @tag="e => { paroquia.push(e); registros.item.pessoa_paroquia = e }"/>
      <small class="form-text text-muted">Você pode selecionar uma paróquia ou digitar uma nova.</small>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark text-start" for="pastorais">Pastorais ou Serviços:</label>
      <input class="form-control" type="text" v-model="registros.item.pessoa_pastorais_ou_servicos"
             id="pastorais" placeholder="Pastorais, ministérios ou serviços que participa"/>
      <small class="form-text text-muted">Campo opcional.</small>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark text-start" for="movimentos">Movimentos:</label>
      <input class="form-control" type="text" v-model="registros.item.pessoa_movimento_pertencente"
             id="movimentos"/>
      <small class="form-text text-muted">Campo opcional.</small>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark text-start" for="outraReligiao">
        Seita/Ideologia/Outra Religião:
      </label>
      <input class="form-control" type="text" v-model="registros.item.pessoa_seita_ideologia_religiao"
             id="outraReligiao"/>
      <small class="form-text text-muted">Campo opcional.</small>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark text-start" for="entidade">Entidade que Frequenta:</label>
      <input class="form-control" type="text" v-model="registros.item.pessoa_entidade_pertencente"
             id="entidade"/>
      <small class="form-text text-muted">Campo opcional.</small>
    </div>

    <div v-if="comConjuge.includes(registros.item.pessoa_estado_civil)">
      <label class="form-label text-dark text-start fw-bold mt-3">
        Selecione as informações de religião do(a) cônjuge
        {{ registros.item.conjuge_nome || '' }}:
      </label>

      <div class="mb-3">
        <label class="form-label text-dark text-start" for="conjugeReligiao"> Religião: </label>
        <multiselect v-model="registros.item.conjuge_religiao" :options="religiao"
                     placeholder="Selecione ou pesquise..." :searchable="true" :close-on-select="true"
                     id="conjugeReligiao" :show-labels="false" :taggable="true"
                     @tag="e => { religiao.push(e); registros.item.conjuge_religiao = e }"/>
        <small class="form-text text-muted">Você pode selecionar uma religião ou digitar uma nova.</small>
      </div>

      <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" v-model="registros.item.conjuge_sacramento_batismo"
               id="conjuge_sacramento_batismo" true-value="S" false-value="N"/>
        <label class="form-check-label text-dark" for="conjuge_sacramento_batismo">Batizado</label>
      </div>

      <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" v-model="registros.item.conjuge_sacramento_eucaristia"
               id="conjuge_sacramento_eucaristia" true-value="S" false-value="N"/>
        <label class="form-check-label text-dark text-start" for="conjuge_sacramento_eucaristia">Primeira
          Comunhão</label>
      </div>

      <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" v-model="registros.item.conjuge_sacramento_crisma"
               id="conjuge_sacramento_crisma" true-value="S" false-value="N"/>
        <label class="form-check-label text-dark text-start" for="conjuge_sacramento_crisma">Crismado</label>
      </div>

      <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" v-model="registros.item.conjuge_atuante_igreja"
               id="conjuge_atuante_igreja" true-value="S" false-value="N"/>
        <label class="form-check-label text-dark text-start" for="conjuge_atuante_igreja">Atuante na Igreja</label>
      </div>

      <div class="mb-3">
        <label class="form-label text-dark text-start" for="conjuge_pessoa_paroquia">
          Paróquia que Frequenta:
        </label>
        <multiselect v-model="registros.item.conjuge_paroquia" :options="paroquia"
                     placeholder="Selecione ou pesquise..." :searchable="true" :close-on-select="true"
                     id="conjuge_pessoa_paroquia" :show-labels="false" :taggable="true"
                     @tag="e => { paroquia.push(e); registros.item.conjuge_paroquia = e }"/>
        <small class="form-text text-muted">Você pode selecionar uma paróquia ou digitar uma nova.</small>
      </div>

      <div class="mb-3">
        <label class="form-label text-dark text-start" for="conjuge_pessoa_pastorais_ou_servicos">
          Pastorais ou Serviços:
        </label>
        <input class="form-control" type="text" v-model="registros.item.conjuge_pastorais_ou_servicos"
               id="conjuge_pessoa_pastorais_ou_servicos"/>
        <small class="form-text text-muted">Campo opcional.</small>
      </div>

      <div class="mb-3">
        <label class="form-label text-dark text-start" for="conjuge_pessoa_movimento_pertencente">
          Movimentos que participa:
        </label>
        <input class="form-control" type="text" v-model="registros.item.conjuge_movimento_pertencente"
               id="conjuge_pessoa_movimento_pertencente"/>
        <small class="form-text text-muted">Campo opcional.</small>
      </div>

      <div class="mb-3">
        <label class="form-label text-dark text-start" for="conjuge_pessoa_seita_ideologia_religiao">
          Seita/Ideologia/Outra Religião:
        </label>
        <input class="form-control" type="text" v-model="registros.item.conjuge_seita_ideologia_religiao"
               id="conjuge_pessoa_seita_ideologia_religiao"/>
        <small class="form-text text-muted">Campo opcional.</small>
      </div>

      <div class="mb-3">
        <label class="form-label text-dark text-start" for="conjuge_pessoa_entidade_pertencente">
          Entidade que Frequenta:
        </label>
        <input class="form-control" type="text" v-model="registros.item.conjuge_entidade_pertencente"
               id="conjuge_pessoa_entidade_pertencente"/>
        <small class="form-text text-muted">Campo opcional.</small>
      </div>

      <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" v-model="registros.item.pessoa_casamento_civil"
               id="conjuge_pessoa_casamento_civil" true-value="S" false-value="N"/>
        <label class="form-check-label text-dark text-start" for="conjuge_pessoa_casamento_civil">Casamento
          Civil</label>
      </div>

      <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" v-model="registros.item.pessoa_casamento_religioso"
               id="conjuge_pessoa_casamento_religioso" true-value="S" false-value="N"/>
        <label class="form-check-label text-dark text-start"
               for="conjuge_pessoa_casamento_religioso">Casamento Religioso</label>
      </div>

      <div class="mb-3">
        <label class="form-label text-dark text-start" for="pessoa_paroquia_casamento2">
          Paróquia do Casamento Religioso:
        </label>
        <multiselect v-model="registros.item.pessoa_paroquia_casamento" :options="paroquia"
                     placeholder="Selecione uma paróquia ou digite para adicionar nova..." :searchable="true"
                     :close-on-select="true" id="pessoa_paroquia_casamento2" :show-labels="true" :taggable="true"
                     @tag="e => { paroquia.push(e); registros.item.pessoa_paroquia_casamento = e }"/>
        <small class="form-text text-muted">Você pode selecionar uma paróquia ou digitar uma nova.</small>
      </div>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';

export default {
  name: 'TabReligiao',
  components: {
    Multiselect,
  },
  props: {
    registros: {type: Object, required: true},
    comConjuge: {type: Array, required: true},
    religiao: {type: Array, required: true},
    paroquia: {type: Array, required: true},
  },
};
</script>