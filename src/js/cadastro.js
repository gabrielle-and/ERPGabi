// Script para cadastro de novos usuários usando IndexedDB
let db;
const request = indexedDB.open("MeuBanco", 1);

request.onupgradeneeded = function(event) {
  db = event.target.result;
  if (!db.objectStoreNames.contains("usuarios")) {
    db.createObjectStore("usuarios", { keyPath: "id", autoIncrement: true });
  }
};

request.onsuccess = function(event) {
  db = event.target.result;
  inicializarCadastro();
};

request.onerror = function(event) {
  console.error("Erro ao abrir o banco:", event.target.errorCode);
};

function adicionarUsuario(usuario) {
  const transaction = db.transaction(["usuarios"], "readwrite");
  const store = transaction.objectStore("usuarios");
  store.add(usuario);
}

function inicializarCadastro() {
  const form = document.querySelector('.form-cadastro');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const nome = document.getElementById('novo-usuario').value;
      const senha = document.getElementById('nova-senha').value;
      adicionarUsuario({ nome, senha });
      alert('Usuário cadastrado com sucesso!');
      form.reset();
    });
  }
}
