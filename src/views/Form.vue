<template>
  <div class="container mt-4">
    <div class="cabecalho">
      <img src="@/assets/logo_grupo_acao.png" alt="Ícone" class="icone">
      <h4>ENCONTRO DE CASAIS COM CRISTO</h4>
      <!-- Passagem parâmetro listar dados e salvar -->
      <button class="btn btn-primary" @click="validarPessoaImportacao(); salvar(true, true); finalizarFormulario()"
        @keypress.enter="listarDados(false); salvar(true); finalizarFormulario()">Finalizar Questionário
      </button>
    </div>

    <!-- Abas -->
    <ul class="nav nav-tabs">
      <li class="nav-item" v-for="tab in tabs" :key="tab.id">
        <button type="button" class="nav-link" :class="{ active: activeTab === tab.id }"
          style="font-weight: bold; font-size: 14pt;" @click="tentarMudarAba(tab.id)" v-if="tab.libera">
          {{ tab.label }}
        </button>
      </li>
    </ul>

    <!-- Aba Cadastro -->
    <div class="tab-content mt-3">
      <div class="tab-pane fade show active" v-if="activeTab === 'cadastro'">
        <!-- <h3>Cadastro</h3> -->
        <form>
          <div class="mb-3">
            <label class="form-label text-dark" for="cpf">
              CPF:<span class="text-danger">*</span>
            </label>

            <div class="input-group">
              <input id="cpf" class="form-control" :disabled="registros.cpf_validado" type="text"
                v-model="registros.item.pessoa_cpf" v-mask="'###.###.###-##'" @keyup.enter="getCpfDetails(true)" />

              <button :disabled="registros.cpf_validado" class="btn btn-outline-primary" type="button" @click="getCpfDetails(true)">
                Buscar CPF
              </button>
            </div>

            <transition name="fade">
              <div v-if="registros.cpf_nao_encontrado">
                <p>CPF não encontrado, verifique se está correto!</p>
              </div>
            </transition>

            <div v-if="erros.pessoa_cpf" class="text-danger mt-1">
              {{ erros.pessoa_cpf }}
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label text-dark text-start" for="nome">Nome Completo:
              <label style="color:red">*</label>
            </label>
            <input class="form-control" :disabled="registros.cpf_validado" type="text" v-model="registros.item.pessoa_nome" id="nome" />
            <div v-if="erros.pessoa_nome" class="text-danger mt-1">
              {{ erros.pessoa_nome }}
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label text-dark text-start" for="apelido">Apelido:</label>
            <input class="form-control" :disabled="registros.cpf_validado" type="text" v-model="registros.item.pessoa_apelido" id="apelido" />
          </div>

          <div class="mb-3">
            <label class="form-label text-dark" for="pessoa_nascimento">Data de Nascimento:<label
                style="color:red">*</label></label>
            <input class="form-control" type="date" :disabled="registros.cpf_validado" v-model="registros.item.pessoa_nascimento" id="pessoa_nascimento"
              true-value="S" false-value="N" />

            <div v-if="erros.pessoa_nascimento" class="text-danger mt-1">
              {{ erros.pessoa_nascimento }}
            </div>
          </div>

          <!-- <div class="mb-3">
            <label class="form-label text-dark">Data de Nascimento:<label style="color:red">*</label></label>
            <ScrollDatePicker v-model="registros.item.pessoa_nascimento" />
            <div v-if="erros.pessoa_nascimento" class="text-danger mt-1">
              {{ erros.pessoa_nascimento }}
            </div>
          </div> -->

          <div class="mb-3">
            <label class="form-label text-dark text-start" for="celular">Celular:<label
                style="color:red">*</label></label>
            <input class="form-control" type="text" v-model="registros.item.pessoa_celular" v-mask="'(##)#####-####'" />
            <div v-if="erros.pessoa_celular" class="text-danger mt-1">
              {{ erros.pessoa_celular }}
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label text-dark text-start" for="emailConjuge">Email:<label
                style="color:red">*</label></label>
            <input class="form-control" type="email" v-model="registros.item.pessoa_email" id="pessoa_email" />
            <div v-if="erros.pessoa_email" class="text-danger mt-1">
              {{ erros.pessoa_email }}
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label text-dark text-start" for="telefoneResidencial">Telefone
              Fixo:</label>
            <input class="form-control" type="text" v-model="registros.item.pessoa_telefone_residencial"
              v-mask="'(##)####-####'" />
          </div>

          <div class="mb-3">
            <label class="form-label text-dark text-start" for="profissao">Profissão:</label>
            <multiselect v-model="registros.item.pessoa_profissao" :options="profissao" :taggable="true"
              :searchable="true" :close-on-select="true" :clear-on-select="true" :hide-selected="true"
              placeholder="Digite para buscar ou adicionar..." id="profissao" :show-labels="true"
              @tag="profissao.push($event); registros.item.pessoa_profissao = $event" />
            <small class="form-text text-muted">Você pode selecionar uma profissão ou digitar uma nova.</small>
          </div>

          <div class="mb-3">
            <label class="form-label text-dark text-start" for="sexo">Sexo:<label style="color:red">*</label></label>
            <multiselect v-model="registros.item.pessoa_sexo" :options="sexo" placeholder="Selecione ou pesquise..."
              :searchable="true" :close-on-select="true" id="sexo" :show-labels="false" :taggable="true"
              @tag="sexo.push($event); registros.item.pessoa_sexo = $event" />
            <div v-if="erros.pessoa_sexo" class="text-danger mt-1">
              {{ erros.pessoa_sexo }}
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label text-dark text-start" for="estadoCivil">Estado Civil:<label
                style="color:red">*</label></label>
            <multiselect v-model="registros.item.pessoa_estado_civil" :options="estadoCivil"
              placeholder="Selecione ou pesquise..." :searchable="true" :close-on-select="true" id="estadoCivil"
              :show-labels="false" :taggable="true"
              @tag="estadoCivil.push($event); registros.item.pessoa_estado_civil = $event" />
            <div v-if="erros.pessoa_estado_civil" class="text-danger mt-1">
              {{ erros.pessoa_estado_civil }}
            </div>
          </div>

          <div v-if="this.comConjuge.includes(registros.item.pessoa_estado_civil)">
            <h4>Informações do Cônjuge</h4>

            <div class="mb-3">
              <label class="form-label text-dark" for="conjugeCpf">
                CPF:<span class="text-danger">*</span>
              </label>

              <div class="input-group">
                <input id="conjugeCpf" class="form-control" type="text" v-model="registros.item.conjuge_cpf"
                  v-mask="'###.###.###-##'" @keyup.enter="getCpfDetails(false, true)" :disabled="registros.cpf_validado"/>

                <button :disabled="registros.cpf_validado" class="btn btn-outline-primary" type="button" @click="getCpfDetails(false, true)">
                  Buscar CPF
                </button>
              </div>

              <div v-if="erros.conjuge_cpf" class="text-danger mt-1">
                {{ erros.conjuge_cpf }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label text-dark text-start" for="nomeConjuge">Nome Completo:<label
                  style="color:red">*</label></label>
              <input class="form-control" type="text" v-model="registros.item.conjuge_nome" :disabled="registros.cpf_validado" id="nomeConjuge" />
              <div v-if="erros.conjuge_nome" class="text-danger mt-1">
                {{ erros.conjuge_nome }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label text-dark text-start" for="apelidoConjuge">Apelido:</label>
              <input class="form-control" type="text" v-model="registros.item.conjuge_apelido" :disabled="registros.cpf_validado" id="apelidoConjuge" />
            </div>

            <div class="mb-3">
              <label class="form-label text-dark text-start" for="conjugeNascimento">Data de
                Nascimento:<label style="color:red">*</label></label>
              <input class="form-control" type="date" :disabled="registros.cpf_validado" v-model="registros.item.conjuge_nascimento"
                id="conjugeNascimento" />
              <div v-if="erros.conjuge_nascimento" class="text-danger mt-1">
                {{ erros.conjuge_nascimento }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label text-dark text-start" for="celular">Celular:<label
                  style="color:red">*</label></label>
              <input class="form-control" type="tel" v-model="registros.item.conjuge_celular"
                v-mask="'(##)#####-####'" />
              <div v-if="erros.conjuge_celular" class="text-danger mt-1">
                {{ erros.conjuge_celular }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label text-dark text-start" for="emailConjuge">Email do Cônjuge:<label
                  style="color:red">*</label></label>
              <input class="form-control" type="email" v-model="registros.item.conjuge_email" id="emailConjuge" />
              <div v-if="erros.conjuge_email" class="text-danger mt-1">
                {{ erros.conjuge_email }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label text-dark text-start" for="conjugeProfissao">Profissão:</label>
              <multiselect v-model="registros.item.conjuge_profissao" :options="profissao"
                placeholder="Selecione ou pesquise..." :searchable="true" :close-on-select="true" id="conjugeProfissao"
                :show-labels="false" :taggable="true"
                @tag="profissao.push($event); registros.item.conjuge_profissao = $event" />
              <small class="form-text text-muted">Você pode selecionar um profissão ou digitar uma nova.</small>
            </div>

            <div class="mb-3">
              <label class="form-label text-dark text-start" for="conjuge_sexo">Sexo:<label
                  style="color:red">*</label></label>
              <multiselect v-model="registros.item.conjuge_sexo" :options="sexo" placeholder="Selecione ou pesquise..."
                :searchable="true" :close-on-select="true" id="conjuge_sexo" :show-labels="false" :taggable="true"
                @tag="sexo.push($event); registros.item.conjuge_sexo = $event" />
              <div v-if="erros.conjuge_sexo" class="text-danger mt-1">
                {{ erros.conjuge_sexo }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label text-dark text-start" for="dataCasamento">Data de
                Casamento:</label>
              <input class="form-control" type="date" v-model="registros.item.pessoa_data_casamento"
                id="dataCasamento" />
            </div>

            <div class="mb-3">
              <label class="form-label text-dark text-start" for="apelidoCasal">Apelido do Casal:</label>
              <input class="form-control" type="text" v-model="registros.item.apelido_casal" id="apelidoCasal" />
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Aba Foto -->
    <div v-show="activeTab === 'foto'">
      <form>
        <div class="mb-3">
          <label class="form-label text-dark text-start" for="fotoPrincipal">Foto da Pessoa:</label>
          <input class="form-control" type="file" @change="handleFileUpload('fotoPrincipal', $event)" accept="image/*"
            id="fotoPrincipal" />
          <img v-show="registros.item.pessoa_foto" alt="Foto Principal" id="pessoa_foto" width="200" height="200"
            class="img-thumbnail rounded" />
        </div>

        <div v-if="this.comConjuge.includes(registros.item.pessoa_estado_civil)">
          <div class="mb-3">
            <label class="form-label text-dark text-start" for="fotoConjuge">Foto do Cônjuge:</label>
            <input class="form-control" type="file" @change="handleFileUpload('fotoConjuge', $event)"
              id="fotoConjuge" />
            <img v-show="registros.item.foto_conjuge" alt="Foto Cônjuge" id="foto_conjuge" width="200" height="200"
              class="img-thumbnail rounded">
          </div>

          <div class="mb-3">
            <label class="form-label text-dark text-start" for="fotoCasal">Foto do Casal:</label>
            <input class="form-control" type="file" @change="handleFileUpload('fotoCasal', $event)" id="fotoCasal" />
            <img v-show="registros.item.pessoa_foto_casal" alt="Foto Casal" id="pessoa_foto_casal" width="200"
              height="200" class="img-thumbnail rounded">
          </div>
        </div>
      </form>
    </div>

    <!-- Aba Endereço -->
    <div v-if="activeTab === 'endereco'">
      <form>
        <div class="mb-3">
          <label class="form-label text-dark text-start" for="cep">CEP:</label>
          <input class="form-control" type="text" v-model="registros.item.pessoa_cep" v-mask="'#####-###'" />
          <small class="form-text text-muted">Após digitar o cep, ele faz a busca automática.</small>
        </div>

        <div class="mb-3">
          <label class="form-label text-dark text-start" for="endereco">Endereço Residencial:</label>
          <input class="form-control" type="text" v-model="registros.item.pessoa_endereco" id="endereco"
            :disabled="camposBloqueados" />
        </div>

        <div class="mb-3">
          <label class="form-label text-dark text-start" for="complemento">Complemento:</label>
          <input class="form-control" type="text" v-model="registros.item.pessoa_complemento" id="complemento" />
        </div>

        <div class="mb-3">
          <label class="form-label text-dark text-start" for="bairro">Bairro:</label>
          <input class="form-control" type="text" v-model="registros.item.pessoa_bairro" id="bairro"
            :disabled="camposBloqueados" />
        </div>

        <div class="mb-3">
          <label class="form-label text-dark text-start" for="cidade">Cidade:</label>
          <input class="form-control" type="text" v-model="registros.item.pessoa_cidade" id="cidade"
            :disabled="camposBloqueados" />
        </div>

        <div class="mb-3">
          <label class="form-label text-dark text-start" for="uf">UF:</label>
          <input class="form-control" type="text" v-model="registros.item.pessoa_uf" id="uf"
            :disabled="camposBloqueados" />
        </div>
      </form>
    </div>

    <!-- Aba Religião -->
    <div v-if="activeTab === 'religiao'">
      <!-- <h3>Religião</h3> -->
      <form>
        <label class="form-label text-dark text-start" for="nome">Selecione as informações de religião {{
          registros.item.pessoa_nome
          }}:</label>

        <div class="mb-3">
          <label class="form-label text-dark text-start" for="religiao"> Religião: </label>
          <multiselect v-model="registros.item.pessoa_religiao" :options="religiao"
            placeholder="Selecione ou pesquise..." :searchable="true" :close-on-select="true" id="religiao"
            :show-labels="false" :taggable="true"
            @tag="religiao.push($event); registros.item.pessoa_religiao = $event" />
          <small class="form-text text-muted">Você pode selecionar uma religião ou digitar uma nova.</small>
        </div>

        <div class="form-check mb-3">
          <input class="form-check-input" type="checkbox" v-model="registros.item.pessoa_sacramento_batismo"
            id="batizado" true-value="S" false-value="N" />
          <label class="form-check-label text-dark" for="batizado">Batizado</label>
        </div>

        <div class="form-check mb-3">
          <label class="form-check-label text-dark text-start" for="primeiraComunhao">Primeira
            Comunhão</label>
          <input class="form-check-input" type="checkbox" v-model="registros.item.pessoa_sacramento_eucaristia"
            id="primeiraComunhao" true-value="S" false-value="N" />
        </div>

        <div class="form-check mb-3">
          <label class="form-check-label text-dark text-start" for="crismado">Crismado</label>
          <input class="form-check-input" type="checkbox" v-model="registros.item.pessoa_sacramento_crisma"
            id="crismado" true-value="S" false-value="N" />
        </div>

        <div class="form-check mb-3">
          <label class="form-check-label text-dark text-start" for="atuanteIgreja">Atuante na
            Igreja</label>
          <input class="form-check-input" type="checkbox" v-model="registros.item.pessoa_atuante_igreja"
            id="atuanteIgreja" true-value="S" false-value="N" />
        </div>

        <div class="mb-3">
          <label class="form-label text-dark text-start" for="paroquia"> Paróquia que Frequenta: </label>
          <multiselect v-model="registros.item.pessoa_paroquia" :options="paroquia"
            placeholder="Selecione ou pesquise..." :searchable="true" :close-on-select="true" id="paroquia"
            :show-labels="false" :taggable="true"
            @tag="paroquia.push($event); registros.item.pessoa_paroquia = $event" />
          <small class="form-text text-muted">Você pode selecionar uma paróquia ou digitar uma nova.</small>
        </div>

        <div class="mb-3">
          <label class="form-label text-dark text-start" for="pastorais">Pastorais ou Serviços:</label>
          <input class="form-control" type="text" v-model="registros.item.pessoa_pastorais_ou_servicos" id="pastorais"
            true-value="S" false-value="N" />
        </div>

        <div class="mb-3">
          <label class="form-label text-dark text-start" for="movimentos">Movimentos:</label>
          <input class="form-control" type="text" v-model="registros.item.pessoa_movimento_pertencente" id="movimentos"
            true-value="S" false-value="N" />
        </div>

        <div class="mb-3">
          <label class="form-label text-dark text-start" for="outraReligiao">Seita/Ideologia/Outra
            Religião:</label>
          <input class="form-control" type="text" v-model="registros.item.pessoa_seita_ideologia_religiao"
            id="outraReligiao" true-value="S" false-value="N" />
        </div>

        <div class="mb-3">
          <label class="form-label text-dark text-start" for="entidade">Entidade que Frequenta:</label>
          <input class="form-control" type="text" v-model="registros.item.pessoa_entidade_pertencente" id="entidade"
            true-value="S" false-value="N" />
        </div>

        <div v-if="this.comConjuge.includes(registros.item.pessoa_estado_civil)">
          <label class="form-label text-dark text-start" for="nome">Selecione as informações de religião (CÔNJUGE) {{
            registros.item.conjuge_nome
            }}:</label>

          <div class="mb-3">
            <label class="form-label text-dark text-start" for="conjugeReligiao"> Religião: </label>
            <multiselect v-model="registros.item.conjuge_religiao" :options="religiao"
              placeholder="Selecione ou pesquise..." :searchable="true" :close-on-select="true" id="conjugeReligiao"
              :show-labels="false" :taggable="true"
              @tag="religiao.push($event); registros.item.conjuge_religiao = $event" />
            <small class="form-text text-muted">Você pode selecionar uma religião ou digitar uma nova.</small>
          </div>

          <div class="form-check mb-3">
            <input class="form-check-input" type="checkbox" v-model="registros.item.conjuge_sacramento_batismo"
              id="conjuge_sacramento_batismo" true-value="S" false-value="N" />
            <label class="form-check-label text-dark" for="conjuge_sacramento_batismo">Batizado</label>
          </div>

          <div class="form-check mb-3">
            <label class="form-check-label text-dark text-start" for="conjuge_sacramento_eucaristia">Primeira
              Comunhão</label>
            <input class="form-check-input" type="checkbox" v-model="registros.item.conjuge_sacramento_eucaristia"
              id="conjuge_sacramento_eucaristia" true-value="S" false-value="N" />
          </div>

          <div class="form-check mb-3">
            <label class="form-check-label text-dark text-start" for="conjuge_sacramento_crisma">Crismado</label>
            <input class="form-check-input" type="checkbox" v-model="registros.item.conjuge_sacramento_crisma"
              id="conjuge_sacramento_crisma" true-value="S" false-value="N" />
          </div>

          <div class="form-check mb-3">
            <label class="form-check-label text-dark text-start" for="conjuge_atuante_igreja">Atuante na Igreja</label>
            <input class="form-check-input" type="checkbox" v-model="registros.item.conjuge_atuante_igreja"
              id="conjuge_atuante_igreja" true-value="S" false-value="N" />
          </div>

          <div class="mb-3">
            <label class="form-label text-dark text-start" for="conjuge_pessoa_paroquia"> Paróquia que Frequenta:
            </label>
            <multiselect v-model="registros.item.conjuge_paroquia" :options="paroquia"
              placeholder="Selecione ou pesquise..." :searchable="true" :close-on-select="true"
              id="conjuge_pessoa_paroquia" :show-labels="false" :taggable="true"
              @tag="paroquia.push($event); registros.item.conjuge_paroquia = $event" />
            <small class="form-text text-muted">Você pode selecionar uma paróquia ou digitar uma nova.</small>
          </div>

          <div class="mb-3">
            <label class="form-label text-dark text-start" for="conjuge_pessoa_pastorais_ou_servicos">Pastorais ou
              Serviços:</label>
            <input class="form-control" type="text" v-model="registros.item.conjuge_pastorais_ou_servicos"
              id="conjuge_pessoa_pastorais_ou_servicos" />
          </div>

          <div class="mb-3">
            <label class="form-label text-dark text-start" for="conjuge_pessoa_movimento_pertencente">Movimentos que
              participa:</label>
            <input class="form-control" type="text" v-model="registros.item.conjuge_movimento_pertencente"
              id="conjuge_pessoa_movimento_pertencente" />
          </div>

          <div class="mb-3">
            <label class="form-label text-dark text-start"
              for="conjuge_pessoa_seita_ideologia_religiao">Seita/Ideologia/Outra Religião:</label>
            <input class="form-control" type="text" v-model="registros.item.conjuge_seita_ideologia_religiao"
              id="conjuge_pessoa_seita_ideologia_religiao" />
          </div>

          <div class="mb-3">
            <label class="form-label text-dark text-start" for="conjuge_pessoa_entidade_pertencente">Entidade que
              Frequenta:</label>
            <input class="form-control" type="text" v-model="registros.item.conjuge_entidade_pertencente"
              id="conjuge_pessoa_entidade_pertencente" />
          </div>

          <div class="form-check mb-3">
            <label class="form-check-label text-dark text-start" for="conjuge_pessoa_casamento_civil">Casamento
              Civil</label>
            <input class="form-check-input" type="checkbox" v-model="registros.item.pessoa_casamento_civil"
              id="conjuge_pessoa_casamento_civil" true-value="S" false-value="N" />
          </div>

          <div class="form-check mb-3">
            <label class="form-check-label text-dark text-start" for="conjuge_pessoa_casamento_religioso">Casamento
              Religioso</label>
            <input class="form-check-input" type="checkbox" v-model="registros.item.pessoa_casamento_religioso"
              id="conjuge_pessoa_casamento_religioso" true-value="S" false-value="N" />
          </div>

          <div class="mb-3">
            <label class="form-label text-dark text-start" for="pessoa_paroquia_casamento2">
              Paróquia do Casamento Religioso:
            </label>
            <multiselect v-model="registros.item.pessoa_paroquia_casamento" :options="paroquia"
              placeholder="Selecione uma paróquia ou digite para adicionar nova..." :searchable="true"
              :close-on-select="true" id="pessoa_paroquia_casamento2" :show-labels="true" :taggable="true"
              @tag="paroquia.push($event); registros.item.pessoa_paroquia_casamento = $event" />
            <small class="form-text text-muted">Você pode selecionar uma paróquia ou digitar uma nova.</small>
          </div>
        </div>
      </form>
    </div>

    <!-- Aba Habilidades ECC -->
    <div v-if="activeTab === 'habilidades'">
      <label class="form-label text-dark text-start" for="nome">Selecione as habilidades que você se enquadra {{
        registros.item.pessoa_nome
        }}: </label>
      <form>
        <div class="form-check mb-3">
          <label class="form-check-label text-dark text-start" for="habilidade_cantar">Cantar</label>
          <input class="form-check-input" type="checkbox" v-model="registros.item.habilidade_cantar" :true-value="'306'"
            :false-value="null" />
        </div>

        <div class="form-check mb-3">
          <label class="form-check-label text-dark text-start" for="habilidade_cozinhar">Cozinhar</label>
          <input class="form-check-input" type="checkbox" v-model="registros.item.habilidade_cozinhar"
            id="habilidade_cozinhar" :true-value="'647'" :false-value="null" />
        </div>

        <div class="form-check mb-3">
          <label class="form-check-label text-dark text-start" for="habilidade_eletronica">Eletrônica</label>
          <input class="form-check-input" type="checkbox" v-model="registros.item.habilidade_eletronica"
            id="habilidade_eletronica" :true-value="'6522'" :false-value="null" />
        </div>

        <div class="form-check mb-3">
          <label class="form-check-label text-dark text-start" for="habilidade_falar_em_publico">Falar em
            Público</label>
          <input class="form-check-input" type="checkbox" v-model="registros.item.habilidade_falar_em_publico"
            id="habilidade_falar_em_publico" :true-value="'632'" :false-value="null" />
        </div>

        <div class="form-check mb-3">
          <label class="form-check-label text-dark text-start" for="habilidade_ministro_eucaristia">Ministro
            Exatraordinário da
            Eucaristia</label>
          <input class="form-check-input" type="checkbox" v-model="registros.item.habilidade_ministro_eucaristia"
            id="habilidade_ministro_eucaristia" :true-value="'633'" :false-value="null" />
        </div>

        <div class="form-check mb-3">
          <label class="form-check-label text-dark text-start" for="habilidade_coordenar_grupos">Coordenar
            Grupos</label>
          <input class="form-check-input" type="checkbox" v-model="registros.item.habilidade_coordenar_grupos"
            id="habilidade_coordenar_grupos" :true-value="'649'" :false-value="null" />
        </div>

        <div class="form-check mb-3">
          <label class="form-check-label text-dark text-start" for="habilidade_informatica">Informática</label>
          <input class="form-check-input" type="checkbox" v-model="registros.item.habilidade_informatica"
            id="habilidade_informatica" :true-value="'648'" :false-value="null" />
        </div>

        <div class="form-check mb-3">
          <label class="form-check-label text-dark text-start" for="habilidade_tocar_violao">Tocar Violão</label>
          <input class="form-check-input" type="checkbox" v-model="registros.item.habilidade_tocar_violao"
            id="habilidade_tocar_violao" :true-value="'308'" :false-value="null" />
        </div>

        <div class="form-check mb-3">
          <label class="form-check-label text-dark text-start" for="habilidade_servir_cafe">Servir Café</label>
          <input class="form-check-input" type="checkbox" v-model="registros.item.habilidade_servir_cafe"
            id="habilidade_servir_cafe" :true-value="'634'" :false-value="null" />
        </div>

        <div class="form-check mb-3">
          <label class="form-check-label text-dark text-start" for="habilidade_desenho">Desenhar</label>
          <input class="form-check-input" type="checkbox" v-model="registros.item.habilidade_desenho"
            id="habilidade_desenho" :true-value="'635'" :false-value="null" />
        </div>

        <div class="form-check mb-3">
          <label class="form-check-label text-dark text-start" for="habilidade_limpeza">Limpeza</label>
          <input class="form-check-input" type="checkbox" v-model="registros.item.habilidade_limpeza"
            id="habilidade_limpeza" :true-value="'636'" :false-value="null" />
        </div>

        <div class="form-check mb-3">
          <label class="form-check-label text-dark text-start" for="habilidade_liturgia">Atos Litúrgicos</label>
          <input class="form-check-input" type="checkbox" v-model="registros.item.habilidade_liturgia"
            id="habilidade_liturgia" :true-value="'643'" :false-value="null" />
        </div>

        <div v-if="this.comConjuge.includes(registros.item.pessoa_estado_civil)">
          <label class="form-label text-dark text-start" for="nome">Selecione as habilidades que se enquadra (CÔNJUGE)
            {{
              registros.item.conjuge_nome
            }}:</label>

          <div class="form-check mb-3">
            <label class="form-check-label text-dark text-start" for="conjuge_habilidade_cantar">Cantar</label>
            <input class="form-check-input" type="checkbox" v-model="registros.item.conjuge_habilidade_cantar"
              id="conjuge_habilidade_cantar" :true-value="'306'" :false-value="null" />
          </div>

          <div class="form-check mb-3">
            <label class="form-check-label text-dark text-start" for="conjuge_habilidade_cozinhar">Cozinhar</label>
            <input class="form-check-input" type="checkbox" v-model="registros.item.conjuge_habilidade_cozinhar"
              id="conjuge_habilidade_cozinhar" :true-value="'647'" :false-value="null" />
          </div>

          <div class="form-check mb-3">
            <label class="form-check-label text-dark text-start" for="conjuge_habilidade_eletronica">Eletrônica</label>
            <input class="form-check-input" type="checkbox" v-model="registros.item.conjuge_habilidade_eletronica"
              id="conjuge_habilidade_eletronica" :true-value="'6522'" :false-value="null" />
          </div>

          <div class="form-check mb-3">
            <label class="form-check-label text-dark text-start" for="conjuge_habilidade_falar_em_publico">Falar em
              Público</label>
            <input class="form-check-input" type="checkbox" v-model="registros.item.conjuge_habilidade_falar_em_publico"
              id="conjuge_habilidade_falar_em_publico" :true-value="'632'" :false-value="null" />
          </div>

          <div class="form-check mb-3">
            <label class="form-check-label text-dark text-start" for="conjuge_habilidade_ministro_eucaristia">Ministro
              Exatraordinário da
              Eucaristia</label>
            <input class="form-check-input" type="checkbox"
              v-model="registros.item.conjuge_habilidade_ministro_eucaristia"
              id="conjuge_habilidade_ministro_eucaristia" :true-value="'633'" :false-value="null" />
          </div>

          <div class="form-check mb-3">
            <label class="form-check-label text-dark text-start" for="conjuge_habilidade_coordenar_grupos">Coordenar
              Grupos</label>
            <input class="form-check-input" type="checkbox" v-model="registros.item.conjuge_habilidade_coordenar_grupos"
              id="conjuge_habilidade_coordenar_grupos" :true-value="'649'" :false-value="null" />
          </div>

          <div class="form-check mb-3">
            <label class="form-check-label text-dark text-start"
              for="conjuge_habilidade_informatica">Informática</label>
            <input class="form-check-input" type="checkbox" v-model="registros.item.conjuge_habilidade_informatica"
              id="conjuge_habilidade_informatica" :true-value="'648'" :false-value="null" />
          </div>

          <div class="form-check mb-3">
            <label class="form-check-label text-dark text-start" for="conjuge_habilidade_tocar_violao">Tocar
              Violão</label>
            <input class="form-check-input" type="checkbox" v-model="registros.item.conjuge_habilidade_tocar_violao"
              id="conjuge_habilidade_tocar_violao" :true-value="'308'" :false-value="null" />
          </div>

          <div class="form-check mb-3">
            <label class="form-check-label text-dark text-start" for="conjuge_habilidade_servir_cafe">Servir
              Café</label>
            <input class="form-check-input" type="checkbox" v-model="registros.item.conjuge_habilidade_servir_cafe"
              id="conjuge_habilidade_servir_cafe" :true-value="'634'" :false-value="null" />
          </div>

          <div class="form-check mb-3">
            <label class="form-check-label text-dark text-start" for="conjuge_habilidade_desenho">Desenhar</label>
            <input class="form-check-input" type="checkbox" v-model="registros.item.conjuge_habilidade_desenho"
              id="conjuge_habilidade_desenho" :true-value="'635'" :false-value="null" />
          </div>

          <div class="form-check mb-3">
            <label class="form-check-label text-dark text-start" for="conjuge_habilidade_limpeza">Limpeza</label>
            <input class="form-check-input" type="checkbox" v-model="registros.item.conjuge_habilidade_limpeza"
              id="conjuge_habilidade_limpeza" :true-value="'636'" :false-value="null" />
          </div>

          <div class="form-check mb-3">
            <label class="form-check-label text-dark text-start" for="conjuge_habilidade_liturgia">Atos
              Litúrgicos</label>
            <input class="form-check-input" type="checkbox" v-model="registros.item.conjuge_habilidade_liturgia"
              id="conjuge_habilidade_liturgia" :true-value="'643'" :false-value="null" />
          </div>
        </div>

      </form>
    </div>

    <!-- Aba Autorização -->
    <div v-if="activeTab === 'autorizacao'">
      <form>
        <label class="form-label text-dark text-start" for="nome">Impressão no Quadrante:</label>

        <div class="form-check mb-3">
          <label class="form-check-label text-dark text-start" for="imprimirEmail">Autorizo Imprimir
            Email</label>
          <input class="form-check-input" type="checkbox" v-model="registros.item.pessoa_email_autorizado"
            id="imprimirEmail" true-value="S" false-value="N" />
        </div>

        <div class="form-check mb-3">
          <label class="form-check-label text-dark text-start" for="imprimirCelular">Autorizo Imprimir
            Celular</label>
          <input class="form-check-input" type="checkbox" v-model="registros.item.pessoa_celular_autorizado"
            id="imprimirCelular" true-value="S" false-value="N" />
        </div>

        <div>
          <div class="form-check mb-3" v-if="this.comConjuge.includes(registros.item.pessoa_estado_civil)">
            <label class="form-check-label text-dark text-start" for="imprimirEmailConjuge">Autorizo
              Imprimir
              Email
              Conjuge</label>
            <input class="form-check-input" type="checkbox" v-model="registros.item.conjuge_email_autorizado"
              id="imprimirEmailConjuge" true-value="S" false-value="N" />
          </div>

          <div class="form-check mb-3" v-if="this.comConjuge.includes(registros.item.pessoa_estado_civil)">
            <label class="form-check-label text-dark text-start" for="imprimirCelularConjuge">Autorizo
              Imprimir
              Celular Conjuge</label>
            <input class="form-check-input" type="checkbox" v-model="registros.item.conjuge_celular_autorizado"
              id="imprimirCelularConjuge" true-value="S" false-value="N" />
          </div>
        </div>

        <div class="form-check mb-3">
          <label class="form-check-label text-dark text-start" for="imprimirTelefoneFixo">Autorizo
            Imprimir
            Telefone
            Fixo</label>
          <input class="form-check-input" type="checkbox" v-model="registros.item.tel_residencial_autorizado"
            id="imprimirTelefoneFixo" true-value="S" false-value="N" />
        </div>

      </form>
    </div>

    <!-- Aba Etapas ECC -->
    <div v-if="activeTab === 'etapas'">
      <form>
        <div class="form-check mb-3">
          <label class="form-check-label text-dark text-start" for="fezECC">Deseja fazer o ECC? </label>
          <input class="form-check-input" type="checkbox" v-model="registros.item.fazerECC" id="fezECC" true-value="S"
            false-value="N" @change="limparFezECC" />
        </div>

        <div class="form-check mb-3">
          <label class="form-check-label text-dark text-start" for="fazerECC">Já fez o ECC? </label>
          <input class="form-check-input" type="checkbox" v-model="registros.item.fezECC" id="fazerECC" true-value="S"
            false-value="N" @change="limparFazerECC" />
        </div>

        <div class="fezEtapa" v-if="registros.item.fezECC === 'S'">
          <label class="form-label text-dark text-start" for="nome">Qual Etapa?</label>
          <div class="form-check mb-3">
            <label class="form-check-label text-dark text-start" for="etapa1">1ª Etapa</label>
            <input class="form-check-input" type="checkbox" v-model="registros.item.pessoa_etapa_1" id="etapa1"
              true-value="S" false-value="N" />
          </div>
          <div class="form-check mb-3">
            <label class="form-check-label text-dark text-start" for="etapa2">2ª Etapa</label>
            <input class="form-check-input" type="checkbox" v-model="registros.item.pessoa_etapa_2" id="etapa2"
              true-value="S" false-value="N" />
          </div>
          <div class="form-check mb-3">
            <label class="form-check-label text-dark text-start" for="etapa3">3ª Etapa</label>
            <input class="form-check-input" type="checkbox" v-model="registros.item.pessoa_etapa_3" id="etapa3"
              true-value="S" false-value="N" />
          </div>
        </div>

        <!-- Dados 1ª Etapa -->
        <div v-if="registros.item.pessoa_etapa_1 === 'S'">
          <div class="mb-3">
            <label class="form-label text-dark text-start" for="numeroEtapa1">Número da 1ª
              Etapa:</label>
            <input class="form-control" type="number" v-model="registros.item.pessoa_etapa_1_numero" id="numeroEtapa1"
              true-value="S" false-value="N" />
          </div>

          <div class="mb-3">
            <label class="form-label text-dark text-start" for="dataInicioEtapa1">Data de Início da
              1ª
              Etapa:</label>
            <input class="form-control" type="date" v-model="registros.item.pessoa_etapa_1_data_inicio"
              id="dataInicioEtapa1" true-value="S" false-value="N" />
          </div>

          <div class="mb-3">
            <label class="form-label text-dark text-start" for="localEtapa1">Local da 1ª
              Etapa:</label>
            <input class="form-control" type="text" v-model="registros.item.pessoa_etapa_1_local" id="localEtapa1"
              true-value="S" false-value="N" />
          </div>

          <div class="mb-3">
            <label class="form-label text-dark text-start" for="siglaEtapa1">Paróquia do ECC da 1ª Etapa</label>
            <multiselect v-model="registros.item.pessoa_etapa_1_nucleo_sigla" :options="paroquia"
              placeholder="Selecione ou pesquise..." :searchable="true" :close-on-select="true" id="siglaEtapa1"
              :show-labels="false" :taggable="true"
              @tag="paroquia.push($event); registros.item.pessoa_etapa_1_nucleo_sigla = $event" />
            <small class="form-text text-muted">Você pode selecionar uma paróquia ou digitar uma nova.</small>
          </div>
        </div>

        <!-- Dados 2ª Etapa -->
        <div v-if="registros.item.pessoa_etapa_2 === 'S'">
          <div class="mb-3">
            <label class="form-label text-dark text-start" for="numeroEtapa2">Número da 2ª
              Etapa:</label>
            <input class="form-control" type="number" v-model="registros.item.pessoa_etapa_2_numero" id="numeroEtapa2"
              true-value="S" false-value="N" />
          </div>

          <div class="mb-3">
            <label class="form-label text-dark text-start" for="dataInicioEtapa2">Data de Início da
              2ª
              Etapa:</label>
            <input class="form-control" type="date" v-model="registros.item.pessoa_etapa_2_data_inicio"
              id="dataInicioEtapa2" true-value="S" false-value="N" />
          </div>

          <div class="mb-3">
            <label class="form-label text-dark text-start" for="localEtapa1">Local da 2ª
              Etapa:</label>
            <input class="form-control" type="text" v-model="registros.item.pessoa_etapa_2_local" id="localEtapa2"
              true-value="S" false-value="N" />
          </div>

          <div class="mb-3">
            <label class="form-label text-dark text-start" for="siglaEtapa2">Paróquia do ECC da 2ª Etapa</label>

            <multiselect v-model="registros.item.pessoa_etapa_2_nucleo_sigla" :options="paroquia"
              placeholder="Selecione ou pesquise..." :searchable="true" :close-on-select="true" id="siglaEtapa2"
              :show-labels="false" :taggable="true"
              @tag="paroquia.push($event); registros.item.pessoa_etapa_2_nucleo_sigla = $event" />
            <small class="form-text text-muted">Você pode selecionar uma paróquia ou digitar uma nova.</small>
          </div>
        </div>

        <!-- Dados 3ª Etapa -->
        <div v-if="registros.item.pessoa_etapa_3 === 'S'">
          <div class="mb-3">
            <label class="form-label text-dark text-start" for="numeroEtapa3">Número da 3ª Etapa:</label>
            <input class="form-control" type="number" v-model="registros.item.pessoa_etapa_3_numero" id="numeroEtapa3"
              true-value="S" false-value="N" />
          </div>

          <div class="mb-3">
            <label class="form-label text-dark text-start" for="dataInicioEtapa3">Data de Início da
              3ª Etapa:</label>
            <input class="form-control" type="date" v-model="registros.item.pessoa_etapa_3_data_inicio"
              id="dataInicioEtapa3" true-value="S" false-value="N" />
          </div>

          <div class="mb-3">
            <label class="form-label text-dark text-start" for="localEtapa1">Local da 3ª Etapa:</label>
            <input class="form-control" type="text" v-model="registros.item.pessoa_etapa_3_local" id="localEtapa3"
              true-value="S" false-value="N" />
          </div>

          <div class="mb-3">
            <label class="form-label text-dark text-start" for="siglaEtapa3">Paróquia do ECC da 3ª Etapa</label>
            <multiselect v-model="registros.item.pessoa_etapa_3_nucleo_sigla" :options="paroquia"
              placeholder="Selecione ou pesquise..." :searchable="true" :close-on-select="true" id="siglaEtapa3"
              :show-labels="false" :taggable="true"
              @tag="paroquia.push($event); registros.item.pessoa_etapa_3_nucleo_sigla = $event" />
            <small class="form-text text-muted">Você pode selecionar uma paróquia ou digitar uma nova.</small>
          </div>
        </div>
      </form>
    </div>

    <!-- Aba Equipe gostaria -->
    <div v-if="activeTab === 'equipes_trabalho'">
      <form>
        <label class="form-label text-dark text-start" for="nome">
          Selecione as equipes que você(s) se enquadra(m) {{ registros.item.pessoa_nome }}
          <span v-if="this.comConjuge.includes(registros.item.pessoa_estado_civil)"> e {{
            registros.item.conjuge_nome
            }}</span>:
        </label>

        <div class="form-check mb-3">
          <label class="form-check-label text-dark text-start" for="equipe_secretaria">Secretaria</label>
          <input class="form-check-input" type="checkbox" v-model="registros.item.equipe_secretaria"
            id="equipe_secretaria" :true-value="'658'" :false-value="null" />
        </div>

        <div class="form-check mb-3">
          <label class="form-check-label text-dark text-start" for="equipe_cozinha">Cozinha</label>
          <input class="form-check-input" type="checkbox" v-model="registros.item.equipe_cozinha" id="equipe_cozinha"
            :true-value="'659'" :false-value="null" />
        </div>

        <div class="form-check mb-3">
          <label class="form-check-label text-dark text-start" for="equipe_compras">Compras</label>
          <input class="form-check-input" type="checkbox" v-model="registros.item.equipe_compras" id="equipe_compras"
            :true-value="'660'" :false-value="null" />
        </div>

        <div class="form-check mb-3">
          <label class="form-check-label text-dark text-start" for="equipe_visitacao">Visitação</label>
          <input class="form-check-input" type="checkbox" v-model="registros.item.equipe_visitacao"
            id="equipe_visitacao" :true-value="'661'" :false-value="null" />
        </div>

        <div class="form-check mb-3">
          <label class="form-check-label text-dark text-start" for="equipe_acolhida">Acolhida</label>
          <input class="form-check-input" type="checkbox" v-model="registros.item.equipe_acolhida" id="equipe_acolhida"
            :true-value="'662'" :false-value="null" />
        </div>

        <div class="form-check mb-3">
          <label class="form-check-label text-dark text-start" for="equipe_cafe_minimercado">Café e Minimercado</label>
          <input class="form-check-input" type="checkbox" v-model="registros.item.equipe_cafe_minimercado"
            id="equipe_cafe_minimercado" :true-value="'663'" :false-value="null" />
        </div>

        <div class="form-check mb-3">
          <label class="form-check-label text-dark text-start" for="equipe_liturgia_vigilia">Liturgia e Vigília</label>
          <input class="form-check-input" type="checkbox" v-model="registros.item.equipe_liturgia_vigilia"
            id="equipe_liturgia_vigilia" :true-value="'664'" :false-value="null" />
        </div>

        <div class="form-check mb-3">
          <label class="form-check-label text-dark text-start" for="equipe_ordem_limpeza">Ordem e Limpeza</label>
          <input class="form-check-input" type="checkbox" v-model="registros.item.equipe_ordem_limpeza"
            id="equipe_ordem_limpeza" :true-value="'665'" :false-value="null" />
        </div>

        <div class="form-check mb-3">
          <label class="form-check-label text-dark text-start" for="equipe_palestras">Palestras</label>
          <input class="form-check-input" type="checkbox" v-model="registros.item.equipe_palestras"
            id="equipe_palestras" :true-value="'720'" :false-value="null" />
        </div>

        <div class="form-check mb-3">
          <label class="form-check-label text-dark text-start" for="equipe_sala_canto">Equipe de Sala - Canto</label>
          <input class="form-check-input" type="checkbox" v-model="registros.item.equipe_sala_canto"
            id="equipe_sala_canto" :true-value="'721'" :false-value="null" />
        </div>

        <div class="form-check mb-3">
          <label class="form-check-label text-dark text-start" for="equipe_boa_vontade">Boa Vontade</label>
          <input class="form-check-input" type="checkbox" v-model="registros.item.equipe_boa_vontade"
            id="equipe_boa_vontade" :true-value="'722'" :false-value="null" />
        </div>

      </form>
    </div>

    <!-- Aba Equipe que Trabalhou -->
    <div v-if="activeTab === 'equipes_que_trabalhou'">
      <form>
        <ul class="nav nav-tabs">
          <li class="nav-item" v-for="tabEt in tabsEtapa" :key="`${tabEt.id}_${tabEt.label}`">
            <button type="button" class="nav-link" :class="{ active: etapaTab === tabEt.id }"
              @click="mudarAbaEtapa(tabEt.id)" v-if="tabEt.libera">
              {{ tabEt.label }}
            </button>
          </li>
        </ul>
        <br>
        <EquipeTrabalho :etapa="etapaTab" :registros="registros.item" @atualizarRegistros="receberRegistros"
          :pessoa-nome="registros.item.pessoa_nome" :conjuge-nome="registros.item.conjuge_nome"
          :estado-civil="registros.item.pessoa_estado_civil" />
      </form>
    </div>

    <div class="text-end">
      <button v-if="deveExibirBotao" type="button" class="btn btn-primary"
        @click="isUltimaTabLiberada ? finalizarQuestionario() : salvarEAvancar()"
        @keypress.enter="isUltimaTabLiberada ? finalizarQuestionario() : salvarEAvancar()">
        {{ isUltimaTabLiberada ? 'Finalizar Questionário' : 'Avançar' }}
      </button>
    </div>
  </div>
</template>

<script>
import dominioService from '@/services/dominioService';
import paroquiaService from '@/services/paroquiaService';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import EquipeTrabalho from '@/views/EquipeTrabalho.vue';
import heic2any from 'heic2any';
// import {format, isDate} from 'date-fns';
// import Datepicker from 'vue3-datepicker';
// import ScrollDatePicker from "../components/ScrollDatePicker.vue";

export default {
  name: 'Form',
  components: {
    Multiselect,
    EquipeTrabalho,
    // Datepicker,
    // ScrollDatePicker
  },
  data() {
    return {
      token: {},
      cpfData: {},
      user: {},
      API_URL: 'https://app.seg.inf.br/novo/api/tela/',
      intervalId: null,
      registrosOriginais: {},
      estadoCivil: [],
      profissao: [],
      religiao: [],
      paroquia: [],
      sexo: [],
      habilidades: [],
      habilidadesSelecionadas: [],
      equipes: [],
      equipesSelecionadas: [],
      comConjuge: ['CASADO (A)', 'UNIÃO ESTÁVEL', 'SEGUNDA UNIÃO'],
      activeTab: 'cadastro',
      tabs: [
        { id: 'cadastro', label: 'Cadastro', libera: true },
        { id: 'foto', label: 'Foto', libera: true },
        { id: 'endereco', label: 'Endereço', libera: true },
        { id: 'religiao', label: 'Religião', libera: true },
        { id: 'habilidades', label: 'Habilidades', libera: true },
        { id: 'autorizacao', label: 'Autorização', libera: true },
        { id: 'etapas', label: 'Etapas ECC', libera: true },
        { id: 'equipes_trabalho', label: 'Equipes que Gostaria', libera: false },
        { id: 'equipes_que_trabalhou', label: 'Equipes que Trabalhou', libera: false },
      ],
      etapaTab: 'etapa1',
      tabsEtapa: [
        { id: 'etapa1', label: 'Etapa 1', libera: false },
        { id: 'etapa2', label: 'Etapa 2', libera: false },
        { id: 'etapa3', label: 'Etapa 3', libera: false },
      ],
      registros: {
        cpf_nao_encontrado: false,
        cpf_validado: false,
        item: {
          pessoa_sacramento_batismo: 'N',
          pessoa_sacramento_eucaristia: 'N',
          pessoa_sacramento_crisma: 'N',
          pessoa_atuante_igreja: 'N',
          conjuge_sacramento_batismo: 'N',
          conjuge_sacramento_eucaristia: 'N',
          conjuge_sacramento_crisma: 'N',
          conjuge_atuante_igreja: 'N',
          pessoa_casamento_civil: 'N',
          pessoa_casamento_religioso: 'N',
          pessoa_email_autorizado: 'N',
          pessoa_celular_autorizado: 'N',
          conjuge_email_autorizado: 'N',
          conjuge_celular_autorizado: 'N',
          tel_residencial_autorizado: 'N',
          habilidade_cantar: 'N',
          habilidade_cozinhar: 'N',
          habilidade_eletronica: 'N',
          habilidade_falar_em_publico: 'N',
          habilidade_ministro_eucaristia: 'N',
          habilidade_coordenar_grupos: 'N',
          habilidade_informatica: 'N',
          habilidade_tocar_violao: 'N',
          habilidade_servir_cafe: 'N',
          habilidade_desenho: 'N',
          habilidade_limpeza: 'N',
          habilidade_liturgia: 'N',
          conjuge_habilidade_cantar: 'N',
          conjuge_habilidade_cozinhar: 'N',
          conjuge_habilidade_eletronica: 'N',
          conjuge_habilidade_falar_em_publico: 'N',
          conjuge_habilidade_ministro_eucaristia: 'N',
          conjuge_habilidade_coordenar_grupos: 'N',
          conjuge_habilidade_informatica: 'N',
          conjuge_habilidade_tocar_violao: 'N',
          conjuge_habilidade_servir_cafe: 'N',
          conjuge_habilidade_desenho: 'N',
          conjuge_habilidade_limpeza: 'N',
          conjuge_habilidade_liturgia: 'N',
          pessoa_nome: '',
          pessoa_nascimento: '',
          pessoa_cpf: '',
          pessoa_celular: '',
          pessoa_email: '',
          pessoa_sexo: '',
          pessoa_estado_civil: '',
          conjuge_nome: '',
          conjuge_nascimento: '',
          conjuge_cpf: '',
          conjuge_celular: '',
          conjuge_email: '',
          conjuge_sexo: '',
          pessoa_cep: '',
          pessoa_endereco: '',
          pessoa_bairro: '',
          pessoa_cidade: '',
          pessoa_uf: '',
          pessoa_complemento: '',
          equipe_secretaria: '',
          equipe_cozinha: '',
          equipe_compras: '',
          equipe_visitacao: '',
          equipe_acolhida: '',
          equipe_cafe_minimercado: '',
          equipe_liturgia_vigilia: '',
          equipe_ordem_limpeza: '',
          equipe_palestras: '',
          equipe_equipe_sala_canto: '',
          equipe_boa_vontade: '',
          pessoa_perfil_habilidade_id: "",
          pessoa_perfil_equipe_indicada_id: "",
          fezECC: '',
          pessoa_etapa_1: '',
          pessoa_etapa_2: '',
          pessoa_etapa_3: '',
          pessoa_etapa_1_nucleo_sigla: '',
          pessoa_etapa_2_nucleo_sigla: '',
          pessoa_etapa_3_nucleo_sigla: '',
          pessoa_etapa_1_numero: '',
          pessoa_etapa_2_numero: '',
          pessoa_etapa_3_numero: '',
          pessoa_etapa_1_data_inicio: '',
          pessoa_etapa_2_data_inicio: '',
          pessoa_etapa_3_data_inicio: '',
          pessoa_etapa_1_local: '',
          pessoa_etapa_2_local: '',
          pessoa_etapa_3_local: '',
          etapa1_funcoes_sala_casal_apresentador: '',
          etapa1_funcoes_sala_casal_boa_vontade: '',
          etapa1_funcoes_sala_canto: '',
          etapa1_funcoes_sala_som_projecao: '',
          etapa1_funcoes_sala_recepcao_palestrantes: '',
          etapa2_funcoes_sala_casal_apresentador: '',
          etapa2_funcoes_sala_casal_boa_vontade: '',
          etapa2_funcoes_sala_canto: '',
          etapa2_funcoes_sala_recepcao_palestrantes: '',
          etapa2_funcoes_sala_som_projecao: '',
          etapa3_funcoes_sala_casal_apresentador: '',
          etapa3_funcoes_sala_casal_boa_vontade: '',
          etapa3_funcoes_sala_som_projecao: '',
          etapa3_funcoes_sala_canto: ''
        },
        info: this.$route.state?.info || {},
      },
      erros: {},
      debounceTimeout: null,
      camposBloqueados: false,
      etapaModalAberta: null,
      pessoaNascimentoFormatada: '',
    };
  },
  created() {
    this.carregarDominio();
    this.listarDados();
    this.getToken();
  },
  watch: {
    'registros.item.pessoa_cep'(newCep) {
      clearTimeout(this.debounceTimeout);

      const cepStr = newCep || ''; // se for null, vira string vazia
      const cepSemMascara = cepStr.replace(/\D/g, '');

      if (cepSemMascara.length === 8) {
        this.debounceTimeout = setTimeout(() => {
          this.getCep();
        }, 250);
      } else if (cepSemMascara.length === 0) {
        this.registros.item.pessoa_endereco = '';
        this.registros.item.pessoa_bairro = '';
        this.registros.item.pessoa_cidade = '';
        this.registros.item.pessoa_uf = '';
        this.camposBloqueados = false; // desbloqueia
      }
    },
    'registros.item.pessoa_etapa_1'(val) {
      if (val === 'S') {
        this.tabsEtapa[0].libera = true;
      } else {
        this.tabsEtapa[0].libera = false;
      }
    },
    'registros.item.pessoa_etapa_2'(val) {
      if (val === 'S') {
        this.tabsEtapa[1].libera = true;
      } else {
        this.tabsEtapa[1].libera = false;
      }
    },
    'registros.item.pessoa_etapa_3'(val) {
      if (val === 'S') {
        this.tabsEtapa[2].libera = true;
      } else {
        this.tabsEtapa[2].libera = false;
      }
    },
    'registros.item.pessoa_nascimento'(novaData) {
      if (novaData instanceof Date) {
        this.pessoaNascimentoFormatada = format(novaData, 'yyyy-MM-dd');
      } else {
        this.pessoaNascimentoFormatada = '';
      }
    },
    'registros.cpf_nao_encontrado': function (val) {
      if (val) {
        setTimeout(() => {
          this.registros.cpf_nao_encontrado = false
        }, 10000);
      }
    },
  },
  mounted() {
    this.intervalId = setInterval(() => {
      if (!this.registros.item.pessoa_nome || !this.registros.item.pessoa_cpf) {
        console.log('Nome e CPF são obrigatórios para salvar.');
        return;
      }

      if (this.houveAlteracoes() && Object.keys(this.registrosOriginais).length > 0) {
        console.log('Alteração detectada. Registro será salvo.');
        return this.salvar(false, false);
      }
    }, 60000);
  },
  beforeUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
  computed: {
    ultimaEtapaLiberada() {
      const liberadas = this.tabsEtapa.filter(tab => tab.libera);
      return liberadas.length ? liberadas[liberadas.length - 1].id : null;
    },
    equipesQueTrabalhouLiberada() {
      return this.tabs.find(tab => tab.id === 'equipes_que_trabalhou')?.libera === true;
    },
    tabsLiberadas() {
      return this.tabs.filter(tab => tab.libera);
    },
    isUltimaTabLiberada() {
      const idx = this.tabsLiberadas.findIndex(tab => tab.id === this.activeTab);
      return idx === this.tabsLiberadas.length - 1;
    },
    deveExibirBotao() {
      if (!this.equipesQueTrabalhouLiberada) {
        return true;
      }

      if (this.activeTab === 'equipes_que_trabalhou') {
        const etapa = this.tabsEtapa.find(et => et.id === this.etapaTab);
        return etapa?.libera === true;
      }

      return true;
    },
  },
  methods: {
    // PADRAO
    async salvar(alertar = false, tem_id = false) {
      const valido = this.validarCamposObrigatorios(alertar);
      if (!valido) return false;

      if (this.registros.item.pessoa_estado_civil === 'Solteiro') {
        this.registros.item.conjuge_nome = '';
        this.registros.item.conjuge_apelido = '';
        this.registros.item.conjuge_nascimento = '';
        this.registros.item.pessoa_foto_casal = '';
        this.registros.item.conjuge_profissao = '';
        this.registros.item.conjuge_cpf = '';
        this.registros.item.apelido_casal = '';
        this.registros.item.pessoa_data_casamento = '';
        this.registros.item.conjuge_email = '';
        this.registros.item.conjuge_celular = '';
        this.registros.item.conjuge_sacramento_batismo = '';
        this.registros.item.conjuge_sacramento_eucaristia = ''
        this.registros.item.conjuge_sacramento_crisma = '';
        this.registros.item.conjuge_casamento_civil = '';
        this.registros.item.conjuge_atuante_igreja = '';
        this.registros.item.conjuge_movimento_pertencente = '';
        this.registros.item.conjuge_pastorais_ou_servicos = '';
        this.registros.item.conjuge_seita_ideologia_religiao = '';
        this.registros.item.conjuge_entidade_pertencente = '';
      }

      this.getIP();

      this.registros.item.resposta_id = this.gerarIdDezDigitos();

      await this.validarPessoaImportacao();

      // if (this.registros.item.fazerECC === 'S') {
      //   this.registros.item.origem_tipo_dom = 5742;
      // }
      if (this.pessoaNascimentoFormatada) {
        this.registros.item.pessoa_nascimento = this.pessoaNascimentoFormatada
      }

      // if (tem_id) {
      //   this.registros.item.id = null;
      // }

      this.ajustarGeneroPrincipal();

      this.registros.item.formulario_id = 145;

      let query;
      query = `DECLARE
                  v_pessoas sge_pessoa_importacao%rowtype;
              BEGIN
                  v_pessoas.id := NVL(to_number('${this.registros.item?.id ?? ''}'), sq_sge_pessoa_importacao.nextval);
                  v_pessoas.origem_id := to_number('${this.registros.item?.origem_id ?? ''}');
                  v_pessoas.origem_tipo_dom := to_number(5738);
                  v_pessoas.ativo := 'S';
                  v_pessoas.nome := UPPER(TRIM('${this.registros.item?.pessoa_nome ?? ''}'));
                  v_pessoas.conjuge_nome := UPPER(TRIM('${this.registros.item?.conjuge_nome ?? ''}'));
                  v_pessoas.apelido := UPPER(TRIM('${this.registros.item?.pessoa_apelido ?? ''}'));
                  v_pessoas.conjuge_apelido := UPPER(TRIM('${this.registros.item?.conjuge_apelido ?? ''}'));
                  v_pessoas.data_nascimento := to_date('${this.registros.item?.pessoa_nascimento || '1111-11-11'}', 'yyyy-mm-dd');
                  v_pessoas.data_nascimento_conjuge := to_date('${this.registros.item.conjuge_nascimento || '1111-11-11'}', 'yyyy-mm-dd');
                  v_pessoas.ip_maquina_usuario := '${this.registros.item?.ip_maquina_usuario ?? ''}';
                  v_pessoas.formulario_id := to_number('${this.registros.item?.formulario_id ?? ''}');
                  v_pessoas.resposta_id := '${this.registros.item?.resposta_id ?? ''}';
                  v_pessoas.sexo := '${this.registros.item?.pessoa_sexo ?? ''}';
                  v_pessoas.sexo_conjuge := '${this.registros.item?.conjuge_sexo ?? ''}';
                  v_pessoas.foto := '${this.registros.item?.pessoa_foto ?? ''}';
                  v_pessoas.foto_casal := '${this.registros.item?.pessoa_foto_casal ?? ''}';
                  v_pessoas.foto_conjuge := '${this.registros.item?.foto_conjuge ?? ''}';
                  v_pessoas.paroquia := '${this.registros.item?.pessoa_paroquia ?? ''}';
                  v_pessoas.conjuge_paroquia := '${this.registros.item?.conjuge_paroquia ?? ''}';
                  v_pessoas.religiao := '${this.registros.item?.pessoa_religiao ?? ''}';
                  v_pessoas.conjuge_religiao := '${this.registros.item?.conjuge_religiao ?? ''}';
                  v_pessoas.profissao := '${this.registros.item?.pessoa_profissao ?? ''}';
                  v_pessoas.conjuge_profissao := '${this.registros.item?.conjuge_profissao ?? ''}';
                  v_pessoas.cpf := TRANSLATE('${this.registros.item?.pessoa_cpf ?? ''}', ' .-', ' ');
                  v_pessoas.conjuge_cpf := TRANSLATE('${this.registros.item?.conjuge_cpf ?? ''}', ' .-', ' ');
                  v_pessoas.data_casamento := to_date('${this.registros.item.pessoa_data_casamento || '1111-11-11'}', 'yyyy-mm-dd');
                  v_pessoas.apelido_casal := '${this.registros.item?.apelido_casal ?? ''}';
                  v_pessoas.estado_civil := '${this.registros.item?.pessoa_estado_civil ?? ''}';
                  v_pessoas.email := '${this.registros.item?.pessoa_email ?? ''}';
                  v_pessoas.celular := REPLACE(TRANSLATE('${this.registros.item?.pessoa_celular ?? ''}', '()-', ' '), ' ');
                  v_pessoas.email_conjuge := '${this.registros.item?.conjuge_email ?? ''}';
                  v_pessoas.celular_conjuge := REPLACE(TRANSLATE('${this.registros.item?.conjuge_celular ?? ''}', '()-', ' '), ' ');
                  v_pessoas.telefone_residencial := REPLACE(TRANSLATE('${this.registros.item?.pessoa_telefone_residencial ?? ''}', '()-', ' '), ' ');
                  v_pessoas.endereco := '${this.registros.item?.pessoa_endereco ?? ''}';
                  v_pessoas.complemento := '${this.registros.item?.pessoa_complemento ?? ''}';
                  v_pessoas.bairro := '${this.registros.item?.pessoa_bairro ?? ''}';
                  v_pessoas.cidade := '${this.registros.item?.pessoa_cidade ?? ''}';
                  v_pessoas.cep := TRANSLATE('${this.registros.item?.pessoa_cep ?? ''}', ' -', ' ');
                  v_pessoas.uf := '${this.registros.item?.pessoa_uf ?? ''}';
                  v_pessoas.data_inclusao := SYSDATE;
                  v_pessoas.etapa_1_fez := '${this.registros.item.pessoa_etapa_1 || 'N'}';
                  v_pessoas.fez_ecc := '${this.registros.item.fezECC || 'N'}';
                  v_pessoas.fazer_ecc := '${this.registros.item.fazerECC || 'N'}';
                  v_pessoas.etapa_1_numero := to_number('${this.registros.item.pessoa_etapa_1_numero || 0}');
                  v_pessoas.etapa_1_data_inicio := to_date('${this.registros.item.pessoa_etapa_1_data_inicio || '1111-11-11'}', 'yyyy-mm-dd');
                  v_pessoas.etapa_1_local := '${this.registros.item?.pessoa_etapa_1_local ?? ''}';
                  v_pessoas.etapa_1_nucleo_sigla := '${this.registros.item?.pessoa_etapa_1_nucleo_sigla ?? ''}';
                  v_pessoas.etapa_2_fez := '${this.registros.item.pessoa_etapa_2 || 'N'}';
                  v_pessoas.etapa_2_numero := to_number('${this.registros.item.pessoa_etapa_2_numero || 0}');
                  v_pessoas.etapa_2_data_inicio := to_date('${this.registros.item.pessoa_etapa_2_data_inicio || '1111-11-11'}', 'yyyy-mm-dd');
                  v_pessoas.etapa_2_local := '${this.registros.item?.pessoa_etapa_2_local ?? ''}';
                  v_pessoas.etapa_2_nucleo_sigla := '${this.registros.item?.pessoa_etapa_2_nucleo_sigla ?? ''}';
                  v_pessoas.etapa_3_fez := '${this.registros.item.pessoa_etapa_3 || 'N'}';
                  v_pessoas.etapa_3_numero := to_number('${this.registros.item.pessoa_etapa_3_numero || 0}');
                  v_pessoas.etapa_3_data_inicio := to_date('${this.registros.item.pessoa_etapa_3_data_inicio || '1111-11-11'}', 'yyyy-mm-dd');
                  v_pessoas.etapa_3_local := '${this.registros.item?.pessoa_etapa_3_local ?? ''}';
                  v_pessoas.etapa_3_nucleo_sigla := '${this.registros.item?.pessoa_etapa_3_nucleo_sigla ?? ''}';
                  v_pessoas.sacramento_batismo := '${this.registros.item.pessoa_sacramento_batismo || 'N'}';
                  v_pessoas.sacramento_eucaristia := '${this.registros.item.pessoa_sacramento_eucaristia || 'N'}';
                  v_pessoas.sacramento_crisma := '${this.registros.item.pessoa_sacramento_crisma || 'N'}';
                  v_pessoas.casamento_civil := '${this.registros.item.pessoa_casamento_civil || 'N'}';
                  v_pessoas.casamento_religioso := '${this.registros.item.pessoa_casamento_religioso || 'N'}';
                  v_pessoas.paroquia_casamento := '${this.registros.item.pessoa_paroquia_casamento ?? ''}';
                  v_pessoas.atuante_igreja := '${this.registros.item.pessoa_atuante_igreja || 'N'}';
                  v_pessoas.movimento_pertencente := '${this.registros.item.pessoa_movimento_pertencente ?? ''}';
                  v_pessoas.pastorais_ou_servicos := '${this.registros.item.pessoa_pastorais_ou_servicos ?? ''}';
                  v_pessoas.seita_ideologia_religiao := '${this.registros.item.pessoa_seita_ideologia_religiao ?? ''}';
                  v_pessoas.entidade_pertencente := '${this.registros.item.pessoa_entidade_pertencente ?? ''}';
                  v_pessoas.conjuge_sacramento_batismo := '${this.registros.item.conjuge_sacramento_batismo || 'N'}';
                  v_pessoas.conjuge_sacramento_eucaristia := '${this.registros.item.conjuge_sacramento_eucaristia || 'N'}';
                  v_pessoas.conjuge_sacramento_crisma := '${this.registros.item.conjuge_sacramento_crisma || 'N'}';
                  v_pessoas.conjuge_casamento_civil := '${this.registros.item.conjuge_casamento_civil || 'N'}';
                  v_pessoas.conjuge_atuante_igreja := '${this.registros.item.conjuge_atuante_igreja || 'N'}';
                  v_pessoas.conjuge_movimento_pertencente := '${this.registros.item.conjuge_movimento_pertencente ?? ''}';
                  v_pessoas.conjuge_pastorais_ou_servicos := '${this.registros.item.conjuge_pastorais_ou_servicos ?? ''}';
                  v_pessoas.conjuge_seita_ideologia_religiao := '${this.registros.item.conjuge_seita_ideologia_religiao ?? ''}';
                  v_pessoas.conjuge_entidade_pertencente := '${this.registros.item.conjuge_entidade_pertencente ?? ''}';
                  v_pessoas.relatorio_email := '${this.registros.item.pessoa_email_autorizado || 'N'}';
                  v_pessoas.relatorio_celular := '${this.registros.item.pessoa_celular_autorizado || 'N'}';
                  v_pessoas.relatorio_email_conjuge := '${this.registros.item.conjuge_email_autorizado || 'N'}';
                  v_pessoas.relatorio_celular_conjuge := '${this.registros.item.conjuge_celular_autorizado || 'N'}';
                  v_pessoas.relatorio_tel_residencial := '${this.registros.item.tel_residencial_autorizado || 'N'}';
                  v_pessoas.habilidade_cantar:='${this.registros.item.habilidade_cantar || 'N'}';
                  v_pessoas.habilidade_cozinhar:='${this.registros.item.habilidade_cozinhar || 'N'}';
                  v_pessoas.habilidade_eletronica:='${this.registros.item.habilidade_eletronica || 'N'}';
                  v_pessoas.habilidade_falar_em_publico:='${this.registros.item.habilidade_falar_em_publico || 'N'}';
                  v_pessoas.habilidade_ministro_eucaristia:='${this.registros.item.habilidade_ministro_eucaristia || 'N'}';
                  v_pessoas.habilidade_coordenar_grupos:='${this.registros.item.habilidade_coordenar_grupos || 'N'}';
                  v_pessoas.habilidade_informatica:='${this.registros.item.habilidade_informatica || 'N'}';
                  v_pessoas.habilidade_tocar_violao:='${this.registros.item.habilidade_tocar_violao || 'N'}';
                  v_pessoas.habilidade_servir_cafe:='${this.registros.item.habilidade_servir_cafe || 'N'}';
                  v_pessoas.habilidade_desenho:='${this.registros.item.habilidade_desenho || 'N'}';
                  v_pessoas.habilidade_limpeza:='${this.registros.item.habilidade_limpeza || 'N'}';
                  v_pessoas.habilidade_liturgia:='${this.registros.item.habilidade_liturgia || 'N'}';
                  v_pessoas.equipe_secretaria:='${this.registros.item.equipe_secretaria || 'N'}';
                  v_pessoas.equipe_cozinha:='${this.registros.item.equipe_cozinha || 'N'}';
                  v_pessoas.equipe_compras:='${this.registros.item.equipe_compras || 'N'}';
                  v_pessoas.equipe_visitacao:='${this.registros.item.equipe_visitacao || 'N'}';
                  v_pessoas.equipe_acolhida:='${this.registros.item.equipe_acolhida || 'N'}';
                  v_pessoas.equipe_cafe_minimercado:='${this.registros.item.equipe_cafe_minimercado || 'N'}';
                  v_pessoas.equipe_liturgia_vigilia:='${this.registros.item.equipe_liturgia_vigilia || 'N'}';
                  v_pessoas.equipe_ordem_limpeza:='${this.registros.item.equipe_ordem_limpeza || 'N'}';
                  v_pessoas.equipe_palestras:='${this.registros.item.equipe_palestras || 'N'}';
                  v_pessoas.equipe_sala_canto:='${this.registros.item.equipe_sala_canto || 'N'}';
                  v_pessoas.equipe_boa_vontade:='${this.registros.item.equipe_boa_vontade || 'N'}';
                  v_pessoas.conjuge_habilidade_cantar:='${this.registros.item.conjuge_habilidade_cantar || 'N'}';
                  v_pessoas.conjuge_habilidade_cozinhar:='${this.registros.item.conjuge_habilidade_cozinhar || 'N'}';
                  v_pessoas.conjuge_habilidade_eletronica:='${this.registros.item.conjuge_habilidade_eletronica || 'N'}';
                  v_pessoas.conjuge_habilidade_falar_em_publico:='${this.registros.item.conjuge_habilidade_falar_em_publico || 'N'}';
                  v_pessoas.conjuge_habilidade_ministro_eucaristia:='${this.registros.item.conjuge_habilidade_ministro_eucaristia || 'N'}';
                  v_pessoas.conjuge_habilidade_coordenar_grupos:='${this.registros.item.conjuge_habilidade_coordenar_grupos || 'N'}';
                  v_pessoas.conjuge_habilidade_informatica:='${this.registros.item.conjuge_habilidade_informatica || 'N'}';
                  v_pessoas.conjuge_habilidade_tocar_violao:='${this.registros.item.conjuge_habilidade_tocar_violao || 'N'}';
                  v_pessoas.conjuge_habilidade_servir_cafe:='${this.registros.item.conjuge_habilidade_servir_cafe || 'N'}';
                  v_pessoas.conjuge_habilidade_desenho:='${this.registros.item.conjuge_habilidade_desenho || 'N'}';
                  v_pessoas.conjuge_habilidade_limpeza:='${this.registros.item.conjuge_habilidade_limpeza || 'N'}';
                  v_pessoas.conjuge_habilidade_liturgia:='${this.registros.item.conjuge_habilidade_liturgia || 'N'}';
                  v_pessoas.conjuge_equipe_secretaria:='${this.registros.item.conjuge_equipe_secretaria || 'N'}';
                  v_pessoas.conjuge_equipe_cozinha:='${this.registros.item.conjuge_equipe_cozinha || 'N'}';
                  v_pessoas.conjuge_equipe_compras:='${this.registros.item.conjuge_equipe_compras || 'N'}';
                  v_pessoas.conjuge_equipe_boa_vontade:='${this.registros.item.conjuge_equipe_boa_vontade || 'N'}';
                  v_pessoas.conjuge_equipe_visitacao:='${this.registros.item.conjuge_equipe_visitacao || 'N'}';
                  v_pessoas.conjuge_equipe_acolhida:='${this.registros.item.conjuge_equipe_acolhida || 'N'}';
                  v_pessoas.conjuge_equipe_cafe_minimercado:='${this.registros.item.conjuge_equipe_cafe_minimercado || 'N'}';
                  v_pessoas.conjuge_equipe_liturgia_vigilia:='${this.registros.item.conjuge_equipe_liturgia_vigilia || 'N'}';
                  v_pessoas.conjuge_equipe_ordem_limpeza:='${this.registros.item.conjuge_equipe_ordem_limpeza || 'N'}';
                  v_pessoas.conjuge_equipe_palestras:='${this.registros.item.conjuge_equipe_palestras || 'N'}';
                  v_pessoas.conjuge_equipe_sala_canto:='${this.registros.item.conjuge_equipe_sala_canto || 'N'}';
                  v_pessoas.etapa1_funcoes_sala_casal_apresentador:='${this.registros.item.etapa1_funcoes_sala_casal_apresentador || 'N'}';
                  v_pessoas.etapa1_funcoes_sala_casal_boa_vontade:='${this.registros.item.etapa1_funcoes_sala_casal_boa_vontade || 'N'}';
                  v_pessoas.etapa1_funcoes_sala_canto:='${this.registros.item.etapa1_funcoes_sala_canto || 'N'}';
                  v_pessoas.etapa1_funcoes_sala_recepcao_palestrantes:='${this.registros.item.etapa1_funcoes_sala_recepcao_palestrantes || 'N'}';
                  v_pessoas.etapa1_funcoes_sala_som_projecao:='${this.registros.item.etapa1_funcoes_sala_som_projecao || 'N'}';
                  v_pessoas.etapa1_equipe_dirigente_casal_fichas:='${this.registros.item.etapa1_equipe_dirigente_casal_fichas || 'N'}';
                  v_pessoas.etapa1_equipe_dirigente_casal_finanças:='${this.registros.item.etapa1_equipe_dirigente_casal_finanças || 'N'}';
                  v_pessoas.etapa1_equipe_dirigente_casal_montagem:='${this.registros.item.etapa1_equipe_dirigente_casal_montagem || 'N'}';
                  v_pessoas.etapa1_equipe_dirigente_casal_palestra:='${this.registros.item.etapa1_equipe_dirigente_casal_palestra || 'N'}';
                  v_pessoas.etapa1_equipe_dirigente_casal_pos_encontro:='${this.registros.item.etapa1_equipe_dirigente_casal_pos_encontro || 'N'}';
                  v_pessoas.etapa1_palestra_plano_de_deus:='${this.registros.item.etapa1_palestra_plano_de_deus || 'N'}';
                  v_pessoas.etapa1_palestra_testemunho_plano_de_deus:='${this.registros.item.etapa1_palestra_testemunho_plano_de_deus || 'N'}';
                  v_pessoas.etapa1_palestra_harmonia_conjugal:='${this.registros.item.etapa1_palestra_harmonia_conjugal || 'N'}';
                  v_pessoas.etapa1_palestra_dialogo_com_filhos:='${this.registros.item.etapa1_palestra_dialogo_com_filhos || 'N'}';
                  v_pessoas.etapa1_palestra_penitencia:='${this.registros.item.etapa1_palestra_penitencia || 'N'}';
                  v_pessoas.etapa1_palestra_nossa_senhora_na_vida_da_familia:='${this.registros.item.etapa1_palestra_nossa_senhora_na_vida_da_familia || 'N'}';
                  v_pessoas.etapa1_palestra_ceia_eucaristica:='${this.registros.item.etapa1_palestra_ceia_eucaristica || 'N'}';
                  v_pessoas.etapa1_palestra_testemunho_na_ceia_eucaristica:='${this.registros.item.etapa1_palestra_testemunho_na_ceia_eucaristica || 'N'}';
                  v_pessoas.etapa1_palestra_fe_nos_revezes_da_vida:='${this.registros.item.etapa1_palestra_fe_nos_revezes_da_vida || 'N'}';
                  v_pessoas.etapa1_palestra_sentido_da_vida:='${this.registros.item.etapa1_palestra_sentido_da_vida || 'N'}';
                  v_pessoas.etapa1_palestra_oracao:='${this.registros.item.etapa1_palestra_oracao || 'N'}';
                  v_pessoas.etapa1_palestra_corresponsabilidade:='${this.registros.item.etapa1_palestra_corresponsabilidade || 'N'}';
                  v_pessoas.etapa1_palestra_vivencia_do_sacramento_no_matrimonio:='${this.registros.item.etapa1_palestra_vivencia_do_sacramento_no_matrimonio || 'N'}';
                  v_pessoas.etapa1_palestra_o_casal_cristao_no_mundo_de_hoje:='${this.registros.item.etapa1_palestra_o_casal_cristao_no_mundo_de_hoje || 'N'}';
                  v_pessoas.etapa1_coordenador_acolhida:='${this.registros.item.etapa1_coordenador_acolhida || 'N'}';
                  v_pessoas.etapa1_encontreiro_acolhida:='${this.registros.item.etapa1_encontreiro_acolhida || 'N'}';
                  v_pessoas.etapa1_coordenador_cafe_minimercado:='${this.registros.item.etapa1_coordenador_cafe_minimercado || 'N'}';
                  v_pessoas.etapa1_encontreiro_cafe_minimercado:='${this.registros.item.etapa1_encontreiro_cafe_minimercado || 'N'}';
                  v_pessoas.etapa1_coordenador_circulo:='${this.registros.item.etapa1_coordenador_circulo || 'N'}';
                  v_pessoas.etapa1_encontreiro_circulos:='${this.registros.item.etapa1_encontreiro_circulos || 'N'}';
                  v_pessoas.etapa1_coordenador_compras:='${this.registros.item.etapa1_coordenador_compras || 'N'}';
                  v_pessoas.etapa1_encontreiro_compras:='${this.registros.item.etapa1_encontreiro_compras || 'N'}';
                  v_pessoas.etapa1_coordenador_cozinha:='${this.registros.item.etapa1_coordenador_cozinha || 'N'}';
                  v_pessoas.etapa1_encontreiro_cozinha:='${this.registros.item.etapa1_encontreiro_cozinha || 'N'}';
                  v_pessoas.etapa1_coordenador_liturgia_vigilia:='${this.registros.item.etapa1_coordenador_liturgia_vigilia || 'N'}';
                  v_pessoas.etapa1_encontreiro_liturgia_vigilia:='${this.registros.item.etapa1_encontreiro_liturgia_vigilia || 'N'}';
                  v_pessoas.etapa1_coordenador_ordem_limpeza:='${this.registros.item.etapa1_coordenador_ordem_limpeza || 'N'}';
                  v_pessoas.etapa1_encontreiro_ordem_limpeza:='${this.registros.item.etapa1_encontreiro_ordem_limpeza || 'N'}';
                  v_pessoas.etapa1_coordenador_secretaria:='${this.registros.item.etapa1_coordenador_secretaria || 'N'}';
                  v_pessoas.etapa1_encontreiro_secretaria:='${this.registros.item.etapa1_encontreiro_secretaria || 'N'}';
                  v_pessoas.etapa1_coordenador_visitacao:='${this.registros.item.etapa1_coordenador_visitacao || 'N'}';
                  v_pessoas.etapa1_encontreiro_visitacao:='${this.registros.item.etapa1_encontreiro_visitacao || 'N'}';
                  v_pessoas.etapa1_coordenadores_gerais:='${this.registros.item.etapa1_coordenadores_gerais || 'N'}';
                  v_pessoas.etapa1_palestra:='${this.registros.item.etapa1_palestra || 'N'}';
                  v_pessoas.etapa2_funcoes_sala_casal_apresentador:='${this.registros.item.etapa2_funcoes_sala_casal_apresentador || 'N'}';
                  v_pessoas.etapa2_funcoes_sala_casal_boa_vontade:='${this.registros.item.etapa2_funcoes_sala_casal_boa_vontade || 'N'}';
                  v_pessoas.etapa2_funcoes_sala_canto:='${this.registros.item.etapa2_funcoes_sala_canto || 'N'}';
                  v_pessoas.etapa2_funcoes_sala_recepcao_palestrantes:='${this.registros.item.etapa2_funcoes_sala_recepcao_palestrantes || 'N'}';
                  v_pessoas.etapa2_funcoes_sala_som_projecao:='${this.registros.item.etapa2_funcoes_sala_som_projecao || 'N'}';
                  v_pessoas.etapa2_equipe_dirigente_casal_fichas:='${this.registros.item.etapa2_equipe_dirigente_casal_fichas || 'N'}';         
                  v_pessoas.etapa2_equipe_dirigente_casal_finanças:='${this.registros.item.etapa2_equipe_dirigente_casal_finanças || 'N'}';         
                  v_pessoas.etapa2_equipe_dirigente_casal_montagem:='${this.registros.item.etapa2_equipe_dirigente_casal_montagem || 'N'}';         
                  v_pessoas.etapa2_equipe_dirigente_casal_palestra:='${this.registros.item.etapa2_equipe_dirigente_casal_palestra || 'N'}';         
                  v_pessoas.etapa2_equipe_dirigente_casal_pos_encontro:='${this.registros.item.etapa2_equipe_dirigente_casal_pos_encontro || 'N'}';        
                  v_pessoas.etapa2_palestra_corresponsabilidade:='${this.registros.item.etapa2_palestra_corresponsabilidade || 'N'}';
                  v_pessoas.etapa2_palestra_missao_de_jesus_cristo:='${this.registros.item.etapa2_palestra_missao_de_jesus_cristo || 'N'}';
                  v_pessoas.etapa2_palestra_igreja_comunidade_salvacao:='${this.registros.item.etapa2_palestra_igreja_comunidade_salvacao || 'N'}';
                  v_pessoas.etapa2_palestra_familia_formadora_da_igreja:='${this.registros.item.etapa2_palestra_familia_formadora_da_igreja || 'N'}';
                  v_pessoas.etapa2_palestra_magisterio_da_igreja:='${this.registros.item.etapa2_palestra_magisterio_da_igreja || 'N'}';
                  v_pessoas.etapa2_palestra_diretrizes_pastorais_cnbb_arquidiocese:='${this.registros.item.etapa2_palestra_diretrizes_pastorais_cnbb_arquidiocese || 'N'}';
                  v_pessoas.etapa2_palestra_oracao_e_meditacao:='${this.registros.item.etapa2_palestra_oracao_e_meditacao || 'N'}';
                  v_pessoas.etapa2_palestra_sacramentos_iniciacao_crista:='${this.registros.item.etapa2_palestra_sacramentos_iniciacao_crista || 'N'}';
                  v_pessoas.etapa2_palestra_pecado_e_inferno:='${this.registros.item.etapa2_palestra_pecado_e_inferno || 'N'}';
                  v_pessoas.etapa2_palestra_painel_sobre_pastorais:='${this.registros.item.etapa2_palestra_painel_sobre_pastorais || 'N'}';
                  v_pessoas.etapa2_palestra_fe_e_esperanca:='${this.registros.item.etapa2_palestra_fe_e_esperanca || 'N'}';
                  v_pessoas.etapa2_palestra_testemunho_sobre_viuvez:='${this.registros.item.etapa2_palestra_testemunho_sobre_viuvez || 'N'}';
                  v_pessoas.etapa2_palestra_familia_construcao_do_mundo:='${this.registros.item.etapa2_palestra_familia_construcao_do_mundo || 'N'}';
                  v_pessoas.etapa2_coordenador_acolhida:='${this.registros.item.etapa2_coordenador_acolhida || 'N'}';
                  v_pessoas.etapa2_encontreiro_acolhida:='${this.registros.item.etapa2_encontreiro_acolhida || 'N'}';
                  v_pessoas.etapa2_coordenador_cafe_minimercado:='${this.registros.item.etapa2_coordenador_cafe_minimercado || 'N'}';
                  v_pessoas.etapa2_encontreiro_cafe_minimercado:='${this.registros.item.etapa2_encontreiro_cafe_minimercado || 'N'}';
                  v_pessoas.etapa2_coordenador_circulo:='${this.registros.item.etapa2_coordenador_circulo || 'N'}';
                  v_pessoas.etapa2_encontreiro_circulos:='${this.registros.item.etapa2_encontreiro_circulos || 'N'}';
                  v_pessoas.etapa2_coordenador_compras:='${this.registros.item.etapa2_coordenador_compras || 'N'}';
                  v_pessoas.etapa2_encontreiro_compras:='${this.registros.item.etapa2_encontreiro_compras || 'N'}';
                  v_pessoas.etapa2_coordenador_cozinha:='${this.registros.item.etapa2_coordenador_cozinha || 'N'}';
                  v_pessoas.etapa2_encontreiro_cozinha:='${this.registros.item.etapa2_encontreiro_cozinha || 'N'}';
                  v_pessoas.etapa2_coordenador_liturgia_vigilia:='${this.registros.item.etapa2_coordenador_liturgia_vigilia || 'N'}';
                  v_pessoas.etapa2_encontreiro_liturgia_vigilia:='${this.registros.item.etapa2_encontreiro_liturgia_vigilia || 'N'}';
                  v_pessoas.etapa2_coordenador_ordem_limpeza:='${this.registros.item.etapa2_coordenador_ordem_limpeza || 'N'}';
                  v_pessoas.etapa2_encontreiro_ordem_limpeza:='${this.registros.item.etapa2_encontreiro_ordem_limpeza || 'N'}';
                  v_pessoas.etapa2_coordenador_secretaria:='${this.registros.item.etapa2_coordenador_secretaria || 'N'}';
                  v_pessoas.etapa2_encontreiro_secretaria:='${this.registros.item.etapa2_encontreiro_secretaria || 'N'}';
                  v_pessoas.etapa2_coordenador_visitacao:='${this.registros.item.etapa2_coordenador_visitacao || 'N'}';
                  v_pessoas.etapa2_encontreiro_visitacao:='${this.registros.item.etapa2_encontreiro_visitacao || 'N'}';
                  v_pessoas.etapa2_coordenadores_gerais:='${this.registros.item.etapa2_coordenadores_gerais || 'N'}';
                  v_pessoas.etapa2_palestra:='${this.registros.item.etapa2_palestra || 'N'}';                 
                  v_pessoas.etapa3_funcoes_sala_casal_apresentador:='${this.registros.item.etapa3_funcoes_sala_casal_apresentador || 'N'}';                 
                  v_pessoas.etapa3_funcoes_sala_casal_boa_vontade:='${this.registros.item.etapa3_funcoes_sala_casal_boa_vontade || 'N'}';                
                  v_pessoas.etapa3_funcoes_sala_canto:='${this.registros.item.etapa3_funcoes_sala_canto || 'N'}';                 
                  v_pessoas.etapa3_funcoes_sala_recepcao_palestrantes:='${this.registros.item.etapa3_funcoes_sala_recepcao_palestrantes || 'N'}';                 
                  v_pessoas.etapa3_funcoes_sala_som_projecao:='${this.registros.item.etapa3_funcoes_sala_som_projecao || 'N'}';                 
                  v_pessoas.etapa3_equipe_dirigente_casal_fichas:='${this.registros.item.etapa3_equipe_dirigente_casal_fichas || 'N'}';                 
                  v_pessoas.etapa3_equipe_dirigente_casal_finanças:='${this.registros.item.etapa3_equipe_dirigente_casal_finanças || 'N'}';                 
                  v_pessoas.etapa3_equipe_dirigente_casal_montagem:='${this.registros.item.etapa3_equipe_dirigente_casal_montagem || 'N'}';                 
                  v_pessoas.etapa3_equipe_dirigente_casal_palestra:='${this.registros.item.etapa3_equipe_dirigente_casal_palestra || 'N'}';                 
                  v_pessoas.etapa3_equipe_dirigente_casal_pos_encontro:='${this.registros.item.etapa3_equipe_dirigente_casal_pos_encontro || 'N'}';
                  v_pessoas.etapa3_palestra_realidade_do_mundo_a_luz_dos_documentos_da_igreja:='${this.registros.item.etapa3_palestra_realidade_do_mundo_a_luz_dos_documentos_da_igreja || 'N'}';
                  v_pessoas.etapa3_palestra_dignidade_da_pessoa_humana:='${this.registros.item.etapa3_palestra_dignidade_da_pessoa_humana || 'N'}';                 
                  v_pessoas.etapa3_palestra_doutrina_social_da_igreja:='${this.registros.item.etapa3_palestra_doutrina_social_da_igreja || 'N'}';                 
                  v_pessoas.etapa3_palestra_justica_social_responsabilidade_do_cristao:='${this.registros.item.etapa3_palestra_justica_social_responsabilidade_do_cristao || 'N'}';
                  v_pessoas.etapa3_palestra_familia_renovadora_do_mundo:='${this.registros.item.etapa3_palestra_familia_renovadora_do_mundo || 'N'}';
                  v_pessoas.etapa3_palestra_penitencia_reconciliacao:='${this.registros.item.etapa3_palestra_penitencia_reconciliacao || 'N'}';
                  v_pessoas.etapa3_palestra_testemunhos_de_casais_e_pessoas:='${this.registros.item.etapa3_palestra_testemunhos_de_casais_e_pessoas || 'N'}';                 
                  v_pessoas.etapa3_coordenador_acolhida:='${this.registros.item.etapa3_coordenador_acolhida || 'N'}';
                  v_pessoas.etapa3_encontreiro_acolhida:='${this.registros.item.etapa3_encontreiro_acolhida || 'N'}';
                  v_pessoas.etapa3_coordenador_cafe_minimercado:='${this.registros.item.etapa3_coordenador_cafe_minimercado || 'N'}';
                  v_pessoas.etapa3_encontreiro_cafe_minimercado:='${this.registros.item.etapa3_encontreiro_cafe_minimercado || 'N'}';
                  v_pessoas.etapa3_coordenador_circulo:='${this.registros.item.etapa3_coordenador_circulo || 'N'}';
                  v_pessoas.etapa3_encontreiro_circulos:='${this.registros.item.etapa3_encontreiro_circulos || 'N'}';
                  v_pessoas.etapa3_coordenador_compras:='${this.registros.item.etapa3_coordenador_compras || 'N'}';
                  v_pessoas.etapa3_encontreiro_compras:='${this.registros.item.etapa3_encontreiro_compras || 'N'}';
                  v_pessoas.etapa3_coordenador_cozinha:='${this.registros.item.etapa3_coordenador_cozinha || 'N'}';
                  v_pessoas.etapa3_encontreiro_cozinha:='${this.registros.item.etapa3_encontreiro_cozinha || 'N'}';
                  v_pessoas.etapa3_coordenador_liturgia_vigilia:='${this.registros.item.etapa3_coordenador_liturgia_vigilia || 'N'}';
                  v_pessoas.etapa3_encontreiro_liturgia_vigilia:='${this.registros.item.etapa3_encontreiro_liturgia_vigilia || 'N'}';
                  v_pessoas.etapa3_coordenador_ordem_limpeza:='${this.registros.item.etapa3_coordenador_ordem_limpeza || 'N'}';
                  v_pessoas.etapa3_encontreiro_ordem_limpeza:='${this.registros.item.etapa3_encontreiro_ordem_limpeza || 'N'}';
                  v_pessoas.etapa3_coordenador_secretaria:='${this.registros.item.etapa3_coordenador_secretaria || 'N'}';
                  v_pessoas.etapa3_encontreiro_secretaria:='${this.registros.item.etapa3_encontreiro_secretaria || 'N'}';
                  v_pessoas.etapa3_coordenador_visitacao:='${this.registros.item.etapa3_coordenador_visitacao || 'N'}';
                  v_pessoas.etapa3_encontreiro_visitacao:='${this.registros.item.etapa3_encontreiro_visitacao || 'N'}';
                  v_pessoas.etapa3_coordenadores_gerais:='${this.registros.item.etapa3_coordenadores_gerais || 'N'}';
                  v_pessoas.etapa3_palestra:='${this.registros.item.etapa3_palestra || 'N'}';                  
                  IF ${this.registros.item.id ?? null} IS NULL THEN
                      INSERT
                      INTO sge_pessoa_importacao
                      VALUES v_pessoas;
                  ELSE
                      UPDATE sge_pessoa_importacao SET ROW = v_pessoas WHERE id = v_pessoas.id;
                  END IF;
                END;`;

      //console.log("SALVAR QUERY ============================");
      //console.log(query);
      //console.log("FIM SALVAR QUERY ============================");


      const data = { query: query }
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }

      await fetch(this.API_URL + 'action', requestOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro ao chamar a API: ' + response.statusText);
          }
          return response.json();
        })
        .then(data => {
          console.log('data', data);
          if (alertar) {
            return this.$router.replace('/end')
          }
        })
        .catch(error => {
          console.log('Erro na chamada à API:', error);
          return window.alert('Erro: ', error);
        })
    },
    async listarDados() {
      const rawUser = sessionStorage.getItem('user');
      let dados = rawUser ? JSON.parse(rawUser) : {};
      const celular = sessionStorage.getItem('celular');
      // if (celular) {
      //  celular = celular.replace(/[^a-z0-9]/gi, '');
      // }
      const encodedEmail = sessionStorage.getItem('email');
      if (encodedEmail) {
        dados.email = encodedEmail;
      }
      let query;
      let where;
      if (this.registros.item.pessoa_email || dados?.email || encodedEmail) {
        where = `(fc_sem_acentos_maiusculos(pessoa_email) LIKE
              ('%' || fc_sem_acentos_maiusculos('${this.registros.item.pessoa_email || (dados?.email ?? encodedEmail)}') || '%') OR
              fc_sem_acentos_maiusculos(conjuge_email) LIKE
              ('%' || fc_sem_acentos_maiusculos('${this.registros.item.pessoa_email || (dados?.email ?? encodedEmail)}') || '%'))`;
      } else if (celular) {
        where = `(fc_sem_acentos_maiusculos(pessoa_celular) LIKE
              ('%' || fc_sem_acentos_maiusculos('${celular}') || '%') OR fc_sem_acentos_maiusculos(conjuge_celular) LIKE
              ('%' || fc_sem_acentos_maiusculos('${celular}') || '%') )`;
      } else {
        where = `( (fc_sem_acentos_maiusculos(pessoa_nome) =
                        (fc_sem_acentos_maiusculos('${this.registros.pessoa_nome ?? dados?.nome}') ))
                        and (fc_sem_acentos_maiusculos(pessoa_cpf) = (fc_sem_acentos_maiusculos('${this.registros.pessoa_cpf ?? dados?.cpf}'))) 
                        OR (fc_sem_acentos_maiusculos(conjuge_nome) =
                        (fc_sem_acentos_maiusculos('${this.registros.pessoa_nome ?? dados?.nome}') ))
                        and (fc_sem_acentos_maiusculos(conjuge_cpf) = (fc_sem_acentos_maiusculos('${this.registros.pessoa_cpf ?? dados?.cpf}'))) )`;
      }

      query = `SELECT pessoa_id                                         origem_id
                    , pessoa_nome                                       pessoa_nome
                    , pessoa_apelido                                    pessoa_apelido
                    , pessoa_logradouro                                 pessoa_endereco
                    , pessoa_cep                                        pessoa_cep
                    , pessoa_celular                                    pessoa_celular
                    , pessoa_telefone                                   pessoa_telefone_residencial
                    , pessoa_email                                      pessoa_email
                    , conjuge_celular                                   conjuge_celular
                    , conjuge_email                                     conjuge_email
                    , TO_CHAR(pessoa_data_nascimento, 'YYYY-MM-DD')     pessoa_nascimento
                    , TO_CHAR(pessoa_data_casamento, 'YYYY-MM-DD')      pessoa_data_casamento
                    , apelido_casal
                    , pessoa_sexo                                       pessoa_sexo
                    , pessoa_religiao                                   pessoa_religiao
                    , pessoa_cpf                                        pessoa_cpf
                    , pessoa_foto                                       pessoa_foto
                    , pessoa_paroquia                                   pessoa_paroquia
                    , pessoa_estado_civil                               pessoa_estado_civil
                    , conjuge_nome
                    , conjuge_apelido
                    , conjuge_sexo
                    , TO_CHAR(conjuge_data_nascimento, 'YYYY-MM-DD')    conjuge_nascimento
                    , conjuge_cpf
                    , conjuge_foto                                      foto_conjuge
                    , conjuge_crismada                                  conjuge_sacramento_crisma
                    , conjuge_batizada                                  conjuge_sacramento_batismo
                    , conjuge_comunhao                                  conjuge_sacramento_eucaristia
                    , conjuge_atuante_igreja                            conjuge_atuante_igreja
                    , conjuge_movimento_pertencente                     conjuge_movimento_pertencente
                    , conjuge_pastorais_ou_servicos                     conjuge_pastorais_ou_servicos
                    , conjuge_seita_ideologia_religiao                  conjuge_seita_ideologia_religiao
                    , conjuge_entidade_pertencente                      conjuge_entidade_pertencente
                    , conjuge_religiao                                  conjuge_religiao
                    , conjuge_email_autorizado                          conjuge_email_autorizado
                    , conjuge_celular_autorizado                        conjuge_celular_autorizado
                    , pessoa_paroquia                                   conjuge_paroquia
                    , pessoa_etapa_1                                    pessoa_etapa_1
                    , pessoa_etapa_2                                    pessoa_etapa_2
                    , pessoa_etapa_3                                    pessoa_etapa_3
                    , pessoa_sacramento_batismo                         pessoa_sacramento_batismo
                    , pessoa_termo_consentimento                        pessoa_termo_consentimento
                    , pessoa_sacramento_eucaristia                      pessoa_sacramento_eucaristia
                    , pessoa_sacramento_crisma                          pessoa_sacramento_crisma
                    , pessoa_casamento_civil                            pessoa_casamento_civil
                    , pessoa_casamento_religioso                        pessoa_casamento_religioso
                    , pessoa_paroquia_casamento                         pessoa_paroquia_casamento
                    , pessoa_atuante_igreja                             pessoa_atuante_igreja
                    , pessoa_movimento_pertencente                      pessoa_movimento_pertencente
                    , pessoa_pastorais_ou_servicos                      pessoa_pastorais_ou_servicos
                    , pessoa_seita_ideologia_religiao                   pessoa_seita_ideologia_religiao
                    , pessoa_entidade_pertencente                       pessoa_entidade_pertencente
                    , pessoa_uf                                         pessoa_uf
                    , pessoa_bairro                                     pessoa_bairro
                    , pessoa_complemento                                pessoa_complemento
                    , pessoa_foto_casal                                 pessoa_foto_casal
                    , pessoa_etapa_1_numero                             pessoa_etapa_1_numero
                    , TO_CHAR(pessoa_etapa_1_data_inicio, 'YYYY-MM-DD') pessoa_etapa_1_data_inicio
                    , pessoa_etapa_1_local                              pessoa_etapa_1_local
                    , pessoa_etapa_1_nucleo_sigla                       pessoa_etapa_1_nucleo_sigla
                    , pessoa_etapa_2_numero                             pessoa_etapa_2_numero
                    , TO_CHAR(pessoa_etapa_2_data_inicio, 'YYYY-MM-DD') pessoa_etapa_2_data_inicio
                    , pessoa_etapa_2_local                              pessoa_etapa_2_local
                    , pessoa_etapa_2_nucleo_sigla                       pessoa_etapa_2_nucleo_sigla
                    , pessoa_etapa_3_numero                             pessoa_etapa_3_numero
                    , TO_CHAR(pessoa_etapa_3_data_inicio, 'YYYY-MM-DD') pessoa_etapa_3_data_inicio
                    , pessoa_etapa_3_local                              pessoa_etapa_3_local
                    , pessoa_etapa_3_nucleo_sigla                       pessoa_etapa_3_nucleo_sigla
                    , pessoa_profissao                                  pessoa_profissao
                    , conjuge_profissao
                    , pessoa_email_autorizado                           pessoa_email_autorizado
                    , pessoa_celular_autorizado                         pessoa_celular_autorizado
                    , tel_residencial_autorizado                        tel_residencial_autorizado
                    , pessoa_perfil_habilidade
                    , pessoa_perfil_habilidade_id
                    , conjuge_perfil_habilidade
                    , conjuge_perfil_habilidade_id
                    , pessoa_perfil_equipe_indicada_id
               FROM bi.td_pessoa
               WHERE pessoa_gestor_id = 12
                 AND pessoa_origem_tipo_dom = 5738
                 AND ${where}`
      const data = { query: query }
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }

      await fetch(this.API_URL + 'listByOne', requestOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro ao chamar a API: ' + response.statusText);
          }
          return response.json();
        })
        .then(data => {
          if (Object.keys(data)?.length > 0) {
            let dados = data[0];

            this.registros.item = dados;
            //console.log(dados);
            if (dados.pessoa_cpf?.length >= 11) {
              this.registros.cpf_validado = true;
            }

            if (dados.conjuge_cpf?.length >= 11) {
              this.registros.cpf_validado = true;
            }

            if (dados.pessoa_etapa_1 === 'S' || dados.pessoa_etapa_2 === 'S' || dados.pessoa_etapa_3 === 'S') {
              setTimeout(() => {
                this.registros.item.fezECC = 'S';

                if (this.registros.item.fezECC = 'S' && this.registros.item.pessoa_perfil_equipe_indicada_id) {
                  this.tabs[7].libera = true;
                } else {
                  this.tabs[7].libera = false;
                }

                if (this.registros.item.fezECC = 'S') {
                  this.tabs[8].libera = true;
                } else {
                  this.tabs[8].libera = false;
                }

              }, 100);
            }
            const mapaHabilidades = {
              '306': 'habilidade_cantar',
              '308': 'habilidade_tocar_violao',
              '632': 'habilidade_falar_em_publico',
              '633': 'habilidade_ministro_eucaristia',
              '634': 'habilidade_servir_cafe',
              '635': 'habilidade_desenho',
              '636': 'habilidade_limpeza',
              '643': 'habilidade_liturgia',
              '647': 'habilidade_cozinhar',
              '648': 'habilidade_informatica',
              '649': 'habilidade_coordenar_grupos',
              '6522': 'habilidade_eletronica',
            };

            Object.values({ ...mapaHabilidades }).forEach(campo => {
              if (!this.registros.item.hasOwnProperty(campo)) {
                this.registros.item[campo] = null;
              }
            });

            const idsPessoa = dados.pessoa_perfil_habilidade_id?.split(',').map(id => id.trim()) || [];
            idsPessoa.forEach(id => {
              const campo = mapaHabilidades[id];
              if (campo) {
                this.registros.item[campo] = id;
              }
            });

            const idsConjuge = dados.conjuge_perfil_habilidade_id?.split(',').map(id => id.trim()) || [];
            idsConjuge.forEach(id => {
              const campo = mapaHabilidades[id];
              if (campo) {
                this.registros.item[`conjuge_${campo}`] = id;
              }
            });

            const mapaEquipes = {
              '658': 'equipe_secretaria',
              '659': 'equipe_cozinha',
              '660': 'equipe_compras',
              '661': 'equipe_visitacao',
              '662': 'equipe_acolhida',
              '663': 'equipe_cafe_minimercado',
              '664': 'equipe_liturgia_vigilia',
              '665': 'equipe_ordem_limpeza',
              '720': 'equipe_palestras',
              '721': 'equipe_sala_canto',
              '722': 'equipe_boa_vontade',
            };

            Object.values({ ...mapaEquipes }).forEach(campo => {
              if (!this.registros.item.hasOwnProperty(campo)) {
                this.registros.item[campo] = null;
              }
            });

            const idsPessoaEquipe = dados.pessoa_perfil_equipe_indicada_id?.split(',').map(id => id.trim()) || [];
            idsPessoaEquipe.forEach(id => {
              const campoEquipe = mapaEquipes[id];
              if (campoEquipe) {
                this.registros.item[campoEquipe] = id;
              }
            });

            const idsConjugeEquipe = dados.conjuge_perfil_equipe_indicada_id?.split(',').map(id => id.trim()) || [];
            idsConjugeEquipe.forEach(id => {
              const campoEquipe = mapaEquipes[id];
              if (campoEquipe) {

                this.registros.item[`conjuge_${campoEquipe}`] = id;

              }
            });

            this.setImagemInput();
          }
        })
        .catch(error => {
          console.log('Erro na chamada à API:', error);
          return;
        })
    },
    async validarPessoaImportacao() {
      const rawUser = sessionStorage.getItem('user');
      let dados = rawUser ? JSON.parse(rawUser) : {};
      const encodedEmail = sessionStorage.getItem('email');
      if (encodedEmail) {
        dados.email = encodedEmail;
      }

      let where;
      if (this.registros.item.pessoa_email || dados?.email || encodedEmail) {
        where = `(fc_sem_acentos_maiusculos(email) LIKE
              ('%' || fc_sem_acentos_maiusculos('${this.registros.item.pessoa_email || (dados?.email ?? encodedEmail)}') || '%'))`;
      } else {
        where = `((fc_sem_acentos_maiusculos(nome) =
                (fc_sem_acentos_maiusculos('${dados?.nome ?? (this.registros.item.pessoa_nome ?? '')}')))
          AND (fc_sem_acentos_maiusculos(cpf) =
               (fc_sem_acentos_maiusculos(TRANSLATE('${dados?.cpf ?? (this.registros.item?.pessoa_cpf ?? '')}', ' .-', ' ')))))`;
      }

      let query;
      query = `
        SELECT id
        FROM sge_pessoa_importacao
        WHERE ${where}`;

      const data = { query: query }
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }

      await fetch(this.API_URL + 'listByOne', requestOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro ao chamar a API: ' + response.statusText);
          }
          return response.json();
        })
        .then(data => {
          if (Object.keys(data).length > 0) {
            let dados = data[0];
            this.registros.item.id = dados.id;
          }
        })
        .catch(error => {
          console.log('Erro na chamada à API:', error);
          return;
        })
    },
    async carregarDominio() {
      await dominioService.carregar();
      this.estadoCivil = dominioService.getEstadoCivil();
      this.profissao = dominioService.getProfissoes();
      this.religiao = dominioService.getReligioes();
      this.sexo = dominioService.getSexo();
      this.paroquia = paroquiaService.getParoquias();
    },
    ajustarGeneroPrincipal() {
      if (this.registros.item.pessoa_sexo === 'FEMININO') {
        const campos = [
          'nome',
          'apelido',
          'nascimento',
          'cpf',
          'celular',
          'email',
          'profissao',
          'sexo'
        ];

        campos.forEach(campo => {
          const pessoaKey = `pessoa_${campo}`;
          const conjugeKey = `conjuge_${campo}`;

          const temp = this.registros.item[pessoaKey];
          this.registros.item[pessoaKey] = this.registros.item[conjugeKey];
          this.registros.item[conjugeKey] = temp;
        });
      }
    },

    // ARQUIVOS
    async handleFileUpload(field, event) {
      let file = event?.target?.files?.[0];
      let metaDados = this.metaDadosImage(file);

      const precisaConverter = [
        'image/webp',
        'image/png',
        'image/heic',
        'image/heif'
      ]

      if (precisaConverter.includes(file.type)) {
        file = await this.converterParaJpeg(file);
        console.log('file convertido', file);

        metaDados = this.metaDadosImage(file);
      }

      if (field === 'fotoPrincipal') {
        this.registros.item.pessoa_foto = metaDados.nameUUID;
        document.getElementById('pessoa_foto').src = URL.createObjectURL(metaDados.file);
      }
      if (field === 'fotoConjuge') {
        this.registros.item.foto_conjuge = metaDados.nameUUID;
        document.getElementById('foto_conjuge').src = URL.createObjectURL(metaDados.file);
      }
      if (field === 'fotoCasal') {
        this.registros.item.pessoa_foto_casal = metaDados.nameUUID;
        document.getElementById('pessoa_foto_casal').src = URL.createObjectURL(metaDados.file);
      }
      // this.uploadImagem(metaDados);
    },
    metaDadosImage(event) {
      let document = event;

      let { name: fileName, type: baseType } = document || {};
      let extension = fileName.split('.').pop();
      let chaveUUID = this.createUUID();
      let nameUUID = chaveUUID + "." + extension;
      let titulo = document.name;

      return {
        file: document,
        fileName: fileName,
        baseType: baseType,
        extension: extension,
        nameUUID: nameUUID,
        chaveUUID: chaveUUID
      }
    },
    async uploadImagem(dados) {
      const formData = new FormData();
      formData.append('file', dados.file, `${dados.nameUUID}`);
      const response = await fetch("https://app.seg.inf.br/oci/upload", {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("content-type");
      console.log('contentType', contentType);
    },
    createUUID() {
      let dt = new Date().getTime()

      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (dt + Math.random() * 16) % 16 | 0
        dt = Math.floor(dt / 16)
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
      })

      return uuid
    },
    async getArquivo(arquivo) {
      try {
        const response = await fetch(`https://app.seg.inf.br/oci/getObject?file=${arquivo}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        if (response.ok) {
          return await response.text();
        } else if (response.status === 404) {
          // console.log('response 404', response.status)
          return 'https://dummyimage.com/128x128/cfd8dc/546e7a&text=Sem+foto';
        } else {
          // console.log('response else', response)
          return 'https://dummyimage.com/128x128/cfd8dc/546e7a&text=Sem+foto';
        }
        // return response.text();
      } catch (error) {
        return null;
      }
    },
    setImagemInput() {
      if (this.registros.item.pessoa_foto) {
        let url = this.getArquivo(this.registros.item.pessoa_foto);
        url.then(r => {
          if (r) {
            document.getElementById('pessoa_foto').src = r;
          }
        })
      } else {
        this.arquivoUrl = 'https://dummyimage.com/128x128/cfd8dc/546e7a&text=Sem+foto'
      }

      if (this.registros.item.foto_conjuge) {
        let url = this.getArquivo(this.registros.item.foto_conjuge);
        url.then(r => {
          if (r) {
            document.getElementById('foto_conjuge').src = r;
          }
        })
      } else {
        this.arquivoUrl = 'https://dummyimage.com/128x128/cfd8dc/546e7a&text=Sem+foto'
      }

      if (this.registros.item.pessoa_foto_casal) {
        let url = this.getArquivo(this.registros.item.pessoa_foto_casal);
        url.then(r => {
          if (r) {
            document.getElementById('pessoa_foto_casal').src = r;
          }
        })
      } else {
        this.arquivoUrl = 'https://dummyimage.com/128x128/cfd8dc/546e7a&text=Sem+foto'
      }
    },
    async converterParaJpeg(file) {
      if (file.type === 'image/heic' || file.type === 'image/heif') {
        const blob = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.9
        })

        return new File([blob], this.trocarExtensao(file.name, 'jpg'), {
          type: 'image/jpeg'
        })
      }

      // WEBP / PNG / JPG
      return new Promise((resolve) => {
        const img = new Image()
        const reader = new FileReader()

        reader.onload = (e) => {
          img.src = e.target.result
        }

        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height

          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0)

          canvas.toBlob(
            (blob) => {
              resolve(
                new File([blob], this.trocarExtensao(file.name, 'jpg'), {
                  type: 'image/jpeg'
                })
              )
            },
            'image/jpeg',
            0.9
          )
        }

        reader.readAsDataURL(file)
      })
    },
    trocarExtensao(nome, novaExtensao) {
      return nome.replace(/\.[^.]+$/, '') + '.' + novaExtensao
    },

    // AUXILIARES, GET, SET, etc
    async getCep() {
      await fetch(`https://viacep.com.br/ws/${this.registros.item.pessoa_cep}/json/`)
        .then(response => response.json())
        .then(data => {
          let { logradouro, localidade: cidade, bairro, cep, uf } = data;

          this.registros.item.pessoa_endereco = logradouro;
          this.registros.item.pessoa_cidade = cidade || 'Brasilia';
          this.registros.item.pessoa_bairro = bairro;
          this.registros.item.pessoa_cep = cep;
          this.registros.item.pessoa_uf = uf;

          this.camposBloqueados = true; // bloqueia campos
        });
    },
    houveAlteracoes() {
      return JSON.stringify(this.registros.item) !== JSON.stringify(this.registrosOriginais);
    },
    async getIP() {
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        this.registros.item.ip_maquina_usuario = data.ip;
      } catch (err) {
        console.error('Erro ao buscar IP:', err);
      }
    },
    gerarIdDezDigitos() {
      return Math.floor(1000000000 + Math.random() * 9000000000);
    },
    salvarEAvancar() {
      const valido = this.validarCamposObrigatorios(true);
      if (!valido) return;

      this.salvar(false, false);

      if (this.activeTab === 'equipes_que_trabalhou' && this.equipesQueTrabalhouLiberada) {
        const etapasLiberadas = this.tabsEtapa.filter(tab => tab.libera);
        const currentIndex = etapasLiberadas.findIndex(tab => tab.id === this.etapaTab);
        const nextIndex = currentIndex + 1;

        if (nextIndex < etapasLiberadas.length) {
          this.etapaTab = etapasLiberadas[nextIndex].id;
        }
        return;
      }

      const tabsLiberadas = this.tabs.filter(tab => tab.libera);
      const currentIndex = tabsLiberadas.findIndex(tab => tab.id === this.activeTab);
      const nextIndex = currentIndex + 1;

      if (nextIndex < tabsLiberadas.length) {
        this.activeTab = tabsLiberadas[nextIndex].id;
      }
    },
    validarCamposObrigatorios(alertar = false) {
      this.erros = {};
      const camposObrigatorios = [];

      const campos = [
        { key: 'pessoa_nome', label: 'Nome Completo' },
        { key: 'pessoa_nascimento', label: 'Data de Nascimento' },
        { key: 'pessoa_cpf', label: 'CPF' },
        { key: 'pessoa_celular', label: 'Celular' },
        { key: 'pessoa_email', label: 'E-mail' },
        { key: 'pessoa_sexo', label: 'Sexo' },
        { key: 'pessoa_estado_civil', label: 'Estado Civil' },
        {
          key: 'conjuge_nome',
          label: 'Nome Conjuge',
          requiredIf: () => this.comConjuge.includes(this.registros.item.pessoa_estado_civil),
        },
        {
          key: 'conjuge_nascimento',
          label: 'Data de Nascimento Conjuge',
          requiredIf: () => this.comConjuge.includes(this.registros.item.pessoa_estado_civil)
        },
        {
          key: 'conjuge_cpf',
          label: 'CPF Conjuge',
          requiredIf: () => this.comConjuge.includes(this.registros.item.pessoa_estado_civil)
        },
        {
          key: 'conjuge_celular',
          label: 'Celular Conjuge',
          requiredIf: () => this.comConjuge.includes(this.registros.item.pessoa_estado_civil)
        },
        {
          key: 'conjuge_email',
          label: 'E-mail Conjuge',
          requiredIf: () => this.comConjuge.includes(this.registros.item.pessoa_estado_civil)
        },
        {
          key: 'conjuge_sexo',
          label: 'Sexo Conjuge',
          requiredIf: () => this.comConjuge.includes(this.registros.item.pessoa_estado_civil),
        },
      ];

      campos.forEach(campo => {
        const deveValidar = typeof campo.requiredIf === 'function' ? campo.requiredIf() : true;
        if (deveValidar) {
          const valor = this.registros.item[campo.key];
          if (!valor || !valor.toString().trim()) {
            this.erros[campo.key] = `O campo ${campo.label} é obrigatório.`;
            camposObrigatorios.push(campo.label);
          }
        }
      });

      if (camposObrigatorios.length > 0) {
        if (alertar) {
          alert('Por favor, preencha os seguintes campos obrigatórios:\n- ' + camposObrigatorios.join('\n- '));
        }
        return false;
      }

      return true;
    },
    async tentarMudarAba(novaAbaId) {
      // Só valida se for tentar sair da aba atual
      if (novaAbaId !== this.activeTab) {
        const valido = this.validarCamposObrigatorios(true);
        if (!valido) return; // bloqueia navegação se houver erro
      }

      this.activeTab = novaAbaId;
    },
    async mudarAbaEtapa(novaAbaId) {
      if (novaAbaId !== this.etapaTab) {
        const valido = this.validarCamposObrigatorios(true);
        if (!valido) return; // bloqueia navegação se houver erro
      }

      this.etapaTab = novaAbaId;
    },
    finalizarQuestionario() {
      this.salvar(true, true);
      this.finalizarFormulario();
    },
    limparFezECC() {
      if (this.registros.item.fazerECC === 'S') {
        this.registros.item.fezECC = 'N';
      }
    },
    limparFazerECC() {
      if (this.registros.item.fezECC === 'S') {

        this.registros.item.fazerECC = 'N';
        if (this.registros.item.pessoa_perfil_equipe_indicada_id) {
          this.tabs[7].libera = true;

        } else {
          this.tabs[7].libera = false;
        }
      } else {
        this.tabs[7].libera = false;
      }
    },
    finalizarFormulario() {
      sessionStorage.setItem('formularioFinalizado', 'true');
      this.$router.replace('/end');
    },
    receberRegistros({ etapas, dados }) {
      Object.keys(dados).forEach(key => {
        this.registros[key] = dados[key];
      });
    },

    // BUSCAR CPF E DETALHES
    async getToken() {
      const consumerKey = "c7Vrg3pZ6KH8eGi5ep0oRjgf8HUa";
      const consumerSecret = "QDi1uNPzdBGC4arVJX4tL5vPVYYa";
      const credentials = btoa(`${consumerKey}:${consumerSecret}`);

      await fetch("https://gateway.apiserpro.serpro.gov.br/token", {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      })
        .then((response) => response.json())
        .then((data) => {
          this.token = data;
        })
        .catch((err) => console.error(err));
    },
    async getCpfDetails(item = false, conjuge = false) {
      await this.getToken();
      let cpf;
      if (!conjuge) {
        cpf = this.registros.item.pessoa_cpf;
      } else {
        cpf = this.registros.item.conjuge_cpf;
      }

      try {
        const res = await fetch(
          `https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v2/cpf/${cpf.replace(/\D/g, '')}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${this.token.access_token}`,
            },
          }
        );

        if (!res.ok) {
          this.registros.cpf_nao_encontrado = true;
          return;
        }

        const data = await res.json();
        this.registros.cpf_nao_encontrado = false;
        this.registros.cpf_validado = true;
        if (item && !conjuge) {
          this.registros.item.pessoa_nome = data.nome;
          this.registros.item.pessoa_apelido = data.nome.split(' ').shift();
          this.registros.item.pessoa_cpf = data.ni;
          this.registros.item.pessoa_nascimento = this.formatarData(data.nascimento);
          this.registros.item.pessoa_cpf_ativo = "S";
        } else {
          this.registros.item.conjuge_nome = data.nome;
          this.registros.item.conjuge_apelido = data.nome.split(' ').shift();
          this.registros.item.conjuge_cpf = data.ni;
          this.registros.item.conjuge_nascimento = this.formatarData(data.nascimento);
          this.registros.item.conjuge_cpf_ativo = "S";
        }
      } catch (err) {
        console.error("Erro na consulta CPF:", err);
        // this.registros.cpf_nao_encontrado = true;
      }
    },
    formatarData(data) {
      const dia = data.substring(0, 2);
      const mes = data.substring(2, 4);
      const ano = data.substring(4, 8);

      return `${ano}-${mes}-${dia}`;
    },
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

body {
  background-color: #f8f9fa;
}

.container {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
  margin-top: 20px;
}

.form-label {
  font-weight: bold;
}

.login-container {
  height: 100vh;
  background: linear-gradient(to right, #007bff, #6610f2);
}

.login-card {
  background: #fff;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
}

.btn-primary {
  background-color: #007bff;
  border: none;
  transition: background 0.3s ease-in-out;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.cabecalho {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
}

.icone {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.cabecalho h4 {
  flex: 1;
  text-align: center;
}
</style>