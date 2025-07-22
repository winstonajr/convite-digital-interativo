<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AppIcon from './UI/AppIcon.vue'

defineProps<{
  title: string
  icon: string
}>()

const sectionRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)

let observer: IntersectionObserver

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true
        observer.unobserve(entry.target) // Anima apenas uma vez
      }
    },
    { threshold: 0.1 }, // Ativa quando 10% da seção está visível
  )

  if (sectionRef.value) {
    observer.observe(sectionRef.value)
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<template>
  <section ref="sectionRef" class="invitation-section" :class="{ 'is-visible': isVisible }">
    <div class="section-header">
      <AppIcon :name="icon" class="text-[var(--brand-gold)]" :size="32" />
      <h3 class="font-['Cormorant_Garamond',_serif] text-4xl text-center mt-2">{{ title }}</h3>
    </div>
    <div class="section-content">
      <slot></slot>
    </div>
  </section>
</template>

<style scoped>
.invitation-section {
  padding: 3rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
  transform: translateY(30px);
  transition:
    opacity 0.8s ease-out,
    transform 0.8s ease-out;
}

.invitation-section.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.section-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.section-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
</style>
