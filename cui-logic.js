// Configuração inicial
document.addEventListener('DOMContentLoaded', function() {
  // Event listeners
  document.getElementById('gerarBtn').addEventListener('click', gerarCUI);
  document.getElementById('validarBtn').addEventListener('click', validarCUI);
  document.getElementById('digitosBtn').addEventListener('click', gerarCheckDigits);
  
  // Limpar mensagens ao editar campos
  document.getElementById('cui').addEventListener('input', limparValidacao);
  document.getElementById('cuiCheck').addEventListener('input', limparCheckDigits);
});

function limparValidacao() {
  const validacaoDiv = document.getElementById('validacao');
  validacaoDiv.textContent = 'Resultado da validação aparecerá aqui';
  validacaoDiv.className = 'result-box';
}

function limparCheckDigits() {
  const checkDigitsDiv = document.getElementById('checkDigits');
  checkDigitsDiv.textContent = 'Dígitos calculados aparecerão aqui';
  checkDigitsDiv.className = 'result-box';
}

// Gera um código local com dígitos aleatórios controláveis
function gerarCodigoLocal() {
  const digitosAleatorios = parseInt(document.getElementById('digitosAleatorios').value);
  const digitosFixos = 12 - digitosAleatorios; // Total de 12 dígitos no código local
  
  let codigo = '';
  
  // Adiciona zeros não significativos
  for (let i = 0; i < digitosFixos; i++) {
    codigo += '0';
  }
  
  // Adiciona dígitos aleatórios
  for (let i = 0; i < digitosAleatorios; i++) {
    codigo += Math.floor(Math.random() * 10).toString();
  }
  
  return codigo;
}

// Formata o CUI para exibição com separadores
function formatarCUI(cui) {
  return `${cui.slice(0,2)}-${cui.slice(2,6)}-${cui.slice(6,12)}-${cui.slice(12,18)}-${cui.slice(18)}`;
}

// Calcula os dígitos de verificação conforme regulamento
function calculateCheckDigits(base) {
  // Remove prefixo do país (PT) se existir
  const numericPart = base.startsWith('PT') ? base.slice(2) : base;
  
  if (numericPart.length !== 16) {
    throw new Error('A parte numérica deve ter 16 dígitos');
  }

  // Calcula módulo 529
  let mod = 0;
  for (let i = 0; i < numericPart.length; i++) {
    const digit = parseInt(numericPart[i], 10);
    if (isNaN(digit)) {
      throw new Error('Caractere inválido na parte numérica');
    }
    mod = (mod * 10 + digit) % 529;
  }

  // Tabela de caracteres para dígitos de verificação
  const table = [
    'T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', // 0-10
    'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E' // 11-22
  ];

  const a = Math.floor(mod / 23);
  const b = mod % 23;

  return table[a] + table[b];
}

// Gera um CUI completo
function gerarCUI() {
  try {
    const prefixo = 'PT';
    const operador = document.getElementById('operador').value;
    const codigoLocal = gerarCodigoLocal();
    const base = prefixo + operador + codigoLocal;
    const checkDigits = calculateCheckDigits(base);
    
    const cuiCompleto = base + checkDigits;
    const resultadoDiv = document.getElementById('resultado');
    
    resultadoDiv.innerHTML = `
      <strong>CUI Gerado:</strong> ${formatarCUI(cuiCompleto)}<br>
      <div class="cui-details">
        Estrutura: PT-${operador}-${codigoLocal.slice(0,6)}-${codigoLocal.slice(6)}-${checkDigits}<br>
        Dígitos aleatórios: ${document.getElementById('digitosAleatorios').value}
      </div>
    `;
    resultadoDiv.className = 'result-box success';
  } catch (error) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.textContent = `❌ Erro ao gerar CUI: ${error.message}`;
    resultadoDiv.className = 'result-box error';
  }
}

// Valida um CUI existente
function validarCUI() {
  try {
    const cuiInput = document.getElementById('cui').value.trim().toUpperCase();
    const validacaoDiv = document.getElementById('validacao');
    
    if (cuiInput.length !== 20) {
      validacaoDiv.textContent = '❌ CUI inválido! Deve ter exatamente 20 caracteres.';
      validacaoDiv.className = 'result-box error';
      return;
    }

    const base = cuiInput.slice(0, -2);
    const checkDigits = cuiInput.slice(-2);
    const calculatedDigits = calculateCheckDigits(base);
    
    if (checkDigits === calculatedDigits) {
      validacaoDiv.textContent = '✅ CUI válido!';
      validacaoDiv.className = 'result-box success';
    } else {
      validacaoDiv.textContent = `❌ CUI inválido! Dígitos corretos: ${calculatedDigits}`;
      validacaoDiv.className = 'result-box error';
    }
  } catch (error) {
    const validacaoDiv = document.getElementById('validacao');
    validacaoDiv.textContent = `❌ Erro na validação: ${error.message}`;
    validacaoDiv.className = 'result-box error';
  }
}

// Gera apenas os dígitos de verificação
function gerarCheckDigits() {
  try {
    const cuiInput = document.getElementById('cuiCheck').value.trim().toUpperCase();
    const checkDigitsDiv = document.getElementById('checkDigits');
    
    if (cuiInput.length !== 18) {
      checkDigitsDiv.textContent = '❌ Comprimento inválido! Deve ter 18 caracteres (incluindo PT).';
      checkDigitsDiv.className = 'result-box error';
      return;
    }

    const checkDigits = calculateCheckDigits(cuiInput);
    checkDigitsDiv.textContent = `Dígitos de verificação: ${checkDigits}`;
    checkDigitsDiv.className = 'result-box success';
  } catch (error) {
    const checkDigitsDiv = document.getElementById('checkDigits');
    checkDigitsDiv.textContent = `❌ Erro no cálculo: ${error.message}`;
    checkDigitsDiv.className = 'result-box error';
  }
}
