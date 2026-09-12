
// ==========================================
// HYPE STORE - SCRIPT PRINCIPAL
// ==========================================

let carrinho = [];

// ==========================================
// ELEMENTOS
// ==========================================

const contadorCarrinho =
    document.getElementById("contador-carrinho");

const listaCarrinho =
    document.getElementById("lista-carrinho");

const totalCarrinho =
    document.getElementById("total-carrinho");

const totalCheckout =
    document.getElementById("total-checkout");

// ==========================================
// FORMATAR DINHEIRO
// ==========================================

function formatarPreco(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}

// ==========================================
// ATUALIZAR CONTADOR
// ==========================================

function atualizarContador() {

    if (!contadorCarrinho) {
        return;
    }

    contadorCarrinho.textContent =
        carrinho.length;
}

// ==========================================
// ADICIONAR AO CARRINHO
// ==========================================

function adicionarCarrinho(
    nome,
    preco,
    opcao = ""
) {

    const produto = {

        nome: String(nome).trim(),

        preco: Number(preco),

        opcao: String(opcao).trim()
    };

    console.log(
        "PRODUTO ADICIONADO:",
        produto
    );

    carrinho.push(produto);

    atualizarContador();

    atualizarCarrinho();

    abrirCarrinho();
}

// ==========================================
// REMOVER PRODUTO
// ==========================================

function removerProduto(index) {

    carrinho.splice(
        index,
        1
    );

    atualizarContador();

    atualizarCarrinho();
}

// ==========================================
// ATUALIZAR CARRINHO
// ==========================================

function atualizarCarrinho() {

    if (!listaCarrinho) {
        return;
    }

    listaCarrinho.innerHTML = "";

    let total = 0;

    if (carrinho.length === 0) {

        listaCarrinho.innerHTML = `
            <p style="text-align:center;">
                Seu carrinho está vazio.
            </p>
        `;

    } else {

        carrinho.forEach(
            (produto, index) => {

                total +=
                    Number(produto.preco);

                const item =
                    document.createElement("div");

                item.className =
                    "item-carrinho";

                item.innerHTML = `

                    <div>

                        <strong>
                            ${produto.nome}
                        </strong>

                        ${
                            produto.opcao
                                ? `
                                    <p>
                                        Plano: ${produto.opcao}
                                    </p>
                                `
                                : ""
                        }

                        <p>
                            ${formatarPreco(
                                produto.preco
                            )}
                        </p>

                    </div>

                    <button
                        onclick="removerProduto(${index})"
                    >
                        ❌
                    </button>

                `;

                listaCarrinho.appendChild(
                    item
                );
            }
        );
    }

    if (totalCarrinho) {

        totalCarrinho.textContent =
            formatarPreco(total);
    }

    if (totalCheckout) {

        totalCheckout.textContent =
            formatarPreco(total);
    }
}

// ==========================================
// ABRIR CARRINHO
// ==========================================

function abrirCarrinho() {

    const carrinhoModal =
        document.getElementById(
            "modal-carrinho"
        );

    if (carrinhoModal) {

        carrinhoModal.style.display =
            "flex";
    }

    atualizarCarrinho();
}

// ==========================================
// FECHAR CARRINHO
// ==========================================

function fecharCarrinho() {

    const carrinhoModal =
        document.getElementById(
            "modal-carrinho"
        );

    if (carrinhoModal) {

        carrinhoModal.style.display =
            "none";
    }
}

// ==========================================
// ABRIR CHECKOUT
// ==========================================

function abrirCheckout() {

    if (carrinho.length === 0) {

        alert(
            "Seu carrinho está vazio."
        );

        return;
    }

    fecharCarrinho();

    const checkoutModal =
        document.getElementById(
            "modal-checkout"
        );

    if (checkoutModal) {

        checkoutModal.style.display =
            "flex";
    }

    atualizarCarrinho();
}

// ==========================================
// FECHAR CHECKOUT
// ==========================================

function fecharCheckout() {

    const checkoutModal =
        document.getElementById(
            "modal-checkout"
        );

    if (checkoutModal) {

        checkoutModal.style.display =
            "none";
    }
}

// ==========================================
// CALCULAR TOTAL
// ==========================================

function calcularTotal() {

    return carrinho.reduce(
        (
            total,
            produto
        ) => {

            return total +
                Number(produto.preco);

        },
        0
    );
}

// ==========================================
// GERAR PAGAMENTO PIX
// ==========================================

async function gerarPagamentoPix() {

    if (carrinho.length === 0) {

        alert(
            "Seu carrinho está vazio."
        );

        return;
    }

    const nome =
        document.getElementById(
            "nome"
        )?.value.trim();

    const discord =
        document.getElementById(
            "discord"
        )?.value.trim();

    const email =
        document.getElementById(
            "email"
        )?.value.trim();

    if (
        !nome ||
        !discord ||
        !email
    ) {

        alert(
            "Preencha seu nome, Discord e e-mail."
        );

        return;
    }

    const valor =
        calcularTotal();

    if (valor < 1.50) {

        alert(
            "O valor mínimo do Pix é R$ 1,50."
        );

        return;
    }

    const botao =
        document.getElementById(
            "btn-pagar-pix"
        );

    if (botao) {

        botao.disabled = true;

        botao.textContent =
            "GERANDO PIX...";
    }

    try {

        // ==========================================
        // GARANTIR QUE A OPÇÃO ESTÁ SENDO ENVIADA
        // ==========================================

        const itensParaEnviar =
            carrinho.map(
                produto => ({

                    nome:
                        String(
                            produto.nome
                        ).trim(),

                    preco:
                        Number(
                            produto.preco
                        ),

                    opcao:
                        String(
                            produto.opcao || ""
                        ).trim()
                })
            );

        console.log(
            "=========================================="
        );

        console.log(
            "GERANDO PAGAMENTO PIX"
        );

        console.log(
            "NOME:",
            nome
        );

        console.log(
            "DISCORD:",
            discord
        );

        console.log(
            "EMAIL:",
            email
        );

        console.log(
            "ITENS ENVIADOS:",
            itensParaEnviar
        );

        console.log(
            "VALOR:",
            valor
        );

        console.log(
            "=========================================="
        );

        // ==========================================
        // ENVIAR PARA O SERVIDOR
        // ==========================================

        const resposta =
            await fetch(
                "/api/pagamento/pix",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            nome:
                                nome,

                            discord:
                                discord,

                            email:
                                email,

                            itens:
                                itensParaEnviar,

                            valor:
                                valor
                        })
                }
            );

        const dados =
            await resposta.json();

        console.log(
            "RESPOSTA DO SERVIDOR:",
            dados
        );

        // ==========================================
        // ERRO
        // ==========================================

        if (!resposta.ok) {

            throw new Error(
                dados?.erro ||
                "Erro ao gerar pagamento."
            );
        }

        if (
            !dados.sucesso ||
            !dados.chargeId
        ) {

            throw new Error(
                "Pagamento não foi criado corretamente."
            );
        }

        // ==========================================
        // MOSTRAR PIX
        // ==========================================

        mostrarPagamentoPix(
            dados
        );

    } catch (erro) {

        console.error(
            "ERRO AO GERAR PAGAMENTO:",
            erro
        );

        alert(
            erro.message ||
            "Não foi possível gerar o pagamento."
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
// MOSTRAR PAGAMENTO PIX
// ==========================================

function mostrarPagamentoPix(
    dados
) {

    fecharCheckout();

    const pixModal =
        document.getElementById(
            "modal-pix"
        );

    if (!pixModal) {

        console.error(
            "Modal Pix não encontrado."
        );

        return;
    }

    pixModal.style.display =
        "flex";

    // ==========================================
    // QR CODE
    // ==========================================

    const qrCode =
        document.getElementById(
            "qr-code"
        );

    if (
        qrCode &&
        dados.qrCode
    ) {

        qrCode.src =
            dados.qrCode;

        qrCode.style.display =
            "block";
    }

    // ==========================================
    // PIX COPIA E COLA
    // ==========================================

    const pixCopiaCola =
        document.getElementById(
            "pix-copia-cola"
        );

    if (pixCopiaCola) {

        pixCopiaCola.value =
            dados.copyPaste || "";
    }

    // ==========================================
    // ID DO PEDIDO
    // ==========================================

    const pedidoId =
        document.getElementById(
            "pedido-id"
        );

    if (pedidoId) {

        pedidoId.textContent =
            dados.pedidoId || "";
    }

    // ==========================================
    // STATUS
    // ==========================================

    const statusPix =
        document.getElementById(
            "status-pix"
        );

    if (statusPix) {

        statusPix.textContent =
            "🟡 AGUARDANDO PAGAMENTO...";
    }

    // ==========================================
    // LIMPAR MENSAGEM ANTERIOR
    // ==========================================

    const mensagem =
        document.getElementById(
            "mensagem-pagamento"
        );

    if (mensagem) {

        mensagem.innerHTML = "";
    }

    // ==========================================
    // VERIFICAR PAGAMENTO
    // ==========================================

    verificarPagamento(
        dados.chargeId
    );
}

// ==========================================
// COPIAR PIX
// ==========================================

async function copiarPix() {

    const campo =
        document.getElementById(
            "pix-copia-cola"
        );

    if (
        !campo ||
        !campo.value
    ) {

        alert(
            "Código Pix não encontrado."
        );

        return;
    }

    try {

        await navigator.clipboard.writeText(
            campo.value
        );

        alert(
            "Código Pix copiado!"
        );

    } catch (erro) {

        campo.select();

        document.execCommand(
            "copy"
        );

        alert(
            "Código Pix copiado!"
        );
    }
}

// ==========================================
// FECHAR PIX
// ==========================================

function fecharPix() {

    const pixModal =
        document.getElementById(
            "modal-pix"
        );

    if (pixModal) {

        pixModal.style.display =
            "none";
    }
}

// ==========================================
// VERIFICAR PAGAMENTO
// ==========================================

let intervaloPagamento = null;

async function verificarPagamento(
    chargeId
) {

    if (!chargeId) {
        return;
    }

    if (intervaloPagamento) {

        clearInterval(
            intervaloPagamento
        );

        intervaloPagamento =
            null;
    }

    // ==========================================
    // CONSULTAR IMEDIATAMENTE
    // ==========================================

    await consultarStatusPagamento(
        chargeId
    );

    // ==========================================
    // CONSULTAR A CADA 5 SEGUNDOS
    // ==========================================

    intervaloPagamento =
        setInterval(
            async () => {

                await consultarStatusPagamento(
                    chargeId
                );

            },
            5000
        );
}

// ==========================================
// CONSULTAR STATUS
// ==========================================

async function consultarStatusPagamento(
    chargeId
) {

    try {

        const resposta =
            await fetch(
                `/api/pagamento/status/${encodeURIComponent(
                    chargeId
                )}`
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

        // ==========================================
        // PAGAMENTO APROVADO
        // ==========================================

        if (
            resposta.ok &&
            dados.status === "PAID"
        ) {

            if (statusPix) {

                statusPix.textContent =
                    "✅ PAGAMENTO APROVADO!";
            }

            if (intervaloPagamento) {

                clearInterval(
                    intervaloPagamento
                );

                intervaloPagamento =
                    null;
            }

            mostrarPagamentoAprovado(
                dados
            );

            return;
        }

        // ==========================================
        // PAGAMENTO PENDENTE
        // ==========================================

        if (
            dados.status === "PENDING"
        ) {

            if (statusPix) {

                statusPix.textContent =
                    "🟡 AGUARDANDO PAGAMENTO...";
            }

            return;
        }

        // ==========================================
        // PROCESSANDO
        // ==========================================

        if (
            dados.status === "PROCESSANDO"
        ) {

            if (statusPix) {

                statusPix.textContent =
                    "🟡 PROCESSANDO PAGAMENTO...";
            }

            return;
        }

        // ==========================================
        // ERRO NA RESPOSTA
        // ==========================================

        if (!resposta.ok) {

            console.error(
                "ERRO AO CONSULTAR PAGAMENTO:",
                dados
            );

            if (statusPix) {

                statusPix.textContent =
                    "⚠️ Erro ao verificar pagamento.";
            }

            return;
        }

        // ==========================================
        // OUTROS STATUS
        // ==========================================

        if (statusPix) {

            statusPix.textContent =
                `STATUS: ${dados.status || "DESCONHECIDO"}`;
        }

    } catch (erro) {

        console.error(
            "ERRO AO CONSULTAR PAGAMENTO:",
            erro
        );
    }
}

// ==========================================
// PAGAMENTO APROVADO
// ==========================================

function mostrarPagamentoAprovado(
    dados = {}
) {

    const statusPix =
        document.getElementById(
            "status-pix"
        );

    if (statusPix) {

        statusPix.textContent =
            "✅ PAGAMENTO APROVADO!";
    }

    const mensagem =
        document.getElementById(
            "mensagem-pagamento"
        );

    if (mensagem) {

        let textoEntrega =
            "";

        if (
            dados.contaEntregue === true
        ) {

            textoEntrega =
                `
                <br>
                <span style="color:#22c55e;">
                    Produto entregue com sucesso!
                </span>
                `;
        } else {

            textoEntrega =
                `
                <br>
                <span>
                    Pagamento aprovado. Processando entrega...
                </span>
                `;
        }

        mensagem.innerHTML = `
            <strong>
                Pagamento aprovado com sucesso!
            </strong>

            ${textoEntrega}

            <br><br>

            ${
                dados.emailEnviado === true
                    ? `
                        <span style="color:#22c55e;">
                            📧 O produto foi enviado para seu e-mail.
                        </span>
                    `
                    : `
                        <span>
                            📧 O envio do e-mail está sendo processado.
                        </span>
                    `
            }
        `;
    }

    // ==========================================
    // LIMPAR CARRINHO
    // ==========================================

    carrinho = [];

    atualizarContador();

    atualizarCarrinho();
}

// ==========================================
// FECHAR MODAIS CLICANDO FORA
// ==========================================

window.addEventListener(
    "click",
    (event) => {

        const modais = [

            "modal-carrinho",

            "modal-checkout",

            "modal-pix"
        ];

        modais.forEach(
            (id) => {

                const modal =
                    document.getElementById(
                        id
                    );

                if (
                    modal &&
                    event.target ===
                    modal
                ) {

                    modal.style.display =
                        "none";
                }
            }
        );
    }
);

// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        atualizarContador();

        atualizarCarrinho();

        console.log(
            "=========================================="
        );

        console.log(
            "HYPE STORE - SCRIPT CARREGADO"
        );

        console.log(
            "Sistema de carrinho ativo."
        );

        console.log(
            "Sistema PIX ativo."
        );

        console.log(
            "=========================================="
        );
    }
);

