
require("dotenv").config();

const express = require("express");
const fs = require("fs");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

const CAMINHO_PEDIDOS = "./pedidos.json";
const CAMINHO_ESTOQUE = "./estoque.json";

const TURBOFY_API = "https://api.turbofypay.com";

// ==========================================
// E-MAIL
// ==========================================

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USUARIO,
        pass: process.env.EMAIL_SENHA_APP
    }
});

// ==========================================
// CONTROLE DE PROCESSAMENTO
// ==========================================

const pedidosEmProcessamento = new Set();

// ==========================================
// LER PEDIDOS
// ==========================================

function lerPedidos() {

    try {

        if (!fs.existsSync(CAMINHO_PEDIDOS)) {
            return [];
        }

        const dados =
            fs.readFileSync(
                CAMINHO_PEDIDOS,
                "utf8"
            );

        if (!dados.trim()) {
            return [];
        }

        return JSON.parse(dados);

    } catch (erro) {

        console.error(
            "ERRO AO LER PEDIDOS:",
            erro
        );

        return [];
    }
}

// ==========================================
// SALVAR PEDIDOS
// ==========================================

function salvarPedidos(pedidos) {

    try {

        fs.writeFileSync(
            CAMINHO_PEDIDOS,
            JSON.stringify(
                pedidos,
                null,
                2
            ),
            "utf8"
        );

        return true;

    } catch (erro) {

        console.error(
            "ERRO AO SALVAR PEDIDOS:",
            erro
        );

        return false;
    }
}

// ==========================================
// LER ESTOQUE
// ==========================================

function lerEstoque() {

    try {

        if (!fs.existsSync(CAMINHO_ESTOQUE)) {

            console.error(
                "ARQUIVO estoque.json NÃO ENCONTRADO."
            );

            return {};
        }

        const dados =
            fs.readFileSync(
                CAMINHO_ESTOQUE,
                "utf8"
            );

        if (!dados.trim()) {
            return {};
        }

        return JSON.parse(dados);

    } catch (erro) {

        console.error(
            "ERRO AO LER ESTOQUE:",
            erro
        );

        return {};
    }
}

// ==========================================
// SALVAR ESTOQUE
// ==========================================

function salvarEstoque(estoque) {

    try {

        fs.writeFileSync(
            CAMINHO_ESTOQUE,
            JSON.stringify(
                estoque,
                null,
                2
            ),
            "utf8"
        );

        return true;

    } catch (erro) {

        console.error(
            "ERRO AO SALVAR ESTOQUE:",
            erro
        );

        return false;
    }
}

// ==========================================
// IDENTIFICAR PRODUTO
// ==========================================

function obterDadosProduto(itens) {

    const item =
        Array.isArray(itens) &&
        itens.length > 0
            ? itens[0]
            : {};

    const nomeProduto =
        String(
            item.nome || ""
        ).trim();

    const opcao =
        String(
            item.opcao || ""
        ).trim();

    let chaveEstoque =
        nomeProduto;

    // ==========================================
    // NITRO DISCORD
    // ==========================================

    if (
        nomeProduto.toLowerCase() ===
        "nitro discord"
    ) {

        if (
            opcao.toLowerCase() ===
            "anual"
        ) {

            chaveEstoque =
                "Nitro Discord Anual";

        } else if (
            opcao.toLowerCase() ===
            "mensal"
        ) {

            chaveEstoque =
                "Nitro Discord Mensal";
        }
    }

    return {

        nomeProduto,
        opcao,
        chaveEstoque
    };
}

// ==========================================
// VERIFICAR ESTOQUE
// ==========================================

function existeEstoqueDisponivel(
    chaveEstoque
) {

    const estoque =
        lerEstoque();

    if (
        !estoque ||
        !Array.isArray(
            estoque[chaveEstoque]
        )
    ) {

        return false;
    }

    return estoque[chaveEstoque].some(
        conta =>
            conta &&
            conta.status ===
                "disponivel"
    );
}

// ==========================================
// ENTREGAR PRODUTO
// ==========================================

function entregarProduto(pedido) {

    try {

        const estoque =
            lerEstoque();

        const dadosProduto =
            obterDadosProduto(
                pedido.itens
            );

        const chaveEstoque =
            pedido.chaveEstoque ||
            dadosProduto.chaveEstoque;

        console.log(
            "PRODUTO:",
            dadosProduto.nomeProduto
        );

        console.log(
            "OPÇÃO:",
            dadosProduto.opcao
        );

        console.log(
            "ESTOQUE SELECIONADO:",
            chaveEstoque
        );

        if (
            !Array.isArray(
                estoque[chaveEstoque]
            )
        ) {

            return {

                sucesso: false,

                erro:
                    `Estoque do produto "${chaveEstoque}" não encontrado.`
            };
        }

        const indice =
            estoque[chaveEstoque].findIndex(
                conta =>
                    conta &&
                    conta.status ===
                        "disponivel"
            );

        if (indice === -1) {

            return {

                sucesso: false,

                erro:
                    `Produto "${chaveEstoque}" está sem estoque.`
            };
        }

        const conta =
            estoque[chaveEstoque][indice];

        // ==========================================
        // MARCAR COMO VENDIDA
        // ==========================================

        estoque[chaveEstoque][indice] = {

            ...conta,

            status: "vendida",

            vendidaEm:
                new Date().toISOString(),

            pedidoId:
                pedido.id
        };

        const salvou =
            salvarEstoque(
                estoque
            );

        if (!salvou) {

            return {

                sucesso: false,

                erro:
                    "Não foi possível salvar a alteração do estoque."
            };
        }

        console.log(
            "PRODUTO ENTREGUE:",
            chaveEstoque
        );

        return {

            sucesso: true,

            produto:
                dadosProduto.nomeProduto,

            opcao:
                dadosProduto.opcao,

            chaveEstoque:
                chaveEstoque,

            entrega: {

                email:
                    conta.email,

                senha:
                    conta.senha
            }
        };

    } catch (erro) {

        console.error(
            "ERRO AO ENTREGAR PRODUTO:",
            erro
        );

        return {

            sucesso: false,

            erro:
                erro.message
        };
    }
}

// ==========================================
// ENVIAR E-MAIL DO PRODUTO
// ==========================================

async function enviarEmailProduto(
    pedido
) {

    try {

        if (!pedido) {

            return {

                sucesso: false,

                erro:
                    "Pedido não informado."
            };
        }

        if (!pedido.email) {

            return {

                sucesso: false,

                erro:
                    "E-mail do cliente não informado."
            };
        }

        if (
            !pedido.conta ||
            !pedido.conta.email ||
            !pedido.conta.senha
        ) {

            return {

                sucesso: false,

                erro:
                    "Conta do produto não encontrada."
            };
        }

        // ==========================================
        // NÃO ENVIAR DUAS VEZES
        // ==========================================

        if (
            pedido.emailEnviado === true
        ) {

            return {

                sucesso: true,

                jaEnviado: true
            };
        }

        const dadosProduto =
            obterDadosProduto(
                pedido.itens
            );

        const nomeProduto =
            pedido.produto ||
            dadosProduto.nomeProduto;

        const opcao =
            pedido.opcao ||
            dadosProduto.opcao;

        const assunto =
            opcao
                ? `Pedido ${pedido.id} - ${nomeProduto} ${opcao}`
                : `Pedido ${pedido.id} - Produto entregue`;

        // ==========================================
        // E-MAIL
        // ==========================================

        const resultado =
            await transporter.sendMail({

                from:
                    `"HYPE STORE" <${process.env.EMAIL_USUARIO}>`,

                to:
                    pedido.email,

                subject:
                    assunto,

                text: `
Olá, ${pedido.nome || "cliente"}!

Seu pagamento foi aprovado.

Seu produto da HYPE STORE foi entregue com sucesso.

Produto: ${nomeProduto}

${opcao ? `Plano: ${opcao}` : ""}

E-MAIL DA CONTA:
${pedido.conta.email}

SENHA:
${pedido.conta.senha}

Pedido:
${pedido.id}

Obrigado por comprar na HYPE STORE!
                `.trim(),

                html: `
                    <div style="
                        font-family:Arial,sans-serif;
                        background:#111;
                        color:#fff;
                        padding:30px;
                        border-radius:12px;
                    ">

                        <h1 style="
                            color:#a855f7;
                            margin-bottom:10px;
                        ">
                            HYPE STORE
                        </h1>

                        <h2>
                            Pagamento aprovado!
                        </h2>

                        <p>
                            Olá,
                            <strong>
                                ${pedido.nome || "cliente"}
                            </strong>!
                        </p>

                        <p>
                            Seu produto foi entregue com sucesso.
                        </p>

                        <hr style="
                            border:none;
                            border-top:1px solid #333;
                            margin:20px 0;
                        ">

                        <p>
                            <strong>Produto:</strong>
                            ${nomeProduto}
                        </p>

                        ${
                            opcao
                                ? `
                                    <p>
                                        <strong>Plano:</strong>
                                        ${opcao}
                                    </p>
                                `
                                : ""
                        }

                        <div style="
                            background:#080808;
                            padding:20px;
                            border-radius:10px;
                            border:1px solid #333;
                            margin-top:20px;
                        ">

                            <p>
                                <strong>
                                    E-MAIL DA CONTA
                                </strong>
                            </p>

                            <p style="
                                color:#a855f7;
                                font-size:16px;
                            ">
                                ${pedido.conta.email}
                            </p>

                            <p>
                                <strong>
                                    SENHA
                                </strong>
                            </p>

                            <p style="
                                color:#a855f7;
                                font-size:16px;
                            ">
                                ${pedido.conta.senha}
                            </p>

                        </div>

                        <p style="
                            color:#aaa;
                            margin-top:25px;
                        ">
                            Pedido:
                            ${pedido.id}
                        </p>

                        <p style="
                            color:#aaa;
                        ">
                            Obrigado por comprar na HYPE STORE!
                        </p>

                    </div>
                `
            });

        console.log(
            "E-MAIL ENVIADO COM SUCESSO:",
            resultado.messageId
        );

        return {

            sucesso: true,

            messageId:
                resultado.messageId
        };

    } catch (erro) {

        console.error(
            "ERRO AO ENVIAR E-MAIL:",
            erro
        );

        return {

            sucesso: false,

            erro:
                erro.message
        };
    }
}

// ==========================================
// STATUS DO SERVIDOR
// ==========================================

app.get(
    "/api/status",
    (req, res) => {

        res.json({

            online: true,

            mensagem:
                "Servidor da HYPE STORE funcionando!"
        });
    }
);

// ==========================================
// VERIFICAR ESTOQUE
// ==========================================

app.get(
    "/api/estoque/:produto",
    (req, res) => {

        try {

            const produto =
                decodeURIComponent(
                    req.params.produto
                );

            const disponivel =
                existeEstoqueDisponivel(
                    produto
                );

            res.json({

                produto,

                disponivel
            });

        } catch (erro) {

            res.status(500).json({

                erro:
                    erro.message
            });
        }
    }
);

// ==========================================
// CRIAR PAGAMENTO PIX
// ==========================================

app.post(
    "/api/pagamento/pix",
    async (req, res) => {

        try {

            const {
                nome,
                discord,
                email,
                itens,
                valor
            } = req.body;

            // ==========================================
            // VALIDAR DADOS
            // ==========================================

            if (
                !nome ||
                !discord ||
                !email ||
                !Array.isArray(itens) ||
                itens.length === 0 ||
                valor === undefined ||
                valor === null
            ) {

                return res.status(400).json({

                    sucesso: false,

                    erro:
                        "Dados do pedido incompletos."
                });
            }

            const valorNumerico =
                Number(valor);

            if (
                !Number.isFinite(
                    valorNumerico
                ) ||
                valorNumerico <= 0
            ) {

                return res.status(400).json({

                    sucesso: false,

                    erro:
                        "Valor do pagamento inválido."
                });
            }

            // ==========================================
            // MÍNIMO PIX
            // ==========================================

            if (
                valorNumerico < 1.50
            ) {

                return res.status(400).json({

                    sucesso: false,

                    erro:
                        "O valor mínimo do Pix é R$ 1,50."
                });
            }

            // ==========================================
            // IDENTIFICAR PRODUTO
            // ==========================================

            const dadosProduto =
                obterDadosProduto(
                    itens
                );

            if (
                !dadosProduto.nomeProduto
            ) {

                return res.status(400).json({

                    sucesso: false,

                    erro:
                        "Produto não informado."
                });
            }

            // ==========================================
            // VERIFICAR ESTOQUE
            // ==========================================

            if (
                !existeEstoqueDisponivel(
                    dadosProduto.chaveEstoque
                )
            ) {

                return res.status(400).json({

                    sucesso: false,

                    erro:
                        `O produto "${dadosProduto.chaveEstoque}" está sem estoque.`
                });
            }

            // ==========================================
            // CONVERTER PARA CENTAVOS
            // ==========================================

            const amountCents =
                Math.round(
                    valorNumerico * 100
                );

            // ==========================================
            // GERAR ID DO PEDIDO
            // ==========================================

            const pedidoId =
                `HYPE-${Date.now()}`;

            // ==========================================
            // CRIAR PEDIDO
            // ==========================================

            const pedidos =
                lerPedidos();

            const pedido = {

                id:
                    pedidoId,

                nome:
                    nome,

                discord:
                    discord,

                email:
                    email,

                itens:
                    itens,

                produto:
                    dadosProduto.nomeProduto,

                opcao:
                    dadosProduto.opcao,

                chaveEstoque:
                    dadosProduto.chaveEstoque,

                valor:
                    valorNumerico,

                chargeId:
                    null,

                status:
                    "PENDENTE",

                entrega:
                    "AGUARDANDO PAGAMENTO",

                contaEntregue:
                    false,

                emailEnviado:
                    false,

                criadoEm:
                    new Date().toISOString()
            };

            pedidos.push(
                pedido
            );

            salvarPedidos(
                pedidos
            );

            // ==========================================
            // GERAR PIX NA TURBOFY
            // ==========================================

            console.log(
                "CRIANDO PIX TURBOFYPAY..."
            );

            const resposta =
                await fetch(
                    `${TURBOFY_API}/sellers/pix`,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "x-client-id":
                                process.env.TURBOFY_CLIENT_ID,

                            "x-client-secret":
                                process.env.TURBOFY_CLIENT_SECRET,

                            "x-idempotency-key":
                                pedidoId
                        },

                        body:
                            JSON.stringify({

                                amountCents:
                                    amountCents,

                                description:
                                    `Pedido ${pedidoId} - ${dadosProduto.nomeProduto}${dadosProduto.opcao ? ` ${dadosProduto.opcao}` : ""}`,

                                externalRef:
                                    pedidoId,

                                metadata: {

                                    pedidoId:
                                        pedidoId,

                                    produto:
                                        dadosProduto.nomeProduto,

                                    opcao:
                                        dadosProduto.opcao
                                }
                            })
                    }
                );

            const textoResposta =
                await resposta.text();

            let dados;

            try {

                dados =
                    textoResposta
                        ? JSON.parse(
                            textoResposta
                        )
                        : {};

            } catch {

                dados = {

                    erro:
                        textoResposta
                };
            }

            if (!resposta.ok) {

                console.error(
                    "ERRO TURBOFYPAY:",
                    dados
                );

                return res.status(
                    502
                ).json({

                    sucesso: false,

                    erro:
                        dados?.message ||
                        dados?.erro ||
                        dados?.error ||
                        `TurbofyPay retornou HTTP ${resposta.status}.`
                });
            }

            if (
                !dados.id
            ) {

                console.error(
                    "TURBOFYPAY NÃO RETORNOU ID:",
                    dados
                );

                return res.status(502).json({

                    sucesso: false,

                    erro:
                        "A TurbofyPay não retornou o ID da cobrança."
                });
            }

            // ==========================================
            // SALVAR CHARGE ID
            // ==========================================

            pedido.chargeId =
                dados.id;

            pedido.status =
                dados.status ||
                "PENDING";

            salvarPedidos(
                pedidos
            );

            // ==========================================
            // QR CODE
            // ==========================================

            let qrCode =
                dados?.pix?.qrCode ||
                null;

            if (
                qrCode &&
                !String(qrCode).startsWith(
                    "data:"
                ) &&
                !String(qrCode).startsWith(
                    "http://"
                ) &&
                !String(qrCode).startsWith(
                    "https://"
                )
            ) {

                qrCode =
                    `data:image/png;base64,${qrCode}`;
            }

            const copyPaste =
                dados?.pix?.copyPaste ||
                null;

            console.log(
                "PIX CRIADO COM SUCESSO."
            );

            console.log(
                "PEDIDO:",
                pedidoId
            );

            console.log(
                "CHARGE ID:",
                dados.id
            );

            return res.json({

                sucesso: true,

                pedidoId:

                    pedidoId,

                chargeId:

                    dados.id,

                qrCode:

                    qrCode,

                copyPaste:

                    copyPaste,

                status:

                    dados.status ||
                    "PENDING"
            });

        } catch (erro) {

            console.error(
                "ERRO AO GERAR PIX:",
                erro
            );

            return res.status(500).json({

                sucesso: false,

                erro:
                    erro.message ||
                    "Erro interno ao gerar pagamento."
            });
        }
    }
);

// ==========================================
// CONSULTAR STATUS DO PAGAMENTO
// ==========================================

app.get(
    "/api/pagamento/status/:chargeId",
    async (req, res) => {

        const {
            chargeId
        } = req.params;

        if (!chargeId) {

            return res.status(400).json({

                sucesso: false,

                erro:
                    "Charge ID não informado."
            });
        }

        // ==========================================
        // EVITAR PROCESSAMENTO DUPLICADO
        // ==========================================

        if (
            pedidosEmProcessamento.has(
                chargeId
            )
        ) {

            return res.json({

                sucesso: true,

                status:
                    "PROCESSANDO",

                chargeId
            });
        }

        pedidosEmProcessamento.add(
            chargeId
        );

        try {

            // ==========================================
            // CONSULTAR TURBOFYPAY
            // ==========================================

            const resposta =
                await fetch(
                    `${TURBOFY_API}/sellers/pix/${encodeURIComponent(chargeId)}`,
                    {

                        method: "GET",

                        headers: {

                            "x-client-id":
                                process.env.TURBOFY_CLIENT_ID,

                            "x-client-secret":
                                process.env.TURBOFY_CLIENT_SECRET
                        }
                    }
                );

            const textoResposta =
                await resposta.text();

            let dados;

            try {

                dados =
                    textoResposta
                        ? JSON.parse(
                            textoResposta
                        )
                        : {};

            } catch {

                dados = {

                    erro:
                        textoResposta
                };
            }

            if (!resposta.ok) {

                console.error(
                    "ERRO AO CONSULTAR TURBOFYPAY:",
                    dados
                );

                return res.status(
                    resposta.status
                ).json({

                    sucesso: false,

                    erro:
                        dados?.message ||
                        dados?.erro ||
                        dados?.error ||
                        "Erro ao consultar pagamento.",

                    chargeId
                });
            }

            const status =
                String(
                    dados.status ||
                    ""
                ).toUpperCase();

            // ==========================================
            // PROCURAR PEDIDO
            // ==========================================

            const pedidos =
                lerPedidos();

            const indicePedido =
                pedidos.findIndex(
                    pedido =>
                        String(
                            pedido.chargeId
                        ) ===
                        String(chargeId)
                );

            if (
                indicePedido === -1
            ) {

                return res.status(404).json({

                    sucesso: false,

                    erro:
                        "Pedido não encontrado para este pagamento.",

                    status,

                    chargeId
                });
            }

            const pedido =
                pedidos[indicePedido];

            // ==========================================
            // PAGAMENTO PENDENTE
            // ==========================================

            if (
                status !== "PAID"
            ) {

                pedido.status =
                    status ||
                    "PENDING";

                salvarPedidos(
                    pedidos
                );

                return res.json({

                    sucesso: true,

                    status:

                        status ||
                        "PENDING",

                    chargeId,

                    pedidoId:
                        pedido.id,

                    produto:
                        pedido.produto,

                    entrega:
                        pedido.entrega,

                    contaEntregue:
                        pedido.contaEntregue,

                    emailEnviado:
                        pedido.emailEnviado
                });
            }

            // ==========================================
            // PAGAMENTO APROVADO
            // ==========================================

            pedido.status =
                "PAGO";

            pedido.entrega =
                "PAGAMENTO APROVADO";

            if (
                !pedido.pagoEm
            ) {

                pedido.pagoEm =
                    new Date().toISOString();
            }

            // ==========================================
            // CASO JÁ TENHA ENTREGADO
            // ==========================================

            if (
                pedido.contaEntregue === true &&
                pedido.conta
            ) {

                // ==========================================
                // TENTAR ENVIAR E-MAIL NOVAMENTE
                // ==========================================

                if (
                    pedido.emailEnviado !==
                    true
                ) {

                    const resultadoEmail =
                        await enviarEmailProduto(
                            pedido
                        );

                    if (
                        resultadoEmail.sucesso
                    ) {

                        pedido.emailEnviado =
                            true;

                        pedido.emailEnviadoEm =
                            new Date().toISOString();

                        pedido.erroEmail =
                            null;

                    } else {

                        pedido.emailEnviado =
                            false;

                        pedido.erroEmail =
                            resultadoEmail.erro;
                    }
                }

                salvarPedidos(
                    pedidos
                );

                return res.json({

                    sucesso: true,

                    status:
                        "PAID",

                    chargeId,

                    pedidoId:
                        pedido.id,

                    produto:
                        pedido.produto,

                    opcao:
                        pedido.opcao,

                    entrega:
                        pedido.entrega,

                    contaEntregue:
                        true,

                    emailEnviado:
                        pedido.emailEnviado,

                    conta:
                        pedido.conta
                });
            }

            // ==========================================
            // ENTREGAR CONTA
            // ==========================================

            const resultadoEntrega =
                entregarProduto(
                    pedido
                );

            if (
                !resultadoEntrega.sucesso
            ) {

                pedido.entrega =
                    "PAGO - AGUARDANDO ESTOQUE";

                pedido.erroEntrega =
                    resultadoEntrega.erro;

                salvarPedidos(
                    pedidos
                );

                return res.json({

                    sucesso: true,

                    status:
                        "PAID",

                    chargeId,

                    pedidoId:
                        pedido.id,

                    produto:
                        pedido.produto,

                    opcao:
                        pedido.opcao,

                    entrega:
                        pedido.entrega,

                    contaEntregue:
                        false,

                    emailEnviado:
                        false,

                    erroEntrega:
                        resultadoEntrega.erro
                });
            }

            // ==========================================
            // SALVAR CONTA NO PEDIDO
            // ==========================================

            pedido.conta =
                resultadoEntrega.entrega;

            pedido.contaEntregue =
                true;

            pedido.entrega =
                "PRODUTO ENTREGUE";

            pedido.entregueEm =
                new Date().toISOString();

            pedido.erroEntrega =
                null;

            // ==========================================
            // ENVIAR E-MAIL
            // ==========================================

            const resultadoEmail =
                await enviarEmailProduto(
                    pedido
                );

            if (
                resultadoEmail.sucesso
            ) {

                pedido.emailEnviado =
                    true;

                pedido.emailEnviadoEm =
                    new Date().toISOString();

                pedido.erroEmail =
                    null;

            } else {

                pedido.emailEnviado =
                    false;

                pedido.erroEmail =
                    resultadoEmail.erro;

                console.error(
                    "PRODUTO ENTREGUE, MAS E-MAIL FALHOU:",
                    resultadoEmail.erro
                );
            }

            // ==========================================
            // SALVAR PEDIDO
            // ==========================================

            salvarPedidos(
                pedidos
            );

            console.log(
                "PAGAMENTO PROCESSADO:"
            );

            console.log(
                "PEDIDO:",
                pedido.id
            );

            console.log(
                "PRODUTO:",
                pedido.produto
            );

            console.log(
                "OPÇÃO:",
                pedido.opcao
            );

            console.log(
                "CONTA ENTREGUE:",
                pedido.contaEntregue
            );

            console.log(
                "E-MAIL ENVIADO:",
                pedido.emailEnviado
            );

            // ==========================================
            // RETORNAR RESULTADO
            // ==========================================

            return res.json({

                sucesso: true,

                status:
                    "PAID",

                chargeId,

                pedidoId:
                    pedido.id,

                produto:
                    pedido.produto,

                opcao:
                    pedido.opcao,

                entrega:
                    pedido.entrega,

                contaEntregue:
                    pedido.contaEntregue,

                emailEnviado:
                    pedido.emailEnviado,

                conta:
                    pedido.conta
            });

        } catch (erro) {

            console.error(
                "ERRO AO CONSULTAR STATUS:",
                erro
            );

            return res.status(500).json({

                sucesso: false,

                erro:
                    erro.message ||
                    "Erro interno ao consultar pagamento.",

                chargeId
            });

        } finally {

            pedidosEmProcessamento.delete(
                chargeId
            );
        }
    }
);

// ==========================================
// TESTE DE E-MAIL
// ==========================================

app.get(
    "/teste-email",
    async (req, res) => {

        const teste = {

            id:
                "TESTE-HYPE",

            nome:
                "Cliente Teste",

            email:
                process.env.EMAIL_USUARIO,

            produto:
                "Nitro Discord",

            opcao:
                "Anual",

            conta: {

                email:
                    "conta-teste@exemplo.com",

                senha:
                    "SENHA-TESTE-123"
            },

            emailEnviado:
                false
        };

        const resultado =
            await enviarEmailProduto(
                teste
            );

        if (
            resultado.sucesso
        ) {

            return res.json({

                sucesso: true,

                mensagem:
                    "E-mail de teste enviado!"
            });
        }

        return res.status(500).json({

            sucesso: false,

            erro:
                resultado.erro
        });
    }
);

// ==========================================
// INICIAR SERVIDOR
// ==========================================

app.listen(
    PORT,
    () => {

        console.log("");
        console.log(
            "=========================================="
        );

        console.log(
            "       HYPE STORE ONLINE"
        );

        console.log(
            "=========================================="
        );

        console.log(
            `PORTA: ${PORT}`
        );

        console.log(
            "PIX TURBOFYPAY ATIVO"
        );

        console.log(
            "ESTOQUE AUTOMÁTICO ATIVO"
        );

        console.log(
            "E-MAIL AUTOMÁTICO ATIVO"
        );

        console.log(
            "=========================================="
        );

        console.log("");
    }
);

