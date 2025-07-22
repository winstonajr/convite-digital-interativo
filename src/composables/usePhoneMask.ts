import { watch, type Ref } from 'vue'

/**
 * Aplica uma máscara de telefone a uma ref de string, permitindo
 * que o usuário apague os caracteres da máscara livremente.
 * @param phoneRef A ref que contém o número de telefone.
 */
export function usePhoneMask(phoneRef: Ref<string>) {
  watch(phoneRef, (newValue, oldValue) => {
    // --- INÍCIO DA CORREÇÃO ---
    // Se o novo valor for menor que o antigo, o usuário está apagando.
    // Nesse caso, retornamos para permitir a ação sem reaplicar a máscara.
    // A máscara será corrigida na próxima vez que um caractere for adicionado.
    if (newValue.length < oldValue.length) {
      return
    }
    // --- FIM DA CORREÇÃO ---

    // 1. Remove tudo que não é dígito e limita a 11 caracteres.
    let v = newValue.replace(/\D/g, '').slice(0, 11)

    // 2. Aplica a formatação condicionalmente.
    if (v.length > 10) {
      // (XX) XXXXX-XXXX
      v = v.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3')
    } else if (v.length > 5) {
      // (XX) XXXX-XXXX
      v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3')
    } else if (v.length > 2) {
      // (XX) XXXX
      v = v.replace(/^(\d{2})(\d*).*/, '($1) $2')
    } else if (v.length > 0) {
      // (XX
      v = `(${v}`
    }

    // 3. Atualiza a ref original apenas se o valor formatado for diferente.
    // Isso evita um loop infinito do 'watch'.
    if (v !== newValue) {
      phoneRef.value = v
    }
  })
}
