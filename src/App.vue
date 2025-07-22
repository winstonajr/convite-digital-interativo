<script setup lang="ts">
import { ref, reactive, shallowRef, computed, onMounted } from 'vue'
import type { Component } from 'vue'

// Componentes
import InvitationSection from './components/InvitationSection.vue'
import ModalWrapper from './components/Modal/ModalWrapper.vue'
import ModalConfirmacao from './components/Modal/ModalConfirmacao.vue'
import ModalComoChegar from './components/Modal/ModalComoChegar.vue'
import ModalPresentear from './components/Modal/ModalPresentear.vue'
import AppButton from './components/UI/AppButton.vue'
import AppIcon from './components/UI/AppIcon.vue'

// Composables
import { /*useToast,*/ ToastContainer } from './composables/useToast'

// --- DADOS DO EVENTO (Poderia vir de uma API) ---
const eventData = reactive({
  bride: 'Melk',
  groom: 'Sabrina',
  imageSrc: '/casal.webp',
  eventDate: '18 de Outubro de 2025',
  eventTime: 'às 16:00 horas',
  ceremonyLocation: 'Quinta das Alamandas',
  ceremonyAddress: 'BR316, S/n - Titanlândia, Castanhal/PA',
  mapUrl: import.meta.env.VITE_MAP_URL,
  mapLink: import.meta.env.VITE_MAP_LINK,
  pixKey: import.meta.env.VITE_PIX_KEY,
})
// --- CONTROLE DE ESTADO DA UI ---
const isRevealed = ref(false)
const activeModal = shallowRef<Component | null>(null)
//const { showToast } = useToast()

const modalProps = computed(() => {
  if (activeModal.value === ModalComoChegar) {
    return {
      location: eventData.ceremonyLocation,
      mapUrl: eventData.mapUrl,
      mapLink: eventData.mapLink,
    }
  }
  if (activeModal.value === ModalPresentear) {
    return { pixKey: eventData.pixKey }
  }
  return {}
})

function revealInvitation() {
  isRevealed.value = true
  document.body.style.overflow = 'auto' // Libera o scroll
}

function openModal(modalComponent: Component) {
  activeModal.value = modalComponent
}

function closeModal() {
  activeModal.value = null
}

async function handleConfirmationSubmit(formData: { name: string }) {
  console.log('Recebido:', formData)
  await new Promise((resolve) => setTimeout(resolve, 1500))
  //showToast(`Obrigado por confirmar, ${formData.name}!`, 'success')
  closeModal()
}

onMounted(() => {
  // UX: Impede o scroll antes do convite ser revelado
  document.body.style.overflow = 'hidden'
})
</script>

<template>
  <ToastContainer />

  <div class="invitation-container font-['Poppins',_sans-serif]">
    <transition name="fade">
      <div v-if="!isRevealed" class="cover">
        <div class="cover-content">
          <h1 class="font-['Cormorant_Garamond',_serif] text-6xl md:text-7xl">
            {{ eventData.bride }} & {{ eventData.groom }}
          </h1>
          <p class="mt-4 text-lg">Temos a alegria de convidar você para o nosso casamento.</p>
          <AppButton @click="revealInvitation" variant="primary" class="mt-8">
            <AppIcon name="Mail" class="mr-2" />
            Abrir Convite
          </AppButton>
        </div>
      </div>
    </transition>

    <main class="invitation-content">
      <header class="main-header">
        <img :src="eventData.imageSrc" alt="Foto dos noivos" class="header-image" />
        <div class="header-overlay"></div>
        <div class="header-text">
          <h2 class="font-['Dancing_Script',_cursive] text-6xl md:text-8xl">Vamos nos Casar!</h2>
          <p class="mt-4 text-xl">
            {{ eventData.bride }} <span class="text-[var(--brand-gold)]">&</span>
            {{ eventData.groom }}
          </p>
        </div>
      </header>

      <InvitationSection title="É com grande alegria que convidamos" icon="Heart">
        <p class="text-center text-lg max-w-2xl mx-auto">
          Para celebrar o capítulo mais esperado de nossa história de amor. Sua presença tornará
          nosso dia ainda mais especial.
        </p>
        <div class="mt-12 text-center">
          <AppButton @click="openModal(ModalConfirmacao)" variant="primary" size="large">
            <AppIcon name="Check" class="mr-2" />
            Confirmar Presença
          </AppButton>
          <p class="text-sm mt-2 text-stone-500">Confirme até 18/09/2025</p>
        </div>
      </InvitationSection>

      <div
        class="my-16 h-px bg-gradient-to-r from-transparent via-[var(--brand-gold)]/30 to-transparent w-2/3 mx-auto"
      ></div>

      <InvitationSection title="A Cerimônia" icon="Church">
        <div class="text-center text-lg">
          <p class="font-bold text-2xl text-[var(--brand-fuchsia-dark)]">
            {{ eventData.eventDate }}
          </p>
          <p class="mt-1">{{ eventData.eventTime }}</p>
          <p class="mt-6 font-semibold text-xl">{{ eventData.ceremonyLocation }}</p>
          <p class="text-base text-stone-500">{{ eventData.ceremonyAddress }}</p>
          <AppButton @click="openModal(ModalComoChegar)" variant="secondary" class="mt-6">
            <AppIcon name="MapPin" class="mr-2" />
            Ver no mapa
          </AppButton>
        </div>
      </InvitationSection>

      <div
        class="my-16 h-px bg-gradient-to-r from-transparent via-[var(--brand-gold)]/30 to-transparent w-2/3 mx-auto"
      ></div>

      <InvitationSection title="Presentes" icon="Gift">
        <p class="text-center text-lg max-w-2xl mx-auto">
          Mais do que qualquer presente, queremos compartilhar esse momento com você. Mas, se quiser
          nos dar um mimo, aceitamos com carinho uma ajuda na nossa lua de mel dos sonhos.
        </p>
        <AppButton @click="openModal(ModalPresentear)" variant="secondary" class="mt-6">
          <AppIcon name="Gift" class="mr-2" />
          Contribuir com nossa lua de mel
        </AppButton>
      </InvitationSection>

      <footer class="py-16 text-center text-stone-500">
        <p class="font-['Dancing_Script',_cursive] text-4xl text-[var(--brand-gold)]">
          Esperamos por você!
        </p>
      </footer>
    </main>

    <ModalWrapper :is-open="!!activeModal" @close="closeModal">
      <component
        :is="activeModal"
        v-bind="modalProps"
        @submit="handleConfirmationSubmit"
        @close="closeModal"
      />
    </ModalWrapper>
  </div>
</template>

<style>
/* Import de fontes globais (pode estar no main.css) */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Poppins:wght@400;600&family=Dancing+Script:wght@500&display=swap');

:root {
  --brand-fuchsia: #d946ef;
  --brand-fuchsia-dark: #a21caf;
  --brand-gold: #f59e0b;
  --card-bg: #fffbeb;
  --bg-warm-light: #fdf2f8;
  --text-main: #44403c; /* stone-700 */
}

body {
  background-color: var(--bg-warm-light);
  color: var(--text-main);
}

.invitation-container {
  background-color: var(--card-bg);
}

/* Estilos da Capa */
.cover {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-warm-light);
  z-index: 100;
  color: var(--text-main);
  text-align: center;
  padding: 1rem;
}
.cover-content {
  max-width: 600px;
}

/* Animação de fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.7s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Conteúdo Principal */
.invitation-content {
  max-width: 1000px;
  margin: 0 auto;
  background-color: #ffffff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.main-header {
  position: relative;
  width: 100%;
  height: 60vh;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

.header-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
}

.header-text {
  position: relative;
  text-align: center;
  color: white;
  text-shadow: 1px 1px 10px rgba(0, 0, 0, 0.5);
}
</style>
