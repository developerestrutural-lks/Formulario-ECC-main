<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-4">
        <div class="card shadow-lg p-4">
          <div class="cabecalho">
            <img src="@/assets/logo_grupo_acao.png" alt="Ícone" class="icone">
            <h5>ENCONTRO DE CASAIS COM CRISTO</h5>
          </div>
          <h3 class="text-center mb-4">Atualização de Cadastro</h3>
          <form @submit.prevent="login()">
            <div class="mb-3">
              <label class="form-label text-dark" for="nome">Nome:</label>
              <input type="text" id="nome" class="form-control" v-model="registros.nome" required/>
            </div>
            <div class="mb-3">
              <label class="form-label text-dark" for="cpf">CPF:</label>
              <input type="text" id="cpf" class="form-control" v-model="registros.cpf" v-mask="'###.###.###-##'"
                     required/>
            </div>
            <div class="text-center">
              <button type="submit" class="btn btn-primary" :disabled="!validacaoConcluida">Entrar</button>
              <small v-if="!validacaoConcluida" class="form-text text-muted d-block mt-2">
                Para entrar com nome e CPF, valide primeiro pelo Google, pelo código no celular ou pelo link no e-mail.
              </small>
              <small v-else class="form-text text-success d-block mt-2">
                Validação concluída ({{ metodoValidacao }}). Agora você pode entrar com nome e CPF.
              </small>
            </div>
          </form>
          <br>

          <div id="buttonDiv"></div>
          <br>

          <div class="mb-3">
            <div class="input-group">
              <input type="text" class="form-control" v-model="registros.celular" v-mask="'(##)#####-####'"
                     placeholder="Login com celular: (61)99999-9999"/>
              <button class="btn btn-primary" type="button" @click="sendCode">Enviar código</button>
              <small class="form-text text-muted">Informe seu número de celular com DDD no formato: (61)
                99999-9999.</small>
            </div>
            <div v-if="confirmationResult" class="input-group" style="top: 6px;">
              <input type="text" class="form-control" v-model="verificationCode" placeholder="Código"/>
              <button class="btn btn-primary" @click="confirmCode">Confirmar código</button>
            </div>
            <div id="recaptcha-container" class="mt-2"></div>
          </div>

          <div class="mb-3">
            <div class="input-group">
              <input class="form-control" type="email" v-model="email" placeholder="Email para Login">
              <button class="btn btn-primary" @click="loginWithEmail">Enviar Link</button>
              <small class="form-text text-muted">Digite seu e-mail para login. Você receberá um link de acesso.</small>
            </div>
          </div>
        </div>
      </div>
      <LoadingSpinner :show="loading"/>
    </div>
  </div>
</template>

<script>
import {auth} from "@/firebaseConfig";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  isSignInWithEmailLink
} from "firebase/auth";
import LoadingSpinner from '@/views/LoadingSpinner.vue';
import erroService from '@/services/erroService';

export default {
  name: 'Home',
  components: {LoadingSpinner},
  data() {
    return {
      ECC_API_URL: 'https://app.seg.inf.br/sge/api/ecc/pessoa/',
      CLIENT_ID: "227598083779-rbngiccnj6untte4sueuc6rblk7gko58.apps.googleusercontent.com",
      accessToken: null,
      userEmail: null,
      registros: {
        nome: '',
        cpf: '',
        email: '',
      },
      loading: false,
      verificationCode: "",
      confirmationResult: null,
      // Login por nome+CPF só é liberado depois de uma validação (Google, SMS ou link de e-mail).
      validacaoConcluida: false,
      metodoValidacao: ''
    }
  },
  created() {
    const waitForGoogle = setInterval(() => {
      if (window.google && window.google.accounts) {
        clearInterval(waitForGoogle);
        this.initGoogleSignIn();
      }
    }, 500);
  },
  mounted() {
    this.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      'size': 'invisible'
    });

    this.recaptchaVerifier.render().then((widgetId) => {
      console.log("Recaptcha renderizado com widgetId: ", widgetId);
    });

    this.initGoogleSignIn();
    this.checkSignInLink();
    sessionStorage.removeItem('formularioFinalizado');
    sessionStorage.removeItem('dados');
    sessionStorage.removeItem('celular');
    sessionStorage.removeItem('email');

    localStorage.removeItem('emailForSignIn');
    localStorage.removeItem('dados');
    localStorage.removeItem('celular');
    localStorage.removeItem('email');
    this.registros.item = {};
    this.loading = false;
  },
  methods: {
    // Funcionalidades para resposta do login pelo Gmail.
    parseJwt(token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            window
                .atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(jsonPayload);
      } catch (error) {
        console.error("Erro ao decodificar o JWT:", error);
        return null;
      }
    },
    async handleCredentialResponse(response) {
      const user = await this.parseJwt(response.credential);
      if (user.email && user.email_verified) {
        this.registros.email = user.email;
        sessionStorage.setItem('email', this.registros.email);
        return this.marcarValidacao('Google');
      } else {
        return window.alert('O Email não é válido!');
      }
    },
    initGoogleSignIn() {
      window?.google.accounts.id.initialize({
        client_id: this.CLIENT_ID,
        callback: (response) => {
          this.handleCredentialResponse(response)
        },
      });
      window.google.accounts.id.renderButton(
          document.getElementById("buttonDiv"),
          {theme: "outline", size: "large"}
      );
      window.google.accounts.id.prompt();

    },

    // Registra que a pessoa provou ser dona de um e-mail ou celular. A partir daqui o
    // login por nome+CPF é liberado, mas a busca continua exigindo que esse mesmo
    // e-mail/celular validado bata com o cadastro (ver login()).
    marcarValidacao(metodo) {
      this.validacaoConcluida = true;
      this.metodoValidacao = metodo;
      window.alert('Validação concluída. Agora preencha nome e CPF e clique em Entrar.');
    },

    // Login padrão no sistema por CPF e Nome da Pessoa completos. Caso as outras opções de login sejam usadas, é validado pela coluna associada ao método.
    // Só é permitido depois de uma validação (Google, código SMS ou link de e-mail).
    async login() {
      if (!this.validacaoConcluida) {
        return window.alert('Para entrar, valide primeiro pelo Google, pelo código enviado ao celular ou pelo link enviado ao e-mail.');
      }

      if (!this.registros.nome || !this.registros.cpf) {
        return window.alert('Preencha nome e CPF para entrar.');
      }

      this.loading = true;

      const celularValidado = this.registros.celular
          ? this.registros.celular.replace(/[^a-z0-9]/gi, '')
          : '';

      let dados = JSON.stringify({
        email: this.registros.email,
        celular: celularValidado,
        nome: this.registros.nome,
        cpf: this.registros.cpf
      });
      sessionStorage.setItem('user', dados);

      // A busca exige nome+CPF E o contato validado (e-mail ou celular). Assim, saber o
      // nome e o CPF de outra pessoa não é suficiente para abrir o cadastro dela.
      const criterio = {
        nome: this.registros.nome,
        cpf: this.registros.cpf,
        email: this.registros.email || '',
        celular: celularValidado
      };

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(criterio)
      }

      await fetch(this.ECC_API_URL + 'buscar', requestOptions)
          .then(async response => {
            if (!response.ok) {
              throw new Error(await erroService.mensagemDaResposta(response));
            }
            this.loading = false;
            return this.$router.push('/form');
          })
          .catch(error => {
            console.log('Erro na chamada à API:', error);
            this.loading = false;
            erroService.registrarErro({
              erro: 'Erro ao fazer login: ' + error,
              nome: this.registros.nome,
              cpf: this.registros.cpf,
              email: this.registros.email
            });
            return window.alert('Erro: ', error);
          })
    },

    // Login no sistema pelo código enviado ao celular, validando se o registro existe pela coluna celular.
    async sendCode() {
      if (!this.registros.celular) {
        return alert('Necessário digitar um número de celular')
      }

      this.loading = true;
      if (!this.recaptchaVerifier) {
        console.error("Recaptcha não inicializado.");
        return;
      }

      let celular;
      if (this.registros.celular) {
        celular = this.registros.celular.replace(/[^a-z0-9]/gi, '');
      }


      try {
        const result = await signInWithPhoneNumber(auth, `+55${celular}`, this.recaptchaVerifier);
        this.confirmationResult = result;
        this.loading = false;
        alert("Código enviado!");
      } catch (error) {
        console.error("Erro ao enviar código:", error.code, error.message);
        alert("Erro ao enviado o código: " + error.message)
        this.loading = false;
      }
    },
    async confirmCode() {
      this.loading = true;
      try {
        const result = await this.confirmationResult.confirm(this.verificationCode);
        if (result) {
          sessionStorage.setItem('celular', this.registros.celular);
          this.loading = false;
          return this.marcarValidacao('celular');
        }
      } catch (error) {
        console.error("Erro ao confirmar código:", error.code, error.message);
        this.loading = false;
        alert("Erro ao validar código: " + error.message)
      }
    },

    // Login no sistema por qualquer email, validando se o registro existe pela coluna email.
    async loginWithEmail() {
      if (!this.email) {
        return alert('Necessário digitar um e-mail válido.')
      }

      this.loading = true;

      const actionCodeSettings = {
        // url: `http://localhost:5173/#/?email=${encodeURIComponent(this.email)}`,
        url: `https://app.seg.inf.br/formulario_ecc/#/?email=${encodeURIComponent(this.email)}`,
        handleCodeInApp: true,
      };

      sendSignInLinkToEmail(auth, this.email, actionCodeSettings)
          .then((res) => {
            this.loading = false;
            window.localStorage.setItem('emailForSignIn', this.email);
            window.alert('Link enviado para o e-mail: ' + this.email);
          })
          .catch((error) => {
            this.loading = false;
            const errorCode = error.code;
            const errorMessage = error.message;
            window.alert('Erro ao enviar link para e-mail: ' + errorMessage);
          });
    },
    async checkSignInLink() {
      this.loading = true;
      if (isSignInWithEmailLink(auth, window.location.href)) {
        const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
        const emailFromUrl = urlParams.get('email');
        const email = window.localStorage.getItem('emailForSignIn') || emailFromUrl || window.prompt('Informe seu email para login:');

        try {
          const result = await signInWithEmailLink(auth, email, window.location.href);
          if (result.user.accessToken) {
            this.loading = false;
            this.registros.email = email;
            sessionStorage.setItem('email', this.registros.email);
            this.marcarValidacao('e-mail');
          }
        } catch (error) {
          console.error('Erro ao fazer login:', error);
          this.loading = false;
        }
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  height: 100vh;
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
  margin-bottom: 20px;
}

.icone {
  width: 58px;
  height: 58px;
  object-fit: cover;
}

.cabecalho h5 {
  flex: 1;
  text-align: center;
}
</style>
