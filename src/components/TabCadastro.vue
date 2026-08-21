<template>
  <div>
    <CpfInput id="cpf" v-model="registros.item.pessoa_cpf" :disabled="registros.cpf_validado"
              :loading="buscandoCpfPessoa" :erro="erros.pessoa_cpf" :validado="registros.cpf_validado"
              success-text="CPF validado com sucesso"
              help-text='Digite seu CPF e clique em "Buscar CPF" para preencher seus dados automaticamente.'
              buscar-aria-label="Buscar dados pelo CPF informado" @buscar="$emit('buscar-cpf-pessoa')"/>

    <transition name="fade">
      <div v-if="registros.cpf_nao_encontrado" class="alert alert-warning mt-2 d-flex align-items-center"
           role="alert">
        <span class="me-2" aria-hidden="true">⚠️</span>
        <span>CPF não encontrado. Verifique se digitou corretamente ou preencha os dados manualmente abaixo.</span>
      </div>
    </transition>

    <div class="mb-3">
      <label class="form-label text-dark text-start" for="nome">Nome Completo:
        <label style="color:red" aria-label="campo obrigatório">*</label>
      </label>
      <input class="form-control" :disabled="registros.cpf_validado" type="text"
             v-model="registros.item.pessoa_nome" id="nome" :aria-invalid="!!erros.pessoa_nome"
             autocomplete="name" placeholder="Digite seu nome como aparece no RG"/>
      <div v-if="erros.pessoa_nome" class="text-danger mt-1" role="alert">
        <span aria-hidden="true">⚠️</span> {{ erros.pessoa_nome }}
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark text-start" for="apelido">Apelido:</label>
      <input class="form-control" :disabled="registros.cpf_validado" type="text"
             v-model="registros.item.pessoa_apelido" id="apelido"
             placeholder="Como você prefere ser chamado(a)"/>
      <small class="form-text text-muted">Campo opcional. Como você prefere ser chamado(a).</small>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark" for="pessoa_nascimento">
        Data de Nascimento:<label style="color:red" aria-label="campo obrigatório">*</label>
      </label>
      <input class="form-control" type="date" :disabled="registros.cpf_validado"
             v-model="registros.item.pessoa_nascimento" id="pessoa_nascimento"
             :aria-invalid="!!erros.pessoa_nascimento" autocomplete="bday"/>

      <div v-if="erros.pessoa_nascimento" class="text-danger mt-1" role="alert">
        <span aria-hidden="true">⚠️</span> {{ erros.pessoa_nascimento }}
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark text-start" for="celular">
        Celular:<label style="color:red" aria-label="campo obrigatório">*</label>
      </label>
      <input class="form-control" id="celular" type="tel" inputmode="tel"
             v-model="registros.item.pessoa_celular" v-mask="'(##)#####-####'"
             :aria-invalid="!!erros.pessoa_celular" autocomplete="tel" placeholder="(00)00000-0000"/>
      <small class="form-text text-muted">Informe seu celular com DDD. Usamos para entrar em contato.</small>
      <div v-if="erros.pessoa_celular" class="text-danger mt-1" role="alert">
        <span aria-hidden="true">⚠️</span> {{ erros.pessoa_celular }}
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark text-start" for="pessoa_email">
        Email:<label style="color:red" aria-label="campo obrigatório">*</label>
      </label>
      <input class="form-control" type="email" inputmode="email" v-model="registros.item.pessoa_email"
             id="pessoa_email" :aria-invalid="!!erros.pessoa_email" autocomplete="email"
             placeholder="seuemail@exemplo.com"/>
      <div v-if="erros.pessoa_email" class="text-danger mt-1" role="alert">
        <span aria-hidden="true">⚠️</span> {{ erros.pessoa_email }}
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark text-start" for="telefoneResidencial">Telefone Fixo:</label>
      <input class="form-control" id="telefoneResidencial" type="tel"
             v-model="registros.item.pessoa_telefone_residencial" v-mask="'(##)####-####'"
             placeholder="(00)0000-0000"/>
      <small class="form-text text-muted">Campo opcional.</small>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark text-start" for="profissao">Profissão:</label>
      <multiselect v-model="registros.item.pessoa_profissao" :options="profissao" :taggable="true"
                   :searchable="true" :close-on-select="true" :clear-on-select="true" :hide-selected="true"
                   placeholder="Digite para buscar ou adicionar..." id="profissao" :show-labels="true"
                   @tag="e => { profissao.push(e); registros.item.pessoa_profissao = e }"/>
      <small class="form-text text-muted">Você pode selecionar uma profissão ou digitar uma nova.</small>
    </div>

    <div class="mb-3">
      <label class="form-label text-dark text-start" for="sexo">
        Sexo:<label style="color:red" aria-label="campo obrigatório">*</label>
      </label>
      <multiselect v-model="registros.item.pessoa_sexo" :options="sexoDisponivel('conjuge_sexo')"
                   placeholder="Selecione ou pesquise..."
                   :searchable="true" :close-on-select="true" id="sexo" :show-labels="false" :taggable="true"
                   @tag="e => { sexo.push(e); registros.item.pessoa_sexo = e }"/>
      <div v-if="erros.pessoa_sexo" class="text-danger mt-1" role="alert">
        <span aria-hidden="true">⚠️</span> {{ erros.pessoa_sexo }}
      </div>
    </div>

    <!-- Aviso visível do cônjuge -->
    <transition name="fade">
      <div v-if="comConjuge.includes(registros.item.pessoa_estado_civil)" class="conjuge-alert"
           role="alert" aria-live="polite">
        <div class="conjuge-alert__icon" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div class="conjuge-alert__content">
          <p class="conjuge-alert__title">Informações do cônjuge</p>
          <p class="conjuge-alert__text">
            Como você informou que é {{ registros.item.pessoa_estado_civil?.toLowerCase() }},
            também precisamos dos dados do seu cônjuge. Por favor, preencha os campos abaixo.
          </p>
        </div>
      </div>
    </transition>

    <div class="mb-3">
      <label class="form-label text-dark text-start" for="estadoCivil">
        Estado Civil:<label style="color:red" aria-label="campo obrigatório">*</label>
      </label>
      <multiselect v-model="registros.item.pessoa_estado_civil" :options="estadoCivil"
                   placeholder="Selecione ou pesquise..." :searchable="true" :close-on-select="true"
                   id="estadoCivil"
                   :show-labels="false" :taggable="true"
                   @tag="e => { estadoCivil.push(e); registros.item.pessoa_estado_civil = e }"/>
      <div v-if="erros.pessoa_estado_civil" class="text-danger mt-1" role="alert">
        <span aria-hidden="true">⚠️</span> {{ erros.pessoa_estado_civil }}
      </div>
    </div>

    <div v-if="comConjuge.includes(registros.item.pessoa_estado_civil)">
      <h4>Informações do Cônjuge</h4>

      <CpfInput id="conjugeCpf" v-model="registros.item.conjuge_cpf" :disabled="registros.cpf_validado_conjuge"
                :loading="buscandoCpfConjuge" :erro="erros.conjuge_cpf" :validado="registros.cpf_validado_conjuge"
                success-text="CPF do cônjuge validado"
                help-text='Digite o CPF do(a) cônjuge e clique em "Buscar CPF" para preenchimento automático.'
                buscar-aria-label="Buscar dados do cônjuge pelo CPF" @buscar="$emit('buscar-cpf-conjuge')"/>

      <div class="mb-3">
        <label class="form-label text-dark text-start" for="nomeConjuge">
          Nome Completo:<label style="color:red" aria-label="campo obrigatório">*</label>
        </label>
        <input class="form-control" type="text" v-model="registros.item.conjuge_nome"
               :disabled="registros.cpf_validado_conjuge" id="nomeConjuge"
               :aria-invalid="!!erros.conjuge_nome"/>
        <div v-if="erros.conjuge_nome" class="text-danger mt-1" role="alert">
          <span aria-hidden="true">⚠️</span> {{ erros.conjuge_nome }}
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label text-dark text-start" for="apelidoConjuge">Apelido:</label>
        <input class="form-control" type="text" v-model="registros.item.conjuge_apelido"
               :disabled="registros.cpf_validado_conjuge" id="apelidoConjuge"/>
      </div>

      <div class="mb-3">
        <label class="form-label text-dark text-start" for="conjugeNascimento">
          Data de Nascimento:<label style="color:red" aria-label="campo obrigatório">*</label>
        </label>
        <input class="form-control" type="date" :disabled="registros.cpf_validado_conjuge"
               v-model="registros.item.conjuge_nascimento" id="conjugeNascimento"
               :aria-invalid="!!erros.conjuge_nascimento"/>
        <div v-if="erros.conjuge_nascimento" class="text-danger mt-1" role="alert">
          <span aria-hidden="true">⚠️</span> {{ erros.conjuge_nascimento }}
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label text-dark text-start" for="conjugeCelular">
          Celular:<label style="color:red" aria-label="campo obrigatório">*</label>
        </label>
        <input id="conjugeCelular" class="form-control" type="tel" inputmode="tel"
               v-model="registros.item.conjuge_celular" v-mask="'(##)#####-####'"
               :aria-invalid="!!erros.conjuge_celular" placeholder="(00)00000-0000"/>
        <div v-if="erros.conjuge_celular" class="text-danger mt-1" role="alert">
          <span aria-hidden="true">⚠️</span> {{ erros.conjuge_celular }}
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label text-dark text-start" for="emailConjuge">
          Email do Cônjuge:<label style="color:red" aria-label="campo obrigatório">*</label>
        </label>
        <input class="form-control" type="email" inputmode="email" v-model="registros.item.conjuge_email"
               id="emailConjuge" :aria-invalid="!!erros.conjuge_email" autocomplete="email"/>
        <div v-if="erros.conjuge_email" class="text-danger mt-1" role="alert">
          <span aria-hidden="true">⚠️</span> {{ erros.conjuge_email }}
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label text-dark text-start" for="conjugeProfissao">Profissão:</label>
        <multiselect v-model="registros.item.conjuge_profissao" :options="profissao"
                     placeholder="Selecione ou pesquise..." :searchable="true" :close-on-select="true"
                     id="conjugeProfissao" :show-labels="false" :taggable="true"
                     @tag="e => { profissao.push(e); registros.item.conjuge_profissao = e }"/>
        <small class="form-text text-muted">Você pode selecionar uma profissão ou digitar uma nova.</small>
      </div>

      <div class="mb-3">
        <label class="form-label text-dark text-start" for="conjuge_sexo">
          Sexo:<label style="color:red" aria-label="campo obrigatório">*</label>
        </label>
        <multiselect v-model="registros.item.conjuge_sexo" :options="sexoDisponivel('pessoa_sexo')"
                     placeholder="Selecione ou pesquise..." :searchable="true" :close-on-select="true"
                     id="conjuge_sexo" :show-labels="false" :taggable="true"
                     @tag="e => { sexo.push(e); registros.item.conjuge_sexo = e }"/>
        <div v-if="erros.conjuge_sexo" class="text-danger mt-1" role="alert">
          <span aria-hidden="true">⚠️</span> {{ erros.conjuge_sexo }}
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label text-dark text-start" for="dataCasamento">Data de Casamento:</label>
        <input class="form-control" type="date" v-model="registros.item.pessoa_data_casamento"
               id="dataCasamento"/>
        <small class="form-text text-muted">Campo opcional.</small>
      </div>

      <div class="mb-3">
        <label class="form-label text-dark text-start" for="apelidoCasal">Apelido do Casal:</label>
        <input class="form-control" type="text" v-model="registros.item.apelido_casal" id="apelidoCasal"
               placeholder='Ex: "Maria e João"'/>
        <small class="form-text text-muted">Campo opcional. Como o casal é conhecido.</small>
      </div>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import CpfInput from './CpfInput.vue';

export default {
  name: 'TabCadastro',
  components: {
    Multiselect,
    CpfInput,
  },
  props: {
    registros: {type: Object, required: true},
    erros: {type: Object, required: true},
    comConjuge: {type: Array, required: true},
    profissao: {type: Array, required: true},
    sexo: {type: Array, required: true},
    estadoCivil: {type: Array, required: true},
    buscandoCpfPessoa: {type: Boolean, default: false},
    buscandoCpfConjuge: {type: Boolean, default: false},
  },
  emits: ['buscar-cpf-pessoa', 'buscar-cpf-conjuge'],
  methods: {
    sexoDisponivel(campoExcluir) {
      return this.sexo.filter(s => s !== this.registros.item[campoExcluir]);
    },
  },
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.conjuge-alert {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #E6F1FB;
  border: 1px solid #B5D4F4;
  border-left: 4px solid #185FA5;
  border-radius: 8px;
  padding: 16px 18px;
  margin: 16px 0;
  color: #0C447C;
}

.conjuge-alert__icon {
  flex-shrink: 0;
  color: #185FA5;
  margin-top: 2px;
}

.conjuge-alert__title {
  margin: 0 0 4px;
  font-weight: 600;
  font-size: 1rem;
  color: #0C447C;
}

.conjuge-alert__text {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #0C447C;
}
</style>