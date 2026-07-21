// ============================================
// ArtOki - Lógica Principal (Etapa 6 + Melhorias)
// Lightbox, Fita Adesiva, Orientação, Tamanho
// ============================================

const CONFIG = {
    ADMIN_PASSWORD: "artoiki2026!",
    APP_NAME: "ArtOki",
    APP_VERSION: "1.0.0",
    MODULO_VENDAS_ATIVO: false,
};

let todosDesenhos = [];
let filtroCategoria = "todas";
let filtroAno = "todos";
const LIKES_STORAGE_KEY = "artoiki_likes";
const DESENHOS_STORAGE_KEY = "artoiki_desenhos";
const ADMIN_LOGADO_KEY = "artoiki_admin_logado";
let desenhosCurtidos = carregarLikes();
let estaEditando = false;
let imagemBase64 = null;

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
// LIGHTBOX
// ============================================

function configurarLightbox() {
    const lightbox = document.getElementById('lightbox');
    const btnFechar = document.getElementById('lightbox-fechar');
    
    if (!lightbox || !btnFechar) return;
    
    btnFechar.addEventListener('click', fecharLightbox);
    
    lightbox.addEventListener('click', (evento) => {
        if (evento.target === lightbox) {
            fecharLightbox();
        }
    });
    
    document.addEventListener('keydown', (evento) => {
        if (evento.key === 'Escape') {
            fecharLightbox();
        }
    });
}

function abrirLightbox(urlImagem, titulo, categoria) {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-imagem');
    const tituloEl = document.getElementById('lightbox-titulo');
    const categoriaEl = document.getElementById('lightbox-categoria');
    
    if (!lightbox) return;
    
    img.src = urlImagem;
    img.alt = titulo;
    tituloEl.textContent = titulo;
    categoriaEl.textContent = categoria;
    
    lightbox.classList.add('ativo');
    document.body.style.overflow = 'hidden';
}

function fecharLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('ativo');
        document.body.style.overflow = '';
    }
}

// ============================================
// NAVEGAÇÃO
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
            
            // REMOVE a aba dinâmica de conteúdo se existir
            const abaDinamica = document.getElementById('aba-conteudo-dinamico');
            if (abaDinamica) {
                abaDinamica.remove();
            }
            
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
// CARREGAMENTO DOS DADOS
// ============================================

let todasAulas = [];
let todosBastidores = [];
const AULAS_STORAGE_KEY = "artoiki_aulas";
const BASTIDORES_STORAGE_KEY = "artoiki_bastidores";

function salvarAulasNoStorage() {
    try {
        localStorage.setItem(AULAS_STORAGE_KEY, JSON.stringify(todasAulas));
    } catch (erro) {
        console.warn("⚠️ Erro ao salvar aulas:", erro);
    }
}

function carregarAulasDoStorage() {
    try {
        const salvos = localStorage.getItem(AULAS_STORAGE_KEY);
        if (salvos) return JSON.parse(salvos);
    } catch (erro) {
        console.warn("⚠️ Erro ao carregar aulas:", erro);
    }
    return null;
}

function salvarBastidoresNoStorage() {
    try {
        localStorage.setItem(BASTIDORES_STORAGE_KEY, JSON.stringify(todosBastidores));
    } catch (erro) {
        console.warn("⚠️ Erro ao salvar bastidores:", erro);
    }
}

function carregarBastidoresDoStorage() {
    try {
        const salvos = localStorage.getItem(BASTIDORES_STORAGE_KEY);
        if (salvos) return JSON.parse(salvos);
    } catch (erro) {
        console.warn("⚠️ Erro ao carregar bastidores:", erro);
    }
    return null;
}

async function carregarDados() {
    try {
        // --- DESENHOS ---
        const desenhosSalvos = carregarDesenhosDoStorage();
        if (desenhosSalvos && desenhosSalvos.length > 0) {
            todosDesenhos = desenhosSalvos;
            console.log(`🎨 ${todosDesenhos.length} desenhos carregados do LocalStorage!`);
        } else {
            const resposta = await fetch('dados.json');
            if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);
            const dados = await resposta.json();
            todosDesenhos = dados.desenhos || [];
            salvarDesenhosNoStorage();
            console.log(`🎨 ${todosDesenhos.length} desenhos carregados do JSON!`);
        }

        // --- AULAS ---
        const aulasSalvas = carregarAulasDoStorage();
        if (aulasSalvas && aulasSalvas.length > 0) {
            todasAulas = aulasSalvas;
            console.log(`📚 ${todasAulas.length} aulas carregadas do LocalStorage!`);
        } else {
            const resposta = await fetch('dados.json');
            if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);
            const dados = await resposta.json();
            todasAulas = dados.aulas || [];
            salvarAulasNoStorage();
            console.log(`📚 ${todasAulas.length} aulas carregadas do JSON!`);
        }

        // --- BASTIDORES ---
        const bastidoresSalvos = carregarBastidoresDoStorage();
        if (bastidoresSalvos && bastidoresSalvos.length > 0) {
            todosBastidores = bastidoresSalvos;
            console.log(`🎬 ${todosBastidores.length} bastidores carregados do LocalStorage!`);
        } else {
            const resposta = await fetch('dados.json');
            if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);
            const dados = await resposta.json();
            todosBastidores = dados.bastidores || [];
            salvarBastidoresNoStorage();
            console.log(`🎬 ${todosBastidores.length} bastidores carregados do JSON!`);
        }

        renderizarGaleria();
        renderizarAulas();
        renderizarBastidores();

        // Renderiza tabelas do admin após dados carregados
        renderizarTabelaAulas();

    } catch (erro) {
        console.error("❌ Erro ao carregar dados:", erro);
        mostrarErro("Não foi possível carregar os desenhos.");
    }
}

// ============================================
// FILTROS
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
// RENDERIZAÇÃO DA GALERIA
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
    
    // Orientação da imagem (padrão: paisagem)
    const orientacao = desenho.orientacao || 'paisagem';
    
    // MÓDULO COMERCIAL
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
    
    card.innerHTML = `
        <div class="card-imagem ${orientacao}" onclick="abrirLightbox('${desenho.url_imagem}', '${desenho.titulo}', '${desenho.categoria}')">
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
// RENDERIZAÇÃO DE AULAS (Aprenda Comigo)
// ============================================

function renderizarAulas() {
    const grid = document.getElementById('grid-dicas');
    if (!grid) return;

    const aulasAtivas = todasAulas.filter(a => a.ativo !== false).sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
    grid.innerHTML = "";

    if (aulasAtivas.length === 0) {
        grid.innerHTML = `
            <div class="sem-resultados" style="grid-column: 1 / -1;">
                <p>📚</p>
                <p>Nenhuma aula cadastrada ainda.</p>
                <p>Em breve teremos conteúdo novo!</p>
            </div>
        `;
        return;
    }

    aulasAtivas.forEach(aula => {
        const card = document.createElement('article');
        card.className = 'card-dica card-clicavel';
        card.dataset.id = aula.id;
        card.innerHTML = `
            <div class="dica-icone">📖</div>
            <h3>${aula.titulo}</h3>
            <p>${aula.descricao}</p>
            <span class="badge-categoria-aula">${aula.categoria_aula}</span>
            <div class="card-overlay">
                <span class="btn-ver-conteudo">👆 Clique para ver a aula</span>
            </div>
        `;
        card.addEventListener('click', () => abrirPaginaAula(aula.id));
        grid.appendChild(card);
    });
}

function abrirPaginaAula(idAula) {
    const aula = todasAulas.find(a => a.id === idAula);
    if (!aula) return;

    // Esconde todas as abas
    document.querySelectorAll('.aba').forEach(aba => aba.classList.remove('ativa'));

    // Cria ou atualiza a aba de conteúdo da aula
    let abaConteudo = document.getElementById('aba-conteudo-dinamico');
    if (!abaConteudo) {
        abaConteudo = document.createElement('section');
        abaConteudo.id = 'aba-conteudo-dinamico';
        abaConteudo.className = 'aba';
        document.querySelector('.conteudo-principal').appendChild(abaConteudo);
    }

    // Monta o HTML do conteúdo sequencial
    let conteudoHTML = '';
    aula.conteudo.forEach((item, index) => {
        if (item.tipo === 'texto') {
            conteudoHTML += `
                <div class="conteudo-sequencia texto">
                    <span class="numero-passo">${index + 1}</span>
                    <div class="conteudo-texto">
                        <h4>${item.titulo}</h4>
                        <p>${item.texto}</p>
                    </div>
                </div>
            `;
        } else if (item.tipo === 'imagem') {
            conteudoHTML += `
                <div class="conteudo-sequencia imagem">
                    <span class="numero-passo">${index + 1}</span>
                    <figure>
                        <img src="${item.url}" alt="${item.legenda}" loading="lazy">
                        <figcaption>${item.legenda}</figcaption>
                    </figure>
                </div>
            `;
        } else if (item.tipo === 'video') {
            conteudoHTML += `
                <div class="conteudo-sequencia video">
                    <span class="numero-passo">${index + 1}</span>
                    <div class="video-container">
                        <p>🎥 ${item.titulo}</p>
                        <p class="video-placeholder">Vídeo em breve disponível</p>
                    </div>
                </div>
            `;
        }
    });

    abaConteudo.innerHTML = `
        <div class="cabecalho-aba">
            <button class="btn-voltar" onclick="voltarParaAba('aprenda')">⬅️ Voltar</button>
            <h2>📚 ${aula.titulo}</h2>
            <p>${aula.descricao}</p>
            <span class="badge-categoria-aula">${aula.categoria_aula}</span>
        </div>
        <div class="conteudo-aula-sequencia">
            ${conteudoHTML}
        </div>
    `;

    abaConteudo.classList.add('ativa');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// RENDERIZAÇÃO DE BASTIDORES
// ============================================

function renderizarBastidores() {
    const grid = document.getElementById('grid-bastidores');
    if (!grid) return;

    const bastidoresAtivos = todosBastidores.filter(b => b.ativo !== false).sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
    grid.innerHTML = "";

    if (bastidoresAtivos.length === 0) {
        grid.innerHTML = `
            <div class="sem-resultados" style="grid-column: 1 / -1;">
                <p>🎬</p>
                <p>Nenhum conteúdo de bastidores ainda.</p>
                <p>Em breve teremos novidades!</p>
            </div>
        `;
        return;
    }

    bastidoresAtivos.forEach(bastidor => {
        const card = document.createElement('figure');
        card.className = 'foto-bastidores card-clicavel';
        card.dataset.id = bastidor.id;
        card.innerHTML = `
            <img src="${bastidor.imagem_capa}" alt="${bastidor.titulo}" loading="lazy">
            <figcaption>
                <strong>${bastidor.titulo}</strong>
                <span class="badge-fotos">📷 ${bastidor.fotos.length} fotos</span>
            </figcaption>
            <div class="card-overlay">
                <span class="btn-ver-conteudo">👆 Clique para ver as fotos</span>
            </div>
        `;
        card.addEventListener('click', () => abrirPaginaBastidor(bastidor.id));
        grid.appendChild(card);
    });
}

function abrirPaginaBastidor(idBastidor) {
    const bastidor = todosBastidores.find(b => b.id === idBastidor);
    if (!bastidor) return;

    // Esconde todas as abas
    document.querySelectorAll('.aba').forEach(aba => aba.classList.remove('ativa'));

    // Cria ou atualiza a aba de conteúdo dinâmico
    let abaConteudo = document.getElementById('aba-conteudo-dinamico');
    if (!abaConteudo) {
        abaConteudo = document.createElement('section');
        abaConteudo.id = 'aba-conteudo-dinamico';
        abaConteudo.className = 'aba';
        document.querySelector('.conteudo-principal').appendChild(abaConteudo);
    }

    // Monta a galeria de fotos
    let fotosHTML = '';
    bastidor.fotos.forEach((foto, index) => {
        fotosHTML += `
            <figure class="foto-galeria-bastidor" onclick="abrirLightbox('${foto.url}', '${foto.legenda}', '${bastidor.titulo}')">
                <img src="${foto.url}" alt="${foto.legenda}" loading="lazy">
                <figcaption>${foto.legenda}</figcaption>
                <span class="numero-foto">${index + 1}</span>
            </figure>
        `;
    });

    abaConteudo.innerHTML = `
        <div class="cabecalho-aba">
            <button class="btn-voltar" onclick="voltarParaAba('bastidores')">⬅️ Voltar</button>
            <h2>🎬 ${bastidor.titulo}</h2>
            <p>${bastidor.descricao}</p>
        </div>
        <div class="galeria-bastidor-fotos">
            ${fotosHTML}
        </div>
    `;

    abaConteudo.classList.add('ativa');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function voltarParaAba(nomeAba) {
    document.querySelectorAll('.aba').forEach(aba => aba.classList.remove('ativa'));
    document.getElementById(`aba-${nomeAba}`).classList.add('ativa');
    
    // Remove a aba dinâmica do DOM para limpar
    const abaDinamica = document.getElementById('aba-conteudo-dinamico');
    if (abaDinamica) {
        abaDinamica.remove();
    }
    
    // Atualiza o menu ativo
    document.querySelectorAll('.link-menu').forEach(link => link.classList.remove('ativo'));
    document.querySelector(`.link-menu[data-aba="${nomeAba}"]`).classList.add('ativo');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// MÓDULO COMERCIAL
// ============================================

function iniciarCompra(idDesenho) {
    const desenho = todosDesenhos.find(d => d.id === idDesenho);
    if (!desenho || !desenho.comercial) return;
    
    console.log(`🛒 Iniciando compra do desenho: ${desenho.titulo}`);
    console.log(`💰 Preço: R$ ${desenho.comercial.preco.toFixed(2)}`);
    
    alert(`🛒 Compra do desenho "${desenho.titulo}" será implementada em breve!\nPreço: R$ ${desenho.comercial.preco.toFixed(2)}`);
}

// ============================================
// INTERAÇÕES DO CARD
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
// FILTROS
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
// CONTATO
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
// ADMIN
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
// CRUD ADMIN
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
    
    const preview = document.getElementById('preview-imagem');
    if (preview) preview.innerHTML = '';
    
    estaEditando = false;
    imagemBase64 = null;
}

function salvarDesenhoAdmin() {
    const titulo = document.getElementById('admin-titulo').value.trim();
    const categoria = document.getElementById('admin-categoria').value;
    const ano = parseInt(document.getElementById('admin-ano').value);
    const orientacao = document.getElementById('admin-orientacao').value;
    const tamanho = document.getElementById('admin-tamanho').value;
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
            todosDesenhos[index].orientacao = orientacao;
            todosDesenhos[index].tamanho = tamanho;
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
            orientacao: orientacao,
            tamanho: tamanho,
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
    document.getElementById('admin-orientacao').value = desenho.orientacao || 'paisagem';
    document.getElementById('admin-tamanho').value = desenho.tamanho || 'A4';
    document.getElementById('admin-materiais').value = desenho.materiais_usados.join(', ');
    document.getElementById('admin-preco').value = desenho.comercial ? desenho.comercial.preco : '';
    document.getElementById('admin-venda').checked = desenho.comercial ? desenho.comercial.disponivel_venda : false;
    document.getElementById('editando-id').value = desenho.id;
    
    if (desenho.url_imagem && !desenho.url_imagem.includes('placehold.co')) {
        imagemBase64 = desenho.url_imagem;
        mostrarPreviewImagem(imagemBase64);
    }
    
    document.getElementById('titulo-formulario').textContent = '✏️ Editar Desenho';
    document.getElementById('btn-salvar').textContent = '💾 Atualizar Desenho';
    document.getElementById('btn-cancelar').style.display = 'inline-block';
    
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
        const orientacaoLabel = {
            'paisagem': 'Deitada',
            'retrato': 'Em Pé',
            'quadrado': 'Quadrada'
        }[desenho.orientacao || 'paisagem'] || 'Deitada';
        
        tr.innerHTML = `
            <td><img src="${desenho.url_imagem}" alt="${desenho.titulo}" loading="lazy"></td>
            <td><strong>${desenho.titulo}</strong></td>
            <td><span class="badge-categoria-tabela ${getClasseCategoria(desenho.categoria)}">${desenho.categoria}</span></td>
            <td>${desenho.ano}</td>
            <td>${orientacaoLabel}</td>
            <td class="acoes">
                <button class="btn-editar" onclick="editarDesenho('${desenho.id}')">✏️ Editar</button>
                <button class="btn-excluir" onclick="excluirDesenho('${desenho.id}')">🗑️ Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Preenche o select de anos dinamicamente de 2020 até o ano atual.
 * Atualiza automaticamente quando mudar o ano.
 */
function preencherAnosFiltro() {
    const selectAno = document.getElementById('filtro-ano');
    if (!selectAno) return;
    
    const anoAtual = new Date().getFullYear();
    const anoInicial = 2020;
    
    // Limpa as opções existentes (mantém "Todos os Anos")
    selectAno.innerHTML = '<option value="todos">Todos os Anos</option>';
    
    // Adiciona os anos de 2020 até o ano atual, em ordem decrescente
    for (let ano = anoAtual; ano >= anoInicial; ano--) {
        const option = document.createElement('option');
        option.value = ano;
        option.textContent = ano;
        selectAno.appendChild(option);
    }
    
    console.log(`📅 Anos do filtro atualizados: ${anoInicial} a ${anoAtual}`);
}

// ============================================
// SERVICE WORKER
// ============================================

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

// ============================================
// AUXILIARES
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
// INICIALIZAÇÃO
// ============================================

function inicializarApp() {
    console.log("🎨 ArtOki iniciado!");
    console.log(`Versão: ${CONFIG.APP_VERSION}`);
    console.log(`Módulo de vendas: ${CONFIG.MODULO_VENDAS_ATIVO ? 'ATIVO' : 'INATIVO (oculto)'}`);
    console.log(`Likes salvos: ${desenhosCurtidos.size} desenhos`);

    preencherAnosFiltro();
    registrarServiceWorker();
    configurarNavegacao();
    configurarFiltros();
    configurarFormularioContato();
    configurarLoginAdmin();
    configurarFormularioAdmin();
    configurarAbasAdmin();
    configurarEditorAulas();
    configurarLightbox();
    
    // Carrega dados e renderiza tabelas após carregar
    carregarDados();
}

document.addEventListener('DOMContentLoaded', inicializarApp);

// ============================================
// ABAS DO PAINEL ADMIN
// ============================================

function configurarAbasAdmin() {
    const botoesAdmin = document.querySelectorAll('.btn-aba-admin');
    const abasAdmin = document.querySelectorAll('.aba-admin');
    
    if (botoesAdmin.length === 0) return;
    
    botoesAdmin.forEach(botao => {
        botao.addEventListener('click', () => {
            const abaAlvo = botao.dataset.abaAdmin;
            
            // Remove ativo de todos os botões
            botoesAdmin.forEach(b => b.classList.remove('ativo'));
            // Ativa o botão clicado
            botao.classList.add('ativo');
            
            // Esconde todas as abas admin
            abasAdmin.forEach(aba => aba.classList.remove('ativa'));
            // Mostra a aba alvo
            const abaDestino = document.getElementById(`aba-admin-${abaAlvo}`);
            if (abaDestino) {
                abaDestino.classList.add('ativa');
            }
            
            console.log(`🔧 Admin: navegou para ${abaAlvo}`);
        });
    });
}

// ============================================
// EDITOR DE CONTEÚDO DE AULAS (ADMIN)
// ============================================

let aulaSendoEditada = null;

function configurarEditorAulas() {
    const formularioAula = document.getElementById('formulario-aula');
    const tabelaAulasBody = document.getElementById('tabela-aulas-body');
    const semAulas = document.getElementById('sem-aulas-admin');
    const editorConteudo = document.getElementById('editor-conteudo-aula');
    const btnFecharEditor = document.getElementById('btn-fechar-editor');
    const btnAdicionarPasso = document.getElementById('btn-adicionar-passo');
    
    // Salvar nova aula
    if (formularioAula) {
        formularioAula.addEventListener('submit', (evento) => {
            evento.preventDefault();
            salvarAulaAdmin();
        });
    }
    
    // Fechar editor
    if (btnFecharEditor) {
        btnFecharEditor.addEventListener('click', () => {
            editorConteudo.style.display = 'none';
            aulaSendoEditada = null;
        });
    }
    
    // Adicionar passo
    if (btnAdicionarPasso) {
        btnAdicionarPasso.addEventListener('click', () => {
            adicionarPassoAula();
        });
    }
    // Sempre começa em modo de criação (formulário limpo)
    resetarFormularioAula();
}

function renderizarTabelaAulas() {
    const tbody = document.getElementById('tabela-aulas-body');
    const semAulas = document.getElementById('sem-aulas-admin');
    const tabela = document.getElementById('tabela-aulas');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';

        console.log('📚 Renderizando tabela de aulas. Total:', todasAulas.length);
    
    if (todasAulas.length === 0) {
        if (tabela) tabela.style.display = 'none';
        if (semAulas) semAulas.style.display = 'block';
        return;
    }
    
    if (tabela) tabela.style.display = 'table';
    if (semAulas) semAulas.style.display = 'none';
    
    todasAulas.forEach(aula => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${aula.imagem_capa}" alt="${aula.titulo}" loading="lazy" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;"></td>
            <td><strong>${aula.titulo}</strong></td>
            <td><span class="badge-categoria-tabela" style="background-color: #3B82F6;">${aula.categoria_aula}</span></td>
            <td class="acoes">
                <button class="btn-editar-conteudo" onclick="abrirEditorConteudo('${aula.id}')">📝 Conteúdo</button>
                <button class="btn-editar" onclick="editarAulaAdmin('${aula.id}')">✏️ Editar</button>
                <button class="btn-excluir" onclick="excluirAulaAdmin('${aula.id}')">🗑️ Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function abrirEditorConteudo(idAula) {
    const aula = todasAulas.find(a => a.id === idAula);
    if (!aula) return;
    
    aulaSendoEditada = idAula;
    const editor = document.getElementById('editor-conteudo-aula');
    const tituloEdicao = document.getElementById('titulo-aula-edicao');
    const listaPassos = document.getElementById('lista-passos-aula');
    
    if (tituloEdicao) tituloEdicao.textContent = `Editando: ${aula.titulo}`;
    
    // Renderiza passos existentes
    listaPassos.innerHTML = '';
    if (aula.conteudo && aula.conteudo.length > 0) {
        aula.conteudo.forEach((passo, index) => {
            const div = document.createElement('div');
            div.className = 'passo-aula-item';
            div.innerHTML = `
                <span class="numero-passo-lista">${index + 1}</span>
                <div class="conteudo-passo-lista">
                    <h5>${passo.titulo || 'Sem título'}</h5>
                    <p>${passo.texto || passo.legenda || passo.url || ''}</p>
                </div>
                <span class="tipo-passo-badge">${passo.tipo}</span>
            `;
            listaPassos.appendChild(div);
        });
    } else {
        listaPassos.innerHTML = '<p style="text-align: center; color: #9CA3AF; padding: 2rem;">Nenhum passo adicionado ainda.</p>';
    }
    
    if (editor) {
        editor.style.display = 'block';
        editor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function salvarAulaAdmin() {
    const titulo = document.getElementById('aula-titulo').value.trim();
    const categoria = document.getElementById('aula-categoria').value.trim();
    const descricao = document.getElementById('aula-descricao').value.trim();
    
    if (!titulo || !categoria || !descricao) {
        alert('⚠️ Preencha todos os campos obrigatórios!');
        return;
    }
    
    const novoId = `aula-${Date.now()}`;
    const novaAula = {
        id: novoId,
        titulo: titulo,
        categoria_aula: categoria,
        descricao: descricao,
        imagem_capa: 'https://placehold.co/400x300/3B82F6/FFFFFF?text=Aula',
        conteudo: [],
        ordem: todasAulas.length + 1,
        ativo: true
    };
    
    todasAulas.push(novaAula);
    salvarAulasNoStorage();
    renderizarTabelaAulas();
    
    // Limpa formulário
    document.getElementById('formulario-aula').reset();
    
    alert('✅ Aula adicionada com sucesso! Agora clique em "📝 Conteúdo" para adicionar os passos.');
}

function editarAulaAdmin(idAula) {
    const aula = todasAulas.find(a => a.id === idAula);
    if (!aula) return;
    
    document.getElementById('aula-titulo').value = aula.titulo;
    document.getElementById('aula-categoria').value = aula.categoria_aula;
    document.getElementById('aula-descricao').value = aula.descricao;
    document.getElementById('editando-id-aula').value = aula.id;
    document.getElementById('titulo-formulario-aula').textContent = '✏️ Editar Aula';
    document.getElementById('btn-salvar-aula').textContent = '💾 Atualizar Aula';
    
    const btnCancelar = document.getElementById('btn-cancelar-aula');
    if (btnCancelar) btnCancelar.style.display = 'inline-block';
}

function excluirAulaAdmin(idAula) {
    if (!confirm('🗑️ Tem certeza que deseja excluir esta aula?')) return;
    
    todasAulas = todasAulas.filter(a => a.id !== idAula);
    salvarAulasNoStorage();
    renderizarTabelaAulas();
    
    // Fecha editor se estiver aberto
    const editor = document.getElementById('editor-conteudo-aula');
    if (editor) editor.style.display = 'none';
    aulaSendoEditada = null;
    
    alert('🗑️ Aula excluída com sucesso!');
}

function adicionarPassoAula() {
    if (!aulaSendoEditada) return;
    
    const tipo = document.getElementById('passo-tipo').value;
    const titulo = document.getElementById('passo-titulo').value.trim();
    const conteudo = document.getElementById('passo-conteudo').value.trim();
    const legenda = document.getElementById('passo-legenda').value.trim();
    
    if (!titulo || !conteudo) {
        alert('⚠️ Preencha o título e o conteúdo do passo!');
        return;
    }
    
    const aula = todasAulas.find(a => a.id === aulaSendoEditada);
    if (!aula) return;
    
    const novoPasso = {
        tipo: tipo,
        titulo: titulo
    };
    
    if (tipo === 'texto') {
        novoPasso.texto = conteudo;
    } else if (tipo === 'imagem') {
        novoPasso.url = conteudo;
        novoPasso.legenda = legenda;
    } else if (tipo === 'video') {
        novoPasso.url = conteudo;
        novoPasso.titulo = titulo;
    }
    
    aula.conteudo.push(novoPasso);
    salvarAulasNoStorage();
    
    // Limpa campos
    document.getElementById('passo-titulo').value = '';
    document.getElementById('passo-conteudo').value = '';
    document.getElementById('passo-legenda').value = '';
    
    // Reabre o editor para mostrar o novo passo
    abrirEditorConteudo(aulaSendoEditada);
}

function resetarFormularioAula() {
    const formulario = document.getElementById('formulario-aula');
    const tituloForm = document.getElementById('titulo-formulario-aula');
    const btnSalvar = document.getElementById('btn-salvar-aula');
    const btnCancelar = document.getElementById('btn-cancelar-aula');
    const editandoId = document.getElementById('editando-id-aula');
    const preview = document.getElementById('preview-capa-aula');
    
    if (formulario) formulario.reset();
    if (tituloForm) tituloForm.textContent = '➕ Adicionar Nova Aula';
    if (btnSalvar) btnSalvar.textContent = '💾 Salvar Aula';
    if (btnCancelar) btnCancelar.style.display = 'none';
    if (editandoId) editandoId.value = '';
    if (preview) preview.innerHTML = '';
}

// Torna funções globais
window.abrirEditorConteudo = abrirEditorConteudo;
window.editarAulaAdmin = editarAulaAdmin;
window.excluirAulaAdmin = excluirAulaAdmin;

// Torna funções globais
window.toggleMateriais = toggleMateriais;
window.toggleLike = toggleLike;
window.editarDesenho = editarDesenho;
window.excluirDesenho = excluirDesenho;
window.iniciarCompra = iniciarCompra;
window.abrirLightbox = abrirLightbox;
window.fecharLightbox = fecharLightbox;
window.abrirPaginaAula = abrirPaginaAula;
window.abrirPaginaBastidor = abrirPaginaBastidor;
window.voltarParaAba = voltarParaAba;

window.ArtOki = {
    validarSenhaAdmin,
    CONFIG,
    aplicarFiltros,
    salvarAulasNoStorage,
    salvarBastidoresNoStorage,
    todasAulas,
    todosBastidores
};