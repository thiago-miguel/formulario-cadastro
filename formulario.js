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

let ultimoCepBuscado = "";
cepInput.addEventListener("input", buscarCep());