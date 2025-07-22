<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import type { Component } from 'vue'

interface Props {
  name: string
}
const props = defineProps<Props>()

// Carrega os ícones dinamicamente para não incluir todos no bundle final
const iconComponent = defineAsyncComponent<Component>(() =>
  import('lucide-vue-next').then((lucide) => lucide[props.name]),
)
</script>

<template>
  <component :is="iconComponent" />
</template>
