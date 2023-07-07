/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
function getList() {
  let url = 'http://127.0.0.1:5000/produtos';
  console.log("get")
  console.log(url)
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.produtos.forEach(item => insertList(item.nome, item.quantidade, item.valor));
      data.produtos.forEach(item => pegaListaId(item.id));
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

let ids = [];
let id;

function pegaListaId(idn) {
  ids.push(idn);
}

function inicar() {
  let atulizar = document.createElement("span");
  atulizar.innerHTML = "atulizar";
  atulizar.classList.add("addBtn");
  atulizar.onclick = busca();
}

function att() {
  let buscar = document.getElementById("buscar");
  buscar.remove();
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/


if (window.location.href.indexOf("estoque.html") !== -1) {
  getList();
}
/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/

async function postItem(inputProduct, inputQuantity, inputPrice) {

  //Criação do objeto
  const formData = new FormData();
  formData.append('nome', inputProduct);
  formData.append('quantidade', inputQuantity);
  formData.append('valor', inputPrice);

  //post do objeto
  let url = 'http://127.0.0.1:5000/produto';
  console.log("post")
  console.log(url)
  fetch(url, {
    method: 'post',
    body: formData
  })
    //a resposta deve ser convertida em json
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/

//Função pra colocar o botão
function inserirBtnRemover(item) {
  let span = document.createElement("span");
  //u00D7 == x
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  //x está no span
  span.appendChild(txt);
  //span está no paramentro parent
  item.appendChild(span);
}

/*
  --------------------------------------------------------------------------------------
  Função para criar um botão editar para cada item da lista
  --------------------------------------------------------------------------------------
*/

//Função pra colocar o botão
function inserirBtnEditar(item) {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u270F");
  span.className = 'edit';
  span.appendChild(txt);
  item.appendChild(span);
}

/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
function Remover() {
  let close = document.getElementsByClassName("close"); // Seleciona todas as células da tabela com a classe close
  // var table = document.getElementById('myTable');
  for (let i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML;
      console.log(nomeItem);

      let linha = this.parentNode.parentElement; // Seleciona a linha que contém a célula clicada
      let idLinha = linha.id - 1;
      id = ids[idLinha];//Id do produto referente a linha

      if (confirm("Você tem certeza?")) {
        div.remove();
        deletarProdutoId(id);
        alert("Removido!");
      }
    };
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para editar um item da lista de acordo com o click no botão edit
  --------------------------------------------------------------------------------------
*/

// Adicionando evento de clique ao botão
function Editar() {
  let celulasBtnEditar = document.querySelectorAll(" .edit"); // Seleciona todas as células da tabela com a classe edit


  for (let i = 0; i < celulasBtnEditar.length; i++) {
    celulasBtnEditar[i].onclick = function () {

      // Esconde o botão de edição
      for (let i = 0; i < celulasBtnEditar.length; i++) {
        celulasBtnEditar[i].style.display = "none";
      }

      let linha = this.parentNode.parentElement; // Seleciona a linha que contém a célula clicada
      let idLinha = linha.id;

      let celulasDaLinhaGeral = document.getElementById(idLinha);
      let celulasDaLinha = celulasDaLinhaGeral.querySelectorAll(" .linhaEditavel"); // Seleciona todas as células de classe linhaEditavel

      idLinha++;

      // Transforma cada célula em um elemento de input
      for (let j = 0; j < celulasDaLinha.length; j++) {
        let input = document.createElement("input");
        input.type = "text";
        input.value = celulasDaLinha[j].innerHTML;
        celulasDaLinha[j].innerHTML = "";
        celulasDaLinha[j].appendChild(input);
      }

      // Adiciona um botão de salvar à linha
      let celulaEditar = this.parentNode;
      let salvar = document.createElement("span");
      salvar.innerHTML = "Salvar";
      salvar.classList.add("addBtn");
      celulaEditar.appendChild(salvar);
      /*
            let salvar = document.createElement("button");
            salvar.innerHTML = "Salvar";
            linha.appendChild(salvar);*/
      // Adiciona um evento de clique ao botão de salvar
      salvar.onclick = function () {
        // Obtém os valores dos inputs e salva os campos
        let inputs = linha.getElementsByTagName("input");
        for (let k = 0; k < inputs.length; k++) {
          let valor = inputs[k].value;
          // Salva o valor do campo aqui
        }

        idLinha--;

        // Remove o botão de salvar
        salvar.remove();

        // Mostra o botão de edição novamente
        for (let i = 0; i < celulasBtnEditar.length; i++) {
          celulasBtnEditar[i].style.display = "";
        }

        // Transforma os elementos de input de volta em text
        let tamanho = inputs.length;

        let nome = inputs[0].value;
        let quantidade = inputs[1].value;
        let preco = inputs[2].value;

        celulasDaLinha[0].innerHTML = nome;
        celulasDaLinha[1].innerHTML = quantidade;
        celulasDaLinha[2].innerHTML = preco

        /*
        for (let l = 0; l < tamanho; l++) {
          let valor = inputs[l].value;
          celulasDaLinha[l].innerHTML = valor;
        }
        */

        //Pega o id referente a coluna clicada
        idLinhaUpdate = idLinha - 1;
        let id = ids[idLinhaUpdate];

        console.log("produto");
        console.log(id);
        console.log(nome);
        console.log(quantidade);
        console.log(preco);
        console.log("============");
        //updateItem(nome, quantidade, preco);
        updateProduto(id, nome, quantidade, preco);

      };
    };
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
function deletarProduto(nomeItem) {
  console.log("Nome do item");
  console.log(nomeItem);
  let url = 'http://127.0.0.1:5000/produto?nome=' + nomeItem;
  console.log("delete")
  console.log(url)
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

function deletarProdutoId(IdItem) {
  console.log("ID do item");
  console.log(IdItem);
  let url = 'http://127.0.0.1:5000/produto?id=' + IdItem;
  console.log("delete")
  console.log(url)
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, quantidade e valor 
  --------------------------------------------------------------------------------------
*/
function newItem() {
  let nome = document.getElementById("getNome").value;
  let quantidade = document.getElementById("getQuantidade").value;
  let preco = document.getElementById("getValor").value;

  if (nome === '') {
    alert("Escreva o nome de um item!");
  } else if (isNaN(quantidade) || isNaN(preco)) {
    alert("Quantidade e valor precisam ser números!");
  } else {
    //Acrescenta o item na lista do site
    insertList(nome, quantidade, preco);
    //Envia um comando post pra api
    postItem(nome, quantidade, preco);
    estoque();//evita bug apos adicionar uma linha
    alert("Item adicionado!");
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
let rowId = 1;
function insertList(nameProduct, quantity, price) {
  //alert("insertList");
  var item = [nameProduct, quantity, price];
  var table = document.getElementById('myTable');
  var row = table.insertRow();
  row.id = `${rowId++}`; // atribui um id à linha e incrementa o contador


  // repita onde( inteiro "i" = 0 e menor que o numero de itens, some 1)
  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
    cel.classList.add('linhaEditavel'); // Adiciona a classe .linhaEditavel à célula
  }
  inserirBtnRemover(row.insertCell(-1));
  inserirBtnEditar(row.insertCell(-1));

  limparDados();
  Remover();
  Editar();
}

function insertUm(nameProduct, quantity, price) {
  //alert("insertList");
  // if () {
  //   limparDados();
  // }
  var item = [nameProduct, quantity, price];
  var table = document.getElementById('myTable');
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }
  var row = table.insertRow();
  row.id = `${rowId++}`; // atribui um id à linha e incrementa o contador


  // repita onde(inteiro "i" = 0 e menor que o numero de itens, some 1)
  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
}


function insertMais(nameProduct, quantity, price) {
  var item = [nameProduct, quantity, price];
  var table = document.getElementById('myTable');
  var row = table.insertRow();
  row.id = `${rowId++}`; // atribui um id à linha e incrementa o contador


  // repita onde( inteiro "i" = 0 e menor que o numero de itens, some 1)
  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
}

function limparDados() {
  document.getElementById("getNome").value = "";
  document.getElementById("getQuantidade").value = "";
  document.getElementById("getValor").value = "";
}

//Altera de pagina
function estoque() {
  console.log("click validade");
  window.location.href = 'estoque.html';
}

//Altera de pagina
function busca() {
  console.log("click sacola");
  window.location.href = 'busca.html';
}

function updateProduto(idProduto, nomeProduto, quantidadeProduto, precoProduto) {

  //Criação do objeto
  const formData = new FormData();
  formData.append('nome', nomeProduto);
  formData.append('quantidade', quantidadeProduto);
  formData.append('valor', precoProduto);

  //put do objeto
  let url = 'http://127.0.0.1:5000/produto?id=' + idProduto;
  console.log("put")
  console.log(url)
  fetch(url, {
    method: 'put',
    body: formData
  })
    //a resposta deve ser convertida em json
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

function buscarProduto() {
  document.getElementById("att2").style.display = 'block';
  let inputID = document.querySelectorAll("#getId");
  let inputNome = document.querySelectorAll("#getNome");
  let inputQuantidade = document.querySelectorAll("#getQuantidade");
  let inputValor = document.querySelectorAll("#getValor");
  let Produto

  att();
  for (let k = 0; k < inputID.length; k++) {
    Produto = inputID[k].value;           // Salva o valor do campo aqui         }
    if (Produto != "") {
      console.log("id");
      buscaGet("id", Produto);
    } else {
      Produto = inputNome[k].value;
      if (Produto != "") {
        console.log("nome");
        buscaGetmais("nome", Produto);
      } else {
        Produto = inputQuantidade[k].value;
        if (Produto != "") {
          console.log("quantidade");
          buscaGetmais("quantidade", Produto);
        } else {
          Produto = inputValor[k].value;
          if (Produto != "") {
            console.log("valor");
            buscaGetmais("valor", Produto);

          }
        }
      }
    }
  }
}

function buscaGet(ParametroUrl, paramentroProduto) {

  let url = 'http://127.0.0.1:5000/produto' + ParametroUrl + '?' + ParametroUrl + '=' + paramentroProduto;

  //get do objeto
  console.log("get")
  console.log(url)
  fetch(url, {
    method: 'get'
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.id != null) {
        insertUm(data.nome, data.quantidade, data.valor);
      } else {
        alert("Produto não encontrado");
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function buscaGetmais(ParametroUrl, paramentroProduto) {

  let url = 'http://127.0.0.1:5000/produtos' + ParametroUrl + '?' + ParametroUrl + '=' + paramentroProduto;

  //get do objeto
  console.log("get")
  console.log(url)
  fetch(url, {
    method: 'get'
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.produtos);
      if (data.produtos != 0) {
        data.produtos.forEach(item => insertMais(item.nome, item.quantidade, item.valor));
      } else {
        alert("Prodduto não encontrado");
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}