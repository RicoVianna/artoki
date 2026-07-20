// ============================================
// ArtOki - Service Worker (PWA Offline)
// ============================================

const CACHE_NAME = 'artoki-cache-v1';
const URLS_PARA_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/dados.json',
    '/icons/icon-144x144.png',
    '/icons/icon-192x192.jpg',
    '/icons/icon-512x512.png'
];

// ============================================
// INSTALAÇÃO - Cacheia os arquivos principais
// ============================================

self.addEventListener('install', (evento) => {
    console.log('🔧 Service Worker: Instalando...');
    
    evento.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Cache aberto, adicionando arquivos...');
                return cache.addAll(URLS_PARA_CACHE);
            })
            .then(() => {
                console.log('✅ Todos os arquivos cacheados com sucesso!');
                return self.skipWaiting();
            })
            .catch((erro) => {
                console.warn('⚠️ Erro ao cachear arquivos:', erro);
            })
    );
});

// ============================================
// ATIVAÇÃO - Limpa caches antigos
// ============================================

self.addEventListener('activate', (evento) => {
    console.log('🚀 Service Worker: Ativando...');
    
    evento.waitUntil(
        caches.keys()
            .then((nomesCaches) => {
                return Promise.all(
                    nomesCaches.map((nomeCache) => {
                        if (nomeCache !== CACHE_NAME) {
                            console.log('🗑️ Removendo cache antigo:', nomeCache);
                            return caches.delete(nomeCache);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker ativado e controlando a página!');
                return self.clients.claim();
            })
    );
});

// ============================================
// FETCH - Estratégia: Cache First, depois Network
// ============================================

self.addEventListener('fetch', (evento) => {
    evento.respondWith(
        caches.match(evento.request)
            .then((respostaCache) => {
                // Se está no cache, retorna do cache
                if (respostaCache) {
                    return respostaCache;
                }
                
                // Se não está no cache, busca na rede
                return fetch(evento.request)
                    .then((respostaRede) => {
                        // Se a resposta for válida, guarda no cache
                        if (!respostaRede || respostaRede.status !== 200 || respostaRede.type !== 'basic') {
                            return respostaRede;
                        }
                        
                        const respostaParaCache = respostaRede.clone();
                        
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(evento.request, respostaParaCache);
                            });
                        
                        return respostaRede;
                    })
                    .catch((erro) => {
                        console.warn('⚠️ Falha ao buscar na rede:', erro);
                        // Se falhar tudo, tenta retornar uma página offline genérica
                        // (poderia ser uma página de "você está offline")
                    });
            })
    );
});