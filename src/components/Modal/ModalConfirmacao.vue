<script setup lang="ts">
import { ref, computed } from 'vue'
import QrcodeVue from 'qrcode.vue'
import { Gift as GiftIcon } from 'lucide-vue-next'
import AppButton from '../UI/AppButton.vue'
import { usePhoneMask } from '../../composables/usePhoneMask'
import { useToast } from '../../composables/useToast'
import giftsData from '../../data/gifts.json'

const emit = defineEmits(['submit', 'close'])
const { showToast } = useToast()

const formStep = ref<'form' | 'giftSelection' | 'qrCode'>('form')

// --- Etapa 1: Formulário de Presença ---
const name = ref('')
const phone = ref('')
const attending = ref<'Sim' | 'Não' | ''>('')
const isSubmitting = ref(false)
usePhoneMask(phone)

// --- Etapa 2: Seleção de Presentes ---
interface Gift {
  id: number
  phrase: string
  amount: number | null
  image: string | null
}

// MUDANÇA: Os dados dos presentes agora vêm do arquivo importado
const gifts = ref<Gift[]>(giftsData)

// --- Etapa 3: QR Code ---
const selectedGift = ref<Gift | null>(null)
const customAmount = ref<number | null>(null)

// O restante da lógica do script permanece o mesmo
async function submitForm() {
  if (!name.value || phone.value.length < 14 || !attending.value) {
    showToast('Por favor, preencha todos os campos.', 'error')
    return
  }
  isSubmitting.value = true
  const googleFormUrl =
    'https://docs.google.com/forms/u/0/d/e/1FAIpQLSeN9LujFwHWLzL_xvOgNJmY_F0eBJDMeG75A_bcU9O2meBqzg/formResponse'
  const formData = new FormData()
  formData.append('entry.947040223', name.value)
  formData.append('entry.117035968', phone.value)
  formData.append('entry.917586526', attending.value)

  try {
    await fetch(googleFormUrl, { method: 'POST', body: formData, mode: 'no-cors' })
    showToast('Confirmação enviada com sucesso!', 'success')

    if (attending.value === 'Sim') {
      emit('submit', { name: name.value, keepOpen: true })
      formStep.value = 'giftSelection'
    } else {
      emit('submit', { name: name.value, keepOpen: false })
    }
  } catch (error) {
    console.error('Erro ao enviar para o Google Forms:', error)
    showToast('Ocorreu um erro ao enviar. Tente novamente.', 'error')
  } finally {
    isSubmitting.value = false
  }
}

function selectGift(gift: Gift) {
  selectedGift.value = gift
  if (gift.amount === null && !customAmount.value) {
    customAmount.value = null
  }
  formStep.value = 'qrCode'
}

function goBackToSelection() {
  selectedGift.value = null
  formStep.value = 'giftSelection'
}

async function copyPixCode() {
  if (!pixPayload.value || pixPayload.value === 'ERRO_CONFIGURACAO') return
  try {
    await navigator.clipboard.writeText(pixPayload.value)
    showToast('Código PIX copiado!', 'success')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    showToast('Não foi possível copiar o código.', 'error')
  }
}

function generatePixPayload(
  key: string,
  merchantName: string,
  city: string,
  txid: string,
  amount?: number,
) {
  const formattedMerchantName = merchantName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .substring(0, 25)
  const formattedCity = city
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .substring(0, 15)
  const formattedTxid = txid
    .normalize('NFD')
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 25)

  const formatField = (id: string, value: string) => {
    const length = value.length.toString().padStart(2, '0')
    return `${id}${length}${value}`
  }

  const payload = [
    formatField('00', '01'),
    formatField('26', `${formatField('00', 'BR.GOV.BCB.PIX')}${formatField('01', key)}`),
    formatField('52', '0000'),
    formatField('53', '986'),
  ]

  if (amount) {
    payload.push(formatField('54', amount.toFixed(2)))
  }

  payload.push(
    formatField('58', 'BR'),
    formatField('59', formattedMerchantName),
    formatField('60', formattedCity),
    formatField('62', formatField('05', formattedTxid)),
  )

  const payloadString = payload.join('')
  const dataToCrc = payloadString + '6304'

  let crc = 0xffff
  for (let i = 0; i < dataToCrc.length; i++) {
    crc ^= dataToCrc.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1
    }
  }

  const crcValue = (crc & 0xffff).toString(16).toUpperCase().padStart(4, '0')
  return `${dataToCrc}${crcValue}`
}

const pixPayload = computed(() => {
  if (!selectedGift.value) return ''

  const isCustomAmountGift = selectedGift.value.amount === null
  if (isCustomAmountGift && (!customAmount.value || customAmount.value <= 0)) {
    return ''
  }

  const pixKey = import.meta.env.VITE_PIX_KEY
  const recipientName = import.meta.env.VITE_PIX_RECIPIENT_NAME
  const recipientCity = import.meta.env.VITE_PIX_RECIPIENT_CITY

  if (!pixKey || !recipientName || !recipientCity) {
    console.error('Variáveis de ambiente do PIX não configuradas no arquivo .env')
    return 'ERRO_CONFIGURACAO'
  }

  const finalAmount = isCustomAmountGift ? customAmount.value! : selectedGift.value.amount!

  return generatePixPayload(
    pixKey,
    recipientName,
    recipientCity,
    `casamento${selectedGift.value.id}`,
    finalAmount,
  )
})
</script>

<template>
  <div class="modal-content">
    <div v-if="formStep === 'form'" class="text-center">
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

    <div v-else-if="formStep === 'giftSelection'" class="text-center">
      <h3 class="modal-title">Um Pix de Amor</h3>
      <p class="modal-subtitle">
        Seu carinho é o maior presente, mas se desejar nos abençoar, escolha uma mensagem!
      </p>
      <div class="mt-6 space-y-3">
        <div v-for="gift in gifts" :key="gift.id" @click="selectGift(gift)" class="gift-item">
          <div class="gift-icon-container">
            <GiftIcon :size="28" stroke-width="1.5" />
          </div>
          <div class="gift-text">
            <p class="gift-phrase">{{ gift.phrase }}</p>
            <p v-if="gift.amount" class="gift-amount">R$ {{ gift.amount.toFixed(2) }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="formStep === 'qrCode' && selectedGift" class="text-center">
      <h3 class="modal-title">Agradecemos seu carinho!</h3>
      <p class="modal-subtitle italic mt-4 mb-2">"{{ selectedGift.phrase }}"</p>

      <div v-if="selectedGift.image" class="selected-gift-image">
        <img :src="selectedGift.image" alt="Foto do casal" />
      </div>

      <div v-if="selectedGift.amount === null" class="mb-4 mt-6 text-left">
        <label for="customAmount" class="form-label">Digite o valor do presente:</label>
        <input
          v-model.number="customAmount"
          id="customAmount"
          type="number"
          placeholder="Ex: 50.00"
          class="form-input text-center"
        />
      </div>

      <div class="qr-container" v-if="pixPayload && pixPayload !== 'ERRO_CONFIGURACAO'">
        <QrcodeVue :value="pixPayload" :size="220" level="H" />
      </div>
      <div v-else-if="pixPayload === 'ERRO_CONFIGURACAO'" class="text-red-600 font-semibold">
        Erro ao gerar o QR Code. Por favor, avise aos noivos.
      </div>
      <div v-else class="text-stone-500 font-semibold p-4">
        {{
          selectedGift.amount === null
            ? 'Digite um valor acima para gerar o QR Code.'
            : 'Gerando QR Code...'
        }}
      </div>

      <div class="mt-6 space-y-3">
        <AppButton @click="copyPixCode" size="large" class="w-full" :disabled="!pixPayload"
          >Copiar Código PIX</AppButton
        >
        <button @click="goBackToSelection" class="back-button">← Escolher outra opção</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-content {
  max-height: 85vh;
  overflow-y: auto;
  padding: 0.5rem 1rem;
}
.modal-content::-webkit-scrollbar {
  width: 8px;
}
.modal-content::-webkit-scrollbar-track {
  background: #f7f7f7;
  border-radius: 10px;
}
.modal-content::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 10px;
  border: 2px solid #f7f7f7;
}

.modal-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.25rem;
  color: var(--brand-fuchsia-dark);
}
.modal-subtitle {
  color: #57534e;
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
  border: 1px solid #fce7f3;
  border-radius: 8px;
  padding: 0.6rem 0.75rem;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}
.form-input:focus {
  outline: none;
  border-color: #f59e0b;
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
  transition: all 0.2s;
}
input[type='radio']:checked + .radio-label {
  border-color: #f59e0b;
  background-color: #fffbeb;
}
.radio-input {
  margin-right: 0.5rem;
  accent-color: var(--brand-fuchsia-dark);
  width: 1.1rem;
  height: 1.1rem;
}
.gift-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border: 1px solid #fce7f3;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-align: left;
}
.gift-item:hover {
  border-color: #f59e0b;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}
.gift-icon-container {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background-color: #fdf2f8; /* pink-50 */
  color: var(--brand-fuchsia-dark);
}
.gift-text {
  flex-grow: 1;
}
.gift-phrase {
  color: var(--brand-fuchsia-dark);
  font-weight: 500;
}
.gift-amount {
  color: #57534e;
  font-size: 0.875rem;
  font-weight: 600;
}
.selected-gift-image {
  max-width: 150px;
  margin: 1.5rem auto 1.5rem;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #fce7f3;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.selected-gift-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.qr-container {
  background-color: white;
  padding: 1rem;
  border: 1px solid #fce7f3;
  border-radius: 8px;
  display: inline-block;
}
.back-button {
  background: none;
  border: none;
  color: #57534e;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem;
  width: 100%;
  border-radius: 8px;
  transition: background-color 0.2s;
}
.back-button:hover {
  background-color: #f5f5f4;
}
.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 1rem;
}
.space-y-3 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 0.75rem;
}
.w-full {
  width: 100%;
}
.text-center {
  text-align: center;
}
.text-left {
  text-align: left;
}
</style>
