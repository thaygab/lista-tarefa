function adicionarTarefa() {
  const input = document.getElementById("tarefaInput");
  const texto = input.value.trim();

  if (texto === "") return;

  criarTarefa(texto);
  salvarTarefas();
  input.value = "";
}

function criarTarefa(texto, concluida = false) {
  const lista = document.getElementById("lista");

  const li = document.createElement("li");

  const span = document.createElement("span");
  span.textContent = texto;
  span.onclick = function () {
    span.classList.toggle("concluida");
    salvarTarefas();
  };

  if (concluida) {
    span.classList.add("concluida");
  }

  const botao = document.createElement("button");
  botao.textContent = "X";
  botao.onclick = function () {
    li.remove();
    salvarTarefas();
  };

  li.appendChild(span);
  li.appendChild(botao);
  lista.appendChild(li);
}

function salvarTarefas() {
  const itens = document.querySelectorAll("#lista li");
  const tarefas = [];

  itens.forEach((item) => {
    const texto = item.querySelector("span").textContent;
    const concluida = item.querySelector("span").classList.contains("concluida");

    tarefas.push({
      texto: texto,
      concluida: concluida
    });
  });

  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function carregarTarefas() {
  const tarefasSalvas = JSON.parse(localStorage.getItem("tarefas")) || [];

  tarefasSalvas.forEach((tarefa) => {
    criarTarefa(tarefa.texto, tarefa.concluida);
  });
}

carregarTarefas();