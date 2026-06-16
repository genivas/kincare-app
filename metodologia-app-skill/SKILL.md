---
name: Design to App & Website Methodology
description: Metodologia passo a passo para IA transformar imagens de UI/UX em aplicativos funcionais e criar a landing page do produto.
---

# Metodologia: De Design UI para App + Site

Esta skill fornece o roteiro definitivo para transformar referências visuais (imagens, mockups, Figma) em um ecossistema de software completo, englobando o Aplicativo (Mobile/Web) e seu respectivo Site Promocional (Landing Page).

## Princípio Fundamental
**NUNCA comece programando as telas.** Todo o desenvolvimento deve ser fundamentado na criação prévia de um **Design System**.

---

## Fases de Execução

### Fase 1: Análise e Extração do Design System
1. **Análise Visual:** Inspecione a imagem fornecida pelo usuário. Identifique o tema, o propósito do app e o fluxo lógico das telas.
2. **Tokens de Cor:** Extraia a paleta exata (Primary, Secondary, Background, Surface, Text, Success, Error, Warning).
3. **Tipografia:** Identifique a fonte utilizada (ex: SF Pro Rounded, Inter, Roboto), pesos (Bold, Regular) e tamanhos de título e texto corrido.
4. **Geometria:** Extraia o espaçamento padrão (padding/margin) e o raio de borda (border-radius).
5. **Inventário de Componentes:** Liste todos os elementos repetíveis (Botões, Inputs, Cards, Ícones, Tab Bar).

### Fase 2: Configuração da Arquitetura (Setup)
1. **Workspace do App:** Inicializar o projeto principal (ex: React Native com Expo, ou React Web).
2. **Workspace do Site:** Inicializar o projeto da Landing Page (ex: Vite + React, Next.js).
3. **Estruturação de Diretórios:** Criar padronização (ex: `/src/components`, `/src/screens`, `/src/theme`, `/src/assets`).

### Fase 3: Codificação do Design System (Theme)
1. Crie um arquivo central de tema (ex: `theme.ts` ou `globals.css`).
2. Adicione todos os tokens de cores, tipografia e espaçamento extraídos na Fase 1.
3. Configure o projeto para que toda a estilização consuma essas variáveis globais.

### Fase 4: Fábrica de Componentes (UI Kit)
1. Construa os componentes isolados e agnósticos:
   - `Button` (variantes: solid, outline, text)
   - `Input` / `TextField`
   - `Card`
   - `Typography` (se aplicável)
   - `TabBar` / `Navbar`
2. Teste-os para garantir que correspondam 100% à referência visual.

### Fase 5: Montagem das Telas do App
Construa as telas respeitando o fluxo natural do usuário:
1. **Onboarding & Splash:** Telas de primeiro contato.
2. **Autenticação:** Telas de Login, Cadastro e Recuperação.
3. **Core Flow (Dashboard):** A tela principal onde o usuário passa mais tempo.
4. **Secundárias:** Telas de criação, formulários, listas e histórico.
5. **Configurações:** Perfil do usuário e preferências.

### Fase 6: Criação da Landing Page (Site Promocional)
1. **Hero Section:** Crie um cabeçalho de alto impacto com a proposta de valor, um mockup visual do app e botões de "Download" (App Store / Google Play).
2. **Features:** Seção detalhando as principais telas construídas na Fase 5.
3. **Identidade:** A Landing Page DEVE usar estritamente o mesmo Design System (cores e fontes) do App.

### Fase 7: Integração e Lógica (State & Navigation)
1. Implemente o roteamento/navegação conectando todas as telas.
2. Adicione gerenciamento de estado (ex: Zustand, React Context) para dados globais.
3. Conecte as interações simulando o funcionamento real (mock data) ou integre com um backend real, se solicitado.

---

## Instruções de Ação para o Agente Inteligente
Quando invocado para executar esta metodologia:
- Sempre informe o usuário em qual **Fase** você está operando.
- Siga as fases rigorosamente em ordem.
- Solicite feedback visual do usuário ao concluir a **Fase 4 (Componentes)** e a **Fase 5 (Telas)**.
- Mantenha o foco extremo na fidelidade estética. Aplicações modernas exigem visuais premium, evite estilos "padrão de navegador" a todo custo.
