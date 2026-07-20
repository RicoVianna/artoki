// ============================================
// ArtOki - Lógica Principal (Etapa 6)
// Navegação, Galeria, Like, Contato, Admin CRUD
// Módulo Comercial (Asaas) - PREPARADO MAS OCULTO
// ============================================

const CONFIG = {
    ADMIN_PASSWORD: "artoiki2026!",
    APP_NAME: "ArtOki",
    APP_VERSION: "1.0.0",
    
    // ============================================
    // FLAG DO MÓDULO COMERCIAL (Asaas)
    // ============================================
    // ⚠️ IMPORTANTE: Mantenha como 'false' até que
    // a integração com o Asaas esteja configurada.
    // Quando ativar, mude para 'true' e os preços
    // e botões de compra aparecerão automaticamente.
    // ============================================
    MODULO_VENDAS_ATIVO: true,
    
    // Placeholder para futura configuração Asaas
    // ASAAS_API_KEY: import.meta.env.VITE_ASAAS_API_KEY,
    // ASAAS_API_URL: "https://api.asaas.com/v3"
};

// ============================================
// 1. VARIÁVEIS GLOBAIS
// ============================================

let todosDesenhos = [];
let filtroCategoria = "todas";
let filtroAno = "todos";
const LIKES_STORAGE_KEY = "artoiki_likes";
const DESENHOS_STORAGE_KEY = "artoiki_desenhos";
const ADMIN_LOGADO_KEY = "artoiki_admin_logado";
let desenhosCurtidos = carregarLikes();
let estaEditando = false;
let imagemBase64 = null;

// ============================================
// 2. LOCALSTORAGE
// ============================================

function carregarLikes() {
    try {
        const likesSalvos = localStorage.getItem(LIKES_STORAGE_KEY);
        if (likesSalvos) return new Set(JSON.parse(likesSalvos));
    } catch (erro) {
        console.warn("⚠️ Erro ao carregar likes:", erro);
    }
    return new Set();
}

function salvarLikes(likesSet) {
    try {
        localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify([...likesSet]));
    } catch (erro) {
        console.warn("⚠️ Erro ao salvar likes:", erro);
    }
}

function salvarDesenhosNoStorage() {
    try {
        localStorage.setItem(DESENHOS_STORAGE_KEY, JSON.stringify(todosDesenhos));
        console.log("💾 Desenhos salvos no LocalStorage");
    } catch (erro) {
        console.warn("⚠️ Erro ao salvar desenhos:", erro);
    }
}

function carregarDesenhosDoStorage() {
    try {
        const salvos = localStorage.getItem(DESENHOS_STORAGE_KEY);
        if (salvos) return JSON.parse(salvos);
    } catch (erro) {
        console.warn("⚠️ Erro ao carregar desenhos do storage:", erro);
    }
    return null;
}

function verificarAdminLogado() {
    return localStorage.getItem(ADMIN_LOGADO_KEY) === "true";
}

function fazerLoginAdmin() {
    localStorage.setItem(ADMIN_LOGADO_KEY, "true");
}

function fazerLogoutAdmin() {
    localStorage.removeItem(ADMIN_LOGADO_KEY);
}

// ============================================
// 3. NAVEGAÇÃO POR ABAS
// ============================================

function configurarNavegacao() {
    const linksMenu = document.querySelectorAll('.link-menu');
    const abas = document.querySelectorAll('.aba');
    const btnMobile = document.getElementById('btn-menu-mobile');
    const listaMenu = document.getElementById('lista-menu');
    
    linksMenu.forEach(link => {
        link.addEventListener('click', (evento) => {
            evento.preventDefault();
            const abaAlvo = link.dataset.aba;
            
            linksMenu.forEach(l => l.classList.remove('ativo'));
            link.classList.add('ativo');
            
            abas.forEach(aba => {
                aba.classList.remove('ativa');
                if (aba.id === `aba-${abaAlvo}`) {
                    aba.classList.add('ativa');
                }
            });
            
            listaMenu.classList.remove('aberto');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            if (abaAlvo === 'admin') {
                verificarSessaoAdmin();
            }
            
            console.log(`🧭 Navegou para: ${abaAlvo}`);
        });
    });
    
    if (btnMobile) {
        btnMobile.addEventListener('click', () => {
            listaMenu.classList.toggle('aberto');
        });
    }
}

// ============================================
// 4. CARREGAMENTO DOS DADOS
// ============================================

async function carregarDados() {
    try {
        const salvos = carregarDesenhosDoStorage();
        
        if (salvos && salvos.length > 0) {
            todosDesenhos = salvos;
            console.log(`🎨 ${todosDesenhos.length} desenhos carregados do LocalStorage!`);
        } else {
            const resposta = await fetch('dados.json');
            if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);
            const dados = await resposta.json();
            todosDesenhos = dados.desenhos;
            salvarDesenhosNoStorage();
            console.log(`🎨 ${todosDesenhos.length} desenhos carregados do JSON!`);
        }
        
        renderizarGaleria();
        
    } catch (erro) {
        console.error("❌ Erro ao carregar dados:", erro);
        mostrarErro("Não foi possível carregar os desenhos.");
    }
}

// ============================================
// 5. LÓGICA DOS FILTROS
// ============================================

function aplicarFiltros() {
    return todosDesenhos.filter(desenho => {
        const passaCategoria = filtroCategoria === "todas" 
            || desenho.categoria === filtroCategoria;
        const passaAno = filtroAno === "todos" 
            || desenho.ano.toString() === filtroAno;
        return passaCategoria && passaAno;
    });
}

function atualizarInfoResultado(quantidade, total) {
    const elemento = document.getElementById('info-resultado');
    if (!elemento) return;
    
    if (filtroCategoria === "todas" && filtroAno === "todos") {
        elemento.textContent = `🎨 Mostrando todos os ${total} desenhos`;
    } else {
        const textoCategoria = filtroCategoria === "todas" ? "todas as categorias" : `"${filtroCategoria}"`;
        const textoAno = filtroAno === "todos" ? "todos os anos" : `${filtroAno}`;
        elemento.textContent = `🎨 ${quantidade} desenhos encontrados (${textoCategoria} + ${textoAno})`;
    }
}

// ============================================
// 6. RENDERIZAÇÃO DA GALERIA
// ============================================

function renderizarGaleria() {
    const grid = document.getElementById('grid-galeria');
    if (!grid) return;
    
    const desenhosFiltrados = aplicarFiltros();
    atualizarInfoResultado(desenhosFiltrados.length, todosDesenhos.length);
    grid.innerHTML = "";
    
    if (desenhosFiltrados.length === 0) {
        grid.innerHTML = `
            <div class="sem-resultados">
                <p>😕</p>
                <p>Nenhum desenho encontrado com esses filtros.</p>
                <p>Tente outra combinação!</p>
            </div>
        `;
        return;
    }
    
    desenhosFiltrados.forEach(desenho => {
        const card = criarCardDesenho(desenho);
        grid.appendChild(card);
    });
}

function getClasseCategoria(categoria) {
    const mapa = {
        "Anime": "anime",
        "Religiosos": "religiosos",
        "Esportes": "esportes",
        "Paisagens": "paisagens",
        "Heróis e Aventuras": "herois",
        "Mundo Animal / Natureza": "animal",
        "Cartoons e Fantasia": "cartoons"
    };
    return mapa[categoria] || "anime";
}

function criarCardDesenho(desenho) {
    const card = document.createElement('div');
    card.className = 'card-desenho';
    card.dataset.id = desenho.id;
    card.dataset.categoria = desenho.categoria;
    
    const materiaisTexto = desenho.materiais_usados.join(", ");
    const jaCurtiu = desenhosCurtidos.has(desenho.id);
    const classeCurtido = jaCurtiu ? "curtido" : "";
    const textoBotao = jaCurtiu ? "❤️ Curtido!" : "🤍 Curtir";
    const likesAtual = jaCurtiu ? desenho.likes + 1 : desenho.likes;
    
    // ============================================
    // MÓDULO COMERCIAL (OCULTO POR PADRÃO)
    // ============================================
    // Quando CONFIG.MODULO_VENDAS_ATIVO for true,
    // esta seção exibirá preço e botão de compra.
    // ============================================
    let htmlComercial = '';
    if (CONFIG.MODULO_VENDAS_ATIVO && desenho.comercial && desenho.comercial.disponivel_venda) {
        const precoFormatado = desenho.comercial.preco.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        htmlComercial = `
            <div class="card-comercial">
                <span class="preco-desenho">${precoFormatado}</span>
                <button class="btn-comprar" onclick="iniciarCompra('${desenho.id}')">
                    🛒 Comprar
                </button>
            </div>
        `;
    }
    // Se o módulo estiver desativado, htmlComercial permanece vazio
    // e nenhum elemento comercial é renderizado.
    
    card.innerHTML = `
        <div class="card-imagem">
            <span class="badge-categoria-img ${getClasseCategoria(desenho.categoria)}">
                ${desenho.categoria}
            </span>
            <img src="${desenho.url_imagem}" alt="${desenho.titulo}" loading="lazy">
        </div>
        <div class="card-conteudo">
            <h3 class="card-titulo">${desenho.titulo}</h3>
            <div class="card-meta">
                <span class="badge-ano">📅 ${desenho.ano}</span>
            </div>
            <button class="btn-materiais" onclick="toggleMateriais('${desenho.id}')">
                🖌️ Ver Materiais Usados
            </button>
            <div class="aba-materiais" id="materiais-${desenho.id}">
                <span class="label-materiais">Materiais Usados:</span>
                <span class="texto-materiais">${materiaisTexto}</span>
            </div>
            ${htmlComercial}
            <div class="card-acoes">
                <button class="btn-like ${classeCurtido}" 
                        onclick="toggleLike('${desenho.id}')" 
                        id="like-${desenho.id}">
                    ${textoBotao} <span id="likes-count-${desenho.id}">${likesAtual}</span>
                </button>
                <span class="contador-comentarios">
                    💬 ${desenho.comentarios.length}
                </span>
            </div>
        </div>
    `;
    
    return card;
}

// ============================================
// 7. FUNÇÕES DO MÓDULO COMERCIAL (FUTURO)
// ============================================

/**
 * Inicia o processo de compra de um desenho.
 * Será implementada na fase de integração com Asaas.
 * 
 * @param {string} idDesenho - ID do desenho a ser comprado
 */
function iniciarCompra(idDesenho) {
    const desenho = todosDesenhos.find(d => d.id === idDesenho);
    if (!desenho || !desenho.comercial) return;
    
    console.log(`🛒 Iniciando compra do desenho: ${desenho.titulo}`);
    console.log(`💰 Preço: R$ ${desenho.comercial.preco.toFixed(2)}`);
    console.log(`🔗 ID Produto Asaas: ${desenho.comercial.id_produto_asaas || 'Não configurado'}`);
    
    // Futura implementação:
    // 1. Chamar API do Asaas para criar cobrança
    // 2. Redirecionar para checkout do Asaas
    // 3. Ou exibir modal de pagamento próprio
    
    alert(`🛒 Compra do desenho "${desenho.titulo}" será implementada em breve!\nPreço: R$ ${desenho.comercial.preco.toFixed(2)}`);
}

// ============================================
// 8. INTERAÇÕES DO CARD
// ============================================

function toggleMateriais(idDesenho) {
    const aba = document.getElementById(`materiais-${idDesenho}`);
    const botao = document.querySelector(`button[onclick="toggleMateriais('${idDesenho}')"]`);
    
    if (aba.classList.contains('aberta')) {
        aba.classList.remove('aberta');
        botao.classList.remove('ativo');
        botao.innerHTML = '🖌️ Ver Materiais Usados';
    } else {
        document.querySelectorAll('.aba-materiais.aberta').forEach(a => a.classList.remove('aberta'));
        document.querySelectorAll('.btn-materiais.ativo').forEach(b => {
            b.classList.remove('ativo');
            b.innerHTML = '🖌️ Ver Materiais Usados';
        });
        
        aba.classList.add('aberta');
        botao.classList.add('ativo');
        botao.innerHTML = '🖌️ Ocultar Materiais';
    }
}

function toggleLike(idDesenho) {
    const botao = document.getElementById(`like-${idDesenho}`);
    const desenho = todosDesenhos.find(d => d.id === idDesenho);
    if (!desenho) return;
    
    if (desenhosCurtidos.has(idDesenho)) {
        desenhosCurtidos.delete(idDesenho);
        botao.classList.remove('curtido');
        botao.innerHTML = `🤍 Curtir <span id="likes-count-${idDesenho}">${desenho.likes}</span>`;
        console.log(`💔 Desenho ${idDesenho} descurtido`);
    } else {
        desenhosCurtidos.add(idDesenho);
        botao.classList.add('curtido');
        botao.innerHTML = `❤️ Curtido! <span id="likes-count-${idDesenho}">${desenho.likes + 1}</span>`;
        console.log(`❤️ Desenho ${idDesenho} curtido!`);
    }
    
    salvarLikes(desenhosCurtidos);
}

// ============================================
// 9. EVENT LISTENERS DOS FILTROS
// ============================================

function configurarFiltros() {
    const selectCategoria = document.getElementById('filtro-categoria');
    const selectAno = document.getElementById('filtro-ano');
    
    if (selectCategoria) {
        selectCategoria.addEventListener('change', (evento) => {
            filtroCategoria = evento.target.value;
            renderizarGaleria();
        });
    }
    
    if (selectAno) {
        selectAno.addEventListener('change', (evento) => {
            filtroAno = evento.target.value;
            renderizarGaleria();
        });
    }
}

// ============================================
// 10. FORMULÁRIO DE CONTATO
// ============================================

function configurarFormularioContato() {
    const formulario = document.getElementById('formulario-contato');
    
    if (formulario) {
        formulario.addEventListener('submit', (evento) => {
            evento.preventDefault();
            
            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const mensagem = document.getElementById('mensagem').value.trim();
            
            if (!nome || !mensagem) {
                alert('⚠️ Por favor, preencha seu nome e a mensagem!');
                return;
            }
            
            console.log('📨 Mensagem recebida:', { nome, email, mensagem });
            alert(`🎉 Obrigado, ${nome}! Sua mensagem foi enviada com sucesso!`);
            formulario.reset();
        });
    }
}

// ============================================
// 11. ÁREA ADMINISTRATIVA
// ============================================

function verificarSessaoAdmin() {
    const telaLogin = document.getElementById('tela-login');
    const painelAdmin = document.getElementById('painel-admin');
    
    if (!telaLogin || !painelAdmin) return;
    
    if (verificarAdminLogado()) {
        telaLogin.style.display = 'none';
        painelAdmin.style.display = 'block';
        renderizarTabelaAdmin();
    } else {
        telaLogin.style.display = 'flex';
        painelAdmin.style.display = 'none';
    }
}

function configurarLoginAdmin() {
    const formularioLogin = document.getElementById('formulario-login');
    const btnSair = document.getElementById('btn-sair');
    
    if (formularioLogin) {
        formularioLogin.addEventListener('submit', (evento) => {
            evento.preventDefault();
            
            const senhaDigitada = document.getElementById('senha-admin').value;
            
            if (validarSenhaAdmin(senhaDigitada)) {
                fazerLoginAdmin();
                verificarSessaoAdmin();
                document.getElementById('senha-admin').value = '';
                console.log('🔓 Login administrativo realizado com sucesso!');
            } else {
                alert('❌ Senha incorreta! Tente novamente.');
                console.log('❌ Tentativa de login com senha incorreta');
            }
        });
    }
    
    if (btnSair) {
        btnSair.addEventListener('click', () => {
            fazerLogoutAdmin();
            verificarSessaoAdmin();
            console.log('🚪 Logout administrativo realizado');
        });
    }
}

// ============================================
// 12. CRUD DOS DESENHOS (ADMIN)
// ============================================

function configurarFormularioAdmin() {
    const formulario = document.getElementById('formulario-admin');
    const inputImagem = document.getElementById('admin-imagem');
    const btnCancelar = document.getElementById('btn-cancelar');
    
    if (inputImagem) {
        inputImagem.addEventListener('change', (evento) => {
            const arquivo = evento.target.files[0];
            if (arquivo) {
                const leitor = new FileReader();
                leitor.onload = (e) => {
                    imagemBase64 = e.target.result;
                    mostrarPreviewImagem(imagemBase64);
                };
                leitor.readAsDataURL(arquivo);
            }
        });
    }
    
    if (formulario) {
        formulario.addEventListener('submit', (evento) => {
            evento.preventDefault();
            salvarDesenhoAdmin();
        });
    }
    
    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            resetarFormularioAdmin();
        });
    }
}

function mostrarPreviewImagem(src) {
    const preview = document.getElementById('preview-imagem');
    if (preview) {
        preview.innerHTML = `<img src="${src}" alt="Pré-visualização">`;
    }
}

function resetarFormularioAdmin() {
    document.getElementById('formulario-admin').reset();
    document.getElementById('editando-id').value = '';
    document.getElementById('titulo-formulario').textContent = '➕ Adicionar Novo Desenho';
    document.getElementById('btn-salvar').textContent = '💾 Salvar Desenho';
    document.getElementById('btn-cancelar').style.display = 'none';
    document.getElementById('admin-preco').value = '';
    document.getElementById('admin-venda').checked = false;
    
    estaEditando = false;
    
    const preview = document.getElementById('preview-imagem');
    if (preview) preview.innerHTML = '';
    
    estaEditando = false;
    imagemBase64 = null;
}

function salvarDesenhoAdmin() {
    const titulo = document.getElementById('admin-titulo').value.trim();
    const categoria = document.getElementById('admin-categoria').value;
    const ano = parseInt(document.getElementById('admin-ano').value);
    const materiaisInput = document.getElementById('admin-materiais').value.trim();
    const precoInput = document.getElementById('admin-preco').value;
    const disponivelVenda = document.getElementById('admin-venda').checked;
    const editandoId = document.getElementById('editando-id').value;
    
    if (!titulo || !categoria || !ano || !materiaisInput) {
        alert('⚠️ Preencha todos os campos obrigatórios!');
        return;
    }
    
    const materiais = materiaisInput.split(',').map(m => m.trim()).filter(m => m);
    const preco = precoInput ? parseFloat(precoInput) : 0.00;
    
    if (estaEditando && editandoId) {
        const index = todosDesenhos.findIndex(d => d.id === editandoId);
        if (index !== -1) {
            todosDesenhos[index].titulo = titulo;
            todosDesenhos[index].categoria = categoria;
            todosDesenhos[index].ano = ano;
            todosDesenhos[index].materiais_usados = materiais;
            todosDesenhos[index].comercial.preco = preco;
            todosDesenhos[index].comercial.disponivel_venda = disponivelVenda;
            if (imagemBase64) {
                todosDesenhos[index].url_imagem = imagemBase64;
            }
            console.log(`✏️ Desenho ${editandoId} editado com sucesso!`);
        }
    } else {
        const novoId = `desenho-${Date.now()}`;
        const novoDesenho = {
            id: novoId,
            titulo: titulo,
            categoria: categoria,
            ano: ano,
            url_imagem: imagemBase64 || "https://placehold.co/400x300/9CA3AF/FFFFFF?text=Sem+Imagem",
            materiais_usados: materiais,
            likes: 0,
            comentarios: [],
            comercial: {
                disponivel_venda: disponivelVenda,
                preco: preco,
                id_produto_asaas: ""
            }
        };
        todosDesenhos.push(novoDesenho);
        console.log(`➕ Novo desenho ${novoId} adicionado!`);
    }
    
    salvarDesenhosNoStorage();
    renderizarTabelaAdmin();
    renderizarGaleria();
    resetarFormularioAdmin();
    
    alert(estaEditando ? '✅ Desenho atualizado com sucesso!' : '✅ Desenho adicionado com sucesso!');
}

function editarDesenho(idDesenho) {
    const desenho = todosDesenhos.find(d => d.id === idDesenho);
    if (!desenho) return;
    
    document.getElementById('admin-titulo').value = desenho.titulo;
    document.getElementById('admin-categoria').value = desenho.categoria;
    document.getElementById('admin-ano').value = desenho.ano;
    document.getElementById('admin-materiais').value = desenho.materiais_usados.join(', ');
    document.getElementById('editando-id').value = desenho.id;
    
    if (desenho.url_imagem && !desenho.url_imagem.includes('placehold.co')) {
        imagemBase64 = desenho.url_imagem;
        mostrarPreviewImagem(imagemBase64);
    }
    
    document.getElementById('titulo-formulario').textContent = '✏️ Editar Desenho';
    document.getElementById('btn-salvar').textContent = '💾 Atualizar Desenho';
    document.getElementById('btn-cancelar').style.display = 'inline-block';
    document.getElementById('admin-preco').value = desenho.comercial ? desenho.comercial.preco : '';
    document.getElementById('admin-venda').checked = desenho.comercial ? desenho.comercial.disponivel_venda : false;
    
    estaEditando = true;
    console.log(`📝 Editando desenho: ${idDesenho}`);
    
    document.querySelector('.card-formulario-admin').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function excluirDesenho(idDesenho) {
    if (!confirm('🗑️ Tem certeza que deseja excluir este desenho? Esta ação não pode ser desfeita!')) {
        return;
    }
    
    todosDesenhos = todosDesenhos.filter(d => d.id !== idDesenho);
    salvarDesenhosNoStorage();
    renderizarTabelaAdmin();
    renderizarGaleria();
    
    console.log(`🗑️ Desenho ${idDesenho} excluído`);
    alert('🗑️ Desenho excluído com sucesso!');
}

function renderizarTabelaAdmin() {
    const tbody = document.getElementById('tabela-admin-body');
    const semDesenhos = document.getElementById('sem-desenhos-admin');
    const tabela = document.getElementById('tabela-admin');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (todosDesenhos.length === 0) {
        if (tabela) tabela.style.display = 'none';
        if (semDesenhos) semDesenhos.style.display = 'block';
        return;
    }
    
    if (tabela) tabela.style.display = 'table';
    if (semDesenhos) semDesenhos.style.display = 'none';
    
    todosDesenhos.forEach(desenho => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${desenho.url_imagem}" alt="${desenho.titulo}" loading="lazy"></td>
            <td><strong>${desenho.titulo}</strong></td>
            <td><span class="badge-categoria-tabela ${getClasseCategoria(desenho.categoria)}">${desenho.categoria}</span></td>
            <td>${desenho.ano}</td>
            <td>${desenho.materiais_usados.join(', ')}</td>
            <td class="acoes">
                <button class="btn-editar" onclick="editarDesenho('${desenho.id}')">✏️ Editar</button>
                <button class="btn-excluir" onclick="excluirDesenho('${desenho.id}')">🗑️ Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ============================================
// 13. FUNÇÕES AUXILIARES
// ============================================

function mostrarErro(mensagem) {
    const grid = document.getElementById('grid-galeria');
    if (grid) {
        grid.innerHTML = `
            <div class="mensagem-erro">
                <p>⚠️ ${mensagem}</p>
            </div>
        `;
    }
}

function validarSenhaAdmin(senhaDigitada) {
    return senhaDigitada === CONFIG.ADMIN_PASSWORD;
}

// ============================================
// 14. INICIALIZAÇÃO
// ============================================

function inicializarApp() {
    console.log("🎨 ArtOki iniciado!");
    console.log(`Versão: ${CONFIG.APP_VERSION}`);
    console.log(`Módulo de vendas: ${CONFIG.MODULO_VENDAS_ATIVO ? 'ATIVO' : 'INATIVO (oculto)'}`);
    console.log(`Likes salvos: ${desenhosCurtidos.size} desenhos`);
    
    registrarServiceWorker();  // ← esta linha deve estar aqui
    configurarNavegacao();
    configurarFiltros();
    configurarFormularioContato();
    configurarLoginAdmin();
    configurarFormularioAdmin();
    carregarDados();
}

document.addEventListener('DOMContentLoaded', inicializarApp);

// Torna funções globais
window.toggleMateriais = toggleMateriais;
window.toggleLike = toggleLike;
window.editarDesenho = editarDesenho;
window.excluirDesenho = excluirDesenho;
window.iniciarCompra = iniciarCompra;

window.ArtOki = {
    validarSenhaAdmin,
    CONFIG,
    aplicarFiltros
};

/**
 * Registra o Service Worker para transformar o site em PWA.
 */
function registrarServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then((registro) => {
                console.log('📱 Service Worker registrado com sucesso!', registro.scope);
            })
            .catch((erro) => {
                console.warn('⚠️ Falha ao registrar Service Worker:', erro);
            });
    } else {
        console.log('⚠️ PWA: Service Worker não suportado neste navegador');
    }
}