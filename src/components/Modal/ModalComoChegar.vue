<script setup lang="ts">
import AppButton from '../UI/AppButton.vue'
import AppIcon from '../UI/AppIcon.vue'

defineProps<{
  location: string
  mapUrl: string
  mapLink: string
}>()
</script>

<template>
  <div class="text-center">
    <h3 class="modal-title">Como Chegar</h3>
    <p class="modal-subtitle">
      O evento será na <strong class="text-[var(--brand-fuchsia-dark)]">{{ location }}</strong
      >.
    </p>

    <div class="mt-6 aspect-video w-full rounded-lg overflow-hidden border-2 border-pink-100">
      <iframe
        class="w-full h-full"
        :src="mapUrl"
        style="border: 0"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>

    <AppButton is="a" :href="mapLink" target="_blank" class="mt-6 w-full" size="large">
      <AppIcon name="Navigation" class="mr-2" />
      Abrir no Google Maps
    </AppButton>
  </div>
</template>

<style scoped>
.modal-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.25rem;
  color: var(--brand-fuchsia-dark);
}
.modal-subtitle {
  color: #57534e;
  margin-top: 0.5rem;
}
</style>
