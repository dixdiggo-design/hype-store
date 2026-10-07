require("dotenv").config();


const express = require("express");
const fs = require("fs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();

const PORT = process.env.PORT || 3000;

const CAMINHO_PEDIDOS = "./pedidos.json";
const CAMINHO_ESTOQUE = "./estoque.json";
const CAMINHO_TICKETS = "./tickets.json";
const CAMINHO_PRECOS = "./precos.json";

const TURBOFY_API =
    process.env.TURBOFY_API || "https://api.turbofypay.com";

const TURBOFY_CLIENT_ID =
    process.env.TURBOFY_CLIENT_ID ||
    process.env.TURBOFY_CLIENTID ||
    "";

const TURBOFY_CLIENT_SECRET =
    process.env.TURBOFY_CLIENT_SECRET ||
    process.env.TURBOFY_CLIENTSECRET ||
    "";
const ADMIN_PASSWORD = "apenasth";

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || "";
const discordClient = new Client({ intents: [GatewayIntentBits.Guilds] });

discordClient.once("ready", () => {
    console.log(`Discord conectado como ${discordClient.user.tag}`);
});

discordClient.on("error", erro => {
    console.error("Erro no bot Discord:", erro.message);
});

if (DISCORD_BOT_TOKEN) {
    discordClient.login(DISCORD_BOT_TOKEN).catch(erro => {
        console.error("Erro ao conectar bot Discord:", erro.message);
    });
} else {
    console.error("DISCORD_BOT_TOKEN não configurado.");
}
const EMAIL_USUARIO = process.env.EMAIL_USUARIO || "";
const EMAIL_SENHA_APP = process.env.EMAIL_SENHA_APP || "";

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

/*
   BLOQUEIA ARQUIVOS PRIVADOS ANTES DO EXPRESS.STATIC
*/
app.use((req, res, next) => {
    const caminho = String(req.path || "").toLowerCase();

    const arquivosPrivados = [
        "/tickets.json",
        "/pedidos.json",
        "/estoque.json",
        "/.env"
    ];

    if (arquivosPrivados.includes(caminho)) {
        return res.status(403).json({
            sucesso: false,
            erro: "Acesso nÃ£o permitido."
        });
    }

    next();
});


/* =========================================================
   HYPE-ROTA-ATENDIMENTO-FINAL
   Rota direta para mensagens do cliente
   ========================================================= */

app.post("/api/tickets/:id/mensagens", (req, res) => {

    impedirCachePrivado(res);

    try {

        const id = String(req.params.id || "").trim();

        const token = String(
            req.body?.token || ""
        ).trim();

        const texto = String(
            req.body?.texto ||
            req.body?.mensagem ||
            ""
        ).trim();

        if (!id) {
            return res.status(400).json({
                sucesso: false,
                erro: "ID do atendimento não informado."
            });
        }

        if (!token) {
            return res.status(401).json({
                sucesso: false,
                erro: "Token do atendimento não informado."
            });
        }

        if (!texto) {
            return res.status(400).json({
                sucesso: false,
                erro: "Digite uma mensagem."
            });
        }

        const dados = lerTickets();

        const tickets = Array.isArray(dados)
            ? dados
            : Array.isArray(dados?.tickets)
                ? dados.tickets
                : [];

        const ticket = tickets.find(
            item => String(item.id) === id
        );

        if (!ticket) {
            return res.status(404).json({
                sucesso: false,
                erro: "Atendimento não encontrado."
            });
        }

        if (
            String(ticket.token || "").trim() !== token
        ) {
            return res.status(403).json({
                sucesso: false,
                erro: "Token do atendimento inválido."
            });
        }

        const status = String(
            ticket.status || ""
        ).trim().toUpperCase();

        if (
            status === "FECHADO" ||
            status === "RESOLVIDO"
        ) {
            return res.status(409).json({
                sucesso: false,
                fechado: true,
                mensagem:
                    "Este atendimento está fechado. Abra um novo atendimento para continuar."
            });
        }

        if (!Array.isArray(ticket.mensagens)) {
            ticket.mensagens = [];
        }

        const agora = new Date().toISOString();

        ticket.mensagens.push({
            id: crypto
                .randomBytes(8)
                .toString("hex"),

            autor: "cliente",

            texto: texto,

            criadoEm: agora
        });

        ticket.atualizadoEm = agora;

        if (
            !ticket.status ||
            status === "RESOLVIDO"
        ) {
            ticket.status = "ABERTO";
        }

        salvarJSON(
            CAMINHO_TICKETS,
            Array.isArray(dados)
                ? tickets
                : {
                    ...dados,
                    tickets: tickets
                }
        );

        const ticketPublico = {
            ...ticket
        };

        delete ticketPublico.token;

        return res.json({
            sucesso: true,
            mensagem: "Mensagem enviada com sucesso.",
            ticket: ticketPublico
        });

    } catch (erro) {

        console.error(
            "HYPE - Erro ao enviar mensagem:",
            erro
        );

        return res.status(500).json({
            sucesso: false,
            erro:
                erro.message ||
                "Erro interno ao enviar mensagem."
        });
    }

});

/* =========================================================
   FIM HYPE-ROTA-ATENDIMENTO-FINAL
   ========================================================= */

/* =========================================================
   HYPE_CORRECAO_MENSAGEM_ADMIN_FINAL
   ENVIO CLIENTE -> TICKETS.JSON -> ADMIN
   ========================================================= */

app.post("/api/tickets/:id/mensagens", (req, res, next) => {

    try {

        const id = String(req.params.id || "").trim();

        const tokenRecebido = String(
            req.body?.token ||
            req.query?.token ||
            ""
        ).trim();

        const textoRecebido = String(
            req.body?.texto ??
            req.body?.mensagem ??
            ""
        ).trim();

        if (!id) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "ID do ticket não informado."
            });
        }

        if (!tokenRecebido) {
            return res.status(401).json({
                sucesso: false,
                mensagem: "Token do ticket não informado."
            });
        }

        if (!textoRecebido) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Digite uma mensagem."
            });
        }

        const tickets = lerTickets();

        const indice = tickets.findIndex(
            item => String(item.id) === id
        );

        if (indice === -1) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Ticket não encontrado."
            });
        }

        const ticket = tickets[indice];

        if (
            String(ticket.token || "").trim() !==
            tokenRecebido
        ) {
            return res.status(403).json({
                sucesso: false,
                mensagem: "Token do ticket inválido."
            });
        }

        if (
            String(ticket.status || "")
                .trim()
                .toLowerCase() === "fechado"
        ) {
            return res.status(409).json({
                sucesso: false,
                fechado: true,
                mensagem:
                    "Este ticket está fechado. Abra um novo ticket para continuar o atendimento."
            });
        }

        if (!Array.isArray(ticket.mensagens)) {
            ticket.mensagens = [];
        }

        const agora = new Date().toISOString();

        const novaMensagem = {
            id: crypto.randomBytes(8).toString("hex"),
            autor: "cliente",
            texto: textoRecebido,
            criadoEm: agora
        };

        ticket.mensagens.push(novaMensagem);

        ticket.atualizadoEm = agora;

        if (!ticket.status) {
            ticket.status = "ABERTO";
        }

        tickets[indice] = ticket;

        salvarTickets(tickets);

        console.log(
            "[SUPORTE] Mensagem recebida no ticket " +
            ticket.id +
            ": " +
            textoRecebido
        );

        return res.status(200).json({
            sucesso: true,
            mensagem: "Mensagem enviada com sucesso.",
            ticket: {
                id: ticket.id,
                nome: ticket.nome,
                email: ticket.email,
                discord: ticket.discord,
                assunto: ticket.assunto,
                status: ticket.status,
                criadoEm: ticket.criadoEm,
                atualizadoEm: ticket.atualizadoEm,
                mensagens: ticket.mensagens
            }
        });

    } catch (erro) {

        console.error(
            "[SUPORTE] Erro ao salvar mensagem:",
            erro
        );

        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno ao salvar a mensagem.",
            erro: erro.message
        });
    }

});

/* =========================================================
   FIM HYPE_CORRECAO_MENSAGEM_ADMIN_FINAL
   ========================================================= */
app.use(express.static(__dirname));
/* ===== BLOQUEIO FINAL - TICKET FECHADO ===== */
app.use(async (req, res, next) => {
    try {
        if (req.method !== "POST") return next();

        const match = req.path.match(/^\/api\/tickets\/([^\/]+)\/mensagens$/);
        if (!match) return next();

        const ticketId = decodeURIComponent(match[1]);
        const dados = lerTickets();

        const lista = Array.isArray(dados)
            ? dados
            : Array.isArray(dados?.tickets)
                ? dados.tickets
                : [];

        const ticket = lista.find(t => String(t.id) === String(ticketId));

        if (!ticket) return next();

        const status = String(ticket.status || "")
            .trim()
            .toLowerCase();

        if (
            status === "resolvido" ||
            status === "resolvida" ||
            status === "fechado" ||
            status === "fechada" ||
            status === "closed"
        ) {
            return res.status(409).json({
                sucesso: false,
                fechado: true,
                mensagem: "Este ticket foi fechado pelo administrador. Crie um novo ticket para continuar o atendimento."
            });
        }

        next();
    } catch (erro) {
        console.error("Erro no bloqueio final do ticket:", erro);
        next();
    }
});
/* ===== FIM DO BLOQUEIO FINAL ===== */

/* =========================================================
   SESSÃ•ES ADMIN
========================================================= */

const sessoesAdmin = new Map();

const TEMPO_SESSAO = 12 * 60 * 60 * 1000;

function gerarTokenSessao() {
    return crypto.randomBytes(32).toString("hex");
}

/*
   Extrai cookie manualmente.
*/
function obterCookie(req, nome) {
    const cookies = req.headers.cookie;

    if (!cookies) return null;

    const partes = cookies.split(";");

    for (const parte of partes) {
        const [chave, ...valor] = parte.trim().split("=");

        if (chave === nome) {
            return decodeURIComponent(valor.join("="));
        }
    }

    return null;
}

function autenticarAdmin(req, res, next) {
    const token = obterCookie(req, "admin_token");

    if (!token) {
        return res.status(401).json({
            sucesso: false,
            erro: "NÃ£o autenticado."
        });
    }

    const sessao = sessoesAdmin.get(token);

    if (!sessao) {
        return res.status(401).json({
            sucesso: false,
            erro: "SessÃ£o invÃ¡lida."
        });
    }

    if (Date.now() > sessao.expiraEm) {
        sessoesAdmin.delete(token);

        return res.status(401).json({
            sucesso: false,
            erro: "SessÃ£o expirada."
        });
    }

    next();
}

function verificarSessaoAdmin(req) {
    const token = obterCookie(req, "admin_token");

    if (!token) return false;

    const sessao = sessoesAdmin.get(token);

    if (!sessao) return false;

    if (Date.now() > sessao.expiraEm) {
        sessoesAdmin.delete(token);
        return false;
    }

    return true;
}


function exigirSessaoAdmin(req, res, next) {
    if (!verificarSessaoAdmin(req)) {
        return res.status(401).json({
            sucesso: false,
            erro: "NÃ£o autorizado."
        });
    }

    next();
}
/* =========================================================
   ARQUIVOS JSON
========================================================= */

function lerJSON(caminho, valorPadrao) {
    try {
        if (!fs.existsSync(caminho)) {
            fs.writeFileSync(
                caminho,
                JSON.stringify(valorPadrao, null, 2),
                "utf8"
            );

            return valorPadrao;
        }

        const conteudo = fs.readFileSync(caminho, "utf8").trim();

        if (!conteudo) {
            fs.writeFileSync(
                caminho,
                JSON.stringify(valorPadrao, null, 2),
                "utf8"
            );

            return valorPadrao;
        }

        return JSON.parse(conteudo);
    } catch (erro) {
        console.error(`Erro ao ler ${caminho}:`, erro);

        return valorPadrao;
    }
}

function salvarJSON(caminho, dados) {
    fs.writeFileSync(
        caminho,
        JSON.stringify(dados, null, 2),
        "utf8"
    );
}

/* =========================================================
   PEDIDOS
========================================================= */

function lerPedidos() {
    const dados = lerJSON(CAMINHO_PEDIDOS, []);

    if (Array.isArray(dados)) {
        return dados;
    }

    if (
        dados &&
        Array.isArray(dados.pedidos)
    ) {
        return dados.pedidos;
    }

    return [];
}

function salvarPedidos(pedidos) {
    salvarJSON(
        CAMINHO_PEDIDOS,
        Array.isArray(pedidos) ? pedidos : []
    );
}

function gerarIdPedido() {
    return `PED-${Date.now()}-${crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase()}`;
}

function encontrarPedido(id) {
    const pedidos = lerPedidos();

    return pedidos.find(
        pedido => String(pedido.id) === String(id)
    );
}

function atualizarPedido(id, alteracoes) {
    const pedidos = lerPedidos();

    const indice = pedidos.findIndex(
        pedido => String(pedido.id) === String(id)
    );

    if (indice === -1) {
        return null;
    }

    pedidos[indice] = {
        ...pedidos[indice],
        ...alteracoes
    };

    salvarPedidos(pedidos);

    return pedidos[indice];
}

/* =========================================================
   ESTOQUE
========================================================= */

function lerEstoque() {
    const dados = lerJSON(CAMINHO_ESTOQUE, {
        "Nitro Discord Mensal": [],
        "Nitro Discord Anual": []
    });

    if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
        return {
            "Nitro Discord Mensal": [],
            "Nitro Discord Anual": []
        };
    }

    return dados;
}

function salvarEstoque(estoque) {
    salvarJSON(CAMINHO_ESTOQUE, estoque);
}

function obterDadosProduto(produto, opcao) {
    const estoque = lerEstoque();

    if (produto === "Nitro Discord") {
        if (
            String(opcao).toLowerCase() === "mensal"
        ) {
            return {
                chave: "Nitro Discord Mensal",
                itens: estoque["Nitro Discord Mensal"] || []
            };
        }

        if (
            String(opcao).toLowerCase() === "anual"
        ) {
            return {
                chave: "Nitro Discord Anual",
                itens: estoque["Nitro Discord Anual"] || []
            };
        }
    }

    if (estoque[produto]) {
        return {
            chave: produto,
            itens: estoque[produto]
        };
    }

    return {
        chave: produto,
        itens: []
    };
}

function encontrarEstoqueDisponivel(produto, opcao) {
    const dados = obterDadosProduto(produto, opcao);

    const indice = dados.itens.findIndex(item => {
        return (
            !item.status ||
            String(item.status).toLowerCase() === "disponivel"
        );
    });

    if (indice === -1) {
        return null;
    }

    return {
        chave: dados.chave,
        indice,
        item: dados.itens[indice]
    };
}

function entregarProduto(pedido) {
    const estoque = lerEstoque();

    const dados = obterDadosProduto(
        pedido.produto,
        pedido.opcao
    );

    if (!estoque[dados.chave]) {
        return {
            sucesso: false,
            erro: "Produto nÃ£o encontrado no estoque."
        };
    }

    const indice = estoque[dados.chave].findIndex(item => {
        return (
            !item.status ||
            String(item.status).toLowerCase() === "disponivel"
        );
    });

    if (indice === -1) {
        return {
            sucesso: false,
            erro: "Produto sem estoque."
        };
    }

    const item = estoque[dados.chave][indice];

    estoque[dados.chave][indice] = {
        ...item,
        status: "vendida",
        vendidaEm: new Date().toISOString(),
        pedidoId: pedido.id
    };

    salvarEstoque(estoque);

    return {
        sucesso: true,
        dados: item
    };
}

/* =========================================================
   E-MAIL
========================================================= */

let transporter = null;

if (EMAIL_USUARIO && EMAIL_SENHA_APP) {
    transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: EMAIL_USUARIO,
            pass: EMAIL_SENHA_APP
        }
    });
}

async function enviarEmailEntrega(pedido, dadosProduto) {
    if (!transporter) {
        throw new Error("E-mail nÃ£o configurado.");
    }

    const destinatario = pedido.email;

    if (!destinatario) {
        throw new Error("Pedido sem e-mail.");
    }

    const emailProduto =
        dadosProduto.email ||
        dadosProduto.usuario ||
        "";

    const senhaProduto =
        dadosProduto.senha ||
        "";

    const html = `
        <div style="font-family:Arial,sans-serif;background:#111;color:#fff;padding:30px">
            <div style="max-width:600px;margin:auto;background:#1a1a1a;padding:30px;border-radius:15px">
                <h1 style="color:#9b59ff">HYPE STORE</h1>

                <h2>Pagamento aprovado!</h2>

                <p>OlÃ¡!</p>

                <p>
                    Seu pedido <strong>${pedido.id}</strong> foi aprovado.
                </p>

                <hr style="border-color:#333">

                <h3>Produto</h3>

                <p>
                    <strong>${pedido.produto}</strong>
                    ${pedido.opcao ? `- ${pedido.opcao}` : ""}
                </p>

                <h3>Dados da conta</h3>

                <div style="background:#0d0d0d;padding:20px;border-radius:10px">
                    <p>
                        <strong>E-mail/UsuÃ¡rio:</strong><br>
                        ${emailProduto || "NÃ£o informado"}
                    </p>

                    <p>
                        <strong>Senha:</strong><br>
                        ${senhaProduto || "NÃ£o informada"}
                    </p>
                </div>

                <br>

                <p>
                    Obrigado por comprar na HYPE STORE!
                </p>
            </div>
        </div>
    `;

    await transporter.sendMail({
        from: `"HYPE STORE" <${EMAIL_USUARIO}>`,
        to: destinatario,
        subject: `HYPE STORE - Pedido ${pedido.id} aprovado`,
        html
    });
}

/* =========================================================
   ENTREGA AUTOMÃTICA
========================================================= */

const pedidosEmProcessamento = new Set();

async function enviarDiscordEntrega(pedido, dadosProduto) {
    if (!DISCORD_BOT_TOKEN) {
        throw new Error("DISCORD_BOT_TOKEN não configurado.");
    }

    const discordId = String(pedido.discord || "").trim();

    if (!/^\d{17,20}$/.test(discordId)) {
        throw new Error("ID do Discord inválido.");
    }

    if (!discordClient.isReady()) {
        throw new Error("Bot do Discord ainda não está conectado.");
    }

    const usuario = await discordClient.users.fetch(discordId);

    const emailProduto =
        dadosProduto.email ||
        dadosProduto.usuario ||
        "";

    const senhaProduto =
        dadosProduto.senha ||
        "";

    await usuario.send({
        content:
`🛒 **HYPE STORE — PEDIDO APROVADO**

Seu pagamento foi confirmado!

**Produto:** ${pedido.produto}
**Plano:** ${pedido.opcao || "Não informado"}
**Pedido:** ${pedido.id}

🔐 **Dados da sua conta**

**E-mail/Usuário:** \`${emailProduto || "Não informado"}\`
**Senha:** \`${senhaProduto || "Não informada"}\`

Obrigado por comprar na **HYPE STORE**!`
    });
}
async function processarPedidoPago(pedido) {
    if (!pedido) return;

    if (pedido.statusPagamento !== "PAID") {
        return;
    }

    if (pedidosEmProcessamento.has(pedido.id)) {
        return;
    }

    pedidosEmProcessamento.add(pedido.id);

    try {
        let pedidoAtual = encontrarPedido(pedido.id);

        if (!pedidoAtual) {
            return;
        }

        let dadosEntrega = pedidoAtual.dadosEntrega || null;

        if (!dadosEntrega) {
            const entrega = entregarProduto(pedidoAtual);

            if (!entrega.sucesso) {
                atualizarPedido(
                    pedidoAtual.id,
                    {
                        status: "PAGO_SEM_ESTOQUE",
                        erroEntrega: entrega.erro
                    }
                );

                console.error(
                    `Pedido ${pedidoAtual.id}:`,
                    entrega.erro
                );

                return;
            }

            dadosEntrega = entrega.dados;

            pedidoAtual = atualizarPedido(
                pedidoAtual.id,
                {
                    dadosEntrega,
                    entregue: true,
                    status: "PAGO"
                }
            );
        }

        let discordOk = pedidoAtual.discordEnviado === true;
        let emailOk = pedidoAtual.emailEnviado === true;

        if (!discordOk) {
            try {
                await enviarDiscordEntrega(
                    pedidoAtual,
                    dadosEntrega
                );

                atualizarPedido(
                    pedidoAtual.id,
                    {
                        discordEnviado: true,
                        discordEnviadoEm: new Date().toISOString(),
                        erroDiscord: null
                    }
                );

                discordOk = true;

                console.log(
                    `Pedido ${pedidoAtual.id}: entrega enviada por DM no Discord.`
                );

            } catch (erroDiscord) {
                console.error(
                    `Erro ao enviar DM do pedido ${pedidoAtual.id}:`,
                    erroDiscord.message
                );

                atualizarPedido(
                    pedidoAtual.id,
                    {
                        erroDiscord: erroDiscord.message
                    }
                );
            }
        }

        if (!emailOk) {
            try {
                await enviarEmailEntrega(
                    pedidoAtual,
                    dadosEntrega
                );

                atualizarPedido(
                    pedidoAtual.id,
                    {
                        emailEnviado: true,
                        emailEnviadoEm: new Date().toISOString(),
                        erroEmail: null
                    }
                );

                emailOk = true;

                console.log(
                    `Pedido ${pedidoAtual.id}: entrega enviada por e-mail.`
                );

            } catch (erroEmail) {
                console.error(
                    `Erro ao enviar e-mail do pedido ${pedidoAtual.id}:`,
                    erroEmail.message
                );

                atualizarPedido(
                    pedidoAtual.id,
                    {
                        erroEmail: erroEmail.message
                    }
                );
            }
        }

        if (discordOk && emailOk) {
            atualizarPedido(
                pedidoAtual.id,
                {
                    entregue: true,
                    status: "ENTREGUE"
                }
            );
        } else if (discordOk || emailOk) {
            atualizarPedido(
                pedidoAtual.id,
                {
                    entregue: true,
                    status: "ENTREGA_PARCIAL"
                }
            );
        } else {
            atualizarPedido(
                pedidoAtual.id,
                {
                    status: "PAGO_ENTREGA_PENDENTE"
                }
            );
        }

    } finally {
        pedidosEmProcessamento.delete(pedido.id);
    }
}
/* =========================================================
   STATUS
========================================================= */

app.post("/api/admin/reentregar/:pedidoId", async (req, res) => {
    try {
        const pedido = encontrarPedido(req.params.pedidoId);

        if (!pedido) {
            return res.status(404).json({
                sucesso: false,
                erro: "Pedido não encontrado."
            });
        }

        if (pedido.statusPagamento !== "PAID") {
            return res.status(400).json({
                sucesso: false,
                erro: "Este pedido ainda não está pago."
            });
        }

        await processarPedidoPago(pedido);

        const pedidoAtualizado = encontrarPedido(pedido.id);

        return res.json({
            sucesso: true,
            pedido: pedidoAtualizado
        });

    } catch (erro) {
        console.error("Erro ao reentregar pedido:", erro);

        return res.status(500).json({
            sucesso: false,
            erro: erro.message
        });
    }
});
app.get("/api/status", (req, res) => {
    res.json({
        online: true,
        mensagem: "Servidor da HYPE STORE funcionando!",
        turbofy: TURBOFY_API,
        estoque: CAMINHO_ESTOQUE,
        pedidos: CAMINHO_PEDIDOS,
        tickets: CAMINHO_TICKETS
    });
});

/* =========================================================
   ESTOQUE API
========================================================= */

app.get("/api/estoque/:produto", (req, res) => {
    const produto = decodeURIComponent(req.params.produto);

    const estoque = lerEstoque();

    const itens = estoque[produto] || [];

    const disponiveis = itens.filter(item => {
        return (
            !item.status ||
            String(item.status).toLowerCase() === "disponivel"
        );
    });

    res.json({
        sucesso: true,
        produto,
        estoque: disponiveis.length
    });
});

/* =========================================================
   PEDIDOS
========================================================= */

app.post("/api/pedidos", (req, res) => {

    const discordId = String(req.body.discord || "").trim();

    if (!/^\d{17,20}$/.test(discordId)) {
        return res.status(400).json({
            sucesso: false,
            erro: "Informe um ID de usuário do Discord válido."
        });
    }
    try {
        const {
            nome,
            email,
            discord,
            produto,
            opcao,
            valor
        } = req.body || {};

        if (!email) {
            return res.status(400).json({
                sucesso: false,
                erro: "E-mail Ã© obrigatÃ³rio."
            });
        }

        if (!produto) {
            return res.status(400).json({
                sucesso: false,
                erro: "Produto Ã© obrigatÃ³rio."
            });
        }

        // BLOQUEIO DE COMPRA SEM ESTOQUE
        const dadosEstoque = obterDadosProduto(produto, opcao);

        if (!dadosEstoque || !dadosEstoque.chave) {
            return res.status(400).json({
                sucesso: false,
                erro: "Produto ou opção inválida."
            });
        }

        const existeEstoque = Array.isArray(dadosEstoque.itens) &&
            dadosEstoque.itens.some(item =>
                !item.status ||
                String(item.status).toLowerCase() === "disponivel"
            );

        if (!existeEstoque) {
            return res.status(400).json({
                sucesso: false,
                erro: "Produto sem estoque no momento."
            });
        }
        const pedido = {
            id: gerarIdPedido(),
            nome: nome || "",
            email,
            discord: discord || "",
            produto,
            opcao: opcao || "",
            valor: Number(valor) || 0,
            status: "AGUARDANDO_PAGAMENTO",
            statusPagamento: "PENDING",
            criadoEm: new Date().toISOString(),
            atualizadoEm: new Date().toISOString(),
            entregue: false,
            emailEnviado: false
        };

        const pedidos = lerPedidos();

        pedidos.push(pedido);

        salvarPedidos(pedidos);

        res.json({
            sucesso: true,
            pedido
        });
    } catch (erro) {
        console.error(
            "Erro ao criar pedido:",
            erro
        );

        res.status(500).json({
            sucesso: false,
            erro: "Erro interno ao criar pedido."
        });
    }
});

app.get("/api/pedidos/:id", (req, res) => {
    const pedido = encontrarPedido(req.params.id);

    if (!pedido) {
        return res.status(404).json({
            sucesso: false,
            erro: "Pedido nÃ£o encontrado."
        });
    }

    res.json({
        sucesso: true,
        pedido
    });
});

/* =========================================================
   TURBOFYPAY - CRIAR PIX
========================================================= */

app.post("/api/pagamento/pix", async (req, res) => {
    try {
        const {
            pedidoId,
            valor,
            produto,
            opcao
        } = req.body || {};

        if (!pedidoId) {
            return res.status(400).json({
                sucesso: false,
                erro: "pedidoId Ã© obrigatÃ³rio."
            });
        }

        if (
            !TURBOFY_CLIENT_ID ||
            !TURBOFY_CLIENT_SECRET
        ) {
            return res.status(500).json({
                sucesso: false,
                erro: "Credenciais da TurbofyPay nÃ£o configuradas."
            });
        }

        const valorNumerico = Number(valor);

        if (!Number.isFinite(valorNumerico)) {
            return res.status(400).json({
                sucesso: false,
                erro: "Valor invÃ¡lido."
            });
        }

        if (valorNumerico < 0.50) {
            return res.status(400).json({
                sucesso: false,
                erro: "O valor mÃ­nimo do pagamento Ã© R$ 1,50"
            });
        }

        const pedido = encontrarPedido(pedidoId);

        if (!pedido) {
            return res.status(404).json({
                sucesso: false,
                erro: "Pedido nÃ£o encontrado."
            });
        }

        const amountCents = Math.round(
            valorNumerico * 100
        );

        const idempotencyKey =
            `${pedidoId}-${Date.now()}`;

        const resposta = await fetch(
            `${TURBOFY_API}/sellers/pix`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "x-client-id": TURBOFY_CLIENT_ID,
                    "x-client-secret": TURBOFY_CLIENT_SECRET,
                    "x-idempotency-key": idempotencyKey
                },

                body: JSON.stringify({
                    amountCents,

                    description:
                        `Pedido ${pedidoId} - ${produto || pedido.produto} ${opcao || pedido.opcao || ""}`,

                    externalRef: pedidoId,

                    metadata: {
                        pedidoId,
                        produto: produto || pedido.produto,
                        opcao: opcao || pedido.opcao || ""
                    }
                })
            }
        );

        const texto = await resposta.text(); console.log("========== TURBOFY STATUS DEBUG =========="); console.log("CHARGE ID:", chargeId); console.log("STATUS HTTP:", resposta.status); console.log("RESPOSTA STATUS COMPLETA:", texto); console.log("==========================================");

        let dados;

        try {
            dados = JSON.parse(texto);
        } catch {
            dados = {
                raw: texto
            };
        }

        if (!resposta.ok) {
            console.error(
                "Erro TurbofyPay:",
                resposta.status,
                dados
            );

            return res.status(resposta.status).json({
                sucesso: false,
                erro:
                    dados?.message ||
                    dados?.error ||
                    "Erro ao criar pagamento.",
                detalhes: dados
            });
        }

        console.log("RESPOSTA TURBOFY COMPLETA:", JSON.stringify(dados, null, 2));

        const chargeId =
            dados.chargeId ||
            dados.id ||
            dados.charge?.id ||
            dados.data?.chargeId ||
            dados.data?.id;

        const copyPaste =
            dados.pix?.copyPaste ||
            dados.copyPaste ||
            dados.pixCopyPaste ||
            dados.data?.pix?.copyPaste ||
            "";

        const qrCode =
            dados.pix?.qrCode ||
            dados.qrCode ||
            dados.pix?.qr_code ||
            dados.qr_code ||
            dados.data?.pix?.qrCode ||
            dados.data?.qrCode ||
            "";

        const expiresAt =
            dados.expiresAt ||
            dados.pix?.expiresAt ||
            dados.data?.expiresAt ||
            null;

        if (!chargeId) {
            console.error(
                "TurbofyPay nÃ£o retornou chargeId:",
                dados
            );

            return res.status(500).json({
                sucesso: false,
                erro: "A TurbofyPay nÃ£o retornou o ID da cobranÃ§a.",
                detalhes: dados
            });
        }

        atualizarPedido(
            pedidoId,
            {
                chargeId,
                copyPaste,
                qrCode,
                expiresAt,
                valor: valorNumerico,
                statusPagamento: "PENDING",
                status: "AGUARDANDO_PAGAMENTO",
                atualizadoEm: new Date().toISOString()
            }
        );

        res.json({
            sucesso: true,
            pedidoId,
            chargeId,
            copyPaste,
            qrCode,
            expiresAt,
            status: "PENDING"
        });
    } catch (erro) {
        console.error(
            "Erro ao criar PIX:",
            erro
        );

        res.status(500).json({
            sucesso: false,
            erro: "Erro interno ao criar pagamento PIX.",
            detalhes: erro.message
        });
    }
});

/* =========================================================
   TURBOFYPAY - CONSULTAR PAGAMENTO
========================================================= */

app.get(
    "/api/pagamento/status/:chargeId",
    async (req, res) => {
        try {

        const chargeId = req.params.chargeId;

            if (
                !TURBOFY_CLIENT_ID ||
                !TURBOFY_CLIENT_SECRET
            ) {
                return res.status(500).json({
                    sucesso: false,
                    erro: "Credenciais da TurbofyPay nÃ£o configuradas."
                });
            }

            const resposta = await fetch(
                `${TURBOFY_API}/sellers/pix/${encodeURIComponent(chargeId)}`,
                {
                    method: "GET",

                    headers: {
                        "x-client-id": TURBOFY_CLIENT_ID,
                        "x-client-secret": TURBOFY_CLIENT_SECRET
                    }
                }
            );

            const texto = await resposta.text(); console.log("========== TURBOFY STATUS DEBUG =========="); console.log("CHARGE ID:", chargeId); console.log("STATUS HTTP:", resposta.status); console.log("RESPOSTA STATUS COMPLETA:", texto); console.log("==========================================");

            let dados;

            try {
                dados = JSON.parse(texto);
            } catch {
                dados = {
                    raw: texto
                };
            }

            if (!resposta.ok) {
                return res.status(resposta.status).json({
                    sucesso: false,
                    erro:
                        dados?.message ||
                        dados?.error ||
                        "Erro ao consultar pagamento.",
                    detalhes: dados
                });
            }

            const status = String(
                dados.status ||
                dados.data?.status ||
                dados.charge?.status ||
                ""
            ).toUpperCase();

            const pedido = lerPedidos().find(
                item =>
                    String(item.chargeId) ===
                    String(chargeId)
            );

            if (pedido) {
                if (status === "PAID") {
                    atualizarPedido(
                        pedido.id,
                        {
                            statusPagamento: "PAID",
                            status: "PAGO",
                            atualizadoEm:
                                new Date().toISOString()
                        }
                    );

                    const pedidoAtualizado =
                        encontrarPedido(pedido.id);

                    await processarPedidoPago(
                        pedidoAtualizado
                    );
                } else {
                    atualizarPedido(
                        pedido.id,
                        {
                            statusPagamento:
                                status || "PENDING",
                            atualizadoEm:
                                new Date().toISOString()
                        }
                    );
                }
            }

            const pedidoFinal =
                pedido
                    ? encontrarPedido(pedido.id)
                    : null;

            res.json({
                sucesso: true,
                chargeId,
                status,
                pedidoId: pedidoFinal?.id || null,
                pedido: pedidoFinal || null,
                dados
            });
        } catch (erro) {
            console.error(
                "Erro ao consultar PIX:",
                erro
            );

            res.status(500).json({
                sucesso: false,
                erro: "Erro interno ao consultar pagamento.",
                detalhes: erro.message
            });
        }
    }
);

/* =========================================================
   MONITORAMENTO AUTOMÃTICO DOS PEDIDOS
========================================================= */

async function verificarPagamentosAutomaticamente() {
    try {
        const pedidos = lerPedidos();

        for (const pedido of pedidos) {
            if (
                !pedido.chargeId ||
                pedido.statusPagamento === "PAID"
            ) {
                continue;
            }

            try {
                const resposta = await fetch(
                    `${TURBOFY_API}/sellers/pix/${encodeURIComponent(pedido.chargeId)}`,
                    {
                        method: "GET",

                        headers: {
                            "x-client-id": TURBOFY_CLIENT_ID,
                            "x-client-secret": TURBOFY_CLIENT_SECRET
                        }
                    }
                );

                if (!resposta.ok) {
                    continue;
                }

                const dados = await resposta.json();

                const status = String(
                    dados.status ||
                    dados.data?.status ||
                    dados.charge?.status ||
                    ""
                ).toUpperCase();

                if (!status) {
                    continue;
                }

                if (status === "PAID") {
                    atualizarPedido(
                        pedido.id,
                        {
                            statusPagamento: "PAID",
                            status: "PAGO",
                            atualizadoEm:
                                new Date().toISOString()
                        }
                    );

                    await processarPedidoPago(
                        encontrarPedido(pedido.id)
                    );
                } else {
                    atualizarPedido(
                        pedido.id,
                        {
                            statusPagamento: status,
                            atualizadoEm:
                                new Date().toISOString()
                        }
                    );
                }
            } catch (erro) {
                console.error(
                    `Erro verificando pedido ${pedido.id}:`,
                    erro.message
                );
            }
        }
    } catch (erro) {
        console.error(
            "Erro no monitoramento:",
            erro
        );
    }
}

setInterval(
    verificarPagamentosAutomaticamente,
    10000
);

/* =========================================================
   ADMIN - LOGIN
========================================================= */

app.post("/api/admin/login", (req, res) => {
    try {
        const { senha } = req.body || {};

        if (!ADMIN_PASSWORD) {
            return res.status(500).json({
                sucesso: false,
                erro: "Senha administrativa nÃ£o configurada."
            });
        }

        if (
            typeof senha !== "string" ||
            senha !== ADMIN_PASSWORD
        ) {
            return res.status(401).json({
                sucesso: false,
                erro: "Senha incorreta."
            });
        }

        const token = gerarTokenSessao();

        sessoesAdmin.set(token, {
            criadoEm: Date.now(),
            expiraEm: Date.now() + TEMPO_SESSAO
        });

        res.setHeader(
            "Set-Cookie",
            [
                `admin_token=${encodeURIComponent(token)}`,
                "HttpOnly",
                "Path=/",
                "SameSite=Lax",
                `Max-Age=${Math.floor(TEMPO_SESSAO / 1000)}`
            ].join("; ")
        );

        res.json({
            sucesso: true,
            mensagem: "Login realizado."
        });
    } catch (erro) {
        console.error(
            "Erro login admin:",
            erro
        );

        res.status(500).json({
            sucesso: false,
            erro: "Erro interno."
        });
    }
});

app.post("/api/admin/logout", (req, res) => {
    const token = obterCookie(
        req,
        "admin_token"
    );

    if (token) {
        sessoesAdmin.delete(token);
    }

    res.setHeader(
        "Set-Cookie",
        [
            "admin_token=",
            "HttpOnly",
            "Path=/",
            "SameSite=Lax",
            "Max-Age=0"
        ].join("; ")
    );

    res.json({
        sucesso: true
    });
});

app.get("/api/admin/me", (req, res) => {
    const autenticado =
        verificarSessaoAdmin(req);

    res.json({
        autenticado
    });
});

/* =========================================================
   TICKETS
========================================================= */

/*
   O tickets.json usa:

   {
       "tickets": []
   }

   A funÃ§Ã£o abaixo converte isso para o array
   utilizado pelas rotas.
*/
function lerPrecos() {
    const padrao = {
        "Nitro Discord Mensal": 5.00,
        "Nitro Discord Anual": 40.00
    };

    const dados = lerJSON(CAMINHO_PRECOS, padrao);

    if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
        return padrao;
    }

    const mensal = Number(dados["Nitro Discord Mensal"]);
    const anual = Number(dados["Nitro Discord Anual"]);

    return {
        "Nitro Discord Mensal": Number.isFinite(mensal) && mensal > 0 ? mensal : 5.00,
        "Nitro Discord Anual": Number.isFinite(anual) && anual > 0 ? anual : 40.00
    };
}

function salvarPrecos(precos) {
    salvarJSON(CAMINHO_PRECOS, precos);
}

function normalizarProdutoEstoque(produto) {
    const p = String(produto || "").trim().toLowerCase();

    if (["mensal", "nitro mensal", "nitro discord mensal"].includes(p)) {
        return "Nitro Discord Mensal";
    }

    if (["anual", "nitro anual", "nitro discord anual"].includes(p)) {
        return "Nitro Discord Anual";
    }

    return null;
}

function gerarIdEstoque() {
    return "STK-" + Date.now().toString(36) + "-" + crypto.randomBytes(3).toString("hex");
}
function lerTickets() {
    const dados = lerJSON(CAMINHO_TICKETS, {
        tickets: []
    });

    /*
       Formato atual:
       {
           "tickets": []
       }
    */
    if (
        dados &&
        !Array.isArray(dados) &&
        Array.isArray(dados.tickets)
    ) {
        return dados.tickets;
    }

    /*
       Compatibilidade com formato antigo:
       [...]
    */
    if (Array.isArray(dados)) {
        return dados;
    }

    return [];
}

/*
   Salva sempre no formato:

   {
       "tickets": []
   }
*/
function salvarTickets(tickets) {
    salvarJSON(CAMINHO_TICKETS, {
        tickets: Array.isArray(tickets)
            ? tickets
            : []
    });
}

function gerarIdTicket() {
    return `TICKET-${Math.floor(
        1000 + Math.random() * 9000
    )}`;
}

function gerarTokenTicket() {
    return crypto
        .randomBytes(32)
        .toString("hex");
}

/*
   Remove o token antes de enviar
   para cliente/admin.
*/
function prepararTicketPublico(ticket) {
    if (!ticket) return null;

    const copia = {
        ...ticket
    };

    delete copia.token;

    return copia;
}

function impedirCachePrivado(res) {
    res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, private"
    );

    res.setHeader(
        "Pragma",
        "no-cache"
    );

    res.setHeader(
        "Expires",
        "0"
    );
}

/* =========================================================
   CRIAR TICKET
========================================================= */

app.post("/api/tickets", (req, res) => {
    try {
        const {
            nome,
            email,
            discord,
            assunto,
            mensagem
        } = req.body || {};

        if (!nome || !email || !mensagem) {
            return res.status(400).json({
                sucesso: false,
                erro: "Nome, e-mail e mensagem sÃ£o obrigatÃ³rios."
            });
        }

        const tickets = lerTickets();

        let id = gerarIdTicket();

        /*
           Evita ID duplicado.
        */
        while (
            tickets.some(
                ticket => String(ticket.id) === String(id)
            )
        ) {
            id = gerarIdTicket();
        }

        const token = gerarTokenTicket();

        const agora =
            new Date().toISOString();

        const ticket = {
            id,
            token,

            nome: String(nome).trim(),
            email: String(email).trim(),
            discord: String(discord || "").trim(),
            assunto: String(
                assunto || "Suporte"
            ).trim(),

            status: "ABERTO",

            criadoEm: agora,
            atualizadoEm: agora,

            mensagens: [
                {
                    id: crypto
                        .randomBytes(8)
                        .toString("hex"),

                    autor: "cliente",

                    texto: String(
                        mensagem
                    ).trim(),

                    criadoEm: agora
                }
            ]
        };

        tickets.push(ticket);

        salvarTickets(tickets);

        /*
           O TOKEN Ã‰ ENTREGUE SOMENTE AQUI.
        */
        res.json({
            sucesso: true,

            ticket: {
                id: ticket.id,
                token: ticket.token,
                status: ticket.status,
                criadoEm: ticket.criadoEm
            }
        });
    } catch (erro) {
        console.error(
            "Erro ao criar ticket:",
            erro
        );

        res.status(500).json({
            sucesso: false,
            erro: "Erro interno ao criar ticket.",
            detalhes: erro.message
        });
    }
});

/* =========================================================
   CLIENTE - CONSULTAR TICKET
========================================================= */

/* =========================================================
   CLIENTE - CONSULTAR TICKET
========================================================= */

app.get("/api/tickets/:id", (req, res) => {
    impedirCachePrivado(res);

    try {
        const id = String(req.params.id || "").trim();
        const token = String(req.query.token || "").trim();

        if (!id || !token) {
            return res.status(401).json({
                sucesso: false,
                erro: "Dados do atendimento incompletos."
            });
        }

        const tickets = lerTickets();

        const ticket = tickets.find(
            item => String(item.id || "").trim() === id
        );

        if (!ticket) {
            return res.status(404).json({
                sucesso: false,
                erro: "Atendimento não encontrado.",
                encontrado: false
            });
        }

        if (
            !ticket.token ||
            String(ticket.token).trim() !== token
        ) {
            return res.status(401).json({
                sucesso: false,
                erro: "Token do atendimento inválido.",
                encontrado: false
            });
        }

        const publico = prepararTicketPublico(ticket);

        return res.json({
            sucesso: true,
            encontrado: true,

            /* formato antigo */
            ticket: publico,

            /* formato compatível com o chat atual */
            id: publico.id,
            nome: publico.nome,
            email: publico.email,
            discord: publico.discord,
            assunto: publico.assunto,
            status: publico.status,
            criadoEm: publico.criadoEm,
            atualizadoEm: publico.atualizadoEm,
            mensagens: Array.isArray(publico.mensagens)
                ? publico.mensagens
                : []
        });

    } catch (erro) {
        console.error("Erro ao consultar ticket:", erro);

        return res.status(500).json({
            sucesso: false,
            erro: "Erro interno ao consultar atendimento."
        });
    }
});

/* =========================================================
   CLIENTE - ENVIAR MENSAGEM
========================================================= */
/* =========================================================
   CLIENTE - ENVIAR MENSAGEM
========================================================= */

/* ===== BLOQUEIO DE TICKET FECHADO ===== */
app.use((req, res, next) => {
    if (req.method === "POST" && req.path.match(/^\/api\/tickets\/[^\/]+\/mensagens$/)) {
        try {
            const id = String(req.path.split("/")[3] || "").trim();
            const tickets = lerTickets();
            const ticket = tickets.find(item => String(item.id) === id);

            if (ticket && String(ticket.status || "").trim().toLowerCase() === "fechado") {
                return res.status(409).json({
                    sucesso: false,
                    fechado: true,
                    mensagem: "Este ticket estÃ¡ fechado. Abra um novo ticket para continuar o atendimento."
                });
            }
        } catch (erro) {
            console.error("Erro ao verificar ticket fechado:", erro);
        }
    }

    next();
});
/* ===== FIM DO BLOQUEIO ===== */
app.post(
    "/api/tickets/:id/mensagens",
    (req, res) => {
        impedirCachePrivado(res);

        try {
            const id = String(
                req.params.id || ""
            ).trim();

            const {
                token,
                texto,
                mensagem
            } = req.body || {};

            const textoFinal =
                texto || mensagem || "";

            if (!token) {
                return res.status(401).json({
                    sucesso: false,
                    erro: "Token do ticket nÃ£o informado."
                });
            }

            if (
                !textoFinal ||
                !String(textoFinal).trim()
            ) {
                return res.status(400).json({
                    sucesso: false,
                    erro: "Mensagem vazia."
                });
            }

            const tickets = lerTickets();

            const indice = tickets.findIndex(
                item => String(item.id) === id
            );

            if (indice === -1) {
                return res.status(404).json({
                    sucesso: false,
                    erro: "Ticket nÃ£o encontrado."
                });
            }

            const ticket = tickets[indice];

            if (
                !ticket.token ||
                ticket.token !== String(token).trim()
            ) {
                return res.status(401).json({
                    sucesso: false,
                    erro: "Acesso negado."
                });
            }

            const agora =
                new Date().toISOString();

            ticket.mensagens =
                Array.isArray(ticket.mensagens)
                    ? ticket.mensagens
                    : [];

            ticket.mensagens.push({
                id: crypto
                    .randomBytes(8)
                    .toString("hex"),

                autor: "cliente",

                texto: String(
                    textoFinal
                ).trim(),

                criadoEm: agora
            });

            if (
                ticket.status === "RESOLVIDO" ||
                ticket.status === "FECHADO"
            ) {
                ticket.status = "ABERTO";
            }

            ticket.atualizadoEm = agora;

            tickets[indice] = ticket;

            salvarTickets(tickets);

            res.json({
                sucesso: true,
                ticket: prepararTicketPublico(ticket)
            });
        } catch (erro) {
            console.error(
                "Erro ao enviar mensagem:",
                erro
            );

            res.status(500).json({
                sucesso: false,
                erro: "Erro interno.",
                detalhes: erro.message
            });
        }
    }
);

/* =========================================================
   ADMIN - LISTAR TICKETS
========================================================= */

app.get(
    "/api/admin/tickets",
    autenticarAdmin,
    (req, res) => {
        impedirCachePrivado(res);

        try {
            const tickets = lerTickets();

            const lista = tickets.filter(ticket => String(ticket.status || "").trim().toLowerCase() !== "fechado").map(ticket => ({
                id: ticket.id,
                nome: ticket.nome,
                email: ticket.email,
                discord: ticket.discord,
                assunto: ticket.assunto,
                status: ticket.status,
                criadoEm: ticket.criadoEm,
                atualizadoEm: ticket.atualizadoEm,

                mensagens:
                    Array.isArray(ticket.mensagens)
                        ? ticket.mensagens.length
                        : 0
            }));

            res.json({
                sucesso: true,
                tickets: lista
            });
        } catch (erro) {
            console.error(
                "Erro ao listar tickets:",
                erro
            );

            res.status(500).json({
                sucesso: false,
                erro: "Erro interno ao listar tickets."
            });
        }
    }
);

/* =========================================================
   ADMIN - ABRIR TICKET
========================================================= */

app.get(
    "/api/admin/tickets/:id",
    autenticarAdmin,
    (req, res) => {
        impedirCachePrivado(res);

        try {
            const id = String(
                req.params.id || ""
            ).trim();

            const tickets = lerTickets();

            const ticket = tickets.find(
                item => String(item.id) === id
            );

            if (!ticket) {
                return res.status(404).json({
                    sucesso: false,
                    erro: "Ticket nÃ£o encontrado."
                });
            }

            res.json({
                sucesso: true,
                ticket: prepararTicketPublico(ticket)
            });
        } catch (erro) {
            console.error(
                "Erro ao abrir ticket:",
                erro
            );

            res.status(500).json({
                sucesso: false,
                erro: "Erro interno ao abrir ticket."
            });
        }
    }
);

/* =========================================================
   ADMIN - RESPONDER TICKET
========================================================= */

function responderTicketComoAdmin(req, res) {
    impedirCachePrivado(res);

    try {
        const id = String(
            req.params.id || ""
        ).trim();

        const {
            texto,
            mensagem
        } = req.body || {};

        const textoFinal =
            texto || mensagem || "";

        if (
            !textoFinal ||
            !String(textoFinal).trim()
        ) {
            return res.status(400).json({
                sucesso: false,
                erro: "Mensagem vazia."
            });
        }

        const tickets = lerTickets();

        const indice = tickets.findIndex(
            item => String(item.id) === id
        );

        if (indice === -1) {
            return res.status(404).json({
                sucesso: false,
                erro: "Ticket nÃ£o encontrado."
            });
        }

        const ticket = tickets[indice];

        const agora =
            new Date().toISOString();

        ticket.mensagens =
            Array.isArray(ticket.mensagens)
                ? ticket.mensagens
                : [];

        ticket.mensagens.push({
            id: crypto
                .randomBytes(8)
                .toString("hex"),

            autor: "admin",

            texto: String(
                textoFinal
            ).trim(),

            criadoEm: agora
        });

        ticket.atualizadoEm = agora;

        

        tickets[indice] = ticket;

        salvarTickets(tickets);

        res.json({
            sucesso: true,
            ticket: prepararTicketPublico(ticket)
        });
    } catch (erro) {
        console.error(
            "Erro ao responder ticket:",
            erro
        );

        res.status(500).json({
            sucesso: false,
            erro: "Erro interno.",
            detalhes: erro.message
        });
    }
}

app.post(
    "/api/admin/tickets/:id/respostas",
    autenticarAdmin,
    responderTicketComoAdmin
);

/*
   Compatibilidade com versÃµes do admin.html
   que utilizem /mensagens.
*/
app.post(
    "/api/admin/tickets/:id/mensagens",
    autenticarAdmin,
    responderTicketComoAdmin
);

/* =========================================================
   ADMIN - ALTERAR STATUS
========================================================= */


/* =========================================================
   ADMIN - FECHAR TICKET
   Fechamento independente de "Resolvido"
========================================================= */
app.patch(
    "/api/admin/tickets/:id/fechar",
    autenticarAdmin,
    (req, res) => {
        impedirCachePrivado(res);

        try {
            const id = String(req.params.id || "").trim();
            const tickets = lerTickets();

            const ticket = tickets.find(
                item => String(item.id) === id
            );

            if (!ticket) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: "Ticket nÃ£o encontrado."
                });
            }

            ticket.status = "fechado";
            ticket.atualizadoEm = new Date().toISOString();

            salvarTickets(tickets);

            return res.json({
                sucesso: true,
                fechado: true,
                mensagem: "Ticket fechado com sucesso.",
                ticket
            });

        } catch (erro) {
            console.error("Erro ao fechar ticket:", erro);

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro interno ao fechar o ticket."
            });
        }
    }
);
app.patch(
    "/api/admin/tickets/:id/status",
    autenticarAdmin,
    (req, res) => {
        impedirCachePrivado(res);

        try {
            const id = String(
                req.params.id || ""
            ).trim();

            const {
                status
            } = req.body || {};

            const statusNormalizado =
                String(
                    status || ""
                ).toUpperCase();

            const statusPermitidos = [
                "ABERTO",
                "EM_ATENDIMENTO",
                "RESOLVIDO",
                "FECHADO"
            ];

            if (
                !statusPermitidos.includes(
                    statusNormalizado
                )
            ) {
                return res.status(400).json({
                    sucesso: false,
                    erro: "Status invÃ¡lido."
                });
            }

            const tickets = lerTickets();

            const indice = tickets.findIndex(
                item => String(item.id) === id
            );

            if (indice === -1) {
                return res.status(404).json({
                    sucesso: false,
                    erro: "Ticket nÃ£o encontrado."
                });
            }

            tickets[indice].status =
                statusNormalizado;

            tickets[indice].atualizadoEm =
                new Date().toISOString();

            salvarTickets(tickets);

            res.json({
                sucesso: true,
                ticket: prepararTicketPublico(
                    tickets[indice]
                )
            });
        } catch (erro) {
            console.error(
                "Erro ao alterar status:",
                erro
            );

            res.status(500).json({
                sucesso: false,
                erro: "Erro interno.",
                detalhes: erro.message
            });
        }
    }
);

/* =========================================================
   TESTE DE E-MAIL
========================================================= */

app.get(
    "/teste-email",
    async (req, res) => {
        try {
            if (!transporter) {
                return res.status(500).json({
                    sucesso: false,
                    erro: "E-mail nÃ£o configurado."
                });
            }

            await transporter.sendMail({
                from: `"HYPE STORE" <${EMAIL_USUARIO}>`,
                to: EMAIL_USUARIO,
                subject: "HYPE STORE - Teste de e-mail",
                text: "Teste de envio de e-mail da HYPE STORE."
            });

            res.json({
                sucesso: true,
                mensagem: "E-mail de teste enviado."
            });
        } catch (erro) {
            console.error(
                "Erro teste e-mail:",
                erro
            );

            res.status(500).json({
                sucesso: false,
                erro: erro.message
            });
        }
    }
);

/* =========================================================
   GARANTIR ARQUIVOS
========================================================= */

function garantirArquivos() {
    if (!fs.existsSync(CAMINHO_PEDIDOS)) {
        salvarPedidos([]);
    }

    if (!fs.existsSync(CAMINHO_TICKETS)) {
        salvarTickets([]);
    } else {
        /*
           Corrige automaticamente tickets.json caso
           esteja vazio ou em formato incompatÃ­vel.
        */
        const dados = lerJSON(
            CAMINHO_TICKETS,
            {
                tickets: []
            }
        );

        if (
            !Array.isArray(dados) &&
            !(
                dados &&
                Array.isArray(dados.tickets)
            )
        ) {
            salvarTickets([]);
        } else if (Array.isArray(dados)) {
            /*
               Converte formato antigo para o atual.
            */
            salvarTickets(dados);
        }
    }

    if (!fs.existsSync(CAMINHO_ESTOQUE)) {
        salvarEstoque({
            "Nitro Discord Mensal": [],
            "Nitro Discord Anual": []
        });
    }
}

garantirArquivos();

/* =========================================================
   INICIAR SERVIDOR
========================================================= */


app.get("/api/precos", (req, res) => {
    const precos = lerPrecos();
    res.json({
        sucesso: true,
        mensal: precos["Nitro Discord Mensal"],
        anual: precos["Nitro Discord Anual"]
    });
});

app.get("/api/admin/precos", exigirSessaoAdmin, (req, res) => {
    const precos = lerPrecos();
    res.json({
        sucesso: true,
        mensal: precos["Nitro Discord Mensal"],
        anual: precos["Nitro Discord Anual"]
    });
});

app.put("/api/admin/precos", exigirSessaoAdmin, (req, res) => {
    const mensal = Number(req.body.mensal);
    const anual = Number(req.body.anual);

    if (!Number.isFinite(mensal) || mensal <= 0 || !Number.isFinite(anual) || anual <= 0) {
        return res.status(400).json({
            sucesso: false,
            erro: "Informe preÃ§os vÃ¡lidos."
        });
    }

    salvarPrecos({
        "Nitro Discord Mensal": mensal,
        "Nitro Discord Anual": anual
    });

    res.json({
        sucesso: true,
        mensal,
        anual
    });
});

app.get("/api/admin/estoque", exigirSessaoAdmin, (req, res) => {
    const estoque = lerEstoque();

    res.json({
        sucesso: true,
        mensal: estoque["Nitro Discord Mensal"] || [],
        anual: estoque["Nitro Discord Anual"] || []
    });
});

app.post("/api/admin/estoque", exigirSessaoAdmin, (req, res) => {
    const produto = normalizarProdutoEstoque(req.body.produto);
    const email = String(req.body.email || "").trim();
    const senha = String(req.body.senha || "").trim();

    if (!produto) {
        return res.status(400).json({
            sucesso: false,
            erro: "Produto invÃ¡lido."
        });
    }

    if (!email || !senha) {
        return res.status(400).json({
            sucesso: false,
            erro: "Email e senha sÃ£o obrigatÃ³rios."
        });
    }

    const estoque = lerEstoque();

    if (!Array.isArray(estoque[produto])) {
        estoque[produto] = [];
    }

    estoque[produto].push({
        id: gerarIdEstoque(),
        email,
        senha,
        status: "disponivel",
        criadoEm: new Date().toISOString()
    });

    salvarEstoque(estoque);

    res.json({
        sucesso: true,
        mensagem: "Conta adicionada ao estoque."
    });
});

app.delete("/api/admin/estoque/:produto/:id", exigirSessaoAdmin, (req, res) => {
    const produto = normalizarProdutoEstoque(req.params.produto);
    const id = String(req.params.id || "");

    if (!produto) {
        return res.status(400).json({
            sucesso: false,
            erro: "Produto invÃ¡lido."
        });
    }

    const estoque = lerEstoque();
    const lista = Array.isArray(estoque[produto]) ? estoque[produto] : [];

    const indice = lista.findIndex(item =>
        String(item.id || "") === id &&
        String(item.status || "disponivel").toLowerCase() === "disponivel"
    );

    if (indice === -1) {
        return res.status(404).json({
            sucesso: false,
            erro: "Conta disponÃ­vel nÃ£o encontrada."
        });
    }

    lista.splice(indice, 1);
    estoque[produto] = lista;

    salvarEstoque(estoque);

    res.json({
        sucesso: true,
        mensagem: "Conta removida do estoque."
    });
});
app.listen(PORT, () => {
    console.log("");
    console.log("======================================");
    console.log("       HYPE STORE - SERVIDOR");
    console.log("======================================");
    console.log(
        `Servidor da HYPE STORE funcionando na porta ${PORT}`
    );
    console.log(
        `TurbofyPay: ${TURBOFY_API}`
    );
    console.log(
        `Estoque: ${CAMINHO_ESTOQUE}`
    );
    console.log(
        `Pedidos: ${CAMINHO_PEDIDOS}`
    );
    console.log(
        `Tickets: ${CAMINHO_TICKETS}`
    );
    console.log(
        `E-mail configurado: ${transporter ? "SIM" : "NÃƒO"}`
    );
    console.log(
        `Admin configurado: ${ADMIN_PASSWORD ? "SIM" : "NÃƒO"}`
    );
    console.log("======================================");
    console.log("");
});
































