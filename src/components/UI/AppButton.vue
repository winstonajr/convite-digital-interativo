<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'

interface Props {
  is?: 'button' | 'a'
  href?: string
  target?: string
  variant?: 'primary' | 'secondary'
  size?: 'normal' | 'large'
  isLoading?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  is: 'button',
  variant: 'primary',
  size: 'normal',
  isLoading: false,
  disabled: false,
})

const buttonClasses = computed(() => [
  'base-button',
  `variant-${props.variant}`,
  `size-${props.size}`,
  { 'is-loading': props.isLoading },
])
</script>

<template>
  <component
    :is="props.is"
    :href="props.is === 'a' ? props.href : undefined"
    :target="props.target"
    :class="buttonClasses"
    :disabled="props.is === 'button' ? props.isLoading || props.disabled : undefined"
    class="no-underline"
  >
    <AppIcon v-if="isLoading" name="LoaderCircle" class="animate-spin" />
    <slot v-else></slot>
  </component>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  border-radius: 8px;
  border: 2px solid transparent;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  white-space: nowrap;
}
.base-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.size-normal {
  padding: 0.6rem 1.25rem;
  font-size: 0.9rem;
}
.size-large {
  padding: 0.8rem 2rem;
  font-size: 1rem;
}

.variant-primary {
  background-color: var(--brand-fuchsia);
  color: white;
  border-color: var(--brand-fuchsia);
}
.variant-primary:not(:disabled):hover {
  background-color: var(--brand-fuchsia-dark);
  border-color: var(--brand-fuchsia-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(217, 70, 239, 0.3);
}

.variant-secondary {
  background-color: transparent;
  color: var(--brand-fuchsia);
  border-color: var(--brand-fuchsia);
}
.variant-secondary:not(:disabled):hover {
  background-color: var(--brand-fuchsia);
  color: white;
}
</style>
