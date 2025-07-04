<template>
  <UContainer>
    <div class="search flex items-center justify-center">
      <h1>
        Desafie seus <br />
        <b class="text-primary">conhecimentos</b>
      </h1>
      <p>Pesquise aqui algum tema para começar</p>
      <div class="input">
        <input v-model="searchTerm" type="search" />
        <img src="/icons/search.png" alt="" />
      </div>
      <UButton
        :to="`/buscar?term=${encodeURIComponent(searchTerm)}`"
        icon="i-lucide-search"
        size="md"
        color="primary"
        variant="solid"
        >Buscar</UButton
      >
    </div>
  </UContainer>
</template>

<script setup>
import { ref } from "vue";
const searchTerm = ref("");
</script>

<style lang="scss" scoped>
.search {
  z-index: 5;
  height: calc(100vh - 100px);
  flex-direction: column;
  gap: 20px;
  position: relative;
  .input {
    display: flex;
    position: relative;
    height: 100px;
    img {
      position: absolute;
      right: -15px;
      top: -15px;
    }
    input {
      height: 100%;
    }
  }
  h1 {
    font-size: 2.5rem;
    text-align: center;
    word-break: break-word;
    white-space: normal;
    line-height: 2.5rem;
    b {
      text-decoration: underline;
    }
  }
  p {
    text-align: center;
  }
  @media screen and (min-width: 1050px) {
    .input {
      width: 400px;
    }
    h1 {
      font-size: 4rem;
      line-height: 4rem;
    }
  }
}
</style>
