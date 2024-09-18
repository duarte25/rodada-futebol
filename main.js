// Mapeamento dos escudos dos times para os arquivos SVG locais
const escudosTimes = {
    "time-a": "img/TimeA.svg",
    "time-b": "img/TimeB.svg",
    "time-c": "img/TimeC.svg",
    "time-d": "img/TimeD.svg",
    "time-e": "img/TimeE.svg",
    "time-f": "img/TimeF.svg",
    "time-g": "img/TimeG.svg",
    "time-h": "img/TimeH.svg"
};

// URL da API fornecida
const apiUrl = 'https://sevn-pleno-esportes.deno.dev/';

let dadosRodadas = [];
let rodadaAtual = 0; // Variavel da rodada atual

// Essa é a função principal que executara todo o fluxo
async function init() {
    try {
        // Busca os dados na API
        dadosRodadas = await fetchDados();

        // Exibe a primeira rodada iniciando com 0
        exibirRodada(rodadaAtual);

        // Configura os botões de paginação
        configurarPaginacao();
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Função que faz a requisição à API e retorna os dados
async function fetchDados() {
    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error('Erro ao buscar dados da API');
    }

    // Retorna a promessa com o JSON
    return response.json();
}

// Função que constroi uma rodada específica no HTML
function exibirRodada(indiceRodada) {
    const resultadosDiv = document.getElementById('resultados');

    // Limpa o conteúdo anterior para evitar bugs
    resultadosDiv.innerHTML = '';

    if (indiceRodada < 0 || indiceRodada >= dadosRodadas.length) return;

    const rodadaData = dadosRodadas[indiceRodada];

    // Chama a função que criara os jogos
    const rodadaHtml = criarRodadaHTML(rodadaData);

    resultadosDiv.appendChild(rodadaHtml);

    // Atualiza o texto da rodada atual
    document.getElementById('rodada-atual').textContent = `Rodada ${rodadaData.round}`;
}

// Função que cria o HTML de uma rodada e seus jogos
function criarRodadaHTML(roundData) {
    const container = document.createElement('div');
    container.classList.add('containerRodada');

    roundData.games.forEach((game, index) => {
        // Chama a função que criará esse jogo específico
        const gameHtml = criarJogoHTML(game);
        container.appendChild(gameHtml);

        // Se não for o último jogo, adiciona a barra entre os jogos
        if (index < roundData.games.length - 1) {
            const versusBar = document.createElement('div');
            versusBar.classList.add('barraHorizontalCurta');
            container.appendChild(versusBar);
        }
    });

    return container;
}
// Função que cria o HTML de cada jogo
function criarJogoHTML(game) {
    const gameInfo = document.createElement('div');
    gameInfo.classList.add('jogo');

    const homeTeam = document.createElement('span');
    homeTeam.innerHTML = `
    <div class="containerTimeScore">
        <img src="${escudosTimes[game.team_home_id]}" alt="Escudo de ${game.team_home_name}" class="escudo">
        <span class="teamName">${game.team_home_name}</span>
        <span class="teamScore">${game.team_home_score}</span> 
    </div>
    `;

    const awayTeam = document.createElement('span');
    awayTeam.innerHTML = `
    <div class="containerTimeScore">
        <span class="teamScore">${game.team_away_score}</span> 
        <span class="teamName">${game.team_away_name}</span>
        <img src="${escudosTimes[game.team_away_id]}" alt="Escudo de ${game.team_away_name}" class="escudo">
    </div>
    `;

    gameInfo.appendChild(homeTeam);

    const versusImage = document.createElement('img');
    versusImage.src = 'img/versus.svg'; // Caminho da imagem
    versusImage.alt = 'Versus';            // Texto alternativo, caso a imagem não carregue

    // Adiciona a classe CSS
    versusImage.classList.add('versusImage');

    // Adiciona a imagem no lugar do ' x '
    gameInfo.appendChild(versusImage);

    gameInfo.appendChild(awayTeam);

    return gameInfo;
}

// Função que configura os botões de paginação
function configurarPaginacao() {
    const btnAnterior = document.getElementById('anterior');
    const btnProxima = document.getElementById('proxima');

    btnAnterior.addEventListener('click', () => {
        if (rodadaAtual > 0) {
            rodadaAtual--;
            exibirRodada(rodadaAtual);
            atualizarEstadoBotoes();
        }
    });

    btnProxima.addEventListener('click', () => {
        if (rodadaAtual < dadosRodadas.length - 1) {
            rodadaAtual++;
            exibirRodada(rodadaAtual);
            atualizarEstadoBotoes();
        }
    });

    atualizarEstadoBotoes();
}

// Essa função atualiza os botões para que assim consiga acontecer a paginação
function atualizarEstadoBotoes() {
    const btnAnterior = document.getElementById('anterior');
    const btnProxima = document.getElementById('proxima');

    btnAnterior.disabled = rodadaAtual === 0;
    btnProxima.disabled = rodadaAtual === dadosRodadas.length - 1;
}

// Inicia o fluxo da aplicação ao carregar a página
init();
