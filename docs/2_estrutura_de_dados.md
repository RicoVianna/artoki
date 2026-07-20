# ArtOiki - Documento de Estrutura de Dados e Segurança

## 1. Estratégia de Armazenamento (Local & Escalável)
Como o app funcionará inicialmente de forma estática no navegador, utilizaremos estruturas modernas de armazenamento local:
* **IndexedDB / LocalStorage:** Para salvar temporariamente as interações locais dos visitantes (como quais desenhos eles deram "like") para evitar que o mesmo usuário vote várias vezes.
* **Mock Data Inicial (JSON):** Os dados dos desenhos (título, categoria, ano, imagem, materiais, preço) ficarão estruturados em um arquivo JSON centralizado, facilitando a leitura pelo PWA e a futura migração para um banco de dados em nuvem (como Firebase ou Supabase) sem quebrar o código.

---

## 2. Modelagem do Objeto "Desenho" (Schema JSON)
Cada arte cadastrada no sistema deve seguir rigorosamente a estrutura abaixo para garantir que os filtros combinados e a exibição de materiais funcionem sem erros:

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
      "autor": "Nome do Amigo",
      "texto": "Ficou muito legal!",
      "data": "2026-07-19"
    }
  ],
  "comercial": {
    "disponivel_venda": false,
    "preco": 0.00,
    "id_produto_asaas": "id_opcional_futuro"
  }
}