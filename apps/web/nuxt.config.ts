// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      title: 'Ask Project',
      meta: [
        { name: 'description', content: 'Ask Project 是一个面向项目思考、任务推进和交付协作的工作空间。' },
        { property: 'og:title', content: 'Ask Project' },
        { property: 'og:description', content: '把想法、任务和交付节奏整理成清晰的项目工作流。' },
        { property: 'og:url', content: 'https://project.askmewhy.cn' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ],
      link: [
        { rel: 'canonical', href: 'https://project.askmewhy.cn' }
      ]
    }
  }
})
