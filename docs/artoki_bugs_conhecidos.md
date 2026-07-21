# ArtOiki - Bugs Conhecidos e Limitações

> **Data:** 2026-07-21
> **Versão do código:** 1.0.0 (Etapa 6 + Aulas/Bastidores dinâmicos)
> **Último teste:** Localhost 127.0.0.1:5501

---

## 1. Bugs Atuais (Funcionalidade Quebrada ou Limitada)

### 1.1 Upload de Imagem no Admin (Desenhos, Aulas, Bastidores)
- **Status:** ⚠️ Funciona parcialmente
- **Problema:** O upload converte para base64 e salva no LocalStorage. Imagens grandes podem ultrapassar o limite do LocalStorage (~5MB)
- **Impacto:** Médio
- **Solução futura:** Usar serviço de hospedagem de imagens (Cloudinary, Imgur) ou backend com storage
- **Workaround:** Usar URLs de imagens externas (placehold.co, imgur) em vez de upload local

### 1.2 Comentários nos Desenhos
- **Status:** ❌ Não renderiza na interface pública
- **Problema:** O schema JSON tem `comentarios[]`, mas o card de desenho não exibe os comentários
- **Impacto:** Baixo
- **Solução futura:** Adicionar seção de comentários no lightbox ou abaixo do card
- **Local no código:** `criarCardDesenho()` em `script.js`

### 1.3 Vídeos em "Aprenda Comigo"
- **Status:** ❌ Placeholder apenas
- **Problema:** A seção de vídeos foi removida do HTML. O schema suporta `tipo: "video"`, mas não há player implementado
- **Impacto:** Baixo
- **Solução futura:** Implementar embed do YouTube ou player HTML5
- **Local no código:** `abrirPaginaAula()` em `script.js`

### 1.4 Formulário de Contato
- **Status:** ⚠️ Simulado (não envia email real)
- **Problema:** O submit do formulário só mostra alerta. Não há integração com serviço de email (EmailJS, Formspree, etc.)
- **Impacto:** Médio
- **Solução futura:** Integrar com EmailJS ou redirecionar para WhatsApp com mensagem pré-preenchida
- **Local no código:** `configurarFormularioContato()` em `script.js`

### 1.5 Módulo Comercial (Asaas)
- **Status:** ❌ Completamente oculto
- **Problema:** `CONFIG.MODULO_VENDAS_ATIVO = false`. Mesmo ativando, o botão "Comprar" só mostra alerta
- **Impacto:** Alto (quando for ativar)
- **Solução futura:** Integrar API do Asaas para criar cobrança PIX/boleto/cartão
- **Local no código:** `iniciarCompra()` em `script.js`

---

## 2. Limitações de UX (Não são bugs, mas incomodam)

### 2.1 Admin - Fluxo de Criação de Aula/Bastidor
- **Problema:** O formulário de criação fica sempre visível no topo. Não há botão "Nova Aula" que abre modal
- **Impacto:** Baixo (só o admin usa)
- **Solução futura:** Transformar em modal ou accordion
- **Observação:** O usuário atual (admin) aprende o fluxo rapidamente

### 2.2 Admin - Editor de Conteúdo Sempre Visível
- **Problema:** O editor de passos/fotos aparece embaixo da tabela, ocupando espaço mesmo quando não em uso
- **Impacto:** Baixo
- **Solução futura:** Transformar em modal ou aba expansível

### 2.3 Sem Confirmação ao Sair do Editor
- **Problema:** Se o admin preencheu um formulário e clicou em outra aba do menu, perde os dados sem aviso
- **Impacto:** Médio
- **Solução futura:** Adicionar `beforeunload` ou confirmar ao trocar de aba com dados não salvos

### 2.4 Cards de Aula/Bastidor sem Imagem Real
- **Problema:** As imagens de capa são placeholders (placehold.co)
- **Impacto:** Baixo (dados de teste)
- **Solução futura:** Substituir por imagens reais via upload ou URL

---

## 3. Limitações Técnicas (Arquitetura)

### 3.1 LocalStorage como "Banco de Dados"
- **Problema:** Dados ficam apenas no navegador do usuário. Se limpar cache, perde tudo
- **Impacto:** Alto
- **Solução futura:** Migrar para Firebase, Supabase ou backend próprio
- **Observação:** O `dados.json` serve como seed inicial, mas após primeira carga, tudo vem do LocalStorage

### 3.2 Sem Sincronização entre Dispositivos
- **Problema:** Curtidas e dados do admin ficam apenas no celular/computador onde foram criados
- **Impacto:** Médio
- **Solução futura:** Backend com autenticação por usuário

### 3.3 Service Worker Básico
- **Problema:** O `sw.js` existe mas pode não estar cacheando todos os recursos para offline
- **Impacto:** Baixo
- **Solução futura:** Revisar estratégia de cache (Cache First, Network First, etc.)

### 3.4 Sem Testes Automatizados
- **Problema:** Não há testes unitários ou E2E. Qualquer mudança pode quebrar algo sem aviso
- **Impacto:** Médio
- **Solução futura:** Adicionar Jest + Cypress ou Playwright

---

## 4. Comportamentos Estranhos (Não Consistentes)

### 4.1 Navegação com Aba Dinâmica Aberta
- **Problema:** Se o usuário clica em "Aprenda Comigo" → clica em uma aula → clica em "Bastidores" sem clicar em "Voltar", a aba dinâmica some corretamente agora
- **Status:** ✅ Corrigido em 2026-07-21
- **Observação:** Foi necessário adicionar `abaDinamica.remove()` no `configurarNavegacao()`

### 4.2 Scroll ao Editar no Admin
- **Problema:** Ao clicar em "Editar" na tabela, a página deveria rolar suavemente até o formulário. Funciona para desenhos, mas não foi testado extensivamente para aulas/bastidores
- **Status:** ⚠️ Não testado

### 4.3 Preview de Imagem no Formulário
- **Problema:** O preview de imagem (base64) aparece ao selecionar arquivo, mas não persiste ao editar (mostra placeholder)
- **Impacto:** Baixo
- **Local no código:** `mostrarPreviewImagem()` em `script.js`

---

## 5. O que Funciona Perfeitamente ✅

| Funcionalidade | Status |
|---------------|--------|
| Galeria com filtros combinados (Categoria AND Ano) | ✅ |
| Cards de desenhos com likes, materiais, lightbox | ✅ |
| Navegação por abas (Home, Aprenda, Bastidores, Contato, Admin) | ✅ |
| Login do Admin com senha | ✅ |
| CRUD completo de Desenhos no Admin | ✅ |
| CRUD completo de Aulas no Admin | ✅ |
| CRUD completo de Bastidores no Admin | ✅ |
| Sub-páginas dinâmicas de Aulas (conteúdo sequencial) | ✅ |
| Sub-páginas dinâmicas de Bastidores (galeria de fotos) | ✅ |
| Botão "Voltar" das páginas dinâmicas | ✅ |
| Responsividade mobile | ✅ |
| PWA (manifest, service worker, ícones) | ✅ |
| Animações CSS (pop, flutuar, hover nos cards) | ✅ |

---

## 6. Checklist para Próximo Dev

Antes de fazer qualquer alteração, teste:

- [ ] Home/Galeria carrega desenhos
- [ ] Filtros de categoria e ano funcionam
- [ ] Cards de desenhos abrem lightbox
- [ ] Likes funcionam e persistem
- [ ] "Aprenda Comigo" mostra cards de aulas
- [ ] Clicar em aula abre conteúdo sequencial
- [ ] "Bastidores" mostra cards de bastidores
- [ ] Clicar em bastidor abre galeria de fotos
- [ ] "Voltar" funciona em ambas as páginas dinâmicas
- [ ] Admin login funciona
- [ ] Admin → Desenhos: CRUD completo
- [ ] Admin → Aulas: CRUD completo + editor de conteúdo
- [ ] Admin → Bastidores: CRUD completo + editor de fotos
- [ ] Navegação entre abas do Admin funciona
- [ ] Navegação do menu principal não quebra com aba dinâmica aberta

---

## 7. Notas para Manutenção

### Como limpar dados e recomeçar do zero
1. F12 → Application → Local Storage → Clear All
2. Recarregar página (Ctrl + F5)
3. O app recarrega do `dados.json` automaticamente

### Como adicionar novo desenho/aula/bastidor no JSON (sem usar Admin)
1. Edite `dados.json`
2. Limpe LocalStorage
3. Recarregue a página

### Como mudar a senha do Admin
1. Edite `script.js` → `CONFIG.ADMIN_PASSWORD`
2. Ou melhor: use variável de ambiente (quando houver backend)

---

*Documento gerado em 2026-07-21. Última sessão de desenvolvimento concluída com sucesso.*
