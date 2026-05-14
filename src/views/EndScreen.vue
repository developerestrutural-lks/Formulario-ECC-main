<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-4">
                <div class="card shadow-lg p-4">
                    <div class="cabecalho">
                        <img src="@/assets/logo_grupo_acao.png" alt="Ícone" class="icone">
                        <h5>ENCONTRO DE CASAIS COM CRISTO</h5>
                    </div>
                    <h5 class="text-center mb-4">Obrigado por nos ajudar a manter o cadastro do ECC atualizado!<br></h5>
                    <h5 class="text-center mb-4">Tudo por Jesus, nada sem Maria.<br></h5>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'EndScreen',
}
</script>
<style scoped>
.login-container {
    height: 100vh;
    /*background: linear-gradient(to right, #007bff, #6610f2);*/
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
    /* border-radius: 8px; */
}

.cabecalho h5 {
    flex: 1;
    text-align: center;
}
</style>