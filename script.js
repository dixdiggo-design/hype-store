// ==========================================
// HYPE STORE - SCRIPT PRINCIPAL
// ==========================================

let carrinho = [];
let intervaloPagamento = null;

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
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// ==========================================
// ATUALIZAR CONTADOR
// ==========================================

function atualizarContador() {
    const contador =
        document.getElementById("contador-carrinho");

    if (!contador) {
        return;
    }

    contador.textContent = carrinho.length;
}

// ==========================================
// ADICIONAR AO CARRINHO
// ==========================================

function adicionarCarrinho(nome, preco, opcao = "") {
    const produto = {
        nome: String(nome).trim(),
        preco: Number(preco),
        opcao: String(opcao).trim()
    };

    console.log("PRODUTO ADICIONADO:", produto);

    carrinho.push(produto);

    atualizarContador();
    atualizarCarrinho();

    abrirCarrinho();
}

// ==========================================
// REMOVER PRODUTO
// ==========================================

function removerProduto(index) {
    if (
        index < 0 ||
        index >= carrinho.length
    ) {
        return;
    }

    carrinho.splice(index, 1);

    atualizarContador();
    atualizarCarrinho();
}

// ==========================================
// CALCULAR TOTAL
// ==========================================

function calcularTotal() {
    return carrinho.reduce(
        (total, produto) => {
            return total + Number(produto.preco);
        },
        0
    );
}

// ==========================================
// ATUALIZAR CARRINHO
// ==========================================

function atualizarCarrinho() {
    const lista =
        document.getElementById("lista-carrinho");

    const total =
        document.getElementById("total-carrinho");

    const checkoutTotal =
        document.getElementById("total-checkout");

    if (!lista) {
        return;
    }

    lista.innerHTML = "";

    if (carrinho.length === 0) {
        lista.innerHTML = `
            <div class="carrinho-vazio">
                <div class="carrinho-vazio-icon">🛒</div>
                <strong>Seu carrinho está vazio</strong>
                <p>Adicione um produto para continuar.</p>
            </div>
        `;

        if (total) {
            total.textContent = formatarPreco(0);
        }

        if (checkoutTotal) {
            checkoutTotal.textContent = formatarPreco(0);
        }

        return;
    }

    let valorTotal = 0;

    carrinho.forEach((produto, index) => {
        valorTotal += Number(produto.preco);

        const item =
            document.createElement("div");

        item.className = "item-carrinho";

        item.innerHTML = `
            <div class="item-carrinho-info">

                <strong>
                    ${produto.nome}
                </strong>

                ${
                    produto.opcao
                        ? `
                            <span class="item-carrinho-opcao">
                                ${produto.opcao}
                            </span>
                        `
                        : ""
                }

                <span class="item-carrinho-preco">
                    ${formatarPreco(produto.preco)}
                </span>

            </div>

            <button
                class="btn-remover"
                type="button"
                onclick="removerProduto(${index})"
                aria-label="Remover produto"
            >
                ×
            </button>
        `;

        lista.appendChild(item);
    });

    if (total) {
        total.textContent =
            formatarPreco(valorTotal);
    }

    if (checkoutTotal) {
        checkoutTotal.textContent =
            formatarPreco(valorTotal);
    }
}

// ==========================================
// ABRIR CARRINHO
// ==========================================

function abrirCarrinho() {
    const modal =
        document.getElementById("modal-carrinho");

    if (!modal) {
        console.error(
            "Modal do carrinho não encontrado."
        );

        return;
    }

    atualizarCarrinho();

    modal.style.display = "flex";

    document.body.classList.add(
        "modal-aberto"
    );
}

// ==========================================
// FECHAR CARRINHO
// ==========================================

function fecharCarrinho() {
    const modal =
        document.getElementById("modal-carrinho");

    if (modal) {
        modal.style.display = "none";
    }

    document.body.classList.remove(
        "modal-aberto"
    );
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

    const modal =
        document.getElementById("modal-checkout");

    if (!modal) {
        console.error(
            "Modal de checkout não encontrado."
        );

        return;
    }

    const total =
        document.getElementById("total-checkout");

    if (total) {
        total.textContent =
            formatarPreco(
                calcularTotal()
            );
    }

    modal.style.display = "flex";

    document.body.classList.add(
        "modal-aberto"
    );
}

// ==========================================
// FECHAR CHECKOUT
// ==========================================

function fecharCheckout() {
    const modal =
        document.getElementById("modal-checkout");

    if (modal) {
        modal.style.display = "none";
    }

    document.body.classList.remove(
        "modal-aberto"
    );
}

// ==========================================
// GERAR PAGAMENTO PIX
// ==========================================

async function gerarPagamentoPix() {
    const nomeInput =
        document.getElementById("nome");

    const discordInput =
        document.getElementById("discord");

    const emailInput =
        document.getElementById("email");

    const botao =
        document.getElementById("btn-pagar-pix");

    if (!nomeInput || !discordInput || !emailInput) {
        console.error(
            "Campos do checkout não encontrados."
        );

        alert(
            "Erro no formulário de checkout."
        );

        return;
    }

    const nome =
        nomeInput.value.trim();

    const discord =
        discordInput.value.trim();

    const email =
        emailInput.value.trim();

    // ==========================================
    // VALIDAÇÃO
    // ==========================================

    if (!nome) {
        alert(
            "Digite seu nome."
        );

        nomeInput.focus();

        return;
    }

    if (!discord) {
        alert(
            "Digite seu Discord."
        );

        discordInput.focus();

        return;
    }

    if (!email) {
        alert(
            "Digite seu e-mail."
        );

        emailInput.focus();

        return;
    }

    if (!email.includes("@")) {
        alert(
            "Digite um e-mail válido."
        );

        emailInput.focus();

        return;
    }

    if (carrinho.length === 0) {
        alert(
            "Seu carrinho está vazio."
        );

        return;
    }

    const valor =
        calcularTotal();

    // ==========================================
    // VALOR MÍNIMO
    // ==========================================

    if (valor < 1.50) {
        alert(
            "O valor mínimo do pagamento é R$ 1,50."
        );

        return;
    }

    // ==========================================
    // DESABILITAR BOTÃO
    // ==========================================

    if (botao) {
        botao.disabled = true;

        botao.textContent =
            "GERANDO PIX...";
    }

    try {
        // ==========================================
        // PREPARAR PRODUTOS
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
            "HYPE STORE - GERANDO PAGAMENTO PIX"
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
            "ITENS:",
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

        // ==========================================
        // TENTAR LER RESPOSTA
        // ==========================================

        let dados;

        try {
            dados =
                await resposta.json();
        } catch (erroJson) {
            throw new Error(
                "O servidor retornou uma resposta inválida."
            );
        }

        console.log(
            "RESPOSTA DO SERVIDOR:",
            dados
        );

        // ==========================================
        // ERRO HTTP
        // ==========================================

        if (!resposta.ok) {
            throw new Error(
                dados?.erro ||
                dados?.message ||
                "Erro ao gerar pagamento."
            );
        }

        // ==========================================
        // VALIDAR PAGAMENTO
        // ==========================================

        if (
            !dados ||
            !dados.sucesso ||
            !dados.chargeId
        ) {
            console.error(
                "Resposta inválida do servidor:",
                dados
            );

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

function mostrarPagamentoPix(dados) {
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

    document.body.classList.add(
        "modal-aberto"
    );

    // ==========================================
    // QR CODE
    // ==========================================

    const qrCode =
        document.getElementById(
            "qr-code"
        );

    if (qrCode) {
        if (dados.qrCode) {
            qrCode.src =
                dados.qrCode;

            qrCode.style.display =
                "block";
        } else {
            qrCode.style.display =
                "none";
        }
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
    // LIMPAR MENSAGEM
    // ==========================================

    const mensagem =
        document.getElementById(
            "mensagem-pagamento"
        );

    if (mensagem) {
        mensagem.innerHTML = `
            <span>
                Após realizar o pagamento, aguarde a confirmação automática.
            </span>
        `;
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
        if (
            navigator.clipboard &&
            navigator.clipboard.writeText
        ) {
            await navigator.clipboard.writeText(
                campo.value
            );
        } else {
            campo.select();

            document.execCommand(
                "copy"
            );
        }

        alert(
            "Código Pix copiado!"
        );

    } catch (erro) {
        console.error(
            "Erro ao copiar Pix:",
            erro
        );

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

    document.body.classList.remove(
        "modal-aberto"
    );
}

// ==========================================
// VERIFICAR PAGAMENTO
// ==========================================

async function verificarPagamento(
    chargeId
) {
    if (!chargeId) {
        console.error(
            "Charge ID não informado."
        );

        return;
    }

    // ==========================================
    // PARAR INTERVALO ANTERIOR
    // ==========================================

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
// CONSULTAR STATUS DO PAGAMENTO
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

        let dados;

        try {
            dados =
                await resposta.json();
        } catch (erroJson) {
            console.error(
                "Resposta inválida do servidor."
            );

            return;
        }

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
        // CANCELADO / EXPIRADO
        // ==========================================

        if (
            dados.status === "CANCELED" ||
            dados.status === "CANCELLED" ||
            dados.status === "EXPIRED"
        ) {
            if (statusPix) {
                statusPix.textContent =
                    "❌ PAGAMENTO EXPIRADO OU CANCELADO.";
            }

            if (intervaloPagamento) {
                clearInterval(
                    intervaloPagamento
                );

                intervaloPagamento =
                    null;
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
                `STATUS: ${
                    dados.status ||
                    "DESCONHECIDO"
                }`;
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

        // ==========================================
        // PRODUTO ENTREGUE
        // ==========================================

        if (
            dados.contaEntregue === true
        ) {
            textoEntrega = `
                <div class="entrega-sucesso">
                    <strong>
                        Produto entregue com sucesso!
                    </strong>
                </div>
            `;
        } else {
            textoEntrega = `
                <div class="entrega-processando">
                    Pagamento aprovado. Processando entrega...
                </div>
            `;
        }

        // ==========================================
        // EMAIL
        // ==========================================

        const mensagemEmail =
            dados.emailEnviado === true
                ? `
                    <div class="email-sucesso">
                        📧 O produto foi enviado para seu e-mail.
                    </div>
                `
                : `
                    <div class="email-processando">
                        📧 O envio do e-mail está sendo processado.
                    </div>
                `;

        mensagem.innerHTML = `
            <div class="pagamento-aprovado">

                <strong>
                    Pagamento aprovado com sucesso!
                </strong>

                ${textoEntrega}

                ${mensagemEmail}

            </div>
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
    event => {
        const modais = [
            "modal-carrinho",
            "modal-checkout",
            "modal-pix"
        ];

        modais.forEach(id => {
            const modal =
                document.getElementById(id);

            if (
                modal &&
                event.target === modal
            ) {
                modal.style.display =
                    "none";

                document.body.classList.remove(
                    "modal-aberto"
                );
            }
        });
    }
);

// ==========================================
// TECLA ESC
// ==========================================

document.addEventListener(
    "keydown",
    event => {
        if (event.key !== "Escape") {
            return;
        }

        const modais = [
            "modal-carrinho",
            "modal-checkout",
            "modal-pix"
        ];

        modais.forEach(id => {
            const modal =
                document.getElementById(id);

            if (
                modal &&
                modal.style.display === "flex"
            ) {
                modal.style.display =
                    "none";
            }
        });

        document.body.classList.remove(
            "modal-aberto"
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
            "Sistema de checkout ativo."
        );

        console.log(
            "Sistema PIX ativo."
        );

        console.log(
            "=========================================="
        );
    }
);
/* =========================================================
   PREÇOS PÚBLICOS — CARREGADOS DO SERVIDOR
========================================================= */

async function carregarPrecosPublicos() {
    try {
        const resposta = await fetch("/api/precos", {
            cache: "no-store"
        });

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar os preços.");
        }

        const dados = await resposta.json();

        const mensal = Number(dados.mensal);
        const anual = Number(dados.anual);

        if (!Number.isFinite(mensal) || !Number.isFinite(anual)) {
            throw new Error("Preços inválidos recebidos do servidor.");
        }

        const formatar = valor =>
            Number(valor).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });

        /* HERO — Nitro Mensal */
        const precoHero = document.querySelector(".hero-card-price strong");

        if (precoHero) {
            precoHero.textContent = formatar(mensal);
        }

        const botaoHero = document.querySelector(
            ".hero-card-button"
        );

        if (botaoHero) {
            botaoHero.onclick = function () {
                adicionarCarrinho(
                    "Nitro Discord Mensal",
                    mensal,
                    "Mensal"
                );
            };
        }

        /* PRODUTO — Nitro Mensal */
        const cardMensal = document.querySelector(
            '.product-card[data-produto="nitro discord mensal"]'
        );

        if (cardMensal) {
            const preco = cardMensal.querySelector(".price strong");

            if (preco) {
                preco.textContent = formatar(mensal);
            }

            const botao = cardMensal.querySelector(".buy-button");

            if (botao) {
                botao.onclick = function () {
                    adicionarCarrinho(
                        "Nitro Discord Mensal",
                        mensal,
                        "Mensal"
                    );
                };
            }
        }

        /* PRODUTO — Nitro Anual */
        const cardAnual = document.querySelector(
            '.product-card[data-produto="nitro discord anual"]'
        );

        if (cardAnual) {
            const preco = cardAnual.querySelector(".price strong");

            if (preco) {
                preco.textContent = formatar(anual);
            }

            const botao = cardAnual.querySelector(".buy-button");

            if (botao) {
                botao.onclick = function () {
                    adicionarCarrinho(
                        "Nitro Discord Anual",
                        anual,
                        "Anual"
                    );
                };
            }
        }

        console.log(
            "[HYPE STORE] Preços carregados:",
            {
                mensal,
                anual
            }
        );

    } catch (erro) {
        console.error(
            "[HYPE STORE] Erro ao carregar preços:",
            erro
        );
    }
}

window.addEventListener("DOMContentLoaded", carregarPrecosPublicos);
