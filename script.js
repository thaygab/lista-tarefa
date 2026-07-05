// ==========================================
// CONFIGURAÇÕES
//
// Constantes utilizadas em toda
// a aplicação.
// ==========================================

/* Storage Key = Chave utilizada
   para salvar as tarefas no Local Storage. */

const STORAGE_KEY = "tarefas";


// ==========================================
// ELEMENTOS DO HTML
//
// Referências aos elementos da interface
// utilizados durante a execução da aplicação.
// ==========================================

// Formulário
/* getElementById() = Procura um elemento
   da página utilizando o valor do atributo id. */

const taskForm = document.getElementById("taskForm");

// Campos do formulário
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const dateInput = document.getElementById("dateInput");

// Lista de tarefas
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

// Botões
const clearCompleted = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".filter-button");

// Dashboard
const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const highPriorityTasks = document.getElementById("highPriorityTasks");
const doneCount = document.getElementById("doneCount");
const progressLabel = document.getElementById("progressLabel");
const progressBar = document.getElementById("progressBar");


// ==========================================
// VARIÁVEIS DA APLICAÇÃO
//
// Armazenam os dados utilizados
// durante a execução da aplicação.
// ==========================================

// Lista com todas as tarefas
/* Load Tasks = Carrega as tarefas
   salvas no navegador. */
let tasks = loadTasks();

/* Current Filter = Filtro atualmente
   selecionado pelo usuário. */
let currentFilter = "todas";


// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

/**
 * Gera um identificador único para cada tarefa.
 *
 * Utiliza a API Crypto quando disponível.
 * Caso contrário, cria um ID baseado
 * na data e em um número aleatório.
 */
function createId() {

  /* Random UUID = Identificador Único Universal

   Verifica se o navegador suporta
   a geração automática de IDs únicos.
*/
  if (window.crypto && crypto.randomUUID) {
    /* Date.now() = Retorna a data e hora atual
   em milissegundos.

   Math.random() = Gera um número aleatório.

   Os dois valores são combinados para criar
   um identificador único.
*/
    return crypto.randomUUID();
  }

  return String(Date.now() + Math.random());

}

/**
 * Padroniza os dados de uma tarefa.
 *
 * Garante que todas as propriedades
 * existam antes da aplicação utilizar
 * o objeto.
 */
function normalizeTask(task) {

/* Return = Retorna um novo objeto
   contendo todas as propriedades
   padronizadas da tarefa. */
  return {

    id: task.id || createId(),

/* || (OU Lógico)

   Utiliza o primeiro valor válido
   encontrado.

   Exemplo:
   task.text
      ↓
   task.texto
      ↓
   "Tarefa sem título"
*/
    text: task.text || task.texto || "Tarefa sem título",

/* Boolean() = Converte um valor
   para verdadeiro (true)
   ou falso (false).

   ?? (Nullish Coalescing)

   Utiliza o valor da direita apenas
   se o valor da esquerda for
   null ou undefined.
*/
    completed: Boolean(task.completed ?? task.concluida),

    priority: task.priority || "media",

    dueDate: task.dueDate || "",

    /* toISOString() = Converte a data
   atual para o formato padrão ISO.

   Exemplo:
   2026-07-04T18:30:15.000Z
*/
    createdAt: task.createdAt || new Date().toISOString()

  };

}

/**
 * Formata uma data para o padrão brasileiro.
 *
 * Exemplo:
 * 2026-07-04 → 04/07/2026
 *
 * Caso nenhuma data seja informada,
 * retorna "Sem prazo".
 */
function formatDate(value) {

  /* If = Se

   Verifica se uma data foi informada.
   Caso contrário, retorna "Sem prazo".
*/
  if (!value) {
    return "Sem prazo";
  }

  /* Split() = Divide um texto em partes.

   O caractere "-" é utilizado como
   separador.

   Exemplo:

   "2026-07-04"

          ↓

   ["2026", "07", "04"]
*/
  const parts = value.split("-");

  /* Template Literal = Permite criar
   textos utilizando variáveis.

   Neste caso reorganizamos a data
   para o formato brasileiro.
*/
  return `${parts[2]}/${parts[1]}/${parts[0]}`;

}


// ==========================================
// LOCAL STORAGE
// ==========================================

/**
 * Carrega as tarefas salvas no navegador.
 *
 * Recupera os dados armazenados no
 * Local Storage e os converte para
 * objetos JavaScript.
 *
 * Caso ocorra algum erro durante
 * a leitura, retorna uma lista vazia.
 */
function loadTasks() {

/* Try = Tenta executar um bloco de código.

   Caso aconteça algum erro,
   a execução será direcionada
   para o bloco catch().
*/
  try {

    /* Local Storage = Armazenamento
   permanente do navegador.

   getItem() = Recupera um valor
   utilizando sua chave.

   JSON.parse() = Converte um texto
   armazenado em um objeto JavaScript.
*/
    const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

/* Map() = Percorre todos os itens
   do array criando um novo array.

   Neste caso, cada tarefa passa
   pela função normalizeTask().
*/
    return savedTasks.map(normalizeTask);

  } catch (error) {

/* Catch = Captura qualquer erro
   ocorrido dentro do bloco try.

   A variável "error" contém
   informações sobre o problema.
*/
    console.error("Erro ao carregar as tarefas:", error);

 /* Retorna uma lista vazia caso
   não seja possível recuperar
   as tarefas salvas.
*/
    return [];

  }

}

/**
 * Salva as tarefas no navegador.
 *
 * Converte a lista de tarefas em texto
 * e armazena no Local Storage.
 */
function saveTasks() {

  /* Local Storage = Armazenamento
   permanente do navegador.

   setItem() = Salva um valor
   utilizando uma chave.
*/
  localStorage.setItem(
    STORAGE_KEY,

    /* JSON.stringify() = Converte um
   objeto JavaScript em texto.

   O Local Storage armazena apenas
   textos, por isso essa conversão
   é necessária.
*/
    JSON.stringify(tasks)
  );

}


// ==========================================
// FILTROS
// ==========================================

/**
 * Retorna as tarefas conforme o
 * filtro atualmente selecionado.
 *
 * Dependendo do filtro escolhido,
 * exibe todas, apenas as pendentes
 * ou apenas as concluídas.
 */
function filteredTasks() {

/* Switch = Estrutura de decisão.

   Executa um bloco de código
   diferente para cada valor
   da variável currentFilter.
*/
  switch (currentFilter) {

    case "pendentes":

    /* Filter() = Filtra os elementos
   de um array.

   Retorna apenas as tarefas
   que ainda não foram concluídas.
*/
      return tasks.filter((task) => !task.completed);

    case "concluidas":

    /* Filter() = Filtra os elementos
   de um array.

   Retorna apenas as tarefas
   concluídas.
*/
      return tasks.filter((task) => task.completed);

      /* Default = Caso nenhum dos
   filtros anteriores seja atendido.

   Retorna todas as tarefas.
*/
    default:
      return tasks;

  }

}


// ==========================================
// RENDERIZAÇÃO
// ==========================================

/**
 * Atualiza a lista de tarefas exibida
 * na tela.
 *
 * Cria todos os elementos HTML das
 * tarefas dinamicamente conforme
 * os dados armazenados na aplicação.
 */
function renderTasks() {

  /* InnerHTML = Conteúdo HTML interno.

     Limpa toda a lista antes de
     renderizar novamente as tarefas.
  */
  taskList.innerHTML = "";

  /* Obtém apenas as tarefas que
     devem ser exibidas conforme
     o filtro selecionado. */
  const visibleTasks = filteredTasks();

  /* ForEach() = Percorre todos os
     elementos de um array.

     Para cada tarefa encontrada,
     cria um novo card na tela.
  */
  visibleTasks.forEach((task) => {

      /* CreateElement() = Cria um novo
       elemento HTML dinamicamente. */
    const item = document.createElement("li");

    /* ClassName = Define a classe CSS
       do elemento criado.

       Se a tarefa estiver concluída,
       adiciona também a classe "done".
    */
    item.className =
      "task-item " + (task.completed ? "done" : "");

         /* Cria um novo elemento HTML */
    const checkButton = document.createElement("button");

    /* Type = Define o tipo do botão.

       "button" evita que ele envie
       o formulário ao ser clicado.
    */
    checkButton.type = "button";

    /* ClassName = Define a classe CSS
       utilizada para estilizar o botão.
    */
    checkButton.className = "check-button";

    /* SetAttribute() = Adiciona um atributo
       ao elemento HTML.

       Aria-label melhora a acessibilidade,
       permitindo que leitores de tela
       descrevam a ação do botão.
    */
    checkButton.setAttribute(

      "aria-label",

      /* Operador Ternário (? :)

         Funciona como um IF simplificado.

         Se a tarefa estiver concluída,
         exibe "Marcar como pendente".

         Caso contrário,
         exibe "Marcar como concluída".
      */
      task.completed
        ? "Marcar como pendente"
        : "Marcar como concluída"

    );

    /* AddEventListener() = Escuta um evento.

       Quando o botão for clicado,
       executa a função toggleTask().
    */
    checkButton.addEventListener(
      "click",
      () => toggleTask(task.id)
    );

      /* Cria um novo elemento HTML */
    const content = document.createElement("div");

    /* ClassName = Define a classe CSS
       utilizada para estilizar o conteúdo
       da tarefa.
    */
    content.className = "task-content";

    /* CreateElement() = Cria o elemento
       que exibirá o título da tarefa.
    */
    const title = document.createElement("span");

    /* ClassName = Define a classe CSS
       do título da tarefa.
    */
    title.className = "task-title";

    /* TextContent = Define o texto
       exibido dentro do elemento.
    */
    title.textContent = task.text;

        /* CreateElement() = Cria um container
       para as informações da tarefa,
       como prioridade e prazo.
    */
    const meta = document.createElement("div");

    /* ClassName = Define a classe CSS
       das informações da tarefa.
    */
    meta.className = "task-meta";

    /* CreateElement() = Cria o indicador
       de prioridade da tarefa.
    */
    const priority = document.createElement("span");

    /* ClassName = Define a classe CSS.

       A prioridade (alta, média ou baixa)
       também é adicionada dinamicamente.
    */
    priority.className =
      "badge " + task.priority;

    /* TextContent = Exibe o nível
       de prioridade da tarefa.
    */
    priority.textContent = task.priority;

        /* CreateElement() = Cria o elemento
       responsável por exibir o prazo.
    */
    const date = document.createElement("span");

    /* FormatDate() = Formata a data
       para o padrão brasileiro antes
       de exibi-la na tela.
    */
    date.textContent =
      formatDate(task.dueDate);

          /* CreateElement() = Cria o container
       responsável pelos botões de ação.
    */
    const actions = document.createElement("div");

    /* ClassName = Define a classe CSS
       do container dos botões.
    */
    actions.className = "task-actions";

    /* CreateElement() = Cria o botão
       utilizado para editar a tarefa.
    */
    const editButton = document.createElement("button");

    /* Type = Define o tipo do botão. */
    editButton.type = "button";

    /* ClassName = Classe utilizada
       para estilização. */
    editButton.className = "icon-button";

    /* TextContent = Texto exibido
       dentro do botão. */
    editButton.textContent = "Editar";

    /* AddEventListener() = Executa a função
       editTask() quando o botão é clicado.
    */
    editButton.addEventListener(
      "click",
      () => editTask(task.id)
    );

        /* CreateElement() = Cria o botão
       utilizado para excluir a tarefa.
    */
    const deleteButton = document.createElement("button");

    /* Type = Define o tipo do botão. */
    deleteButton.type = "button";

    /* ClassName = Classe utilizada
       para estilização. */
    deleteButton.className = "icon-button";

    /* TextContent = Texto exibido
       dentro do botão. */
    deleteButton.textContent = "Excluir";

    /* AddEventListener() = Executa a função
       deleteTask() quando o botão é clicado.
    */
    deleteButton.addEventListener(
      "click",
      () => deleteTask(task.id)
    );

        /* Append() = Adiciona um ou mais
       elementos dentro de outro elemento.

       Aqui montamos toda a estrutura
       da tarefa antes de adicioná-la
       à lista principal.
    */
    meta.append(priority, date);

    content.append(title, meta);

    actions.append(editButton, deleteButton);

    item.append(checkButton, content, actions);

    /* AppendChild() = Adiciona o card
       completo à lista de tarefas.
    */
    taskList.appendChild(item);

  });

  /* ClassList = Permite manipular
     as classes CSS de um elemento.

     Toggle() adiciona ou remove
     a classe "visible" conforme
     a condição informada.
  */
  emptyState.classList.toggle(
    "visible",
    visibleTasks.length === 0
  );

  /* Atualiza os indicadores do
     painel após renderizar a lista.
  */
  updateDashboard();

}

// ==========================================
// DASHBOARD
// ==========================================

/**
 * Atualiza os indicadores do painel.
 *
 * Calcula as estatísticas das tarefas
 * e atualiza as informações exibidas
 * no dashboard.
 */
function updateDashboard() {

  /* Length = Retorna a quantidade
     de elementos existentes
     em um array.
  */
  const total = tasks.length;

  /* Filter() = Filtra apenas as
     tarefas concluídas.

     Length retorna a quantidade
     de tarefas encontradas.
  */
  const done =
    tasks.filter((task) => task.completed).length;

  /* Calcula a quantidade de
     tarefas pendentes.
  */
  const pending = total - done;

    /* Filter() = Filtra apenas as
     tarefas de alta prioridade
     que ainda não foram concluídas.
  */
  const highPriority =
    tasks.filter(
      (task) =>
        task.priority === "alta" &&
        !task.completed
    ).length;

  /* Operador Ternário (? :)

     Evita uma divisão por zero.

     Caso exista pelo menos uma tarefa,
     calcula a porcentagem concluída.

     Math.round() = Arredonda um número
     para o inteiro mais próximo.
  */
  const percent =
    total
      ? Math.round((done / total) * 100)
      : 0;

        /* Atualiza os valores exibidos
     nos cartões do dashboard.
  */
  totalTasks.textContent = total;

  pendingTasks.textContent = pending;

  highPriorityTasks.textContent = highPriority;

  doneCount.textContent =
    `${done}/${total}`;

  progressLabel.textContent =
    `${percent}% concluído`;

  /* Style = Permite alterar
     estilos CSS utilizando JavaScript.

     Width controla a largura da
     barra de progresso.
  */
  progressBar.style.width =
    `${percent}%`;

}

// ==========================================
// AÇÕES DAS TAREFAS
// ==========================================

/**
 * Adiciona uma nova tarefa.
 *
 * Recupera os dados informados
 * no formulário, cria uma nova
 * tarefa e atualiza a aplicação.
 */
function addTask(event) {

  /* PreventDefault() = Impede o
     comportamento padrão do formulário.

     Evita que a página seja recarregada
     ao clicar no botão "Adicionar".
  */
  event.preventDefault();

  /* Trim() = Remove espaços em branco
     no início e no final do texto.
  */
  const text = taskInput.value.trim();

  /* Verifica se o campo está vazio.
     Caso esteja, encerra a função.
  */
  if (!text) {
    return;
  }
  /* Unshift() = Adiciona um novo
     elemento no início do array.

     Assim, a tarefa mais recente
     aparece primeiro na lista.
  */
  tasks.unshift(

    /* NormalizeTask() = Padroniza
       a estrutura da nova tarefa
       antes de adicioná-la.
    */
    normalizeTask({

      text: text,

      priority: priorityInput.value,

      dueDate: dateInput.value,

      completed: false

    })

  );

    /* Reset() = Limpa todos os campos
     do formulário após adicionar
     a tarefa.
  */
  taskForm.reset();

  /* Define novamente a prioridade
     padrão como "média". */
  priorityInput.value = "media";

  /* Salva a lista atualizada
     no Local Storage.
  */
  saveTasks();

  /* Atualiza a interface para
     exibir a nova tarefa.
  */
  renderTasks();

}

/**
 * Alterna o status de uma tarefa.
 *
 * Se a tarefa estiver pendente,
 * ela será marcada como concluída.
 *
 * Se já estiver concluída,
 * voltará para pendente.
 */
function toggleTask(id) {

  /* Map() = Percorre todos os
     elementos do array criando
     um novo array.
  */
  tasks = tasks.map((task) =>

        /* Operador Ternário (? :)

       Verifica se a tarefa atual
       possui o mesmo ID recebido.
    */
    task.id === id

      /* Spread Operator (...) = Copia
         todas as propriedades do objeto.

         Em seguida alteramos apenas
         a propriedade "completed".
      */
      ? {
          ...task,

          completed: !task.completed
        }

      /* Caso o ID seja diferente,
         mantém a tarefa sem alterações.
      */
      : task

        );

  /* Salva a lista atualizada
     no Local Storage.
  */
  saveTasks();

  /* Atualiza a interface.
  */
  renderTasks();

}

/**
 * Edita o texto de uma tarefa.
 *
 * Localiza a tarefa pelo ID,
 * solicita um novo texto ao usuário
 * e atualiza a tarefa.
 */
function editTask(id) {

  /* Find() = Procura o primeiro
     elemento do array que atende
     à condição informada.
  */
  const task =
    tasks.find((item) => item.id === id);

  /* Caso a tarefa não seja encontrada,
     encerra a função.
  */
  if (!task) {
    return;
  }

    /* Prompt() = Exibe uma caixa de diálogo
     permitindo que o usuário informe
     um novo texto para a tarefa.
  */
  const nextText = prompt(
    "Editar tarefa",
    task.text
  );

  /* Verifica se o usuário cancelou
     a edição ou informou um texto vazio.
  */
  if (
    nextText === null ||
    nextText.trim() === ""
  ) {
    return;
  }

  /* Trim() = Remove espaços em branco
     do início e do final do texto.
  */
  task.text = nextText.trim();

  /* Salva as alterações
     no Local Storage.
  */
  saveTasks();

  /* Atualiza a interface
     com o novo texto.
  */
  renderTasks();

}

/**
 * Remove uma tarefa.
 *
 * Exclui a tarefa correspondente
 * ao ID informado.
 */
function deleteTask(id) {

  /* Filter() = Cria um novo array
     contendo apenas os elementos
     que atendem à condição.

     Neste caso, mantém todas as
     tarefas cujo ID seja diferente
     do ID recebido.
  */
  tasks = tasks.filter(
    (task) => task.id !== id
  );

  /* Salva a lista atualizada
     no Local Storage.
  */
  saveTasks();

  /* Atualiza a interface após
     remover a tarefa.
  */
  renderTasks();

}

// ==========================================
// EVENTOS
//
// Capturam as ações realizadas pelo
// usuário e executam as funções
// correspondentes.
// ==========================================
/* AddEventListener() = Escuta um evento
   disparado por um elemento HTML.

   Neste caso, quando o formulário
   for enviado, executa a função
   addTask().
*/
taskForm.addEventListener(
  "submit",
  addTask
);

/* Escuta o clique no botão
   "Limpar concluídas".
*/
clearCompleted.addEventListener(
  "click",
  () => {

    /* Remove todas as tarefas
       que já foram concluídas.
    */
    tasks = tasks.filter(
      (task) => !task.completed
    );

    /* Salva as alterações. */
    saveTasks();

    /* Atualiza a interface. */
    renderTasks();

  }
);

/* ForEach() = Percorre todos os
   botões de filtro existentes.
*/
filterButtons.forEach((button) => {

  /* Escuta o clique em cada botão
     de filtro.
  */
  button.addEventListener(
    "click",
    () => {

      /* Dataset = Permite acessar
         atributos data-* do HTML.

         Neste caso recupera o valor
         do atributo data-filter.
      */
      currentFilter =
        button.dataset.filter;

      /* Atualiza a aparência dos
         botões de filtro.

         Apenas o botão clicado
         permanece ativo.
      */
      filterButtons.forEach((item) => {

        /* ClassList = Permite manipular
           as classes CSS.

           Toggle() adiciona ou remove
           a classe "active".
        */
        item.classList.toggle(
          "active",
          item === button
        );

      });

      /* Atualiza a lista conforme
         o filtro selecionado.
      */
      renderTasks();

    }
  );

});

// ==========================================
// INICIALIZAÇÃO
//
// Inicia a aplicação carregando as
// tarefas salvas e exibindo a
// interface atualizada.
// ==========================================

/* Inicia a aplicação.

   Renderiza todas as tarefas
   salvas no Local Storage e
   atualiza o dashboard.
*/
renderTasks();