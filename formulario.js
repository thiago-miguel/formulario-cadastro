let ultimoCepBuscado = "";

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

document.addEventListener("DOMContentLoaded", () => {
    const cepSalvo = localStorage.getItem("cep");

    if (cepSalvo != null) {
        document.getElementById("cep").value = cepSalvo;
        document.getElementById("logradouro").value = localStorage.getItem("logradouro");
        document.getElementById("bairro").value = localStorage.getItem("bairro");
        document.getElementById("cidade").value = localStorage.getItem("cidade");
        document.getElementById("estado").value = localStorage.getItem("estado");
    }
});