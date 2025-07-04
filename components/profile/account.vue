<template>
  <UContainer>
    <UCard class="p-10 mt-30 w-full md:w-7/10 mx-auto">
      <template #header>
        <div>
          <h1 class="pt-5 pb-5">Bem-vindo {{ user?.name }}!</h1>
        </div>
      </template>

       <UForm :state="state" class="space-y-4" @submit="alert('test')">
          <UFormField label="Email" name="email">
            <UInput v-model="state.email" />
          </UFormField>

          <UFormField label="Nome" name="name">
            <UInput v-model="state.name" type="text" />
          </UFormField>

          <UButton type="submit">
            Salvar
          </UButton>
      </UForm>    
      <template #footer>
        <Placeholder class="h-8" />
      </template>
    </UCard>     
  </UContainer>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useRouter } from 'vue-router'; 
const auth = useAuthStore();
const router = useRouter();
const isAuthenticated = computed(() => auth.isAuthenticated);
const userId = computed(() => auth.userId);

const state = reactive({
  email: '',
  name: ''
})


const { data: user, pending: loadingUser } =
  await useFetch<string>(`http://localhost:5035/api/v1/users/${userId.value}`, {
    server: true,
    key: `user-${userId.value}`
  });

 watchEffect(() => {
  if (!isAuthenticated.value) {
    router.push('/');
  }
  if (user.value) {
    state.email = user.value.email
    state.name = user.value.name
  }
});

</script>







