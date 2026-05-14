<template>
    <div class="loading-overlay" v-if="show">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Carregando...</span>
        </div>
    </div>
</template>
  
<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false,
        },
    },
};
</script>
  
<style scoped>
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}
</style>
  