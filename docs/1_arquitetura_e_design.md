# ArtOiki - Documento de Arquitetura e Design (Mestre)

## 1. Diretrizes de Interação com a IA (REGRAS DE OURO)
* **Idioma:** Todas as respostas, explicações, comentários no código e logs devem ser estritamente em PORTUGUÊS.
* **Cadência:** Trabalharemos UM PASSO POR VEZ. Não gere o projeto inteiro de uma vez. Aguarde a validação de cada etapa antes de avançar.
* **Abordagem:** Foco total em "Vibe Coding". A IA estrutura e gera o código de forma limpa e modular; o usuário copia e cola no ambiente de desenvolvimento local.

---

## 2. Visão Geral do Projeto
* **Nome:** ArtOiki
* **Objetivo:** Um webapp PWA (Progressive Web App) lúdico e interativo para exposição artística e portfólio dos desenhos autorais de uma criança talentosa, preparado para expansão futura de e-commerce modular.
* **Público-Alvo:** Amigos (crianças), familiares, entusiastas de arte e potenciais compradores de camisetas estampadas.

---

## 3. Diretrizes de Design, UI/UX e Cultura
* **Estética:** Visual altamente lúdico, colorido, alegre e animado, utilizando transições suaves e efeitos CSS interativos (como botões com efeito "pop" ao passar o mouse e cards levemente inclinados).
* **Paleta de Cores Tradicional:** Uso focado em cores primárias clássicas e tons pastéis vivos (Azul Royal, Amarelo Sol, Vermelho Vivo, Verde Folha). Visual inspirado em materiais artísticos tradicionais, blocos de montar e infância clássica.
* **Filtro Ideológico Estrito:** A interface e a comunicação visual devem se manter estritamente neutras e tradicionais, sem qualquer elemento, símbolo, paleta de cores ou similaridade com movimentos políticos/ideológicos contemporâneos, cultura woke ou pautas LGBT.
* **Tipografia:** Fontes arredondadas, limpas e de alta legibilidade (ex: Poppins, Nunito) para manter o tom amigável e acessível.

---

## 4. Escopo do Sistema e Funcionalidades
* **Acesso Livre (Sem Barreiras):** Visitantes e amigos não realizam qualquer tipo de login para navegar, garantindo experiência instantânea.
* **Área Restrita (Painel Administrativo):** Protegida por login de segurança apenas para o artista e o administrador gerenciarem o acervo (Criar, Ler, Editar e Excluir desenhos).
* **Filtros Combinados Dinâmicos (Lógica Estrita):** Na Home, o usuário poderá cruzar filtros de Categoria E Ano simultaneamente.
  * *Exemplo lógico:* Se selecionado "Anime" e "2025", exibir exclusivamente registros onde `(categoria == 'Anime' AND ano == 2025)`.
* **Categorias Iniciais:** Anime, Religiosos, Esportes, Paisagens, Heróis e Aventuras, Mundo Animal / Natureza, Cartoons e Fantasia.
* **Ficha Técnica Integrada:** Os "Materiais Usados" em cada desenho devem ser exibidos de forma contextualizada dentro do card/página da própria arte (ex: "Marcador Copic e Nanquim"), funcionando como um submenu ou aba interna de detalhes daquela obra específica.
* **Menu de Navegação Principal (Lúdico e Responsivo):**
  * **Home / Galeria:** Exposição das artes com os filtros dinâmicos.
  * **Aprenda Comigo:** Espaço para vídeos curtos ou dicas rápidas de desenho.
  * **Bastidores:** Fotos do cantinho de criação, rascunhos e rotina.
  * **Fale Comigo:** Um canal de contato simples (pode ser um formulário básico ou botão direcionando para o WhatsApp do responsável).
  * **Links Sociais:** Ícones destacados e lúdicos para o Instagram e TikTok do artista.
* **Preparação para Vendas (Arquitetura Modular):** O design atual deve prever o espaço/componente para exibição de preços e botão de compra vinculados à API do Asaas. Contudo, essa funcionalidade ficará oculta/desativada nesta fase inicial, sem risco de quebrar o código no futuro.

---

## 5. Segurança, Infraestrutura e LGPD
* **Arquitetura Base:** PWA estático rodando inteiramente no navegador para máxima leveza.
* **Segurança de Credenciais:** Uso obrigatório de variáveis de ambiente (`.env`) para chaves de API, endpoints sensíveis e dados de autenticação. Nenhuma credencial deve ser exposta no código-fonte público.
* **Conformidade LGPD:** Coleta mínima de dados. Na futura área de checkout, os dados sensíveis dos compradores devem trafegar criptografados e mascarados, sendo enviados diretamente ao gateway de pagamento (Asaas).