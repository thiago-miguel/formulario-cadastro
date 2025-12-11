let ultimoCepBuscado = "";

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

campos.forEach(id => {
  const input = document.getElementById(id);
  input.addEventListener("input", () => {
    localStorage.setItem(id, input.value);
  });
});

const telInput = document.getElementById("telefone");
telInput.addEventListener("blur", () => {
    const apenasNumeros = telInput.value.replace(/\D/g, "");

    if (apenasNumeros.length !== 10 && apenasNumeros.length !== 11) {
        alert("Número de telefone inválido. Deve conter 10 ou 11 dígitos.");
        telInput.value = "";
        localStorage.removeItem("telefone");
        return;
    }

    telInput.value = apenasNumeros;
    localStorage.setItem("telefone", telInput.value);
});

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
        alert(`A idade não confere. Fala a verdade!`);
        idadeInput.value = "";
        localStorage.setItem("idade", "");
        setTimeout(() => {
            idadeInput.focus();
            idadeInput.select();
        }, 10);
    }
}

idadeInput.addEventListener("blur", validarIdade);
dataInput.addEventListener("blur", validarIdade);

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

const btnLimpar = document.getElementById("btn-limpar");
btnLimpar.addEventListener("click", () => {
    localStorage.clear();
    campos.forEach(campo => {
    document.getElementById(campo).value = "";
    });
    camposEndereco.forEach(campo => {
    document.getElementById(campo).value = "";
    });
});