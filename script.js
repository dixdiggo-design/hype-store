let carrinho = [];

function adicionarCarrinho(nome, preco) {
    const produtoExistente = carrinho.find(produto => produto.nome === nome);

    if (produtoExistente) {
        produtoExistente.quantidade++;
    } else {
        carrinho.push({
            nome: nome,
            preco: preco,
            quantidade: 1
        });
    }

    atualizarCarrinho();
}

function removerCarrinho(nome) {
    carrinho = carrinho.filter(produto => produto.nome !== nome);
    atualizarCarrinho();
}

function alterarQuantidade(nome, quantidade) {
    const produto = carrinho.find(produto => produto.nome === nome);

    if (!produto) return;

    produto.quantidade += quantidade;

    if (produto.quantidade <= 0) {
        removerCarrinho(nome);
    } else {
        atualizarCarrinho();
    }
}

function atualizarCarrinho() {
    const lista = document.getElementById("lista-carrinho");
    const total = document.getElementById("total-carrinho");
    const contador = document.getElementById("contador-carrinho");

    lista.innerHTML = "";

    let valorTotal = 0;
    let quantidadeTotal = 0;

    carrinho.forEach(produto => {
        const subtotal = produto.preco * produto.quantidade;

        valorTotal += subtotal;
        quantidadeTotal += produto.quantidade;

        lista.innerHTML += `
            <div class="item-carrinho">

                <div>
                    <h3>${produto.nome}</h3>
                    <p>R$ ${produto.preco.toFixed(2)}</p>
                </div>

                <div class="quantidade">
                    <button onclick="alterarQuantidade('${produto.nome}', -1)">−</button>

                    <span>${produto.quantidade}</span>

                    <button onclick="alterarQuantidade('${produto.nome}', 1)">+</button>
                </div>

                <strong>
                    R$ ${subtotal.toFixed(2)}
                </strong>

                <button
                    class="remover"
                    onclick="removerCarrinho('${produto.nome}')">
                    ✕
                </button>

            </div>
        `;
    });

    if (carrinho.length === 0) {
        lista.innerHTML = `
            <div class="carrinho-vazio">
                <h3>Seu carrinho está vazio</h3>
                <p>Adicione algum produto para continuar.</p>
            </div>
        `;
    }

    total.textContent = `R$ ${valorTotal.toFixed(2)}`;
    contador.textContent = quantidadeTotal;
}

function finalizarCompra() {

    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    let total = 0;

    carrinho.forEach(produto => {
        total += produto.preco * produto.quantidade;
    });

    document.getElementById("total-checkout").textContent =
        `R$ ${total.toFixed(2)}`;

    document.getElementById("checkout").classList.add("ativo");
}

function fecharCheckout() {
    document.getElementById("checkout").classList.remove("ativo");
}

async function confirmarPedido() {

    const nome = document.getElementById("nome").value.trim();
    const discord = document.getElementById("discord").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!nome || !discord || !email) {
        alert("Preencha todos os campos.");
        return;
    }

    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio.");
        return;
    }

    try {

        const resposta = await fetch("/api/pedidos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nome,
                discord: discord,
                email: email,
                itens: carrinho
            })
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            alert(resultado.mensagem || "Erro ao criar pedido.");
            return;
        }

        console.log("Pedido recebido pelo servidor:", resultado.pedido);

        localStorage.setItem(
    "ultimoPedido",
    resultado.pedido.id
);

window.location.href = "/pedido.html";

    } catch (erro) {

        console.error(erro);

        alert(
            "Não foi possível conectar ao servidor."
        );
    }
}

    alert("Vamos para a finalização da compra!");

function abrirCarrinho() {
    document.getElementById("carrinho").classList.add("ativo");
}

function fecharCarrinho() {
    document.getElementById("carrinho").classList.remove("ativo");
}

atualizarCarrinho();