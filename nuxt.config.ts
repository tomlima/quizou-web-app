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
      apiBase: "http://localhost:5000/api/v1",
      imageBase: "https://quizou.s3.amazonaws.com/quizzes"
    }
  },
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@pinia/nuxt"],
  css: ["~/assets/css/main.css"],
})
