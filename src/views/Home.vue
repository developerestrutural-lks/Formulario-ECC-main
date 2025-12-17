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
              <input type="text" id="nome" class="form-control" v-model="registros.nome" required />
            </div>
            <div class="mb-3">
              <label class="form-label text-dark" for="cpf">CPF:</label>
              <input type="text" id="cpf" class="form-control" v-model="registros.cpf" v-mask="'###.###.###-##'"
                required />
            </div>
            <div class="text-center">
              <button type="submit" class="btn btn-primary">Entrar</button>
            </div>
          </form>
          <br>

          <div id="buttonDiv"></div>
          <br>

          <div class="mb-3">
            <div class="input-group">
              <input type="text" class="form-control" v-model="registros.celular" v-mask="'(##)#####-####'"
                placeholder="Login com celular: (61)99999-9999" />
              <button class="btn btn-primary" type="button" @click="sendCode">Enviar código</button>
              <small class="form-text text-muted">Informe seu número de celular com DDD no formato: (61)
                99999-9999.</small>
            </div>
            <div v-if="confirmationResult" class="input-group" style="top: 6px;">
              <input type="text" class="form-control" v-model="verificationCode" placeholder="Código" />
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
      <LoadingSpinner :show="loading" />
    </div>
  </div>
</template>

<script>
import { auth } from "@/firebaseConfig";
import { RecaptchaVerifier, signInWithPhoneNumber, sendSignInLinkToEmail, signInWithEmailLink, isSignInWithEmailLink } from "firebase/auth";
import LoadingSpinner from '@/views/LoadingSpinner.vue';

export default {
  name: 'Home',
  components: { LoadingSpinner },
  data() {
    return {
      API_URL: 'https://app.seg.inf.br/novo/api/tela/listByOne',
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
      confirmationResult: null
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
        let dados = JSON.stringify({
          email: this.registros.email,
          nome: this.registros.nome,
          cpf: this.registros.cpf
        });
        sessionStorage.setItem('user', dados);
        sessionStorage.setItem('email', this.registros.email);
        return this.verificarEmailExistente();
      } else {
        return window.alert('O Email não é válido!');
      }
    },

    // Validação do Gmail e caso validado faz login no sistema com o email.
    async verificarEmailExistente() {
      let query;
      query = `
          SELECT pessoa_id     id
               , pessoa_email  pessoa_email
               , conjuge_email conjuge_email
          FROM bi.td_pessoa
          WHERE ( (fc_sem_acentos_maiusculos(pessoa_email) LIKE
                  ('%' || fc_sem_acentos_maiusculos('${this.registros.email}') || '%'))
            OR (fc_sem_acentos_maiusculos(conjuge_email) LIKE
                ('%' || fc_sem_acentos_maiusculos('${this.registros.email}') || '%')))`;

      const data = { query: query }
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }

      await fetch(this.API_URL, requestOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro ao chamar a API: ' + response.statusText);
          }
          return response.json();
        })
        .then(data => {
          if (Object.keys(data).length > 0) {
            this.login();
          }
        })
        .catch(error => {
          console.log('Erro na chamada à API:', error);
          return window.alert('Erro: ', error);
        })
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
        { theme: "outline", size: "large" }
      );
      window.google.accounts.id.prompt();

    },

    // Login padrão no sistema por CPF e Nome da Pessoa completos. Caso as outras opções de login sejam usadas, é validado pela coluna associada ao método.
    async login() {
      this.loading = true;

      let dados = JSON.stringify({
        email: this.registros.email,
        nome: this.registros.nome,
        cpf: this.registros.cpf
      });
      sessionStorage.setItem('user', dados);

      let query;
      let where;

      if (this.registros.email) {
        where = `( fc_sem_acentos_maiusculos(pessoa_email) LIKE
              '%' || fc_sem_acentos_maiusculos('${this.registros.email}') || '%'
               OR  fc_sem_acentos_maiusculos(conjuge_email) LIKE
              '%' || fc_sem_acentos_maiusculos('${this.registros.email}') || '%'  )`;
      } else if (this.registros.celular) {
        let celular = this.registros.celular.replace(/[^a-z0-9]/gi, '');
        where = `(fc_sem_acentos_maiusculos(pessoa_celular) LIKE
              '%' || fc_sem_acentos_maiusculos('${celular}') || '%'
               OR fc_sem_acentos_maiusculos(conjuge_celular) LIKE
              '%' || fc_sem_acentos_maiusculos('${celular}') || '%')`
      } else {
        where = `(
        ( fc_sem_acentos_maiusculos(pessoa_nome) = fc_sem_acentos_maiusculos('${this.registros.nome}')
        AND fc_sem_acentos_maiusculos(pessoa_cpf) = fc_sem_acentos_maiusculos('${this.registros.cpf}') ) 
          OR
        ( fc_sem_acentos_maiusculos(conjuge_nome) = fc_sem_acentos_maiusculos('${this.registros.nome}')
        AND fc_sem_acentos_maiusculos(conjuge_cpf) = fc_sem_acentos_maiusculos('${this.registros.cpf}') )
        )`;
      }

      query = `SELECT *
                 FROM bi.td_pessoa
                 WHERE pessoa_gestor_id = 12
                   AND pessoa_origem_tipo_dom = 5738
                   AND ${where}`

          console.log(query);
      const data = { query: query }
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }

      await fetch(this.API_URL, requestOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro ao chamar a API: ' + response.statusText);
          }
          return response.json();
        })
        .then(async data => {
          if (Object.keys(data).length > 0) {
            this.loading = false;
            return this.$router.push('/form');
          } else {
            this.loading = false;
            return this.$router.push('/form');
          }
        })
        .catch(error => {
          console.log('Erro na chamada à API:', error);
          this.loading = false;
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
          return await this.login();
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
            this.login();
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
