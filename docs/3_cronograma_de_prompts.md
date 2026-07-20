# ArtOiki - Cronograma de Desenvolvimento (Prompts)

## 1. Estratégia de Desenvolvimento
Para respeitar a regra de "um passo por vez" e evitar perda de contexto por parte da IA, o projeto será fatiado em etapas sequenciais. 
A cada nova etapa, o usuário fornecerá este arquivo e os documentos anteriores como contexto mestre.

---

## 2. Sequência de Etapas e Entregáveis

### Etapa 1: Estrutura Base do PWA e Configuração (.env)
* **Objetivo:** Criar o esqueleto do projeto, configurar o manifesto PWA para funcionamento em navegadores e estruturar o suporte ao arquivo `.env`.
* **Foco do Código:** Configuração inicial, index.html, estrutura de pastas de arquivos estáticos e simulação das variáveis de ambiente para a senha do administrador.

### Etapa 2: Banco de Dados Mock (JSON) e Lógica dos Filtros Combinados
* **Objetivo:** Criar o arquivo de dados com os primeiros desenhos simulados e implementar a barra de filtros.
* **Foco do Código:** Criar o JSON baseado no esquema planejado. Criar a lógica em JavaScript que cruza (Categoria AND Ano) e atualiza a tela em tempo real.

### Etapa 3: Interface da Galeria (Home) e Componentes Visuais Lúdicos
* **Objetivo:** Construir o visual alegre, colorido e animado da página inicial onde os desenhos aparecem.
* **Foco do Código:** CSS estilizado (cores tradicionais e limpas), animações "pop" nos botões, cards lúdicos dos desenhos exibindo título, ano e os "Materiais Usados" contextuais.

### Etapa 4: Menus de Navegação, "Aprenda Comigo", "Bastidores", "Fale Comigo" e Redes Sociais
* **Objetivo:** Implementar todas as páginas institucionais e canais de contato do menu.
* **Foco do Código:** Criação das abas de conteúdo (Aprenda Comigo e Bastidores), a página/seção de contato (Fale Comigo) e a barra de rodapé ou cabeçalho com os links direcionando para o Instagram e TikTok.

### Etapa 5: Área Administrativa Restrita (Autenticação Simple & CRUD)
* **Objetivo:** Criar a tela protegida por senha para gerenciamento das artes.
* **Foco do Código:** Tela de login que valida contra o `.env`. Painel administrativo com formulários lúdicos para Adicionar, Editar e Excluir desenhos do arquivo local.

### Etapa 6: Preparação Oculta do Módulo Comercial (Asaas)
* **Objetivo:** Deixar a estrutura de vendas pronta no código, mas completamente invisível para o usuário final.
* **Foco do Código:** Criação das propriedades comerciais no código e ocultação dos elementos visuais até que a flag de venda seja ativada no futuro.