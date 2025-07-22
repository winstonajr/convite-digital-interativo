<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import type { Component } from 'vue'

interface Props {
  name: string
}
const props = defineProps<Props>()

const iconComponent = defineAsyncComponent<Component>(async () => {
  const lucide = await import('lucide-vue-next')
  const icons = lucide.icons as Record<string, Component> // Força o tipo correto

  const icon = icons[props.name]

  if (!icon) {
    throw new Error(`Ícone "${props.name}" não encontrado em lucide-vue-next`)
  }

  return icon
})
</script>

<template>
  <component :is="iconComponent" />
</template>
