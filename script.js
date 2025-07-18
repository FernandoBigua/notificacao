document.addEventListener('DOMContentLoaded', () => {
    let todosOsDados = []; // Variável para armazenar todos os dados do JSON
    const filtroCompromissoSelect = document.getElementById('filtroCompromisso');
    const filtroResponsabilidadeSelect = document.getElementById('filtroResponsabilidade');
    const compromissosTableBody = document.querySelector('#compromissosTable tbody');

    // Função para carregar o JSON
    async function carregarDados() {
        try {
            const response = await fetch('compromisso.json');
            todosOsDados = await response.json();
            console.log('Dados carregados:', todosOsDados); // Para depuração

            popularFiltros();
            renderizarTabela(); // Renderiza a tabela inicial com todos os dados
        } catch (error) {
            console.error('Erro ao carregar o arquivo JSON:', error);
            compromissosTableBody.innerHTML = '<tr><td colspan="5">Erro ao carregar os dados.</td></tr>';
        }
        document.getElementById('botaoImprimir').style.display = 'inline-block';

    }

    // Função para popular os dropdowns de filtro
    function popularFiltros() {
        // Popular filtro de Compromisso
        const compromissosUnicos = [...new Set(todosOsDados.map(item => item.COMPROMISSO))];
        compromissosUnicos.sort().forEach(compromisso => {
            const option = document.createElement('option');
            option.value = compromisso;
            option.textContent = compromisso;
            filtroCompromissoSelect.appendChild(option);
        });

        // O filtro de Responsabilidade já tem opções estáticas no HTML,
        // mas você pode popular dinamicamente se preferir (similar ao de Compromisso)
        // const responsabilidadesUnicas = [...new Set(todosOsDados.map(item => item.RESPONSABILIDADE))];
        // responsabilidadesUnicas.sort().forEach(responsabilidade => {
        //     const option = document.createElement('option');
        //     option.value = responsabilidade;
        //     option.textContent = responsabilidade;
        //     filtroResponsabilidadeSelect.appendChild(option);
        // });
    }

    // Função para renderizar a tabela com os dados filtrados
    function renderizarTabela() {
        if (filtroResponsabilidadeSelect.value === '') {
            compromissosTableBody.innerHTML = '<tr><td colspan="5">Selecione uma responsabilidade para ver os resultados.</td></tr>';
            return;
        }

        const compromissoSelecionado = filtroCompromissoSelect.value;
        const responsabilidadeSelecionada = filtroResponsabilidadeSelect.value;

        // Filtra os dados com base nas seleções
        const dadosFiltrados = todosOsDados.filter((item) => {
          const matchCompromisso =
            compromissoSelecionado === "" ||
            item.COMPROMISSO === compromissoSelecionado;
          const matchResponsabilidade =
            responsabilidadeSelecionada === "" ||
            item.RESPONSABILIDADE === responsabilidadeSelecionada;
          return matchCompromisso && matchResponsabilidade;
        });
       dadosFiltrados.sort((a, b) => a.ITEM.localeCompare(b.ITEM, undefined, { numeric: true }));


        // Limpa o corpo da tabela
        compromissosTableBody.innerHTML = "";

        if (dadosFiltrados.length === 0) {
          compromissosTableBody.innerHTML =
            '<tr><td colspan="5">Nenhum compromisso encontrado com os filtros selecionados.</td></tr>';
          return;
        }

        // Adiciona as linhas à tabela
        dadosFiltrados.forEach(item => {
            const row = compromissosTableBody.insertRow();
            row.insertCell().textContent = item.COMPROMISSO;
            row.insertCell().textContent = item.RESPONSABILIDADE;
            row.insertCell().textContent = item.ITEM;
            row.insertCell().textContent = item.DESCRIÇÃO;
            row.insertCell().textContent = item.PRAZO;
        });
        // Atualiza os textos que vão para impressão
document.getElementById('infoCompromisso').textContent =
  compromissoSelecionado ? `Compromisso: ${compromissoSelecionado}` : '';

document.getElementById('infoResponsabilidade').textContent =
  responsabilidadeSelecionada ? `Responsabilidade: ${responsabilidadeSelecionada}` : '';

    }

    // Adiciona os event listeners para os filtros
    filtroCompromissoSelect.addEventListener('change', renderizarTabela);
    filtroResponsabilidadeSelect.addEventListener('change', renderizarTabela);

    // Carrega os dados quando o DOM estiver completamente carregado
    carregarDados();
});
function imprimirComDelay() {
    // Aguarda 500ms antes de chamar a impressão, garantindo que a tabela esteja totalmente renderizada
    setTimeout(() => {
        window.print();
    }, 500);
}
