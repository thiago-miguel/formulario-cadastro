let ultimoCepBuscado = "";

// Persistência dos dados ao recarregar a página
document.addEventListener("DOMContentLoaded", () => {
    const cepSalvo = localStorage.getItem("cep");

    if (cepSalvo != null) {
        document.getElementById("cep").value = cepSalvo;
        document.getElementById("logradouro").value = localStorage.getItem("logradouro");
        document.getElementById("bairro").value = localStorage.getItem("bairro");
        document.getElementById("cidade").value = localStorage.getItem("cidade");
        document.getElementById("estado").value = localStorage.getItem("estado");
    }

    document.getElementById("nome").value = localStorage.getItem("nome") ?? "";
    document.getElementById("email").value = localStorage.getItem("email") ?? "";
    document.getElementById("telefone").value = localStorage.getItem("telefone") ?? "";
    document.getElementById("idade").value = localStorage.getItem("idade") ?? "";
    document.getElementById("data-nascimento").value = localStorage.getItem("data-nascimento") ?? "";
    document.getElementById("tamanho-calçado").value = localStorage.getItem("tamanho-calçado") ?? "";
    document.getElementById("comida-favorita").value = localStorage.getItem("comida-favorita") ?? "";

});

const campos = [
  "nome", "email", "telefone", "idade",
  "data-nascimento", "tamanho-calçado", "comida-favorita"
];

const camposEndereco = [
  "cep", "logradouro", "bairro", "cidade", "estado"
];

// Mantém persistência dos dados conforme o usuário digita
campos.forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener("input", debounce(() => {
        localStorage.setItem(id, input.value);
    }, 400));
});

// Teletone
const telInput = document.getElementById("telefone");
telInput.addEventListener("blur", () => {
    const apenasNumeros = telInput.value.replace(/\D/g, "");

    if (apenasNumeros.length !== 10 && apenasNumeros.length !== 11) {
        alert("Número de telefone inválido. Deve conter 10 ou 11 dígitos.");
        telInput.classList.add("input-erro");
        telInput.value = "";
        localStorage.removeItem("telefone");
        telInput.focus();
        return;
    }

    telInput.classList.remove("input-erro");
});


telInput.addEventListener("input", () => {
    const valorMascarado = formatarTelefone(telInput.value);
    telInput.value = valorMascarado;

    localStorage.setItem("telefone", valorMascarado);
});

function formatarTelefone(valor) {
    let numeros = valor.replace(/\D/g, "");

    // Limita a 11 dígitos
    numeros = numeros.slice(0, 11);

    // Celular (11 dígitos)
    if (numeros.length === 11) {
        return numeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }

    // Fixo (10 dígitos)
    if (numeros.length === 10) {
        return numeros.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }

    // Parcial (usuário digitando)
    if (numeros.length > 6) {
        return numeros.replace(/(\d{2})(\d{4})(\d*)/, "($1) $2-$3");
    }

    if (numeros.length > 2) {
        return numeros.replace(/(\d{2})(\d*)/, "($1) $2");
    }

    if (numeros.length > 0) {
        return `(${numeros}`;
    }

    return "";
}

// Idade e Data de Nascimento
function calcularIdade(data) {
    const hoje = new Date();
    const nascimento = new Date(data);

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    return idade;
}

const idadeInput = document.getElementById("idade");
const dataInput = document.getElementById("data-nascimento");

function validarIdade() {
    const data = dataInput.value;
    const idade = parseInt(idadeInput.value);

    if (!data || !idade) return;

    const idadeCorreta = calcularIdade(data);

    if (idadeCorreta !== idade) {
        marcarErro(idadeInput, "Idade errada. Ta mentindo pra mim?");
        idadeInput.value = "";
        localStorage.setItem("idade", "");
        setTimeout(() => idadeInput.focus(), 50);
    } else {
        limparErro(idadeInput);
    }

}

idadeInput.addEventListener("blur", validarIdade);
dataInput.addEventListener("blur", validarIdade);

//Endereço
function buscarCep() {
    let cep = document.getElementById('cep').value.replace(/\D/g, "");

    if (cep.length !== 8 || cep === ultimoCepBuscado) {
        return;
    }

    ultimoCepBuscado = cep;

    const url = `https://viacep.com.br/ws/${cep}/json/`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data.erro) {
                document.getElementById('logradouro').value = data.logradouro;
                document.getElementById('bairro').value = data.bairro;
                document.getElementById('cidade').value = data.localidade;
                document.getElementById('estado').value = data.uf;

                localStorage.setItem("cep", cep);
                localStorage.setItem("logradouro", document.getElementById('logradouro').value);
                localStorage.setItem("bairro", document.getElementById('bairro').value);
                localStorage.setItem("cidade", document.getElementById('cidade').value);
                localStorage.setItem("estado", document.getElementById('estado').value);

              
            } else {
                alert('CEP não encontrado.');
            }
        })
        .catch(error => {
            alert('Erro ao buscar o CEP.');
            console.error(error);
        });
}

const btnLupa = document.getElementById("btn-lupa");
btnLupa.addEventListener("click", buscarCep);

const cepInput = document.getElementById("cep");
cepInput.addEventListener("blur", buscarCep);
cepInput.addEventListener("input", buscarCep);

// Botão limpar
const btnLimpar = document.getElementById("btn-limpar");
btnLimpar.addEventListener("click", () => {
    localStorage.clear();
    campos.forEach(campo => {
    document.getElementById(campo).value = "";
    });
    camposEndereco.forEach(campo => {
    document.getElementById(campo).value = "";
    });
    limparErro(idadeInput);
});

// Erros nos campos
function marcarErro(campo, mensagem = "") {
    campo.classList.add("input-erro");

    const msg = campo.nextElementSibling;

    if (msg && msg.classList.contains("erro-msg")) {
        msg.textContent = mensagem;
        msg.style.display = "block";
    }
}


function limparErro(campo) {
    campo.classList.remove("input-erro");

    const msg = campo.nextElementSibling;

    if (msg && msg.classList.contains("erro-msg")) {
        msg.textContent = "";
        msg.style.display = "none";
    }
}

// Debounce
function debounce(func, delay = 500) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}