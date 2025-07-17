<script setup lang="ts">
import { ref, computed, type Component } from 'vue'
import { Copy, Check, X } from 'lucide-vue-next'
import Qrcode from 'qrcode.vue'

interface Props {
  bride?: string;
  groom?: string;
  imageSrc?: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  eventAddress?: string;
  mapUrl?: string;
}

interface ConfirmationForm {
  name: string;
  phone: string;
  attending: 'Sim' | 'Não' | '';
}

type ModalType = 'Confirmar Presença' | 'Como Chegar' | 'Presentear' | null;

const props = withDefaults(defineProps<Props>(), {
  bride: 'Melk',
  groom: 'Sabrina',
  imageSrc: '/casal.webp',
  eventDate: '18 de Outubro de 2025',
  eventTime: 'às 16:00 horas',
  eventLocation: 'Quinta das Alamandas',
  eventAddress: 'BR316, S/n - Titanlândia, Castanhal/PA',
  mapUrl: 'https://maps.app.goo.gl/GVRCReN39HQB1xd5A',
})

const pixKey = import.meta.env.VITE_PIX_KEY;

const modalLabel = ref<ModalType>(null)
const copyButtonText = ref<string>('Copiar Código PIX')
const isCopied = ref<boolean>(false)

const initialFormState: ConfirmationForm = { name: '', phone: '', attending: '' }
const form = ref<ConfirmationForm>({ ...initialFormState })

const copyIcon = computed<Component>(() => (isCopied.value ? Check : Copy))

function openModal(label: ModalType): void {
  modalLabel.value = label
  isCopied.value = false
  copyButtonText.value = 'Copiar Código PIX'
}

function closeModal(): void {
  modalLabel.value = null
}

async function copyPix(): Promise<void> {
  if (!pixKey || pixKey.includes('nao-configurada')) {
    alert('A chave PIX não está configurada no arquivo .env');
    return;
  }
  try {
    await navigator.clipboard.writeText(pixKey)
    isCopied.value = true
    copyButtonText.value = 'Copiado com sucesso!'
    setTimeout(() => {
      isCopied.value = false
      copyButtonText.value = 'Copiar Código PIX'
    }, 2500)
  } catch (err) {
    console.error('Falha ao copiar a chave PIX: ', err)
    alert('Não foi possível copiar a chave. Tente novamente ou use o QR Code.')
  }
}

function submitConfirmation(): void {
  console.log('Confirmação enviada:', form.value)
  alert(`Obrigado por confirmar, ${form.value.name}! Sua resposta foi registrada.`)
  closeModal()
  form.value = { ...initialFormState }
}
</script>

<template>
  <div class="invitation-wrapper min-h-screen bg-gradient-to-b from-[var(--bg-warm-light)] to-[var(--bg-warm-medium)] flex items-center justify-center p-4 antialiased">
    <div class="w-full max-w-md bg-[var(--card-bg)] rounded-2xl shadow-xl shadow-[var(--brand-fuchsia)]/20 overflow-hidden">

      <div class="relative">
        <img :src="props.imageSrc" alt="Foto dos noivos" class="w-full h-80 object-cover" />
        <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[var(--card-bg)] to-transparent"></div>
      </div>

      <div class="px-6 py-8 text-center text-[var(--text-main)]">
        <h2 class="text-4xl font-['Cormorant_Garamond',_serif] tracking-normal text-[var(--brand-fuchsia-dark)]">
          {{ props.bride }} <span class="font-['Dancing_Script',_cursive] text-5xl mx-1 text-[var(--brand-gold)]">&</span> {{ props.groom }}
        </h2>
        <p class="font-['Poppins',_sans-serif] text-[var(--text-main)]/80 text-base mt-4 max-w-xs mx-auto">
          Com alegria, convidamos para a celebração do nosso amor.
        </p>

        <div class="my-8 h-px bg-gradient-to-r from-transparent via-[var(--brand-gold)]/50 to-transparent w-2/3 mx-auto"></div>

        <div class="space-y-2 font-['Poppins',_sans-serif]">
          <p class="text-sm uppercase tracking-wider text-[var(--brand-fuchsia)] font-semibold">
            {{ props.eventDate }}
          </p>
          <p class="text-lg mt-1 text-[var(--text-main)]">
            {{ props.eventTime }}
          </p>
          <p class="text-sm text-[var(--text-main)]/70">
            {{ props.eventLocation }} • {{ props.eventAddress }}
          </p>
        </div>
      </div>

      <div class="px-6 pb-8 text-center font-['Poppins',_sans-serif]">
        <button
          @click="openModal('Confirmar Presença')"
          class="w-full bg-[var(--brand-fuchsia)] text-white px-6 py-3 rounded-lg hover:bg-[var(--brand-fuchsia-dark)] transition-all duration-300 ease-in-out font-semibold tracking-wide shadow-lg shadow-[var(--brand-fuchsia)]/30 hover:shadow-xl hover:shadow-[var(--brand-fuchsia)]/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)] focus:ring-offset-2 focus:ring-offset-[var(--card-bg)]"
        >
          Confirmar Presença
        </button>

        <div class="mt-6 flex justify-center items-center gap-6 text-sm">
          <a @click.prevent="openModal('Como Chegar')" href="#" class="text-[var(--text-main)] hover:text-[var(--brand-gold)] font-medium transition-colors">Como Chegar</a>
          <span class="text-[var(--brand-fuchsia)]/20">•</span>
          <a @click.prevent="openModal('Presentear')" href="#" class="text-[var(--text-main)] hover:text-[var(--brand-gold)] font-medium transition-colors">Presentear</a>
        </div>
      </div>
    </div>

    <transition name="modal-fade">
      <div v-if="modalLabel" class="invitation-wrapper fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div @click.self="closeModal" class="fixed inset-0 cursor-pointer"></div>

        <div class="bg-[var(--card-bg)] rounded-2xl p-8 w-11/12 max-w-md text-center relative shadow-2xl modal-content">
          <button @click="closeModal" class="absolute top-4 right-4 text-[var(--text-main)]/50 hover:text-[var(--brand-fuchsia)] transition-colors">
            <X :size="28" />
          </button>
          <h3 class="font-['Cormorant_Garamond',_serif] text-[var(--brand-fuchsia-dark)] text-3xl mb-6">{{ modalLabel }}</h3>

          <div class="text-base text-[var(--text-main)] text-left sm:text-center font-['Poppins',_sans-serif]">

            <template v-if="modalLabel === 'Confirmar Presença'">
              <form @submit.prevent="submitConfirmation" class="space-y-4 text-left">
                <div>
                  <label class="block text-sm font-medium text-[var(--brand-fuchsia-dark)] mb-1" for="name">Nome completo:</label>
                  <input v-model="form.name" id="name" type="text" required class="w-full border border-[var(--bg-warm-medium)] rounded-lg px-3 py-2 focus:border-[var(--brand-gold)] focus:ring-1 focus:ring-[var(--brand-gold)] transition bg-white/80" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-[var(--brand-fuchsia-dark)] mb-1" for="phone">Celular:</label>
                  <input v-model="form.phone" id="phone" type="tel" required class="w-full border border-[var(--bg-warm-medium)] rounded-lg px-3 py-2 focus:border-[var(--brand-gold)] focus:ring-1 focus:ring-[var(--brand-gold)] transition bg-white/80" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-[var(--brand-fuchsia-dark)] mb-2">Presença confirmada?</label>
                  <div class="flex gap-6 mt-1">
                    <label class="inline-flex items-center cursor-pointer">
                      <input type="radio" v-model="form.attending" value="Sim" required class="mr-2 h-4 w-4 accent-[var(--brand-fuchsia)]" /> Sim
                    </label>
                    <label class="inline-flex items-center cursor-pointer">
                      <input type="radio" v-model="form.attending" value="Não" required class="mr-2 h-4 w-4 accent-[var(--brand-fuchsia)]" /> Não
                    </label>
                  </div>
                </div>
                <button type="submit" class="mt-4 w-full bg-[var(--brand-fuchsia)] text-white px-4 py-2.5 rounded-lg hover:bg-[var(--brand-fuchsia-dark)] transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)] focus:ring-offset-2">Enviar</button>
              </form>
            </template>

            <template v-else-if="modalLabel === 'Como Chegar'">
              <p class="mb-4 text-center">
                O evento será na <strong class="text-[var(--brand-fuchsia-dark)]">{{ props.eventLocation }}</strong>.
              </p>

              <div class="w-full aspect-video rounded-lg overflow-hidden border border-[var(--bg-warm-medium)]">
                <iframe
                  class="w-full h-full"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.797371201507!2d-47.9651371!3d-1.2962011000000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x92a5af2fb531cd01%3A0x92fdbbc9b2d9ae8b!2sHotel%20Quinta%20das%20Alamandas!5e0!3m2!1spt-BR!2sbr!4v1752772505244!5m2!1spt-BR!2sbr"
                  style="border:0;"
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  allowfullscreen
                ></iframe>
              </div>

              <a
                :href="props.mapUrl"
                target="_blank"
                class="inline-block mt-4 w-full bg-[var(--brand-fuchsia)] text-white px-6 py-2.5 rounded-lg hover:bg-[var(--brand-fuchsia-dark)] transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)] focus:ring-offset-2 text-center"
              >
                Abrir no Google Maps
              </a>
            </template>


            <template v-else-if="modalLabel === 'Presentear'">
              <div class="text-center">
                <p>Sua presença é nosso maior presente!</p>
                <p class="mt-2">Se desejar, uma contribuição para nossa lua de mel nos fará muito felizes.</p>
                <div class="mt-6 flex flex-col items-center">
                  <p class="text-sm text-[var(--brand-fuchsia-dark)] mb-2">Escaneie o QR Code</p>
                  <div class="p-2 bg-white border-4 border-[var(--bg-warm-medium)] rounded-lg">
                    <Qrcode :value="pixKey" :options="{ width: 200, errorCorrectionLevel: 'H' }" />
                  </div>
                  <button @click="copyPix" class="mt-4 w-full flex items-center justify-center gap-2 text-white px-4 py-2.5 rounded-lg transition-all font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)] focus:ring-offset-2" :class="isCopied ? 'bg-green-600 hover:bg-green-700' : 'bg-[var(--brand-fuchsia)] hover:bg-[var(--brand-fuchsia-dark)]'">
                    <component :is="copyIcon" class="w-5 h-5" />
                    {{ copyButtonText }}
                  </button>
                </div>
              </div>
            </template>

          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Poppins:wght@400;600&family=Dancing+Script:wght@500&display=swap');

.invitation-wrapper {
  /* Cores Principais */
  --brand-fuchsia:      #d946ef; /* fuchsia-500 */
  --brand-fuchsia-dark: #a21caf; /* fuchsia-700 */
  --brand-gold:         #f59e0b; /* amber-500 */

  /* Cores de Fundo e Texto */
  --card-bg:            #fffbeb; /* amber-50 */
  --bg-warm-light:      #fdf2f8; /* pink-50 */
  --bg-warm-medium:     #fce7f3; /* pink-100 */
  --text-main:          #57534e; /* stone-600 */
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  transform: scale(0.9) translateY(10px);
  opacity: 0;
}
</style>
