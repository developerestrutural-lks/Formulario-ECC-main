<template>
  <div>
    <div class="mb-3">
      <label class="form-label text-dark" for="cpf">
        CPF: <span class="text-danger">*</span>
      </label>
      <div class="input-group">
        <input
            id="cpf"
            class="form-control"
            type="text"
            :disabled="registros.cpf_validado"
            v-model="registros.item.pessoa_cpf"
            v-mask="'###.###.###-##'"
            @keyup.enter="$emit('buscar-cpf', true)"
        />
        <button
            class="btn btn-outline-primary"
            type="button"
            :disabled="registros.cpf_validado"
            @click="$emit('buscar-cpf', true)"
        >
          Buscar CPF
        </button>
      </div>
      <transition name="fade">
        <p v-if="registros.cpf_nao_encontrado" class="text-warning mt-1">
          CPF não encontrado, verifique se está correto!
        </p>
      </transition>
      <div v-if="erros.pessoa_cpf" class="text-danger mt-1">{{ erros.pessoa_cpf }}</div>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark" for="nome">
        Nome Completo: <span class="text-danger">*</span>
      </label>
      <input class="form-control" id="nome" type="text"
             :disabled="registros.cpf_validado" v-model="registros.item.pessoa_nome"/>
      <div v-if="erros.pessoa_nome" class="text-danger mt-1">{{ erros.pessoa_nome }}</div>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark" for="apelido">Apelido:</label>
      <input class="form-control" id="apelido" type="text"
             :disabled="registros.cpf_validado" v-model="registros.item.pessoa_apelido"/>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark" for="pessoa_nascimento">
        Data de Nascimento: <span class="text-danger">*</span>
      </label>
      <input class="form-control" id="pessoa_nascimento" type="date"
             :disabled="registros.cpf_validado" v-model="registros.item.pessoa_nascimento"/>
      <div v-if="erros.pessoa_nascimento" class="text-danger mt-1">{{ erros.pessoa_nascimento }}</div>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark" for="celular">
        Celular: <span class="text-danger">*</span>
      </label>
      <input class="form-control" id="celular" type="text"
             v-model="registros.item.pessoa_celular" v-mask="'(##)#####-####'"/>
      <div v-if="erros.pessoa_celular" class="text-danger mt-1">{{ erros.pessoa_celular }}</div>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark" for="pessoa_email">
        Email: <span class="text-danger">*</span>
      </label>
      <input class="form-control" id="pessoa_email" type="email" v-model="registros.item.pessoa_email"/>
      <div v-if="erros.pessoa_email" class="text-danger mt-1">{{ erros.pessoa_email }}</div>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark" for="telefoneResidencial">Telefone Fixo:</label>
      <input class="form-control" id="telefoneResidencial" type="text"
             v-model="registros.item.pessoa_telefone_residencial" v-mask="'(##)####-####'"/>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark" for="profissao">Profissão:</label>
      <multiselect
          v-model="registros.item.pessoa_profissao"
          :options="profissao"
          :taggable="true" :searchable="true" :close-on-select="true"
          :clear-on-select="true" :hide-selected="true"
          placeholder="Digite para buscar ou adicionar..."
          id="profissao"
          @tag="e => { profissao.push(e); registros.item.pessoa_profissao = e }"
      />
      <small class="form-text text-muted">Você pode selecionar uma profissão ou digitar uma nova.</small>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark" for="sexo">
        Sexo: <span class="text-danger">*</span>
      </label>
      <multiselect
          v-model="registros.item.pessoa_sexo"
          :options="sexo"
          :searchable="true" :close-on-select="true" :taggable="true"
          placeholder="Selecione ou pesquise..." id="sexo"
          @tag="e => { sexo.push(e); registros.item.pessoa_sexo = e }"
      />
      <div v-if="erros.pessoa_sexo" class="text-danger mt-1">{{ erros.pessoa_sexo }}</div>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark" for="estadoCivil">
        Estado Civil: <span class="text-danger">*</span>
      </label>
      <multiselect
          v-model="registros.item.pessoa_estado_civil"
          :options="estadoCivil"
          :searchable="true" :close-on-select="true" :taggable="true"
          placeholder="Selecione ou pesquise..." id="estadoCivil"
          @tag="e => { estadoCivil.push(e); registros.item.pessoa_estado_civil = e }"
      />
      <div v-if="erros.pessoa_estado_civil" class="text-danger mt-1">{{ erros.pessoa_estado_civil }}</div>
    </div>

    <!-- Seção Cônjuge -->
    <template v-if="comConjuge.includes(registros.item.pessoa_estado_civil)">
      <h4 class="mt-4 mb-3">Informações do Cônjuge</h4>

      <div class="mb-3">
        <label class="form-label text-dark" for="conjugeCpf">
          CPF: <span class="text-danger">*</span>
        </label>
        <div class="input-group">
          <input
              id="conjugeCpf"
              class="form-control"
              type="text"
              v-model="registros.item.conjuge_cpf"
              v-mask="'###.###.###-##'"
              :disabled="registros.cpf_validado"
              @keyup.enter="$emit('buscar-cpf', false)"
          />
          <button class="btn btn-outline-primary" type="button"
                  :disabled="registros.cpf_validado" @click="$emit('buscar-cpf', false)">
            Buscar CPF
          </button>
        </div>
        <div v-if="erros.conjuge_cpf" class="text-danger mt-1">{{ erros.conjuge_cpf }}</div>
      </div>

      <div class="mb-3">
        <label class="form-label text-dark" for="nomeConjuge">
          Nome Completo: <span class="text-danger">*</span>
        </label>
        <input class="form-control" id="nomeConjuge" type="text"
               v-model="registros.item.conjuge_nome" :disabled="registros.cpf_validado"/>
        <div v-if="erros.conjuge_nome" class="text-danger mt-1">{{ erros.conjuge_nome }}</div>
      </div>

      <div class="mb-3">
        <label class="form-label text-dark" for="apelidoConjuge">Apelido:</label>
        <input class="form-control" id="apelidoConjuge" type="text"
               v-model="registros.item.conjuge_apelido" :disabled="registros.cpf_validado"/>
      </div>

      <div class="mb-3">
        <label class="form-label text-dark" for="conjugeNascimento">
          Data de Nascimento: <span class="text-danger">*</span>
        </label>
        <input class="form-control" id="conjugeNascimento" type="date"
               v-model="registros.item.conjuge_nascimento" :disabled="registros.cpf_validado"/>
        <div v-if="erros.conjuge_nascimento" class="text-danger mt-1">{{ erros.conjuge_nascimento }}</div>
      </div>

      <div class="mb-3">
        <label class="form-label text-dark">
          Celular: <span class="text-danger">*</span>
        </label>
        <input class="form-control" type="tel"
               v-model="registros.item.conjuge_celular" v-mask="'(##)#####-####'"/>
        <div v-if="erros.conjuge_celular" class="text-danger mt-1">{{ erros.conjuge_celular }}</div>
      </div>

      <div class="mb-3">
        <label class="form-label text-dark" for="emailConjuge">
          Email do Cônjuge: <span class="text-danger">*</span>
        </label>
        <input class="form-control" id="emailConjuge" type="email" v-model="registros.item.conjuge_email"/>
        <div v-if="erros.conjuge_email" class="text-danger mt-1">{{ erros.conjuge_email }}</div>
      </div>

      <div class="mb-3">
        <label class="form-label text-dark" for="conjugeProfissao">Profissão:</label>
        <multiselect
            v-model="registros.item.conjuge_profissao"
            :options="profissao"
            :searchable="true" :close-on-select="true" :taggable="true"
            placeholder="Selecione ou pesquise..." id="conjugeProfissao"
            @tag="e => { profissao.push(e); registros.item.conjuge_profissao = e }"
        />
      </div>

      <div class="mb-3">
        <label class="form-label text-dark" for="conjuge_sexo">
          Sexo: <span class="text-danger">*</span>
        </label>
        <multiselect
            v-model="registros.item.conjuge_sexo"
            :options="sexo"
            :searchable="true" :close-on-select="true" :taggable="true"
            placeholder="Selecione ou pesquise..." id="conjuge_sexo"
            @tag="e => { sexo.push(e); registros.item.conjuge_sexo = e }"
        />
        <div v-if="erros.conjuge_sexo" class="text-danger mt-1">{{ erros.conjuge_sexo }}</div>
      </div>

      <div class="mb-3">
        <label class="form-label text-dark" for="dataCasamento">Data de Casamento:</label>
        <input class="form-control" id="dataCasamento" type="date"
               v-model="registros.item.pessoa_data_casamento"/>
      </div>

      <div class="mb-3">
        <label class="form-label text-dark" for="apelidoCasal">Apelido do Casal:</label>
        <input class="form-control" id="apelidoCasal" type="text"
               v-model="registros.item.apelido_casal"/>
      </div>
    </template>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import EquipeTrabalho from "@/views/EquipeTrabalho.vue";

export default {
  name: 'TabCadastro',
  components: {
    Multiselect,
    EquipeTrabalho,
  },
  props: {
    registros: {type: Object, required: true},
    erros: {type: Object, required: true},
    comConjuge: {type: Array, required: true},
    profissao: {type: Array, required: true},
    sexo: {type: Array, required: true},
    estadoCivil: {type: Array, required: true},
  },
  emits: ['buscar-cpf'],
};
</script>