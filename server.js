const { MercadoPagoConfig, Order } = require("mercadopago");
const express = require("express");
const fs = require("fs");
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN
});
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.get("/api/status", (req, res) => {
    res.json({
        online: true,
        mensagem: "Servidor da HYPE STORE funcionando!"
    });
});
app.get("/api/pedidos/:id", (req, res) => {

    const id = Number(req.params.id);

    const pedidos = JSON.parse(
        fs.readFileSync("pedidos.json", "utf8")
    );

    const pedido = pedidos.find(p => p.id === id);

    if (!pedido) {
        return res.status(404).json({
            sucesso: false,
            mensagem: "Pedido não encontrado."
        });
    }

    res.json({
        sucesso: true,
        pedido: pedido
    });
});


app.post("/api/pedidos", (req, res) => {

    const { nome, discord, email, itens } = req.body;

    if (!nome || !discord || !email || !Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({
            sucesso: false,
            mensagem: "Dados do pedido incompletos."
        });
    }

    const pedidos = JSON.parse(
        fs.readFileSync("pedidos.json", "utf8")
    );

    const pedido = {
        id: Date.now(),
        nome: nome,
        discord: discord,
        email: email,
        itens: itens,
        data: new Date().toISOString(),
        status: "aguardando pagamento"
    };

    pedidos.push(pedido);

    fs.writeFileSync(
        "pedidos.json",
        JSON.stringify(pedidos, null, 2)
    );

    console.log("NOVO PEDIDO SALVO:");
    console.log(pedido);

    res.status(201).json({
        sucesso: true,
        mensagem: "Pedido salvo com sucesso!",
        pedido: pedido
    });
});
app.post("/api/pagamento/pix", async (req, res) => {

    try {

        const { email, valor, pedidoId } = req.body;

        if (!email || !valor || !pedidoId) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Dados do pagamento incompletos."
            });
        }

        const order = new Order(client);

        const resultado = await order.create({
            body: {
                type: "online",
                total_amount: Number(valor).toFixed(2),
                external_reference: String(pedidoId),
                processing_mode: "automatic",
                transactions: {
                    payments: [
                        {
                            amount: Number(valor).toFixed(2),
                            payment_method: {
                                id: "pix",
                                type: "bank_transfer"
                            }
                        }
                    ]
                },
                payer: {
                    email: email
                }
            },
            requestOptions: {
                idempotencyKey: `${pedidoId}-${Date.now()}`
            }
        });

        const pagamento = resultado.transactions.payments[0];

        res.json({
            sucesso: true,
            orderId: resultado.id,
            paymentId: pagamento.id,
            qrCode: pagamento.payment_method.qr_code,
            qrCodeBase64: pagamento.payment_method.qr_code_base64,
            ticketUrl: pagamento.payment_method.ticket_url
        });

    } catch (erro) {

        console.error("ERRO MERCADO PAGO:");
        console.error(erro);

        res.status(500).json({
            sucesso: false,
            mensagem: "Não foi possível criar o pagamento Pix."
        });
    }
});
app.listen(PORT, () => {
    console.log("Servidor iniciado em http://localhost:" + PORT);
});