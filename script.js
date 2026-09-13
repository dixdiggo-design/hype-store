// ==========================================
// HYPE STORE - SCRIPT DO SITE
// ==========================================

let carrinho = [];


// ==========================================
// CARRINHO
// ==========================================

function adicionarCarrinho(nome, preco, opcao = "") {

    const produto = {
        nome: nome,
        preco: Number(preco),
        opcao: opcao
    };

    carrinho.push(produto);

    atualizarCarrinho();

    abrirCarrinho();
}


// ==========================================
// ATUALIZAR CARRINHO
// ==========================================

function atualizarCarrinho() {

    const lista = document.getElementById("lista-carrinho");
    const contador = document.getElementById("contador-carrinho");
    const total = document.getElementById("total-carrinho");
    const totalCheckout = document.getElementById("total-checkout");

    if (contador) {
        contador.textContent = carrinho.length;
    }

    if (!lista) {
        return;
    }

    lista.innerHTML = "";

    if (carrinho.length === 0) {

        lista.innerHTML = `
            <p style="text-align:center;">
                Seu carrinho está vazio.
            </p>
        `;

    } else {

        carrinho.forEach((produto, index) => {

            const item = document.createElement("div");

            item.className = "item-carrinho";

            item.innerHTML = `
                <div>
                    <strong>${produto.nome}</strong>
                    ${
                        produto.opcao
                            ? `<small>${produto.opcao}</small>`
                            : ""
                    }
                </div>

                <div>
                    <span>
                        R$ ${produto.preco.toFixed(2).replace(".", ",")}
                    </span>

                    <button
                        type="button"
                        onclick="removerProduto(${index})">
                        ❌
                    </button>
                </div>
            `;

            lista.appendChild(item);
        });
    }

    const valorTotal = carrinho.reduce(
        (soma, produto) => soma + Number(produto.preco),
        0
    );

    if (total) {
        total.textContent =
            `R$ ${valorTotal.toFixed(2).replace(".", ",")}`;
    }

    if (totalCheckout) {
        totalCheckout.textContent =
            `R$ ${valorTotal.toFixed(2).replace(".", ",")}`;
    }
}


// ==========================================
// REMOVER PRODUTO
// ==========================================

function removerProduto(index) {

    carrinho.splice(index, 1);

    atualizarCarrinho();
}


// ==========================================
// ABRIR CARRINHO
// ==========================================

function abrirCarrinho() {

    const modal =
        document.getElementById("modal-carrinho");

    if (!modal) {
        return;
    }

    modal.classList.add("ativo");

    atualizarCarrinho();
}


// ==========================================
// FECHAR CARRINHO
// ==========================================

function fecharCarrinho() {

    const modal =
        document.getElementById("modal-carrinho");

    if (modal) {
        modal.classList.remove("ativo");
    }
}


// ==========================================
// ABRIR CHECKOUT
// ==========================================

function abrirCheckout() {

    if (carrinho.length === 0) {

        alert("Seu carrinho está vazio.");

        return;
    }

    fecharCarrinho();

    const modal =
        document.getElementById("modal-checkout");

    if (modal) {
        modal.classList.add("ativo");
    }

    atualizarTotalCheckout();
}


// ==========================================
// FECHAR CHECKOUT
// ==========================================

function fecharCheckout() {

    const modal =
        document.getElementById("modal-checkout");

    if (modal) {
        modal.classList.remove("ativo");
    }
}


// ==========================================
// TOTAL DO CHECKOUT
// ==========================================

function atualizarTotalCheckout() {

    const totalCheckout =
        document.getElementById("total-checkout");

    if (!totalCheckout) {
        return;
    }

    const total = carrinho.reduce(
        (soma, produto) =>
            soma + Number(produto.preco),
        0
    );

    totalCheckout.textContent =
        `R$ ${total.toFixed(2).replace(".", ",")}`;
}


// ==========================================
// GERAR PAGAMENTO PIX
// ==========================================

async function gerarPagamentoPix() {

    if (carrinho.length === 0) {

        alert("Seu carrinho está vazio.");

        return;
    }

    const nome =
        document.getElementById("nome")?.value.trim();

    const discord =
        document.getElementById("discord")?.value.trim();

    const email =
        document.getElementById("email")?.value.trim();

    if (!nome) {

        alert("Digite seu nome.");

        return;
    }

    if (!discord) {

        alert("Digite seu Discord.");

        return;
    }

    if (!email) {

        alert("Digite seu e-mail.");

        return;
    }

    const valor = carrinho.reduce(
        (soma, produto) =>
            soma + Number(produto.preco),
        0
    );

    const modalPix =
        document.getElementById("modal-pix");

    const loading =
        document.querySelector(".carregando");

    const qrCode =
        document.getElementById("qr-code");

    const copiaCola =
        document.getElementById("pix-copia-cola");

    const statusPix =
        document.getElementById("status-pix");

    const pedidoId =
        document.getElementById("pedido-id");

    const mensagem =
        document.getElementById("mensagem-pagamento");

    const botao =
        document.getElementById("btn-pagar-pix");

    if (botao) {
        botao.disabled = true;
        botao.textContent = "GERANDO PIX...";
    }

    if (modalPix) {
        modalPix.classList.add("ativo");
    }

    if (loading) {
        loading.style.display = "block";
    }

    if (qrCode) {
        qrCode.style.display = "none";
        qrCode.src = "";
    }

    if (copiaCola) {
        copiaCola.value = "";
    }

    if (statusPix) {
        statusPix.textContent =
            "Gerando pagamento PIX...";
    }

    try {

        const resposta = await fetch(
            "/api/pagamento/pix",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    nome: nome,
                    discord: discord,
                    email: email,
                    itens: carrinho,
                    valor: valor
                })
            }
        );

        const dados =
            await resposta.json();

        console.log(
            "RESPOSTA DO SERVIDOR:",
            dados
        );

        if (!resposta.ok || !dados.sucesso) {

            throw new Error(
                dados.erro ||
                "Não foi possível gerar o PIX."
            );
        }

        if (pedidoId) {
            pedidoId.textContent =
                dados.pedidoId || "";
        }

        // QR CODE TURBOFYPAY
        if (dados.qrCode && qrCode) {

            qrCode.src =
                dados.qrCode.startsWith("data:")
                    ? dados.qrCode
                    : `data:image/png;base64,${dados.qrCode}`;

            qrCode.style.display = "block";
        }

        // PIX COPIA E COLA
        if (copiaCola) {

            copiaCola.value =
                dados.copyPaste || "";
        }

        if (loading) {
            loading.style.display = "none";
        }

        if (statusPix) {

            statusPix.textContent =
                "Aguardando pagamento...";
        }

        if (mensagem) {

            mensagem.textContent =
                "Escaneie o QR Code ou copie o PIX copia e cola.";
        }

        // COMEÇA A VERIFICAR O PAGAMENTO
        if (dados.chargeId) {

            verificarPagamento(
                dados.chargeId
            );
        }

    } catch (erro) {

        console.error(
            "ERRO AO GERAR PIX:",
            erro
        );

        if (loading) {
            loading.style.display = "none";
        }

        if (statusPix) {

            statusPix.textContent =
                "Erro ao gerar pagamento.";
        }

        alert(
            erro.message ||
            "Erro ao gerar pagamento."
        );

    } finally {

        if (botao) {

            botao.disabled = false;

            botao.textContent =
                "PAGAR COM PIX";
        }
    }
}


// ==========================================
// VERIFICAR PAGAMENTO
// ==========================================

async function verificarPagamento(chargeId) {

    let tentativas = 0;

    const limite =
        120;

    const intervalo =
        5000;

    async function verificar() {

        tentativas++;

        try {

            const resposta =
                await fetch(
                    `/api/pagamento/status/${chargeId}`
                );

            const dados =
                await resposta.json();

            console.log(
                "STATUS DO PAGAMENTO:",
                dados
            );

            const statusPix =
                document.getElementById(
                    "status-pix"
                );

            if (
                dados.status === "PAID" ||
                dados.status === "PAGO"
            ) {

                if (statusPix) {

                    statusPix.textContent =
                        "✅ Pagamento confirmado!";
                }

                const mensagem =
                    document.getElementById(
                        "mensagem-pagamento"
                    );

                if (mensagem) {

                    mensagem.textContent =
                        "Pagamento confirmado! Seu produto foi processado.";
                }

                return;
            }

            if (
                tentativas >= limite
            ) {

                if (statusPix) {

                    statusPix.textContent =
                        "⏱️ Tempo de verificação encerrado. Consulte seu pedido.";
                }

                return;
            }

        } catch (erro) {

            console.error(
                "ERRO AO VERIFICAR PAGAMENTO:",
                erro
            );
        }

        setTimeout(
            verificar,
            intervalo
        );
    }

    verificar();
}


// ==========================================
// FECHAR PIX
// ==========================================

function fecharPix() {

    const modal =
        document.getElementById("modal-pix");

    if (modal) {
        modal.classList.remove("ativo");
    }
}


// ==========================================
// COPIAR PIX
// ==========================================

async function copiarPix() {

    const campo =
        document.getElementById(
            "pix-copia-cola"
        );

    if (!campo || !campo.value) {

        alert(
            "O PIX copia e cola ainda não foi gerado."
        );

        return;
    }

    try {

        await navigator.clipboard.writeText(
            campo.value
        );

        alert(
            "PIX copia e cola copiado!"
        );

    } catch (erro) {

        campo.select();

        document.execCommand("copy");

        alert(
            "PIX copia e cola copiado!"
        );
    }
}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        atualizarCarrinho();

        console.log(
            "HYPE STORE: script.js carregado corretamente."
        );
    }
);