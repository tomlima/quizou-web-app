export default defineNuxtConfig({
  app: {
    head: {
      title: "Quizou - Desafie seus conhecimentos",
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "/favicon.png"
        }
      ]
    }
  },
  runtimeConfig: {
    public: {
      apiBase: "https://localhost:7089/api/v1"
    }
  },
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@pinia/nuxt"],
  css: ["~/assets/css/main.css"],
})
