document.addEventListener('DOMContentLoaded', function () {
    // Elementos do DOM
    const inputPortas = document.getElementById('portas');
    const btnResolver = document.getElementById('resolver');
    const btnLimpar = document.getElementById('limpar');
    const resultadoDiv = document.getElementById('resultado');

    // Função principal para resolver o enigma
    function resolverEnigma() {
        // Limpa resultados anteriores
        resultadoDiv.innerHTML = '';

        // Obtém e valida a entrada
        const entrada = inputPortas.value.trim();
        if (!entrada) {
            mostrarErro('Por favor, insira os números das portas!');
            return;
        }

        // Converte a entrada em um array de números
        let numerosPortas;
        try {
            numerosPortas = entrada.split(',').map(num => parseInt(num.trim(), 10));
        } catch (e) {
            mostrarErro('Formato inválido! Use números separados por vírgula, ex: 15, 6, 90');
            return;
        }

        // Verifica se temos exatamente 3 portas
        if (numerosPortas.length !== 3) {
            mostrarErro('Por favor, insira exatamente 3 números de portas!');
            return;
        }

        // Verifica se todos os valores são números válidos e positivos
        if (numerosPortas.some(isNaN) || numerosPortas.some(num => num <= 0)) {
            mostrarErro('Por favor, insira apenas números positivos válidos!');
            return;
        }

        // Verifica todas as permutações possíveis das portas
        const resultado = identificarPortas(numerosPortas);

        if (resultado) {
            exibirResultado(resultado.tesouro, resultado.poco, resultado.inicio);
        } else {
            mostrarErro('Não foi possível determinar as portas com os números fornecidos. Verifique se seguem os padrões do enigma.');
        }
    }

    // Função para identificar qual porta é qual
    function identificarPortas(numeros) {
        // Gera todas as permutações possíveis das 3 portas
        const permutacoes = [
            [numeros[0], numeros[1], numeros[2]],
            [numeros[0], numeros[2], numeros[1]],
            [numeros[1], numeros[0], numeros[2]],
            [numeros[1], numeros[2], numeros[0]],
            [numeros[2], numeros[0], numeros[1]],
            [numeros[2], numeros[1], numeros[0]]
        ];

        // Testa cada permutação para ver se atende às condições
        for (const [a, b, c] of permutacoes) {
            // Verifica as condições para cada tipo de porta
            const aEhTesouro = a % 3 === 0;
            const bEhPoco = b === somaDigitos(a);
            const cEhInicio = c === a * b;

            if (aEhTesouro && bEhPoco && cEhInicio) {
                return { tesouro: a, poco: b, inicio: c };
            }
        }

        // Se nenhuma permutação funcionar, retorna null
        return null;
    }

    // Função auxiliar para calcular a soma dos dígitos
    function somaDigitos(numero) {
        return String(numero).split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
    }

    // Função para exibir mensagens de erro
    function mostrarErro(mensagem) {
        resultadoDiv.innerHTML = `<div class="porta-resultado" style="color: #ef5350;">${mensagem}</div>`;
    }

    // Função para exibir o resultado formatado
    function exibirResultado(tesouro, poco, inicio) {
        resultadoDiv.innerHTML = `
            <div class="porta-resultado tesouro">
                <span>Porta ${tesouro}</span>
                <span>"tesouro" 🏆 (Múltiplo de 3)</span>
            </div>
            <div class="porta-resultado poco">
                <span>Porta ${poco}</span>
                <span>"poço sem fim" ⚠️ (Soma dos dígitos: ${somaDigitos(tesouro)})</span>
            </div>
            <div class="porta-resultado inicio">
                <span>Porta ${inicio}</span>
                <span>"volta ao início" 🔄 (Produto: ${tesouro} × ${poco} = ${tesouro * poco})</span>
            </div>
        `;
    }

    // Função para limpar os campos
    function limparCampos() {
        inputPortas.value = '';
        resultadoDiv.innerHTML = '';
    }

    // Event listeners
    btnResolver.addEventListener('click', resolverEnigma);
    btnLimpar.addEventListener('click', limparCampos);

    // Permite resolver pressionando Enter no input
    inputPortas.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            resolverEnigma();
        }
    });
});