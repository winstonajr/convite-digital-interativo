import { ref, readonly, defineComponent, h, TransitionGroup } from 'vue'
import type { VNode } from 'vue'

// --- Interfaces e Estado ---
interface ToastNotification {
  id: number
  message: string
  type: 'success' | 'error'
}

// O estado das notificações é interno ao módulo, agindo como um singleton.
const notifications = ref<ToastNotification[]>([])
let idCounter = 0

// --- Função Composable ---
// Use esta função em qualquer componente para poder exibir toasts.
export function useToast() {
  function showToast(message: string, type: 'success' | 'error' = 'success', duration = 3000) {
    const id = idCounter++
    notifications.value.push({ id, message, type })
    setTimeout(() => {
      notifications.value = notifications.value.filter((n) => n.id !== id)
    }, duration)
  }

  return {
    showToast,
    notifications: readonly(notifications), // Exporta uma versão somente leitura para segurança
  }
}

// --- Componente do Container ---
// Coloque <ToastContainer /> uma vez no seu App.vue. Ele renderizará os toasts.
export const ToastContainer = defineComponent({
  name: 'ToastContainer',
  setup() {
    const toastContainerStyles = {
      position: 'fixed',
      top: '1.5rem',
      right: '1.5rem',
      zIndex: 1100, // Acima do modal
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
    }

    const notificationBaseStyle = {
      borderRadius: '8px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
      padding: '0.75rem 1.25rem',
      color: 'white',
      fontWeight: 500,
      fontSize: '0.9rem',
      minWidth: '250px',
    }

    // Usando a função de renderização `h` do Vue para criar o componente de forma programática.
    return (): VNode =>
      h('div', { style: toastContainerStyles }, [
        h(
          TransitionGroup,
          { name: 'toast', tag: 'div' },
          {
            default: () =>
              notifications.value.map((n) =>
                h(
                  'div',
                  {
                    key: n.id,
                    class: n.type === 'success' ? 'toast-success' : 'toast-error',
                    style: notificationBaseStyle,
                  },
                  n.message,
                ),
              ),
          },
        ),
      ])
  },
})
