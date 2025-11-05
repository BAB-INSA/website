<!-- src/shared/components/PlayerLink.vue -->
<template>
  <button
    @click="navigateToProfile"
    :class="[
      'text-primary hover:text-primary/80 hover:underline transition-colors cursor-pointer font-medium',
      props.class
    ]"
  >
    {{ displayText }}
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Player } from '@/features/core/types/player'

interface Props {
  player: Player
  showId?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  showId: false,
  class: ''
})

const router = useRouter()

const displayText = computed(() => {
  if (props.showId) {
    return `${props.player.username} (#${props.player.id})`
  }
  return props.player.username
})

const navigateToProfile = () => {
  router.push(`/player/${props.player.id}/profile`)
}
</script>