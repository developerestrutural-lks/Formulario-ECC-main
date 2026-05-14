<template>
  <div class="tab-pane fade show active">
    <label class="form-label text-dark text-start">
      Selecione as equipes que você(s) já trabalharam, {{ pessoaNome }}
      <span v-if="estadoCivil === 'CASADO (A)'"> e {{ conjugeNome }}</span>
    </label>

    <!-- TABELA -->
    <table class="table table-bordered text-center align-middle">
      <thead class="table-light">
        <tr class="border-2">
          <th></th>
          <th class="border-end border-2">Casal Coordenador</th>
          <th class="border-end border-2">Encontreiro</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-2" v-for="(equipe, index) in equipesConfig" :key="index">
          <td class="text-start border-end border-2">{{ equipe.nome }}</td>
          <td class="border-end border-2">
            <div class="form-check d-flex justify-content-center p-0 m-0">
              <input class="form-check-input border border-1 border-dark" type="checkbox"
                :id="getInputId(equipe.coordenadorKey)" v-model="registros[`${etapa}_${equipe.coordenadorKey}`]"
                :true-value="String(equipe.trueValueCoordenador)" :false-value="'N'" />
            </div>
          </td>
          <td class="border-end border-2">
            <div class="form-check d-flex justify-content-center p-0 m-0">
              <input class="form-check-input border border-1 border-dark" type="checkbox"
                :id="getInputId(equipe.encontreiroKey)" v-model="registros[`${etapa}_${equipe.encontreiroKey}`]"
                :true-value="String(equipe.trueValueEncontreiro)" :false-value="'N'" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- PERGUNTAS -->
    <div class="mb-3">
      <label class="form-check-label text-dark text-start">
        Já trabalharam em alguma das funções da SALA?
      </label>
      <div class="funcoes_sala">
        <div class="form-check mb-3" v-for="(funcao, index) in funcoesSala" :key="index">
          <label class="form-check-label text-dark text-start">
            {{ funcao.label }}
          </label>
          <input class="form-check-input" type="checkbox" :true-value="String(funcao.values[etapa])" :false-value="'N'"
            v-model="registros[`${etapa}_${funcao.key}`]" />
        </div>
      </div>
    </div>

    <br>

    <div class="mb-3">
      <label class="form-check-label text-dark text-start">
        Já foram Coordenadores Gerais?
      </label>
      <div class="form-check mb-3">
        <input class="form-check-input" type="radio" id="sim" v-model="registros[`${etapa}_coordenadores_gerais`]"
          value="5939" />
        <label class="form-check-label text-dark text-start" for="sim">SIM</label>
      </div>
      <div class="form-check mb-3">
        <input class="form-check-input" type="radio" id="nao" v-model="registros[`${etapa}_coordenadores_gerais`]"
          value="'N'" />
        <label class="form-check-label text-dark text-start" for="nao">NÃO</label>
      </div>
    </div>

    <div class="mb-3">
      <label class="form-check-label text-dark text-start">Já participaram da equipe
        dirigente?</label>
      <div class="equipes_dirigentes">
        <div class="form-check mb-3" v-for="(equipe, index) in equipesDirigentes" :key="index">
          <label class="form-check-label text-dark text-start">
            {{ equipe.label }}
          </label>
          <input class="form-check-input" type="checkbox" :true-value="String(equipe.values[etapa])" :false-value="'N'"
            v-model="registros[`${etapa}_${equipe.key}`]" />
        </div>
      </div>
    </div>

    <div class="mb-3">
      <label class="form-check-label text-dark text-start">
        Já ministrou palestra no ECC {{ etapaLabel }}?
      </label>
      <div class="form-check mb-3">
        <input class="form-check-input" type="radio" id="sim" v-model="registros[`${etapa}_palestra`]" value="S" />
        <label class="form-check-label text-dark text-start" for="sim">SIM</label>
      </div>
      <div class="form-check mb-3">
        <input class="form-check-input" type="radio" id="nao" v-model="registros[`${etapa}_palestra`]" value="'N'" />
        <label class="form-check-label text-dark text-start" for="nao">NÃO</label>
      </div>
    </div>

    <div class="mb-3">
      <label class="form-check-label text-dark text-start">Palestra que ministrou na {{ etapaLabel }}:</label>
      <div class="palestras">
        <div class="form-check mb-3" v-for="(palestra, index) in palestrasFiltradas" :key="palestra">
          <label class="form-check-label text-dark text-start">
            {{ palestra.label }}
          </label>
          <input class="form-check-input" type="checkbox" :true-value="String(palestra.values[etapa])"
            :false-value="'N'" v-model="registros[`${etapa}_${palestra.key}`]" />
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'EquipeTrabalho',
  data() {
    return {
      equipesConfig: [
        {
          nome: 'Acolhida',
          coordenadorKey: 'coordenador_acolhida',
          encontreiroKey: 'encontreiro_acolhida',
          trueValueCoordenador: '430',
          trueValueEncontreiro: '432'
        },
        {
          nome: 'Café e MiniMercado',
          coordenadorKey: 'coordenador_cafe_minimercado',
          encontreiroKey: 'encontreiro_cafe_minimercado',
          trueValueCoordenador: '438',
          trueValueEncontreiro: '439'
        },
        {
          nome: 'Círculos',
          coordenadorKey: 'coordenador_circulo',
          encontreiroKey: 'encontreiro_circulos',
          trueValueCoordenador: '412',
          trueValueEncontreiro: '708'
        },
        {
          nome: 'Compras',
          coordenadorKey: 'coordenador_compras',
          encontreiroKey: 'encontreiro_compras',
          trueValueCoordenador: '452',
          trueValueEncontreiro: '453'
        },
        {
          nome: 'Cozinha',
          coordenadorKey: 'coordenador_cozinha',
          encontreiroKey: 'encontreiro_cozinha',
          trueValueCoordenador: '448',
          trueValueEncontreiro: '449'
        },
        {
          nome: 'Liturgia e Vigília',
          coordenadorKey: 'coordenador_liturgia_vigilia',
          encontreiroKey: 'encontreiro_liturgia_vigilia',
          trueValueCoordenador: '436',
          trueValueEncontreiro: '441'
        },
        {
          nome: 'Ordem e Limpeza',
          coordenadorKey: 'coordenador_ordem_limpeza',
          encontreiroKey: 'encontreiro_ordem_limpeza',
          trueValueCoordenador: '446',
          trueValueEncontreiro: '447'
        },
        {
          nome: 'Secretaria',
          coordenadorKey: 'coordenador_secretaria',
          encontreiroKey: 'encontreiro_secretaria',
          trueValueCoordenador: '444',
          trueValueEncontreiro: '445'
        },
        {
          nome: 'Visitação',
          coordenadorKey: 'coordenador_visitacao',
          encontreiroKey: 'encontreiro_visitacao',
          trueValueCoordenador: '434',
          trueValueEncontreiro: '435'
        },
      ],
      funcoesSala: [
        {
          label: 'Casal Apresentador',
          key: 'funcoes_sala_casal_apresentador',
          values: { etapa1: '386', etapa2: '25', etapa3: 'S' }
        },
        {
          label: 'Casal Boa Vontade',
          key: 'funcoes_sala_casal_boa_vontade',
          values: { etapa1: '387', etapa2: '26', etapa3: 'S' }
        },
        {
          label: 'Canto',
          key: 'funcoes_sala_canto',
          values: { etapa1: '398', etapa2: 'S', etapa3: 'S' }
        },
        {
          label: 'Recepção de Palestrantes',
          key: 'funcoes_sala_recepcao_palestrantes',
          values: { etapa1: '393', etapa2: '27', etapa3: 'S' }
        },
        {
          label: 'Som e Projeção',
          key: 'funcoes_sala_som_projecao',
          values: { etapa1: '410', etapa2: '28', etapa3: 'S' }
        }
      ],
      equipesDirigentes: [
        {
          label: 'Casal Fichas',
          key: 'equipe_dirigente_casal_fichas',
          values: { etapa1: '380', etapa2: '22', etapa3: 'S' }
        },
        {
          label: 'Casal Finanças',
          key: 'equipe_dirigente_casal_finanças',
          values: { etapa1: '381', etapa2: '23', etapa3: 'S' }
        },
        {
          label: 'Casal Montagem',
          key: 'equipe_dirigente_casal_montagem',
          values: { etapa1: '382', etapa2: '24', etapa3: 'S' }
        },
        {
          label: 'Casal Palestra',
          key: 'equipe_dirigente_casal_palestra',
          values: { etapa1: '383', etapa2: '31', etapa3: 'S' }
        },
        {
          label: 'Casal Pós Encontro',
          key: 'equipe_dirigente_casal_pos_encontro',
          values: { etapa1: '384', etapa2: 'S', etapa3: 'S' }
        },
      ],
      palestras: [
        {
          label: 'Plano de Deus',
          key: 'palestra_plano_de_deus',
          values: { etapa1: '454' }
        },
        {
          label: 'Testemunho do Plano de Deus',
          key: 'palestra_testemunho_plano_de_deus',
          values: { etapa1: '484' }
        },
        {
          label: 'Harmonia Conjugal',
          key: 'palestra_harmonia_conjugal',
          values: { etapa1: '455' }
        },
        {
          label: 'Diálogo com os Filhos',
          key: 'palestra_dialogo_com_filhos',
          values: { etapa1: '458' }
        },
        {
          label: 'Penitência(Reconciliação)',
          key: 'palestra_penitencia',
          values: { etapa1: '459' }
        },
        {
          label: 'Nossa Senhora na Vida da Família',
          key: 'palestra_nossa_senhora_na_vida_da_familia',
          values: { etapa1: '464' }
        },
        {
          label: 'Ceia Eucarística',
          key: 'palestra_ceia_eucaristica',
          values: { etapa1: '465' }
        },
        {
          label: 'Testemunho na Ceia Eucarística',
          key: 'palestra_testemunho_na_ceia_eucaristica',
          values: { etapa1: '547' }
        },
        {
          label: 'Fé nos Revezes da Vida',
          key: 'palestra_fe_nos_revezes_da_vida',
          values: { etapa1: '467' }
        },
        {
          label: 'Sentido da Vida',
          key: 'palestra_sentido_da_vida',
          values: { etapa1: '468' }
        },
        {
          label: 'Oração',
          key: 'palestra_oracao',
          values: { etapa1: '469' }
        },
        {
          label: 'Corresponsabilidade',
          key: 'palestra_corresponsabilidade',
          values: { etapa1: '657', etapa2: '657' }
        },
        {
          label: 'A Vivência do Sacramento no Matrimônio',
          key: 'palestra_vivencia_do_sacramento_no_matrimonio',
          values: { etapa1: '472' }
        },
        {
          label: 'O Casal Cristão no Mundo de Hoje',
          key: 'palestra_o_casal_cristao_no_mundo_de_hoje',
          values: { etapa1: '474' }
        },
        {
          label: 'Missão de Jesus Cristo',
          key: 'palestra_missao_de_jesus_cristo',
          values: { etapa2: '889' }
        },
        {
          label: 'Igreja Comunidade e Salvação',
          key: 'palestra_igreja_comunidade_salvacao',
          values: { etapa2: '890' }
        },
        {
          label: 'A Família formadora da Igreja',
          key: 'palestra_familia_formadora_da_igreja',
          values: { etapa2: '891' }
        },
        {
          label: 'Magistério da Igreja',
          key: 'palestra_magisterio_da_igreja',
          values: { etapa2: '892' }
        },
        {
          label: 'Diretrizes Pastorais da CNBB e da Arquidiocese',
          key: 'palestra_diretrizes_pastorais_cnbb_arquidiocese',
          values: { etapa2: '893' }
        },
        {
          label: 'Oração e Meditação',
          key: 'palestra_oracao_e_meditacao',
          values: { etapa2: '894' }
        },
        {
          label: 'Os Sacramentos da Iniciação Cristã: Batismo, Crisma e Eucaristia',
          key: 'palestra_sacramentos_iniciacao_crista',
          values: { etapa2: '895' }
        },
        {
          label: 'Pecado e Inferno',
          key: 'palestra_pecado_e_inferno',
          values: { etapa2: '896' }
        },
        {
          label: 'Painel Sobre as Pastorais',
          key: 'palestra_painel_sobre_pastorais',
          values: { etapa2: '898' }
        },
        {
          label: 'Fé e Esperança',
          key: 'palestra_fe_e_esperanca',
          values: { etapa2: '899' }
        },
        {
          label: 'Testemunho sobre Viuvez',
          key: 'palestra_testemunho_sobre_viuvez',
          values: { etapa2: '899' }
        },
        {
          label: 'A Família na Construção do Mundo',
          key: 'palestra_familia_construcao_do_mundo',
          values: { etapa2: '901' }
        },
        {
          label: 'A Realidade do Mundo à Luz dos Documentos da Igreja',
          key: 'palestra_realidade_do_mundo_a_luz_dos_documentos_da_igreja',
          values: { etapa3: 'S' }
        },
        {
          label: 'A Dignidade da Pessoa Humana e os Sistemas Locais',
          key: 'palestra_dignidade_da_pessoa_humana',
          values: { etapa3: 'S' }
        },
        {
          label: 'A Doutrina Social da Igreja',
          key: 'palestra_doutrina_social_da_igreja',
          values: { etapa3: 'S' }
        },
        {
          label: 'Justiça Social, responsabilidade do Cristão',
          key: 'palestra_justica_social_responsabilidade_do_cristao',
          values: { etapa3: 'S' }
        },
        {
          label: 'Família Renovadora do Mundo',
          key: 'palestra_familia_renovadora_do_mundo',
          values: { etapa3: 'S' }
        },
        {
          label: 'Penitência e Reconciliação',
          key: 'palestra_penitencia_reconciliacao',
          values: { etapa3: 'S' }
        },
        {
          label: 'Testemunhos de Casais e Pessoas já Posicionados e Engajadoss na Justiça Social',
          key: 'palestra_testemunhos_de_casais_e_pessoas',
          values: { etapa3: 'S' }
        },
      ]
    }
  },
  props: {
    etapa: {
      type: String,
      required: true
    },
    registros: {
      type: Object,
      required: true
    },
    pessoaNome: {
      type: String,
      default: ''
    },
    conjugeNome: {
      type: String,
      default: ''
    },
    estadoCivil: {
      type: String,
      default: ''
    }
  },
  // emits: ['atualizarRegistros'],
  created() {
    this.funcoesSala.forEach(funcao => {
      const chave = `${this.etapa}_${funcao.key}`;
      if (!(chave in this.registros)) {
        this.registros[chave] = 'N'; // valor padrão
      }
    });
  },
  mounted() {
    this.inicializarCamposEtapa();
  },
  computed: {
    palestrasFiltradas() {
      return this.palestras.filter(p => p.values[this.etapa]);
    },
    etapaLabel() {
      const mapa = {
        etapa1: '1ª ETAPA',
        etapa2: '2ª ETAPA',
        etapa3: '3ª ETAPA'
      };
      return mapa[this.etapa] || '';
    }
  },
  watch: {
    etapa() {
      this.inicializarCamposEtapa();
    },
    registros: {
      handler() {
        this.emitirRegistrosAtualizados();
      },
      deep: true
    }
  },
  methods: {
    getInputId(field) {
      return `${this.etapa}_input_${field}`;
    },
    emitirRegistrosAtualizados() {
      this.$emit('atualizarRegistros', {
        etapa: this.etapa,
        dados: this.registros,
      })
    },
    inicializarCamposEtapa() {
      this.funcoesSala?.forEach(funcao => {
        const chave = `${this.etapa}_${funcao.key}`;
        if (!(chave in this.registros)) {
          this.registros[chave] = 'N';
        }
      });

      this.equipesDirigentes?.forEach(funcao => {
        const chave = `${this.etapa}_${funcao.key}`;
        if (!(chave in this.registros)) {
          this.registros[chave] = 'N';
        }
      });

      this.palestrasFiltradas?.forEach(funcao => {
        const chave = `${this.etapa}_${funcao.key}`;
        if (!(chave in this.registros)) {
          this.registros[chave] = 'N';
        }
      });

      this.equipesConfig.forEach(eq => {
        const keys = [`${this.etapa}_${eq.coordenadorKey}`, `${this.etapa}_${eq.encontreiroKey}`];
        keys.forEach(chave => {
          if (!(chave in this.registros)) {
            this.registros[chave] = 'N';
          }
        });
      });

      const coordenadorGeralKey = `${this.etapa}_coordenadores_gerais`;
      if (!(coordenadorGeralKey in this.registros)) {
        this.registros[coordenadorGeralKey] = 'N';
      }

      const palestraKey = `${this.etapa}_palestra`;
      if (!(palestraKey in this.registros)) {
        this.registros[palestraKey] = 'N';
      }
    },
  },

}
</script>