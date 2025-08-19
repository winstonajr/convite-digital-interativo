# Convite de Casamento Digital Interativo 💍

> Um convite de casamento digital, interativo e elegante, construído com Vue 3, TypeScript e Vite. Inclui confirmação de presença (RSVP) via Google Forms e um sistema de presentes com geração de PIX dinâmico.

![Vue.js](https://img.shields.io/badge/Vue.js-3-4FC08D?style=for-the-badge&logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite)

> **⚠️ Este é um projeto de portfólio.** O código é disponibilizado apenas para fins demonstrativos e de avaliação técnica. Sua cópia, distribuição ou reutilização não é permitida.

---

## ✨ Sobre o Projeto

Este projeto foi criado para oferecer uma experiência moderna e encantadora para convidados de um casamento. Em vez de um convite de papel tradicional, esta aplicação web de página única (SPA) guia o convidado através de todas as informações importantes do evento de forma fluida e interativa.

O design é focado na elegância e na experiência do usuário, com animações sutis, transições suaves e total responsividade para dispositivos móveis e desktops. O objetivo principal foi demonstrar a construção de uma interface rica e funcional com tecnologias modernas do ecossistema Vue.js.

## 🚀 Funcionalidades Demonstradas

- **💌 Animação de Entrada:** Uma tela de "Abrir Convite" que revela o conteúdo principal de forma elegante, demonstrando manipulação de estado e transições do Vue.
- **✅ Confirmação de Presença (RSVP):** Um formulário multi-etapas que:
  1.  Coleta dados do usuário com validação simples e máscara de input.
  2.  Envia os dados de forma assíncrona para uma planilha do **Google Forms**, simulando uma integração com um backend _serverless_.
  3.  Transita para uma tela de agradecimento e sugestão de presente, demonstrando um fluxo de usuário condicional.
- **🎁 Sistema de Presentes "Pix do Amor":**
  - Lista de presentes simbólicos com valores pré-definidos e opção de valor livre.
  - Geração dinâmica e em tempo real de um **QR Code PIX (BR Code)** válido para pagamento, demonstrando lógica complexa no front-end.
  - Funcionalidade de "Copiar Código PIX" utilizando a API do navegador.
- **🗺️ Integração com API Externa:** Seção "Como Chegar" com um mapa do Google Maps incorporado.
- **♿ Acessibilidade:** O modal principal inclui "focus trap", permitindo a navegação via teclado e o fechamento com a tecla `Esc`, mostrando atenção às boas práticas de acessibilidade (a11y).
- **⚡ Performance:** Otimizado com carregamento assíncrono de ícones (code-splitting) e animações de scroll performáticas com `IntersectionObserver`.

## 🛠️ Tecnologias Utilizadas

- **[Vue 3](https://vuejs.org/)**: Framework principal, utilizando a Composition API e `<script setup>`.
- **[Vite](https://vitejs.dev/)**: Ferramenta de build para desenvolvimento rápido.
- **[TypeScript](https://www.typescriptlang.org/)**: Para tipagem estática, robustez e melhor manutenibilidade do código.
- **[qrcode.vue](https://github.com/scopewu/qrcode.vue)**: Para a geração dos QR Codes PIX.
- **[Lucide Icons](https://lucide.dev/)**: Biblioteca de ícones leve e customizável.
- **Vue Composables**: Para abstração e reutilização de lógicas com estado (Toast de notificações e máscara de telefone).
- **CSS Moderno**: Variáveis CSS (Custom Properties) para theming e layout com Flexbox.

## ⚖️ Direitos e Uso do Código

Todo o código, design e assets visuais contidos neste repositório são de minha propriedade intelectual e foram criados para compor meu portfólio pessoal.

A visualização do código-fonte é incentivada para fins de avaliação técnica de minhas habilidades como desenvolvedor. No entanto, **a cópia, distribuição ou utilização deste projeto (ou de partes dele) em outros trabalhos, sejam eles comerciais ou não, é estritamente proibida** sem minha autorização prévia e expressa.

---

Desenvolvido com ❤️ por [Winston Junior (winstonajr)](https://github.com/winstonajr)
