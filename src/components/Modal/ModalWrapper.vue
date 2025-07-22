<script setup lang="ts">
import { ref, watch, onUnmounted, nextTick } from 'vue'
import AppIcon from '../UI/AppIcon.vue'

interface Props {
  isOpen: boolean
}
const props = defineProps<Props>()
const emit = defineEmits(['close'])

const modalDialogRef = ref<HTMLElement | null>(null)

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close')
    return
  }

  // Lógica de "Focus Trap" para Acessibilidade
  if (e.key === 'Tab' && modalDialogRef.value) {
    const focusableElements = Array.from(
      modalDialogRef.value.querySelectorAll(
        'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => !(el as HTMLElement).hasAttribute('disabled')) as HTMLElement[]

    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (e.shiftKey) {
      // Shift + Tab (voltando)
      if (document.activeElement === firstElement) {
        lastElement.focus()
        e.preventDefault()
      }
    } else {
      // Tab (avançando)
      if (document.activeElement === lastElement) {
        firstElement.focus()
        e.preventDefault()
      }
    }
  }
}

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeydown)
      // Foca o primeiro elemento interativo quando o modal abre
      nextTick(() => {
        const firstFocusable = modalDialogRef.value?.querySelector(
          'button, input',
        ) as HTMLElement | null
        firstFocusable?.focus()
      })
    } else {
      window.removeEventListener('keydown', handleKeydown)
    }
  },
)

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <transition name="modal-fade">
    <div v-if="isOpen" class="modal-backdrop" @click.self="$emit('close')">
      <div ref="modalDialogRef" class="modal-dialog" role="dialog" aria-modal="true">
        <button @click="$emit('close')" class="close-button" aria-label="Fechar modal">
          <AppIcon name="X" :size="24" />
        </button>
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<style scoped>
/* Estilos e animações do modal... */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(30, 27, 27, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}
.modal-dialog {
  background-color: var(--card-bg);
  color: var(--text-main);
  border-radius: 12px;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}
.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af; /* gray-400 */
  transition: color 0.2s;
}
.close-button:hover {
  color: var(--brand-fuchsia);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-active .modal-dialog,
.modal-fade-leave-active .modal-dialog {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .modal-dialog,
.modal-fade-leave-to .modal-dialog {
  transform: scale(0.9) translateY(20px);
}
</style>
