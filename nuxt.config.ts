// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@privyid/persona',
    '@privyid/persona-icon',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxtjs/google-fonts',
    '@sidebase/nuxt-auth',
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore', 'storeToRefs'],
      },
    ],
    [
      '@vee-validate/nuxt',
      {
        // disable or enable auto imports
        autoImports: true,
        // Use different names for components
        componentNames: {
          Form: 'VeeForm',
          Field: 'VeeField',
          FieldArray: 'VeeFieldArray',
          ErrorMessage: 'VeeErrorMessage',
        },
      },
    ],
  ],
  postcss: {
    plugins: {
      'postcss-hexrgba': {},
      'tailwindcss/nesting': {},
      'tailwindcss': {},
      'postcss-lighten-darken': {},
      'autoprefixer': {},
    },
  },
  googleFonts: {
    families: {
      "Playfair Display": true,
      Poppins: true,
    }
  },
  routeRules: {
    '/internal': {
      redirect: '/internal/dashboard'
    }
  },
  imports: {
    // Auto-import pinia stores defined in `~/stores`
    dirs: ['stores'],
  },
  runtimeConfig: {
    authSecretKey: process.env.NUXT_AUTH_SECRET_KEY || '',
    jwtSecretKey: process.env.NUXT_JWT_SECRET_KEY || '',
    googleClientID: process.env.NUXT_GOOGLE_CLIENT_ID || '',
    googleClientSecret: process.env.NUXT_GOOGLE_CLIENT_SECRET || '',
    minioEndpoint: process.env.NUXT_MINIO_ENDPOINT || '',
    minioBaseUrl: process.env.NUXT_MINIO_BASE_URL || '',
    minioSSL: process.env.NUXT_MINIO_SSL || '',
    minioAccessKey: process.env.NUXT_MINIO_ACCESS_KEY || '',
    minioSecretKey: process.env.NUXT_MINIO_SECRET_KEY || '',
    minioBucket: process.env.NUXT_MINIO_BUCKET || '',
    minioRegion: process.env.NUXT_MINIO_REGION || '',
  },
  auth: {
    provider: {
      type: 'authjs',
      trustHost: false,
      defaultProvider: 'google',
      addDefaultCallbackUrl: true
    }
  },
})
