<script setup lang="ts">
import { ref } from 'vue'
import Qrcode from 'qrcode.vue'
import AppButton from '../UI/AppButton.vue'
import AppIcon from '../UI/AppIcon.vue'
import { useToast } from '../../composables/useToast'

const props = defineProps<{
  pixKey: string
}>()

const { showToast } = useToast()
const isCopied = ref(false)

async function copyPix() {
  if (!props.pixKey) {
    showToast('A chave PIX não está configurada.', 'error')
    return
  }
  try {
    await navigator.clipboard.writeText(props.pixKey)
    isCopied.value = true
    showToast('Chave PIX copiada com sucesso!', 'success')
    setTimeout(() => {
      isCopied.value = false
    }, 3000)
  } catch {
    showToast('Erro ao copiar a chave.', 'error')
  }
}
</script>

<template>
  <div class="text-center">
    <h3 class="modal-title">Presente com Carinho</h3>
    <p class="modal-subtitle">
      Sua presença é o nosso maior presente! Mas, se desejar nos mimar, aceitamos com muito amor uma
      contribuição para nossa lua de mel.
    </p>

    <div class="mt-6 flex flex-col items-center">
      <div class="p-2 bg-white border-4 border-pink-100 rounded-lg">
        <Qrcode :value="pixKey" :options="{ width: 220, errorCorrectionLevel: 'H' }" />
      </div>
      <p class="text-sm mt-4 text-stone-500">Escaneie o QR Code com o app do seu banco</p>

      <div class="my-4 flex items-center w-full">
        <div class="flex-grow h-px bg-pink-200"></div>
        <span class="mx-4 text-sm text-stone-500">OU</span>
        <div class="flex-grow h-px bg-pink-200"></div>
      </div>

      <AppButton
        @click="copyPix"
        class="w-full"
        size="large"
        variant="secondary"
        :disabled="isCopied"
      >
        <AppIcon :name="isCopied ? 'Check' : 'Copy'" class="mr-2" />
        {{ isCopied ? 'Chave PIX Copiada!' : 'Copiar Chave PIX' }}
      </AppButton>
    </div>
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
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}
</style>
