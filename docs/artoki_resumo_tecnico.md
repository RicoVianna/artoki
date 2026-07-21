# ArtOiki - Resumo Técnico Completo do Projeto

> **Data:** 2026-07-21
> **Versão:** 1.0.0
> **Arquitetura:** PWA Estático (HTML + CSS + JS)
> **Deploy:** Vercel

---

## 1. Estrutura de Arquivos

```
ARTOIKI/
├── docs/                    # Documentação (PDFs, MDs - ignorado pelo build)
├── icons/                   # Ícones do PWA (192x192, 512x512)
├── .env                     # Variáveis de ambiente (NÃO commitar)
├── .gitignore
├── dados.json               # Mock data inicial (desenhos, aulas, bastidores)
├── index.html               # Página única (SPA com abas)
├── manifest.json            # Configuração PWA
├── script.js                # Lógica principal (~1800 linhas)
├── style.css                # Estilos lúdicos (~2000 linhas)
└── sw.js                    # Service Worker (cache offline)
```

---

## 2. Schema de Dados (dados.json)

### 2.1 Desenho
```json
{
  "id": "string-uuid-unico",
  "titulo": "Nome do Desenho",
  "categoria": "Anime",
  "ano": 2025,
  "url_imagem": "caminho/para/imagem.jpg",
  "materiais_usados": ["Marcador Copic", "Caneta Nanquim 0.5"],
  "likes": 0,
  "comentarios": [
    {
      "autor": "Nome",
      "texto": "Comentário",
      "data": "2026-07-19"
    }
  ],
  "comercial": {
    "disponivel_venda": false,
    "preco": 0.00,
    "id_produto_asaas": ""
  }
}
```

### 2.2 Aula
```json
{
  "id": "aula-001",
  "titulo": "Como Desenhar Olhos de Anime",
  "descricao": "Breve descrição...",
  "categoria_aula": "Técnicas Básicas",
  "imagem_capa": "url...",
  "conteudo": [
    {
      "tipo": "texto|imagem|video",
      "titulo": "Passo 1",
      "texto": "...",
      "url": "...",
      "legenda": "..."
    }
  ],
  "ordem": 1,
  "ativo": true
}
```

### 2.3 Bastidor
```json
{
  "id": "bastidor-001",
  "titulo": "Meu Cantinho de Desenho",
  "descricao": "Descrição...",
  "imagem_capa": "url...",
  "fotos": [
    {
      "url": "...",
      "legenda": "..."
    }
  ],
  "ordem": 1,
  "ativo": true
}
```

---

## 3. Abas do Site (Menu Principal)

| Aba | ID | Conteúdo | Público |
|-----|-----|----------|---------|
| Home / Galeria | `aba-galeria` | Cards de desenhos + filtros | Livre |
| Aprenda Comigo | `aba-aprenda` | Cards de aulas clicáveis | Livre |
| Bastidores | `aba-bastidores` | Cards de bastidores clicáveis | Livre |
| Fale Comigo | `aba-contato` | Formulário + WhatsApp | Livre |
| Admin | `aba-admin` | Painel restrito | 🔐 Senha |

---

## 4. Painel Administrativo (Interno)

### 4.1 Menu de Abas do Admin
```
🎨 Desenhos  |  📚 Aulas  |  🎬 Bastidores
```

### 4.2 Aba Desenhos
- Formulário: Título, Categoria, Ano, Orientação, Tamanho, Imagem, Materiais, Preço, Disponível para venda
- Tabela com: Imagem, Título, Categoria, Ano, Orientação, Ações (Editar/Excluir)

### 4.3 Aba Aulas
- Formulário: Título, Categoria, Descrição, Imagem de Capa
- Tabela com: Capa, Título, Categoria, Ações (📝 Conteúdo / ✏️ Editar / 🗑️ Excluir)
- Editor de Conteúdo: Adicionar passos sequenciais (texto, imagem, vídeo)

### 4.4 Aba Bastidores
- Formulário: Título, Descrição, Imagem de Capa
- Tabela com: Capa, Título, Ações (🖼️ Fotos / ✏️ Editar / 🗑️ Excluir)
- Editor de Fotos: Adicionar fotos com URL + legenda

---

## 5. Funções Principais (JavaScript)

### 5.1 Navegação
- `configurarNavegacao()` - Troca de abas do menu principal
- `configurarAbasAdmin()` - Troca de abas dentro do Admin
- `voltarParaAba(nomeAba)` - Volta da página dinâmica para aba original

### 5.2 Galeria
- `carregarDados()` - Carrega desenhos, aulas, bastidores do JSON/LocalStorage
- `renderizarGaleria()` - Renderiza cards de desenhos com filtros
- `aplicarFiltros()` - Lógica AND (Categoria + Ano)
- `criarCardDesenho(desenho)` - Cria HTML do card

### 5.3 Aulas (Público)
- `renderizarAulas()` - Cards na aba "Aprenda Comigo"
- `abrirPaginaAula(idAula)` - Abre página dinâmica com conteúdo sequencial

### 5.4 Bastidores (Público)
- `renderizarBastidores()` - Cards na aba "Bastidores"
- `abrirPaginaBastidor(idBastidor)` - Abre galeria de fotos dinâmica

### 5.5 Admin - Desenhos
- `configurarFormularioAdmin()` - Eventos do formulário de desenhos
- `salvarDesenhoAdmin()` - Cria/Edita desenho
- `renderizarTabelaAdmin()` - Tabela de desenhos no admin
- `editarDesenho(id)` / `excluirDesenho(id)` - Ações da tabela

### 5.6 Admin - Aulas
- `configurarEditorAulas()` - Eventos do formulário de aulas
- `salvarAulaAdmin()` - Cria nova aula
- `renderizarTabelaAulas()` - Tabela de aulas
- `abrirEditorConteudo(idAula)` - Abre editor de passos
- `adicionarPassoAula()` - Adiciona passo à aula
- `editarAulaAdmin(id)` / `excluirAulaAdmin(id)` - Ações

### 5.7 Admin - Bastidores
- `configurarEditorBastidores()` - Eventos do formulário de bastidores
- `salvarBastidorAdmin()` - Cria novo bastidor
- `renderizarTabelaBastidores()` - Tabela de bastidores
- `abrirEditorFotos(idBastidor)` - Abre editor de fotos
- `adicionarFotoBastidor()` - Adiciona foto ao bastidor
- `editarBastidorAdmin(id)` / `excluirBastidorAdmin(id)` - Ações

### 5.8 Storage
- `salvarDesenhosNoStorage()` / `carregarDesenhosDoStorage()`
- `salvarAulasNoStorage()` / `carregarAulasDoStorage()`
- `salvarBastidoresNoStorage()` / `carregarBastidoresDoStorage()`
- `salvarLikes()` / `carregarLikes()`

---

## 6. CSS - Componentes Principais

| Classe | Onde está | Função |
|--------|-----------|--------|
| `.aba` / `.aba.ativa` | Sistema de abas | Esconde/mostra seções |
| `.card-desenho` | Galeria | Cards dos desenhos |
| `.card-dica` / `.card-clicavel` | Aulas | Cards clicáveis de aulas |
| `.foto-bastidores` / `.card-clicavel` | Bastidores | Cards clicáveis de bastidores |
| `.conteudo-aula-sequencia` | Página dinâmica | Passo a passo da aula |
| `.galeria-bastidor-fotos` | Página dinâmica | Grid de fotos do bastidor |
| `.aba-admin` / `.aba-admin.ativa` | Admin | Abas internas do painel |
| `.menu-admin-abas` | Admin | Menu de botões do admin |
| `.card-formulario-admin` | Admin | Formulários do painel |
| `.tabela-admin` | Admin | Tabelas de listagem |
| `.btn-aba-admin` / `.btn-aba-admin.ativo` | Admin | Botões de navegação interna |

---

## 7. Configurações Importantes

### 7.1 Senha do Admin
```javascript
const CONFIG = {
    ADMIN_PASSWORD: "artoiki2026!",
    // ...
};
```
> **ATENÇÃO:** Em produção, a senha deve vir de variável de ambiente (.env)

### 7.2 Módulo Comercial (Desativado)
```javascript
MODULO_VENDAS_ATIVO: false
```
> Quando ativar, os cards mostram preço e botão "Comprar"

### 7.3 LocalStorage Keys
```javascript
LIKES_STORAGE_KEY = "artoiki_likes"
DESENHOS_STORAGE_KEY = "artoiki_desenhos"
AULAS_STORAGE_KEY = "artoiki_aulas"
BASTIDORES_STORAGE_KEY = "artoiki_bastidores"
ADMIN_LOGADO_KEY = "artoiki_admin_logado"
```

---

## 8. Fluxo de Dados

```
[Visitante] → [index.html] → [script.js] → [LocalStorage?]
                                      ↓
                              [dados.json] (primeira vez)
                                      ↓
                              [Renderiza na tela]

[Admin] → [Login] → [Painel] → [CRUD] → [LocalStorage]
                                      ↓
                              [Atualiza tela automaticamente]
```

---

## 9. O que Falta Implementar / Melhorias Futuras

| # | Funcionalidade | Prioridade | Complexidade |
|---|---------------|------------|--------------|
| 1 | Upload real de imagens (hoje é base64 ou URL) | Alta | Média |
| 2 | Módulo de vendas com Asaas (flag já existe) | Média | Alta |
| 3 | Backend real (Firebase/Supabase) em vez de LocalStorage | Média | Alta |
| 4 | Área de vídeos em "Aprenda Comigo" (placeholder hoje) | Baixa | Média |
| 5 | Comentários nos desenhos (schema existe, não renderiza) | Baixa | Baixa |
| 6 | Melhorar UX do Admin (formulários menores, modais) | Baixa | Média |
| 7 | SEO e meta tags dinâmicas | Baixa | Baixa |
| 8 | Analytics de visitas | Baixa | Baixa |

---

## 10. Comandos Git para Deploy

```bash
# Adicionar todos os arquivos
git add .

# Commit com mensagem descritiva
git commit -m "feat: adiciona painel admin para aulas e bastidores"

# Enviar para o Vercel
git push origin main

# O Vercel faz deploy automático em ~1-2 minutos
```

---

## 11. Dicas de Manutenção

### Limpar cache do PWA no celular
- **Android:** Chrome → Configurações → Apps → Chrome → Armazenamento → Limpar cache
- **iOS:** Ajustes → Safari → Limpar histórico e dados

### Debug no navegador
- F12 → Console: verifica erros de JavaScript
- F12 → Application → Local Storage: verifica dados salvos
- F12 → Elements: inspeciona HTML renderizado

### Resetar todos os dados
- F12 → Application → Local Storage → Clear All
- Recarregar a página (Ctrl + F5)

---

## 12. Contato para Suporte

- **Instagram:** @digotamaoki
- **TikTok:** @digo.tamaoki

---

*Documento gerado em 2026-07-21. Última atualização do código: Etapa 6 + Melhorias (Aulas e Bastidores dinâmicos no Admin).*
