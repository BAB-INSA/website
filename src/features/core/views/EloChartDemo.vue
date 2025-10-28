<!-- src/features/core/views/EloChartDemo.vue -->
<template>
  <div class="container mx-auto py-6 space-y-6">
    <div>
      <h1 class="text-3xl font-bold mb-2">Démo Graphique ELO</h1>
      <p class="text-muted-foreground">
        Exemple d'utilisation du composant EloChart avec des données de test
      </p>
    </div>

    <!-- Exemples avec différents scénarios -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Exemple 1: Progression positive -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold">Progression positive</h2>
        <EloChart 
          :player-id="1" 
          :elo-history="progressiveData"
          :is-loading="false"
        />
      </div>

      <!-- Exemple 2: Fluctuations -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold">Fluctuations</h2>
        <EloChart 
          :player-id="2" 
          :elo-history="fluctuatingData"
          :is-loading="false"
        />
      </div>

      <!-- Exemple 3: État de chargement -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold">État de chargement</h2>
        <EloChart 
          :player-id="3" 
          :elo-history="[]"
          :is-loading="true"
        />
      </div>

      <!-- Exemple 4: Aucune donnée -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold">Aucune donnée</h2>
        <EloChart 
          :player-id="4" 
          :elo-history="[]"
          :is-loading="false"
        />
      </div>
    </div>

    <!-- Instructions d'utilisation -->
    <div class="mt-8 p-6 bg-muted/50 rounded-lg">
      <h3 class="text-lg font-semibold mb-4">Utilisation du composant</h3>
      <pre class="text-sm overflow-x-auto"><code>&lt;EloChart 
  :player-id="playerId" 
  :elo-history="eloHistory"
  :is-loading="isLoading"
/&gt;</code></pre>
      
      <div class="mt-4 space-y-2">
        <p><strong>Props :</strong></p>
        <ul class="list-disc list-inside space-y-1 text-sm">
          <li><code>player-id</code> : ID du joueur (number)</li>
          <li><code>elo-history</code> : Tableau des données historiques (Array)</li>
          <li><code>is-loading</code> : État de chargement (boolean, optionnel)</li>
        </ul>
      </div>

      <div class="mt-4 space-y-2">
        <p><strong>Format des données :</strong></p>
        <pre class="text-xs bg-background p-2 rounded border"><code>[
  {
    date: "2024-01-15T10:30:00Z",
    elo: 1250,
    matchType: "ranked" // optionnel
  },
  // ...
]</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EloChart from '@/features/core/components/EloChart.vue'

// Données de test - Progression positive
const progressiveData = ref([
  { date: "2024-01-01T10:00:00Z", elo: 1000 },
  { date: "2024-01-02T10:00:00Z", elo: 1025 },
  { date: "2024-01-03T10:00:00Z", elo: 1050 },
  { date: "2024-01-04T10:00:00Z", elo: 1080 },
  { date: "2024-01-05T10:00:00Z", elo: 1100 },
  { date: "2024-01-06T10:00:00Z", elo: 1140 },
  { date: "2024-01-07T10:00:00Z", elo: 1170 },
  { date: "2024-01-08T10:00:00Z", elo: 1200 },
  { date: "2024-01-09T10:00:00Z", elo: 1230 },
  { date: "2024-01-10T10:00:00Z", elo: 1280 }
])

// Données de test - Fluctuations
const fluctuatingData = ref([
  { date: "2024-01-01T10:00:00Z", elo: 1200 },
  { date: "2024-01-02T10:00:00Z", elo: 1180 },
  { date: "2024-01-03T10:00:00Z", elo: 1220 },
  { date: "2024-01-04T10:00:00Z", elo: 1190 },
  { date: "2024-01-05T10:00:00Z", elo: 1250 },
  { date: "2024-01-06T10:00:00Z", elo: 1210 },
  { date: "2024-01-07T10:00:00Z", elo: 1240 },
  { date: "2024-01-08T10:00:00Z", elo: 1200 },
  { date: "2024-01-09T10:00:00Z", elo: 1270 },
  { date: "2024-01-10T10:00:00Z", elo: 1230 }
])
</script>