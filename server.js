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

const pedidosEmProcessamento = new Set();


// ==========================================
// LER PEDIDOS
// ==========================================

function lerPedidos() {
    try {
        if (!fs.existsSync(CAMINHO_PEDIDOS)) {
            return [];
        }

        const dados = fs.readFileSync(
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

    return estoque[
        chaveEstoque
    ].some(
        conta =>
            conta &&
            conta.status ===
                "disponivel"
    );
}


// ==========================================
// ENTREGAR PRODUTO
// ==========================================

function entregarProduto(
    pedido
) {

    const estoque =
        lerEstoque();

    const dadosProduto =
        obterDadosProduto(
            pedido.itens
        );

    const chaveEstoque =
        pedido.chaveEstoque ||
        dadosProduto.chaveEstoque;

    if (
        !estoque ||
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
        estoque[
            chaveEstoque
        ].findIndex(
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
        estoque[
            chaveEstoque
        ][indice];

    estoque[
        chaveEstoque
    ][indice].status =
        "vendida";

    estoque[
        chaveEstoque
    ][indice].vendidaEm =
        new Date().toISOString();

    estoque[
        chaveEstoque
    ][indice].pedidoId =
        pedido.id;

    const salvo =
        salvarEstoque(
            estoque
        );

    if (!salvo) {

        return {
            sucesso: false,
            erro:
                "Não foi possível atualizar o estoque."
        };
    }

    return {
        sucesso: true,
        email:
            conta.email ||
            conta.login ||
            "",
        senha:
            conta.senha ||
            conta.password ||
            ""
    };
}


// ==========================================
// EMAIL
// ==========================================

function criarTransportador() {

    if (
        !process.env.EMAIL_USUARIO ||
        !process.env.EMAIL_SENHA_APP
    ) {

        console.error(
            "EMAIL_USUARIO ou EMAIL_SENHA_APP não configurados."
        );

        return null;
    }

    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user:
                process.env.EMAIL_USUARIO,
            pass:
                process.env.EMAIL_SENHA_APP
        }
    });
}


// ==========================================
// ENVIAR PRODUTO POR EMAIL
// ==========================================

async function enviarEmailProduto(
    pedido,
    entrega
) {

    const transporter =
        criarTransportador();

    if (!transporter) {
        return false;
    }

    const texto = `
Olá!

Seu pagamento foi confirmado com sucesso.

PEDIDO:
${pedido.id}

PRODUTO:
${pedido.produto || "Produto digital"}

${pedido.opcao ? `OPÇÃO:\n${pedido.opcao}\n` : ""}

DADOS DE ACESSO:

E-mail/Login:
${entrega.email}

Senha:
${entrega.senha}

Obrigado por comprar na HYPE STORE!
`;

    try {

        await transporter.sendMail({

            from:
                `"HYPE STORE" <${process.env.EMAIL_USUARIO}>`,

            to:
                pedido.email,

            subject:
                `HYPE STORE - Pedido ${pedido.id} aprovado`,

            text:
                texto
        });

        console.log(
            "E-MAIL ENVIADO PARA:",
            pedido.email
        );

        return true;

    } catch (erro) {

        console.error(
            "ERRO AO ENVIAR E-MAIL:",
            erro
        );

        return false;
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
// CONSULTAR ESTOQUE
// ==========================================

app.get(
    "/api/estoque/:produto",
    (req, res) => {

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
    }
);


// ==========================================
// CONSULTAR PEDIDO
// ==========================================

app.get(
    "/api/pedidos/:id",
    (req, res) => {

        const pedidos =
            lerPedidos();

        const pedido =
            pedidos.find(
                item =>
                    String(item.id) ===
                    String(req.params.id)
            );

        if (!pedido) {

            return res.status(404).json({
                sucesso: false,
                erro:
                    "Pedido não encontrado."
            });
        }

        res.json({
            sucesso: true,
            pedido
        });
    }
);


// ==========================================
// CRIAR PEDIDO
// ==========================================

app.post(
    "/api/pedidos",
    (req, res) => {

        try {

            const {
                nome,
                discord,
                email,
                itens
            } = req.body;

            if (
                !nome ||
                !discord ||
                !email ||
                !Array.isArray(itens) ||
                itens.length === 0
            ) {

                return res.status(400).json({
                    sucesso: false,
                    erro:
                        "Dados do pedido incompletos."
                });
            }

            const dadosProduto =
                obterDadosProduto(
                    itens
                );

            const id =
                `HYPE-${Date.now()}`;

            const pedidos =
                lerPedidos();

            const pedido = {

                id,

                nome,

                discord,

                email,

                itens,

                produto:
                    dadosProduto.nomeProduto,

                opcao:
                    dadosProduto.opcao,

                chaveEstoque:
                    dadosProduto.chaveEstoque,

                status:
                    "AGUARDANDO PAGAMENTO",

                criadoEm:
                    new Date().toISOString()
            };

            pedidos.push(
                pedido
            );

            salvarPedidos(
                pedidos
            );

            res.json({
                sucesso: true,
                pedidoId: id
            });

        } catch (erro) {

            console.error(
                "ERRO AO CRIAR PEDIDO:",
                erro
            );

            res.status(500).json({
                sucesso: false,
                erro:
                    "Erro interno ao criar pedido."
            });
        }
    }
);


// ==========================================
// GERAR PIX TURBOFYPAY
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

            if (
                !nome ||
                !discord ||
                !email ||
                !Array.isArray(itens) ||
                itens.length === 0 ||
                !valor
            ) {

                return res.status(400).json({
                    sucesso: false,
                    erro:
                        "Dados do pagamento incompletos."
                });
            }

            const valorNumerico =
                Number(valor);

            if (
                !Number.isFinite(
                    valorNumerico
                ) ||
                valorNumerico < 1.50
            ) {

                return res.status(400).json({
                    sucesso: false,
                    erro:
                        "O valor mínimo do pagamento é R$ 1,50."
                });
            }


            // ==========================================
            // PRODUTO
            // ==========================================

            const dadosProduto =
                obterDadosProduto(
                    itens
                );


            // ==========================================
            // DIAGNÓSTICO DO ESTOQUE
            // ==========================================

            console.log("");
            console.log(
                "=========================================="
            );
            console.log(
                "       DIAGNÓSTICO DO ESTOQUE"
            );
            console.log(
                "=========================================="
            );

            console.log(
                "ITENS RECEBIDOS:",
                JSON.stringify(
                    itens,
                    null,
                    2
                )
            );

            console.log(
                "NOME DO PRODUTO:",
                dadosProduto.nomeProduto
            );

            console.log(
                "OPÇÃO:",
                dadosProduto.opcao
            );

            console.log(
                "CHAVE DO ESTOQUE:",
                dadosProduto.chaveEstoque
            );

            console.log(
                "ESTOQUE DISPONÍVEL:",
                existeEstoqueDisponivel(
                    dadosProduto.chaveEstoque
                )
            );

            console.log(
                "=========================================="
            );
            console.log("");


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
            // CRIAR PEDIDO
            // ==========================================

            const pedidoId =
                `HYPE-${Date.now()}`;

            const pedidos =
                lerPedidos();

            const novoPedido = {

                id:
                    pedidoId,

                nome,

                discord,

                email,

                itens,

                produto:
                    dadosProduto.nomeProduto,

                opcao:
                    dadosProduto.opcao,

                chaveEstoque:
                    dadosProduto.chaveEstoque,

                valor:
                    valorNumerico,

                status:
                    "AGUARDANDO PAGAMENTO",

                criadoEm:
                    new Date().toISOString()
            };

            pedidos.push(
                novoPedido
            );

            salvarPedidos(
                pedidos
            );


            // ==========================================
            // VALOR EM CENTAVOS
            // ==========================================

            const amountCents =
                Math.round(
                    valorNumerico * 100
                );


            // ==========================================
            // TURBOFYPAY
            // ==========================================

            console.log("");
            console.log(
                "=========================================="
            );
            console.log(
                "       GERANDO PIX TURBOFYPAY"
            );
            console.log(
                "=========================================="
            );
            console.log(
                "PEDIDO:",
                pedidoId
            );
            console.log(
                "VALOR:",
                valorNumerico
            );
            console.log(
                "CENTAVOS:",
                amountCents
            );
            console.log(
                "=========================================="
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

                                amountCents,

                                description:
                                    `Pedido ${pedidoId} - ${dadosProduto.nomeProduto}${dadosProduto.opcao ? ` ${dadosProduto.opcao}` : ""}`,

                                externalRef:
                                    pedidoId,

                                metadata: {

                                    pedidoId,

                                    produto:
                                        dadosProduto.nomeProduto,

                                    opcao:
                                        dadosProduto.opcao
                                }
                            })
                    }
                );


            const dados =
                await resposta.json();


            console.log(
                "RESPOSTA TURBOFYPAY:",
                JSON.stringify(
                    dados,
                    null,
                    2
                )
            );


            // ==========================================
            // ERRO TURBOFYPAY
            // ==========================================

            if (!resposta.ok) {

                console.error(
                    "ERRO TURBOFYPAY:",
                    dados
                );

                return res.status(
                    resposta.status
                ).json({

                    sucesso: false,

                    erro:
                        dados.message ||
                        dados.error ||
                        "Erro ao criar cobrança PIX."
                });
            }


            // ==========================================
            // VERIFICAR SE O PIX FOI GERADO
            // ==========================================

            if (
                !dados?.pix?.qrCode &&
                !dados?.pix?.copyPaste
            ) {

                console.error(
                    "TURBOFYPAY NÃO RETORNOU QR CODE OU PIX COPIA E COLA."
                );

                return res.status(502).json({

                    sucesso: false,

                    erro:
                        "A cobrança foi criada, mas a TurbofyPay não retornou os dados do PIX."
                });
            }


            // ==========================================
            // SALVAR DADOS DO PAGAMENTO
            // ==========================================

            const pedidosAtualizados =
                lerPedidos();

            const indicePedido =
                pedidosAtualizados.findIndex(
                    pedido =>
                        pedido.id ===
                        pedidoId
                );

            if (
                indicePedido !== -1
            ) {

                pedidosAtualizados[
                    indicePedido
                ].chargeId =
                    dados.id;

                pedidosAtualizados[
                    indicePedido
                ].statusPagamento =
                    dados.status ||
                    "PENDING";

                pedidosAtualizados[
                    indicePedido
                ].pix =
                    dados;

                salvarPedidos(
                    pedidosAtualizados
                );
            }


            // ==========================================
            // RESPOSTA PARA O SITE
            // ==========================================

            return res.json({

                sucesso: true,

                pedidoId,

                chargeId:
                    dados.id,

                qrCode:
                    dados?.pix?.qrCode ||
                    dados?.pix?.qr_code ||
                    "",

                copyPaste:
                    dados?.pix?.copyPaste ||
                    dados?.pix?.copy_paste ||
                    "",

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
                    "Erro interno ao gerar PIX."
            });
        }
    }
);


// ==========================================
// VERIFICAR STATUS DO PIX
// ==========================================

app.get(
    "/api/pagamento/status/:chargeId",
    async (req, res) => {

        const chargeId =
            req.params.chargeId;

        try {

            const resposta =
                await fetch(
                    `${TURBOFY_API}/sellers/pix/${chargeId}`,
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


            const dados =
                await resposta.json();


            console.log(
                "STATUS TURBOFYPAY:",
                JSON.stringify(
                    dados,
                    null,
                    2
                )
            );


            if (!resposta.ok) {

                return res.status(
                    resposta.status
                ).json({

                    sucesso: false,

                    erro:
                        dados.message ||
                        dados.error ||
                        "Erro ao consultar pagamento."
                });
            }


            const status =
                String(
                    dados.status ||
                    ""
                ).toUpperCase();


            const pedidos =
                lerPedidos();


            const indicePedido =
                pedidos.findIndex(
                    pedido =>
                        pedido.chargeId ===
                        chargeId
                );


            if (
                indicePedido === -1
            ) {

                return res.json({

                    sucesso: true,

                    status,

                    chargeId,

                    mensagem:
                        "Pagamento consultado, mas pedido não encontrado."
                });
            }


            const pedido =
                pedidos[
                    indicePedido
                ];


            // ==========================================
            // PAGAMENTO AINDA NÃO FOI PAGO
            // ==========================================

            if (
                status !== "PAID"
            ) {

                pedido.statusPagamento =
                    status;

                salvarPedidos(
                    pedidos
                );

                return res.json({

                    sucesso: true,

                    status,

                    chargeId
                });
            }


            // ==========================================
            // EVITAR PROCESSAMENTO DUPLICADO
            // ==========================================

            if (
                pedidosEmProcessamento.has(
                    pedido.id
                )
            ) {

                return res.json({

                    sucesso: true,

                    status: "PAID",

                    chargeId,

                    processando: true
                });
            }


            pedidosEmProcessamento.add(
                pedido.id
            );


            try {

                pedido.statusPagamento =
                    "PAID";

                pedido.status =
                    "PAGO";


                // ==========================================
                // CASO JÁ TENHA SIDO ENTREGUE
                // ==========================================

                if (
                    pedido.contaEntregue
                ) {

                    let emailEnviado =
                        pedido.emailEnviado ||
                        false;


                    if (
                        !emailEnviado
                    ) {

                        const entrega = {

                            email:
                                pedido.contaEmail ||
                                "",

                            senha:
                                pedido.contaSenha ||
                                ""
                        };


                        emailEnviado =
                            await enviarEmailProduto(
                                pedido,
                                entrega
                            );


                        pedido.emailEnviado =
                            emailEnviado;

                        pedido.emailEnviadoEm =
                            emailEnviado
                                ? new Date().toISOString()
                                : null;
                    }


                    salvarPedidos(
                        pedidos
                    );


                    return res.json({

                        sucesso: true,

                        status: "PAID",

                        chargeId,

                        entregue: true,

                        emailEnviado,

                        conta: {

                            email:
                                pedido.contaEmail,

                            senha:
                                pedido.contaSenha
                        }
                    });
                }


                // ==========================================
                // ENTREGAR CONTA
                // ==========================================

                const entrega =
                    entregarProduto(
                        pedido
                    );


                if (
                    !entrega.sucesso
                ) {

                    pedido.erroEntrega =
                        entrega.erro;

                    salvarPedidos(
                        pedidos
                    );

                    return res.status(500).json({

                        sucesso: false,

                        status: "PAID",

                        chargeId,

                        erro:
                            entrega.erro
                    });
                }


                // ==========================================
                // SALVAR CONTA NO PEDIDO
                // ==========================================

                pedido.contaEntregue =
                    true;

                pedido.contaEmail =
                    entrega.email;

                pedido.contaSenha =
                    entrega.senha;

                pedido.entregueEm =
                    new Date().toISOString();


                // ==========================================
                // ENVIAR EMAIL
                // ==========================================

                const emailEnviado =
                    await enviarEmailProduto(
                        pedido,
                        entrega
                    );

                pedido.emailEnviado =
                    emailEnviado;

                pedido.emailEnviadoEm =
                    emailEnviado
                        ? new Date().toISOString()
                        : null;


                salvarPedidos(
                    pedidos
                );


                return res.json({

                    sucesso: true,

                    status: "PAID",

                    chargeId,

                    entregue: true,

                    emailEnviado,

                    conta: {

                        email:
                            entrega.email,

                        senha:
                            entrega.senha
                    }
                });


            } finally {

                pedidosEmProcessamento.delete(
                    pedido.id
                );
            }


        } catch (erro) {

            console.error(
                "ERRO AO CONSULTAR PAGAMENTO:",
                erro
            );

            return res.status(500).json({

                sucesso: false,

                erro:
                    erro.message ||
                    "Erro ao consultar pagamento."
            });
        }
    }
);


// ==========================================
// TESTE DE EMAIL
// ==========================================

app.get(
    "/teste-email",
    async (req, res) => {

        try {

            const transporter =
                criarTransportador();

            if (!transporter) {

                return res.status(500).json({

                    sucesso: false,

                    erro:
                        "E-mail não configurado."
                });
            }


            await transporter.sendMail({

                from:
                    `"HYPE STORE" <${process.env.EMAIL_USUARIO}>`,

                to:
                    process.env.EMAIL_USUARIO,

                subject:
                    "Teste HYPE STORE",

                text:
                    "Teste de envio de e-mail da HYPE STORE funcionando."
            });


            res.json({

                sucesso: true,

                mensagem:
                    "E-mail de teste enviado."
            });


        } catch (erro) {

            console.error(
                "ERRO NO TESTE DE EMAIL:",
                erro
            );

            res.status(500).json({

                sucesso: false,

                erro:
                    erro.message
            });
        }
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
            "          HYPE STORE ONLINE"
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