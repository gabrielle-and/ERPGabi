const imagens = document.querySelectorAll(".imagem");
const informacoes = document.querySelectorAll(".informacoes");
// Lógica de login e redirecionamento
document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector(".form-login");
    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            const usuario = document.getElementById("usuario").value;
            const senha = document.getElementById("senha").value;
            // Verifica usuário e senha no IndexedDB
            autenticarUsuario(usuario, senha);
        });
    }
});

function autenticarUsuario(usuario, senha) {
    const transaction = db.transaction(["usuarios"], "readonly");
    const store = transaction.objectStore("usuarios");
    const request = store.openCursor();
    let autenticado = false;
    request.onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
            if (cursor.value.nome === usuario && String(cursor.value.senha) === String(senha)) {
                autenticado = true;
                window.location.href = "telaInicial.html";
                return;
            }
            cursor.continue();
        } else {
            if (!autenticado) {
                alert("Usuário ou senha incorretos!");
            }
        }
    };
}

// Exemplo de uso do IndexedDB para salvar e listar usuários
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
    // Exemplo: adicionar um usuário ao banco
    adicionarUsuario({ nome: "Gabi", senha: 123 });
    adicionarUsuario({ nome: "Eric", senha: 123 });
    // Exemplo: listar todos os usuários
    listarUsuarios();
};

request.onerror = function(event) {
    console.error("Erro ao abrir o banco:", event.target.errorCode);
};

function adicionarUsuario(usuario) {
    const transaction = db.transaction(["usuarios"], "readwrite");
    const store = transaction.objectStore("usuarios");
    store.add(usuario);
}

function adicionarSenha(senha) {
    const transaction = db.transaction(["senha"], "readwrite");
    const store = transaction.objectStore("senha");
    store.add(senha);
}

function listarUsuarios() {
    const transaction = db.transaction(["usuarios"], "readonly");
    const store = transaction.objectStore("usuarios");
    const request = store.openCursor();
    request.onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
            console.log(cursor.value);
            cursor.continue();
        }
    };
}

function marcarBotaoSelecinado(botao) {
    botao.classList.add("selecionado");
}

function mostrarInformacoes(indice) {
    informacoes[indice].classList.add("ativa");
}

function esconderAsInformacoesAtivas() {
    const informacoesAtiva = document.querySelector(".informacoes.ativa");
    informacoesAtiva.classList.remove("ativa");
}

function mostrarImagemDeFundo(indice) {
    imagens[indice].classList.add("ativa");
}

function esconderImagemAtiva() {
    const imagemAtiva = document.querySelector(".ativa");
    imagemAtiva.classList.remove("ativa");
}

function desativarBotaoSelecionado() {
    const botaoSelecinado = document.querySelector(".selecionado");
    botaoSelecinado.classList.remove("selecionado");
}
