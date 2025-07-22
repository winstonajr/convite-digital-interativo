<script setup lang="ts">
import { ref } from 'vue'
import AppButton from '../UI/AppButton.vue'
import { usePhoneMask } from '../../composables/usePhoneMask'
import { useToast } from '../../composables/useToast'

// O evento agora se chama 'submitted' para clareza
const emit = defineEmits(['submitted'])
const { showToast } = useToast()

const name = ref('')
const phone = ref('')
const attending = ref<'Sim' | 'Não' | ''>('')
const isSubmitting = ref(false)

usePhoneMask(phone)

// Função de submissão atualizada para enviar ao Google Forms
async function submitForm() {
  // 1. Validação dos campos (continua a mesma)
  if (!name.value || phone.value.length < 14 || !attending.value) {
    showToast('Por favor, preencha todos os campos.', 'error')
    return
  }

  isSubmitting.value = true

  // 2. Preparação dos dados para o Google Forms
  const googleFormUrl =
    'https://docs.google.com/forms/u/0/d/e/1FAIpQLSeN9LujFwHWLzL_xvOgNJmY_F0eBJDMeG75A_bcU9O2meBqzg/formResponse'
  const formData = new FormData()
  formData.append('entry.947040223', name.value)
  formData.append('entry.117035968', phone.value)
  formData.append('entry.917586526', attending.value)

  try {
    // 3. Envio da requisição assíncrona
    await fetch(googleFormUrl, {
      method: 'POST',
      body: formData,
      mode: 'no-cors', // Importante para evitar erros de CORS
    })

    // 4. Feedback de sucesso
    showToast('Confirmação enviada com sucesso!', 'success')

    // LINHA CORRIGIDA: O nome é enviado junto com o evento 'submitted'
    emit('submitted', { name: name.value })

    // Opcional: Limpar o formulário após o envio
    name.value = ''
    phone.value = ''
    attending.value = ''
  } catch (error) {
    console.error('Erro ao enviar para o Google Forms:', error)
    showToast('Ocorreu um erro ao enviar. Tente novamente.', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="text-center">
    <h3 class="modal-title">Confirmar Presença</h3>
    <p class="modal-subtitle">Ficaremos felizes em saber se você poderá celebrar conosco.</p>

    <form @submit.prevent="submitForm" class="mt-6 text-left space-y-4">
      <div>
        <label for="name" class="form-label">Nome completo:</label>
        <input v-model="name" id="name" type="text" required class="form-input" />
      </div>
      <div>
        <label for="phone" class="form-label">Celular (com DDD):</label>
        <input
          v-model="phone"
          id="phone"
          type="tel"
          required
          placeholder="(XX) XXXXX-XXXX"
          class="form-input"
        />
      </div>
      <fieldset>
        <legend class="form-label mb-2">Você poderá comparecer?</legend>
        <div class="flex gap-4">
          <label class="radio-label">
            <input
              type="radio"
              v-model="attending"
              value="Sim"
              name="attending"
              class="radio-input"
            />
            Sim
          </label>
          <label class="radio-label">
            <input
              type="radio"
              v-model="attending"
              value="Não"
              name="attending"
              class="radio-input"
            />
            Não
          </label>
        </div>
      </fieldset>
      <div class="pt-4">
        <AppButton type="submit" size="large" class="w-full" :is-loading="isSubmitting">
          Enviar Confirmação
        </AppButton>
      </div>
    </form>
  </div>
</template>

<style scoped>
.modal-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.25rem;
  color: var(--brand-fuchsia-dark);
}
.modal-subtitle {
  color: #57534e; /* stone-600 */
  margin-top: 0.5rem;
}
.form-label {
  display: block;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  color: var(--brand-fuchsia-dark);
}
.form-input {
  width: 100%;
  border: 1px solid #fce7f3; /* pink-100 */
  border-radius: 8px;
  padding: 0.6rem 0.75rem;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}
.form-input:focus {
  outline: none;
  border-color: var(--brand-gold);
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.3);
}
.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border: 1px solid #fce7f3;
  border-radius: 8px;
  flex-grow: 1;
  justify-content: center;
}
.radio-input {
  margin-right: 0.5rem;
  accent-color: var(--brand-fuchsia);
  width: 1.1rem;
  height: 1.1rem;
}
</style>
