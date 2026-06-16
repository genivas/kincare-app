---
name: Padrão Visual Hidra - Gerador de Apps
description: Utiliza o padrão visual premium e a arquitetura do app "Hidra" (SF Pro Rounded, clean design, UI moderna) para construir novos aplicativos e sites do zero, independentemente do nicho.
---

# Padrão Visual "Hidra" para Criação de Apps

Esta skill ensina a Inteligência Artificial a construir qualquer aplicativo utilizando o "Padrão Hidra" — uma estética premium, limpa, amigável e moderna, muito inspirada nos melhores aplicativos de saúde e no ecossistema Apple. 

Ao invocar esta skill, o agente já sabe exatamente como a interface deve se parecer e se comportar, dispensando a necessidade de um design no Figma.

## O Design System "Hidra" (Padrão Gravado)

### 1. Paleta de Cores (The Hidra Theme)
- **Primary:** Azul vibrante moderno (ex: `#007AFF` ou `#2563EB`). Usado em botões principais e elementos de destaque.
- **Secondary / Surface Light:** Azul bem claro ou fundo pastel para destacar áreas sem usar linhas (ex: `#E5F1FF` ou `#EFF6FF`).
- **Background:** Branco puro (`#FFFFFF`) ou um off-white extremamente limpo (`#F9FAFB`).
- **Surface (Cards):** Fundo branco puro com sombras extremamente suaves para dar profundidade.
- **Text Primary:** Cinza muito escuro para contraste suave, nunca preto puro (ex: `#1C1C1E` ou `#1F2937`).
- **Text Secondary:** Cinza médio para descrições e apoio (ex: `#8E8E93` ou `#6B7280`).

### 2. Tipografia
- **Família da Fonte:** `SF Pro Rounded` (ou `Nunito` / `Quicksand` caso a fonte da Apple não esteja disponível no ambiente Web).
- **Estilo:** A essência do Hidra está nas fontes amigáveis (com cantos arredondados). Títulos grandes e em negrito, com textos de corpo limpos e legíveis.

### 3. Geometria, Bordas e Sombras (Shape & Elevation)
- **Border Radius:** A marca registrada do Hidra é o visual "soft". 
  - Cards e Painéis: `16px` a `20px`.
  - Botões Primários: Totalmente arredondados (`border-radius: 9999px` ou "pill shape").
  - Inputs de texto: `12px` a `14px`.
- **Sombras (Shadows):** Sombras longas e muito transparentes. Nada agressivo. Exemplo CSS: `box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);`.
- **Espaçamento (Whitespace):** Muito "respiro" na tela. Margens generosas (múltiplos de 8px, como 16px, 24px, 32px) para dar sensação de leveza e organização.

### 4. Componentes Base Obrigatórios (UI Kit)
- **Primary Button:** Fundo sólido na cor Primary, texto branco em negrito, altura generosa (min 48px para toque confortável).
- **Inputs:** Fundo levemente acinzentado (off-white), sem borda demarcada (ou borda muito sutil apenas no "focus").
- **Bottom Tab Bar:** Navegação inferior clássica. Fundo branco flutuante ou fixo, com ícones simples e texto pequeno. O ícone ativo ganha a cor Primary.
- **Gráficos e Progresso:** Elementos circulares e barras de progresso grossas e com cantos arredondados.

---

## Metodologia de Ação (Como o Agente deve construir o App)

Quando o usuário pedir: *"Crie um app sobre [TEMA] usando o Padrão Hidra"*, o Agente deve seguir o roteiro:

1. **Setup Inicial:** Crie o projeto (Next.js para Web, Expo para Mobile).
2. **Injeção do Padrão Visual:** Antes de qualquer tela, crie o arquivo `theme.ts` (ou CSS/Tailwind config) e adicione exatamente a paleta de cores, tipografia e bordas definidas acima.
3. **Fábrica de Componentes:** Crie a pasta `/components` e construa o Botão, o Input e o Card com a estética Hidra.
4. **Geração da Estrutura Base:** Construa as telas seguindo a arquitetura lógica do modelo Hidra original:
   - *Splash Screen* (Logo limpa no centro)
   - *Onboarding* (Telas educativas com ilustrações clean e botão de pular)
   - *Auth* (Login super simples)
   - *Dashboard* (A Home com as métricas principais do tema)
5. **Aplicação do Nicho:** Adapte os textos, imagens e a lógica para o novo tema solicitado pelo usuário, mas garantindo que quem olhar para o app dirá: *"Esse app tem a cara daquele Hidra!"*.
