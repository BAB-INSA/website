<template>
  <div class="space-y-6">
    <div class="flex flex-col space-y-2">
      <h2 class="text-2xl font-bold tracking-tight">Bienvenue</h2>
      <p class="text-muted-foreground">
        Découvrez notre plateforme moderne et intuitive
      </p>
    </div>


    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Interface moderne</CardTitle>
          <CardDescription>Une interface utilisateur moderne et responsive</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Personnalisation</CardTitle>
          <CardDescription>Personnalisez votre expérience avec de nombreux thèmes</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Performance</CardTitle>
          <CardDescription>Application rapide et optimisée pour tous les appareils</CardDescription>
        </CardHeader>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSEO } from '@/shared/composables/useSEO'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'

// SEO Configuration for Home page
const seoData = computed(() => ({
  title: 'Accueil',
  description: 'Template Vue 3 avec composants Shadcn/Vue, authentification, PWA et fonctionnalités modernes.',
  ogType: 'website'
}))

useSEO(seoData)
</script>