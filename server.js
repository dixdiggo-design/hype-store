const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

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

app.listen(PORT, () => {
    console.log("Servidor iniciado em http://localhost:" + PORT);
});