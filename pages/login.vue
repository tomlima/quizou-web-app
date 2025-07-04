<template>
  <UContainer class="mt-20">
    <UCard class="w-full md:w-[400px] mx-auto pt-5 pb-5 login">
      <template #header>
        <div class="flex flex-col items-center">
          <img class="login__image" src="/icons/lock-account.png" alt="Login" />
          <h1 class="mt-5 mb-5">Faça login</h1>
          <p class="text-center">
            E aproveite todos os recursos que o Battle Quiz oferece.
          </p>
        </div>
      </template>

      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4 flex flex-col items-center"
        @submit="onSubmit"
      >
        <UFormField label="Email" name="email" size="xl">
          <UInput v-model="state.email" />
        </UFormField>

        <UFormField label="Password" name="password" size="xl">
          <UInput v-model="state.password" type="password" />
        </UFormField>

        <UButton type="submit"> Submit </UButton>
      </UForm>

      <template #footer>
        <div class="mt-5 flex flex-col justify-center items-center">
          <span
            >Ainda não tem conta? crie a sua
            <NuxtLink class="text-primary" to="/nova-conta"
              >aqui</NuxtLink
            ></span
          >
          <span
            ><NuxtLink class="text-primary" to="/nova-conta"
              >Esqueci minha senha</NuxtLink
            ></span
          >
        </div>
      </template>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import * as v from "valibot";
import type { FormSubmitEvent } from "@nuxt/ui";
import type { LoginResponse } from "~/types/entity/auth";
const config = useRuntimeConfig()
const schema = v.object({
  email: v.pipe(v.string(), v.email("Email inválido")),
  password: v.pipe(
    v.string(),
    v.minLength(4, "Necessário pelo menos 4 caracteres")
  ),
});

type Schema = v.InferOutput<typeof schema>;

const state = reactive({
  email: "",
  password: "",
});

const toast = useToastMessage();
const router = useRouter();
const auth = useAuthStore();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const response = await $fetch<LoginResponse>(
      `${config.public.apiBase}/auth/login`,
      {
        method: "POST",
        body: {
          email: event.data.email,
          password: event.data.password,
        },
      }
    );

    const token = response.token;
    auth.login(token);
    toast("success", "Login realizado com sucesso!");
    router.push({ name: "index" });  
  } catch (error: any) {
    toast("error", "verifique suas credenciais");    
  }
}
</script>

<style scoped style="scss">
.login,
span,
a {
  font-size: 0.8rem;
}

.login h1 {
  font-size: 40px;
}
</style>
