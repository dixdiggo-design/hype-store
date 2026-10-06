[1mdiff --cc .gitignore[m
[1mindex df4053c,155bbb1..0000000[m
[1m--- a/.gitignore[m
[1m+++ b/.gitignore[m
[36m@@@ -1,3 -1,4 +1,8 @@@[m
  .env[m
  node_modules/[m
[32m++<<<<<<< HEAD[m
[32m +chaves.json[m
[32m++=======[m
[32m+ [m
[32m+ tickets.json[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
[1mdiff --cc script.js[m
[1mindex 36b0ff0,cb477cd..0000000[m
[1m--- a/script.js[m
[1m+++ b/script.js[m
[36m@@@ -3,42 -3,115 +3,127 @@@[m
  // ==========================================[m
  [m
  let carrinho = [];[m
[32m+ let intervaloPagamento = null;[m
  [m
[32m +[m
  // ==========================================[m
[31m -// ELEMENTOS[m
[32m +// CARRINHO[m
  // ==========================================[m
  [m
[31m -const contadorCarrinho =[m
[31m -    document.getElementById("contador-carrinho");[m
[31m -[m
[31m -const listaCarrinho =[m
[31m -    document.getElementById("lista-carrinho");[m
[31m -[m
[31m -const totalCarrinho =[m
[31m -    document.getElementById("total-carrinho");[m
[32m++<<<<<<< HEAD[m
[32m +function adicionarCarrinho(nome, preco, opcao = "") {[m
  [m
[31m -const totalCheckout =[m
[31m -    document.getElementById("total-checkout");[m
[32m +    const produto = {[m
[32m +        nome: nome,[m
[32m +        preco: Number(preco),[m
[32m +        opcao: opcao[m
[32m +    };[m
  [m
[31m -// ==========================================[m
[31m -// FORMATAR DINHEIRO[m
[31m -// ==========================================[m
[32m +    carrinho.push(produto);[m
  [m
[32m++=======[m
[32m+ function formatarPreco(valor) {[m
[32m+     return Number(valor).toLocaleString("pt-BR", {[m
[32m+         style: "currency",[m
[32m+         currency: "BRL"[m
[32m+     });[m
[32m+ }[m
[32m+ [m
[32m+ // ==========================================[m
[32m+ // ATUALIZAR CONTADOR[m
[32m+ // ==========================================[m
[32m+ [m
[32m+ function atualizarContador() {[m
[32m+     const contador =[m
[32m+         document.getElementById("contador-carrinho");[m
[32m+ [m
[32m+     if (!contador) {[m
[32m+         return;[m
[32m+     }[m
[32m+ [m
[32m+     contador.textContent = carrinho.length;[m
[32m+ }[m
[32m+ [m
[32m+ // ==========================================[m
[32m+ // ADICIONAR AO CARRINHO[m
[32m+ // ==========================================[m
[32m+ [m
[32m+ function adicionarCarrinho(nome, preco, opcao = "") {[m
[32m+     const produto = {[m
[32m+         nome: String(nome).trim(),[m
[32m+         preco: Number(preco),[m
[32m+         opcao: String(opcao).trim()[m
[32m+     };[m
[32m+ [m
[32m+     console.log("PRODUTO ADICIONADO:", produto);[m
[32m+ [m
[32m+     carrinho.push(produto);[m
[32m+ [m
[32m+     atualizarContador();[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
      atualizarCarrinho();[m
  [m
      abrirCarrinho();[m
  }[m
  [m
[32m++<<<<<<< HEAD[m
[32m++=======[m
[32m+ // ==========================================[m
[32m+ // REMOVER PRODUTO[m
[32m+ // ==========================================[m
[32m+ [m
[32m+ function removerProduto(index) {[m
[32m+     if ([m
[32m+         index < 0 ||[m
[32m+         index >= carrinho.length[m
[32m+     ) {[m
[32m+         return;[m
[32m+     }[m
[32m+ [m
[32m+     carrinho.splice(index, 1);[m
[32m+ [m
[32m+     atualizarContador();[m
[32m+     atualizarCarrinho();[m
[32m+ }[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
[32m+ [m
[32m+ // ==========================================[m
[32m+ // CALCULAR TOTAL[m
[32m+ // ==========================================[m
[32m+ [m
[32m+ function calcularTotal() {[m
[32m+     return carrinho.reduce([m
[32m+         (total, produto) => {[m
[32m+             return total + Number(produto.preco);[m
[32m+         },[m
[32m+         0[m
[32m+     );[m
[32m+ }[m
  [m
  // ==========================================[m
  // ATUALIZAR CARRINHO[m
  // ==========================================[m
  [m
  function atualizarCarrinho() {[m
[32m+     const lista =[m
[32m+         document.getElementById("lista-carrinho");[m
  [m
[32m++<<<<<<< HEAD[m
[32m +    const lista = document.getElementById("lista-carrinho");[m
[32m +    const contador = document.getElementById("contador-carrinho");[m
[32m +    const total = document.getElementById("total-carrinho");[m
[32m +    const totalCheckout = document.getElementById("total-checkout");[m
[32m +[m
[32m +    if (contador) {[m
[32m +        contador.textContent = carrinho.length;[m
[32m +    }[m
[32m++=======[m
[32m+     const total =[m
[32m+         document.getElementById("total-carrinho");[m
[32m+ [m
[32m+     const checkoutTotal =[m
[32m+         document.getElementById("total-checkout");[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
  [m
      if (!lista) {[m
          return;[m
[36m@@@ -47,61 -120,79 +132,136 @@@[m
      lista.innerHTML = "";[m
  [m
      if (carrinho.length === 0) {[m
[32m++<<<<<<< HEAD[m
[32m +[m
[32m +        lista.innerHTML = `[m
[32m +            <p style="text-align:center;">[m
[32m +                Seu carrinho está vazio.[m
[32m +            </p>[m
[32m++=======[m
[32m+         lista.innerHTML = `[m
[32m+             <div class="carrinho-vazio">[m
[32m+                 <div class="carrinho-vazio-icon">🛒</div>[m
[32m+                 <strong>Seu carrinho está vazio</strong>[m
[32m+                 <p>Adicione um produto para continuar.</p>[m
[32m+             </div>[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
          `;[m
  [m
[31m-     } else {[m
[32m+         if (total) {[m
[32m+             total.textContent = formatarPreco(0);[m
[32m+         }[m
  [m
[32m++<<<<<<< HEAD[m
[32m +        carrinho.forEach((produto, index) => {[m
[32m +[m
[32m +            const item = document.createElement("div");[m
[32m +[m
[32m +            item.className = "item-carrinho";[m
[32m +[m
[32m +            item.innerHTML = `[m
[32m +                <div>[m
[32m +                    <strong>${produto.nome}</strong>[m
[32m +                    ${[m
[32m +                        produto.opcao[m
[32m +                            ? `<small>${produto.opcao}</small>`[m
[32m +                            : ""[m
[32m +                    }[m
[32m +                </div>[m
[32m +[m
[32m +                <div>[m
[32m +                    <span>[m
[32m +                        R$ ${produto.preco.toFixed(2).replace(".", ",")}[m
[32m +                    </span>[m
[32m +[m
[32m +                    <button[m
[32m +                        type="button"[m
[32m +                        onclick="removerProduto(${index})">[m
[32m +                        ❌[m
[32m +                    </button>[m
[32m +                </div>[m
[32m +            `;[m
[32m +[m
[32m +            lista.appendChild(item);[m
[32m +        });[m
[32m +    }[m
[32m +[m
[32m +    const valorTotal = carrinho.reduce([m
[32m +        (soma, produto) => soma + Number(produto.preco),[m
[32m +        0[m
[32m +    );[m
[32m +[m
[32m +    if (total) {[m
[32m +        total.textContent =[m
[32m +            `R$ ${valorTotal.toFixed(2).replace(".", ",")}`;[m
[32m +    }[m
[32m +[m
[32m +    if (totalCheckout) {[m
[32m +        totalCheckout.textContent =[m
[32m +            `R$ ${valorTotal.toFixed(2).replace(".", ",")}`;[m
[32m++=======[m
[32m+         if (checkoutTotal) {[m
[32m+             checkoutTotal.textContent = formatarPreco(0);[m
[32m+         }[m
[32m+ [m
[32m+         return;[m
[32m+     }[m
[32m+ [m
[32m+     let valorTotal = 0;[m
[32m+ [m
[32m+     carrinho.forEach((produto, index) => {[m
[32m+         valorTotal += Number(produto.preco);[m
[32m+ [m
[32m+         const item =[m
[32m+             document.createElement("div");[m
[32m+ [m
[32m+         item.className = "item-carrinho";[m
[32m+ [m
[32m+         item.innerHTML = `[m
[32m+             <div class="item-carrinho-info">[m
[32m+ [m
[32m+                 <strong>[m
[32m+                     ${produto.nome}[m
[32m+                 </strong>[m
[32m+ [m
[32m+                 ${[m
[32m+                     produto.opcao[m
[32m+                         ? `[m
[32m+                             <span class="item-carrinho-opcao">[m
[32m+                                 ${produto.opcao}[m
[32m+                             </span>[m
[32m+                         `[m
[32m+                         : ""[m
[32m+                 }[m
[32m+ [m
[32m+                 <span class="item-carrinho-preco">[m
[32m+                     ${formatarPreco(produto.preco)}[m
[32m+                 </span>[m
[32m+ [m
[32m+             </div>[m
[32m+ [m
[32m+             <button[m
[32m+                 class="btn-remover"[m
[32m+                 type="button"[m
[32m+                 onclick="removerProduto(${index})"[m
[32m+                 aria-label="Remover produto"[m
[32m+             >[m
[32m+                 ×[m
[32m+             </button>[m
[32m+         `;[m
[32m+ [m
[32m+         lista.appendChild(item);[m
[32m+     });[m
[32m+ [m
[32m+     if (total) {[m
[32m+         total.textContent =[m
[32m+             formatarPreco(valorTotal);[m
[32m+     }[m
[32m+ [m
[32m+     if (checkoutTotal) {[m
[32m+         checkoutTotal.textContent =[m
[32m+             formatarPreco(valorTotal);[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
      }[m
  }[m
  [m
[36m@@@ -123,44 -201,52 +283,76 @@@[m [mfunction removerProduto(index) [m
  // ==========================================[m
  [m
  function abrirCarrinho() {[m
[32m+     const modal =[m
[32m+         document.getElementById("modal-carrinho");[m
  [m
[32m++<<<<<<< HEAD[m
[32m +    const modal =[m
[32m +        document.getElementById("modal-carrinho");[m
[32m +[m
[32m +    if (!modal) {[m
[32m++=======[m
[32m+     if (!modal) {[m
[32m+         console.error([m
[32m+             "Modal do carrinho não encontrado."[m
[32m+         );[m
[32m+ [m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
          return;[m
      }[m
  [m
[32m +    modal.classList.add("ativo");[m
[32m +[m
      atualizarCarrinho();[m
[32m+ [m
[32m+     modal.style.display = "flex";[m
[32m+ [m
[32m+     document.body.classList.add([m
[32m+         "modal-aberto"[m
[32m+     );[m
  }[m
  [m
[32m +[m
  // ==========================================[m
  // FECHAR CARRINHO[m
  // ==========================================[m
  [m
  function fecharCarrinho() {[m
[32m+     const modal =[m
[32m+         document.getElementById("modal-carrinho");[m
  [m
[32m++<<<<<<< HEAD[m
[32m +    const modal =[m
[32m +        document.getElementById("modal-carrinho");[m
[32m +[m
[32m +    if (modal) {[m
[32m +        modal.classList.remove("ativo");[m
[32m++=======[m
[32m+     if (modal) {[m
[32m+         modal.style.display = "none";[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
      }[m
[32m+ [m
[32m+     document.body.classList.remove([m
[32m+         "modal-aberto"[m
[32m+     );[m
  }[m
  [m
[32m +[m
  // ==========================================[m
  // ABRIR CHECKOUT[m
  // ==========================================[m
  [m
  function abrirCheckout() {[m
[31m- [m
      if (carrinho.length === 0) {[m
[32m++<<<<<<< HEAD[m
[32m +[m
[32m +        alert("Seu carrinho está vazio.");[m
[32m++=======[m
[32m+         alert([m
[32m+             "Seu carrinho está vazio."[m
[32m+         );[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
  [m
          return;[m
      }[m
[36m@@@ -169,126 -255,157 +361,260 @@@[m
  [m
      const modal =[m
          document.getElementById("modal-checkout");[m
[32m++<<<<<<< HEAD[m
[32m +[m
[32m +    if (modal) {[m
[32m +        modal.classList.add("ativo");[m
[32m +    }[m
[32m +[m
[32m +    atualizarTotalCheckout();[m
[32m++=======[m
[32m+ [m
[32m+     if (!modal) {[m
[32m+         console.error([m
[32m+             "Modal de checkout não encontrado."[m
[32m+         );[m
[32m+ [m
[32m+         return;[m
[32m+     }[m
[32m+ [m
[32m+     const total =[m
[32m+         document.getElementById("total-checkout");[m
[32m+ [m
[32m+     if (total) {[m
[32m+         total.textContent =[m
[32m+             formatarPreco([m
[32m+                 calcularTotal()[m
[32m+             );[m
[32m+     }[m
[32m+ [m
[32m+     modal.style.display = "flex";[m
[32m+ [m
[32m+     document.body.classList.add([m
[32m+         "modal-aberto"[m
[32m+     );[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
  }[m
  [m
[32m +[m
  // ==========================================[m
  // FECHAR CHECKOUT[m
  // ==========================================[m
  [m
  function fecharCheckout() {[m
[32m+     const modal =[m
[32m+         document.getElementById("modal-checkout");[m
  [m
[32m++<<<<<<< HEAD[m
[32m +    const modal =[m
[32m +        document.getElementById("modal-checkout");[m
[32m +[m
[32m +    if (modal) {[m
[32m +        modal.classList.remove("ativo");[m
[32m++=======[m
[32m+     if (modal) {[m
[32m+         modal.style.display = "none";[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
      }[m
[31m- }[m
  [m
[32m++<<<<<<< HEAD[m
[32m +[m
[32m +// ==========================================[m
[32m +// TOTAL DO CHECKOUT[m
[32m +// ==========================================[m
[32m +[m
[32m +function atualizarTotalCheckout() {[m
[32m +[m
[32m +    const totalCheckout =[m
[32m +        document.getElementById("total-checkout");[m
[32m +[m
[32m +    if (!totalCheckout) {[m
[32m +        return;[m
[32m +    }[m
[32m +[m
[32m +    const total = carrinho.reduce([m
[32m +        (soma, produto) =>[m
[32m +            soma + Number(produto.preco),[m
[32m +        0[m
[32m++=======[m
[32m+     document.body.classList.remove([m
[32m+         "modal-aberto"[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
      );[m
[32m +[m
[32m +    totalCheckout.textContent =[m
[32m +        `R$ ${total.toFixed(2).replace(".", ",")}`;[m
  }[m
  [m
[32m +[m
  // ==========================================[m
  // GERAR PAGAMENTO PIX[m
  // ==========================================[m
  [m
  async function gerarPagamentoPix() {[m
[32m+     const nomeInput =[m
[32m+         document.getElementById("nome");[m
  [m
[31m-     if (carrinho.length === 0) {[m
[32m+     const discordInput =[m
[32m+         document.getElementById("discord");[m
[32m+ [m
[32m+     const emailInput =[m
[32m+         document.getElementById("email");[m
[32m+ [m
[32m+     const botao =[m
[32m+         document.getElementById("btn-pagar-pix");[m
[32m+ [m
[32m+     if (!nomeInput || !discordInput || !emailInput) {[m
[32m+         console.error([m
[32m+             "Campos do checkout não encontrados."[m
[32m+         );[m
  [m
[32m++<<<<<<< HEAD[m
[32m +        alert("Seu carrinho está vazio.");[m
[32m++=======[m
[32m+         alert([m
[32m+             "Erro no formulário de checkout."[m
[32m+         );[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
  [m
          return;[m
      }[m
  [m
      const nome =[m
[32m++<<<<<<< HEAD[m
[32m +        document.getElementById("nome")?.value.trim();[m
[32m +[m
[32m +    const discord =[m
[32m +        document.getElementById("discord")?.value.trim();[m
[32m +[m
[32m +    const email =[m
[32m +        document.getElementById("email")?.value.trim();[m
[32m +[m
[32m +    if (!nome) {[m
[32m +[m
[32m +        alert("Digite seu nome.");[m
[32m++=======[m
[32m+         nomeInput.value.trim();[m
[32m+ [m
[32m+     const discord =[m
[32m+         discordInput.value.trim();[m
[32m+ [m
[32m+     const email =[m
[32m+         emailInput.value.trim();[m
[32m+ [m
[32m+     // ==========================================[m
[32m+     // VALIDAÇÃO[m
[32m+     // ==========================================[m
[32m+ [m
[32m+     if (!nome) {[m
[32m+         alert([m
[32m+             "Digite seu nome."[m
[32m+         );[m
[32m+ [m
[32m+         nomeInput.focus();[m
  [m
          return;[m
      }[m
  [m
      if (!discord) {[m
[32m+         alert([m
[32m+             "Digite seu Discord."[m
[32m+         );[m
[32m+ [m
[32m+         discordInput.focus();[m
  [m
[32m+         return;[m
[32m+     }[m
[32m+ [m
[32m+     if (!email) {[m
[32m+         alert([m
[32m+             "Digite seu e-mail."[m
[32m+         );[m
[32m+ [m
[32m+         emailInput.focus();[m
[32m+ [m
[32m+         return;[m
[32m+     }[m
[32m+ [m
[32m+     if (!email.includes("@")) {[m
[32m+         alert([m
[32m+             "Digite um e-mail válido."[m
[32m+         );[m
[32m+ [m
[32m+         emailInput.focus();[m
[32m+ [m
[32m+         return;[m
[32m+     }[m
[32m+ [m
[32m+     if (carrinho.length === 0) {[m
[32m+         alert([m
[32m+             "Seu carrinho está vazio."[m
[32m+         );[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
[32m+ [m
[32m+         return;[m
[32m+     }[m
[32m+ [m
[31m -    const valor =[m
[31m -        calcularTotal();[m
[32m++    if (!discord) {[m
[32m+ [m
[32m++<<<<<<< HEAD[m
[32m +        alert("Digite seu Discord.");[m
[32m++=======[m
[32m+     // ==========================================[m
[32m+     // VALOR MÍNIMO[m
[32m+     // ==========================================[m
[32m+ [m
[32m+     if (valor < 1.50) {[m
[32m+         alert([m
[32m+             "O valor mínimo do pagamento é R$ 1,50."[m
[32m+         );[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
  [m
          return;[m
      }[m
  [m
[32m++<<<<<<< HEAD[m
[32m +    if (!email) {[m
[32m +[m
[32m +        alert("Digite seu e-mail.");[m
[32m +[m
[32m +        return;[m
[32m +    }[m
[32m +[m
[32m +    const valor = carrinho.reduce([m
[32m +        (soma, produto) =>[m
[32m +            soma + Number(produto.preco),[m
[32m +        0[m
[32m +    );[m
[32m +[m
[32m +    const modalPix =[m
[32m +        document.getElementById("modal-pix");[m
[32m +[m
[32m +    const loading =[m
[32m +        document.querySelector(".carregando");[m
[32m +[m
[32m +    const qrCode =[m
[32m +        document.getElementById("qr-code");[m
[32m +[m
[32m +    const copiaCola =[m
[32m +        document.getElementById("pix-copia-cola");[m
[32m +[m
[32m +    const statusPix =[m
[32m +        document.getElementById("status-pix");[m
[32m +[m
[32m +    const pedidoId =[m
[32m +        document.getElementById("pedido-id");[m
[32m +[m
[32m +    const mensagem =[m
[32m +        document.getElementById("mensagem-pagamento");[m
[32m +[m
[32m +    const botao =[m
[32m +        document.getElementById("btn-pagar-pix");[m
[32m++=======[m
[32m+     // ==========================================[m
[32m+     // DESABILITAR BOTÃO[m
[32m+     // ==========================================[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
  [m
      if (botao) {[m
          botao.disabled = true;[m
[36m@@@ -318,93 -415,164 +644,233 @@@[m
      }[m
  [m
      try {[m
[32m++<<<<<<< HEAD[m
[32m +[m
[32m +        const resposta = await fetch([m
[32m +            "/api/pagamento/pix",[m
[32m +            {[m
[32m +                method: "POST",[m
[32m +[m
[32m +                headers: {[m
[32m +                    "Content-Type": "application/json"[m
[32m +                },[m
[32m +[m
[32m +                body: JSON.stringify({[m
[32m +                    nome: nome,[m
[32m +                    discord: discord,[m
[32m +                    email: email,[m
[32m +                    itens: carrinho,[m
[32m +                    valor: valor[m
[32m++=======[m
[32m+         // ==========================================[m
[32m+         // PREPARAR PRODUTOS[m
[32m+         // ==========================================[m
[32m+ [m
[32m+         const itensParaEnviar =[m
[32m+             carrinho.map([m
[32m+                 produto => ({[m
[32m+                     nome:[m
[32m+                         String([m
[32m+                             produto.nome[m
[32m+                         ).trim(),[m
[32m+ [m
[32m+                     preco:[m
[32m+                         Number([m
[32m+                             produto.preco[m
[32m+                         ),[m
[32m+ [m
[32m+                     opcao:[m
[32m+                         String([m
[32m+                             produto.opcao || ""[m
[32m+                         ).trim()[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
                  })[m
[31m -            );[m
[31m -[m
[31m -        console.log([m
[31m -            "=========================================="[m
[32m +            }[m
          );[m
  [m
[32m++<<<<<<< HEAD[m
[32m +        const dados =[m
[32m +            await resposta.json();[m
[32m++=======[m
[32m+         console.log([m
[32m+             "HYPE STORE - GERANDO PAGAMENTO PIX"[m
[32m+         );[m
[32m+ [m
[32m+         console.log([m
[32m+             "NOME:",[m
[32m+             nome[m
[32m+         );[m
[32m+ [m
[32m+         console.log([m
[32m+             "DISCORD:",[m
[32m+             discord[m
[32m+         );[m
[32m+ [m
[32m+         console.log([m
[32m+             "EMAIL:",[m
[32m+             email[m
[32m+         );[m
[32m+ [m
[32m+         console.log([m
[32m+             "ITENS:",[m
[32m+             itensParaEnviar[m
[32m+         );[m
[32m+ [m
[32m+         console.log([m
[32m+             "VALOR:",[m
[32m+             valor[m
[32m+         );[m
[32m+ [m
[32m+         console.log([m
[32m+             "=========================================="[m
[32m+         );[m
[32m+ [m
[32m+         // ==========================================[m
[32m+         // ENVIAR PARA O SERVIDOR[m
[32m+         // ==========================================[m
[32m+ [m
[32m+         const resposta =[m
[32m+             await fetch([m
[32m+                 "/api/pagamento/pix",[m
[32m+                 {[m
[32m+                     method: "POST",[m
[32m+ [m
[32m+                     headers: {[m
[32m+                         "Content-Type":[m
[32m+                             "application/json"[m
[32m+                     },[m
[32m+ [m
[32m+                     body:[m
[32m+                         JSON.stringify({[m
[32m+                             nome:[m
[32m+                                 nome,[m
[32m+ [m
[32m+                             discord:[m
[32m+                                 discord,[m
[32m+ [m
[32m+                             email:[m
[32m+                                 email,[m
[32m+ [m
[32m+                             itens:[m
[32m+                                 itensParaEnviar,[m
[32m+ [m
[32m+                             valor:[m
[32m+                                 valor[m
[32m+                         })[m
[32m+                 }[m
[32m+             );[m
[32m+ [m
[32m+         // ==========================================[m
[32m+         // TENTAR LER RESPOSTA[m
[32m+         // ==========================================[m
[32m+ [m
[32m+         let dados;[m
[32m+ [m
[32m+         try {[m
[32m+             dados =[m
[32m+                 await resposta.json();[m
[32m+         } catch (erroJson) {[m
[32m+             throw new Error([m
[32m+                 "O servidor retornou uma resposta inválida."[m
[32m+             );[m
[32m+         }[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
  [m
          console.log([m
              "RESPOSTA DO SERVIDOR:",[m
              dados[m
          );[m
  [m
[32m++<<<<<<< HEAD[m
[32m +        if (!resposta.ok || !dados.sucesso) {[m
[32m +[m
[32m +            throw new Error([m
[32m +                dados.erro ||[m
[32m +                "Não foi possível gerar o PIX."[m
[32m +            );[m
[32m +        }[m
[32m +[m
[32m +        if (pedidoId) {[m
[32m +            pedidoId.textContent =[m
[32m +                dados.pedidoId || "";[m
[32m++=======[m
[32m+         // ==========================================[m
[32m+         // ERRO HTTP[m
[32m+         // ==========================================[m
[32m+ [m
[32m+         if (!resposta.ok) {[m
[32m+             throw new Error([m
[32m+                 dados?.erro ||[m
[32m+                 dados?.message ||[m
[32m+                 "Erro ao gerar pagamento."[m
[32m+             );[m
[32m+         }[m
[32m+ [m
[32m+         // ==========================================[m
[32m+         // VALIDAR PAGAMENTO[m
[32m+         // ==========================================[m
[32m+ [m
[32m+         if ([m
[32m+             !dados ||[m
[32m+             !dados.sucesso ||[m
[32m+             !dados.chargeId[m
[32m+         ) {[m
[32m+             console.error([m
[32m+                 "Resposta inválida do servidor:",[m
[32m+                 dados[m
[32m+             );[m
[32m+ [m
[32m+             throw new Error([m
[32m+                 "Pagamento não foi criado corretamente."[m
[32m+             );[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
          }[m
  [m
[31m -        // ==========================================[m
[31m -        // MOSTRAR PIX[m
[31m -        // ==========================================[m
[32m +        // QR CODE TURBOFYPAY[m
[32m +        if (dados.qrCode && qrCode) {[m
  [m
[31m -        mostrarPagamentoPix([m
[31m -            dados[m
[31m -        );[m
[32m +            qrCode.src =[m
[32m +                dados.qrCode.startsWith("data:")[m
[32m +                    ? dados.qrCode[m
[32m +                    : `data:image/png;base64,${dados.qrCode}`;[m
[32m +[m
[32m +            qrCode.style.display = "block";[m
[32m +        }[m
[32m +[m
[32m +        // PIX COPIA E COLA[m
[32m +        if (copiaCola) {[m
[32m +[m
[32m +            copiaCola.value =[m
[32m +                dados.copyPaste || "";[m
[32m +        }[m
[32m +[m
[32m +        if (loading) {[m
[32m +            loading.style.display = "none";[m
[32m +        }[m
[32m +[m
[32m +        if (statusPix) {[m
[32m +[m
[32m +            statusPix.textContent =[m
[32m +                "Aguardando pagamento...";[m
[32m +        }[m
[32m +[m
[32m +        if (mensagem) {[m
[32m +[m
[32m +            mensagem.textContent =[m
[32m +                "Escaneie o QR Code ou copie o PIX copia e cola.";[m
[32m +        }[m
[32m +[m
[32m +        // COMEÇA A VERIFICAR O PAGAMENTO[m
[32m +        if (dados.chargeId) {[m
[32m +[m
[32m +            verificarPagamento([m
[32m +                dados.chargeId[m
[32m +            );[m
[32m +        }[m
  [m
      } catch (erro) {[m
[31m- [m
          console.error([m
[31m -            "ERRO AO GERAR PAGAMENTO:",[m
[32m +            "ERRO AO GERAR PIX:",[m
              erro[m
          );[m
  [m
[36m@@@ -435,116 -591,123 +899,228 @@@[m
      }[m
  }[m
  [m
[32m +[m
  // ==========================================[m
[31m -// MOSTRAR PAGAMENTO PIX[m
[32m +// VERIFICAR PAGAMENTO[m
  // ==========================================[m
  [m
[32m++<<<<<<< HEAD[m
[32m +async function verificarPagamento(chargeId) {[m
[32m +[m
[32m +    let tentativas = 0;[m
[32m++=======[m
[32m+ function mostrarPagamentoPix(dados) {[m
[32m+     fecharCheckout();[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
  [m
[31m -    const pixModal =[m
[31m -        document.getElementById([m
[31m -            "modal-pix"[m
[32m +    const limite =[m
[32m +        120;[m
[32m +[m
[32m +    const intervalo =[m
[32m +        5000;[m
[32m +[m
[32m +    async function verificar() {[m
[32m +[m
[32m +        tentativas++;[m
[32m +[m
[32m +        try {[m
[32m +[m
[32m +            const resposta =[m
[32m +                await fetch([m
[32m +                    `/api/pagamento/status/${chargeId}`[m
[32m +                );[m
[32m +[m
[32m +            const dados =[m
[32m +                await resposta.json();[m
[32m +[m
[32m +            console.log([m
[32m +                "STATUS DO PAGAMENTO:",[m
[32m +                dados[m
[32m +            );[m
[32m +[m
[32m +            const statusPix =[m
[32m +                document.getElementById([m
[32m +                    "status-pix"[m
[32m +                );[m
[32m +[m
[32m +            if ([m
[32m +                dados.status === "PAID" ||[m
[32m +                dados.status === "PAGO"[m
[32m +            ) {[m
[32m +[m
[32m +                if (statusPix) {[m
[32m +[m
[32m +                    statusPix.textContent =[m
[32m +                        "✅ Pagamento confirmado!";[m
[32m +                }[m
[32m +[m
[32m +                const mensagem =[m
[32m +                    document.getElementById([m
[32m +                        "mensagem-pagamento"[m
[32m +                    );[m
[32m +[m
[32m +                if (mensagem) {[m
[32m +[m
[32m +                    mensagem.textContent =[m
[32m +                        "Pagamento confirmado! Seu produto foi processado.";[m
[32m +                }[m
[32m +[m
[32m +                return;[m
[32m +            }[m
[32m +[m
[32m +            if ([m
[32m +                tentativas >= limite[m
[32m +            ) {[m
[32m +[m
[32m +                if (statusPix) {[m
[32m +[m
[32m +                    statusPix.textContent =[m
[32m +                        "⏱️ Tempo de verificação encerrado. Consulte seu pedido.";[m
[32m +                }[m
[32m +[m
[32m +                return;[m
[32m +            }[m
[32m +[m
[32m +        } catch (erro) {[m
[32m +[m
[32m +            console.error([m
[32m +                "ERRO AO VERIFICAR PAGAMENTO:",[m
[32m +                erro[m
[32m +            );[m
[32m +        }[m
[32m +[m
[32m +        setTimeout([m
[32m +            verificar,[m
[32m +            intervalo[m
          );[m
[32m++<<<<<<< HEAD[m
[32m +    }[m
[32m +[m
[32m +    verificar();[m
[32m++=======[m
[32m+ [m
[32m+     if (!pixModal) {[m
[32m+         console.error([m
[32m+             "Modal Pix não encontrado."[m
[32m+         );[m
[32m+ [m
[32m+         return;[m
[32m+     }[m
[32m+ [m
[32m+     pixModal.style.display =[m
[32m+         "flex";[m
[32m+ [m
[32m+     document.body.classList.add([m
[32m+         "modal-aberto"[m
[32m+     );[m
[32m+ [m
[32m+     // ==========================================[m
[32m+     // QR CODE[m
[32m+     // ==========================================[m
[32m+ [m
[32m+     const qrCode =[m
[32m+         document.getElementById([m
[32m+             "qr-code"[m
[32m+         );[m
[32m+ [m
[32m+     if (qrCode) {[m
[32m+         if (dados.qrCode) {[m
[32m+             qrCode.src =[m
[32m+                 dados.qrCode;[m
[32m+ [m
[32m+             qrCode.style.display =[m
[32m+                 "block";[m
[32m+         } else {[m
[32m+             qrCode.style.display =[m
[32m+                 "none";[m
[32m+         }[m
[32m+     }[m
[32m+ [m
[32m+     // ==========================================[m
[32m+     // PIX COPIA E COLA[m
[32m+     // ==========================================[m
[32m+ [m
[32m+     const pixCopiaCola =[m
[32m+         document.getElementById([m
[32m+             "pix-copia-cola"[m
[32m+         );[m
[32m+ [m
[32m+     if (pixCopiaCola) {[m
[32m+         pixCopiaCola.value =[m
[32m+             dados.copyPaste || "";[m
[32m+     }[m
[32m+ [m
[32m+     // ==========================================[m
[32m+     // ID DO PEDIDO[m
[32m+     // ==========================================[m
[32m+ [m
[32m+     const pedidoId =[m
[32m+         document.getElementById([m
[32m+             "pedido-id"[m
[32m+         );[m
[32m+ [m
[32m+     if (pedidoId) {[m
[32m+         pedidoId.textContent =[m
[32m+             dados.pedidoId || "";[m
[32m+     }[m
[32m+ [m
[32m+     // ==========================================[m
[32m+     // STATUS[m
[32m+     // ==========================================[m
[32m+ [m
[32m+     const statusPix =[m
[32m+         document.getElementById([m
[32m+             "status-pix"[m
[32m+         );[m
[32m+ [m
[32m+     if (statusPix) {[m
[32m+         statusPix.textContent =[m
[32m+             "🟡 AGUARDANDO PAGAMENTO...";[m
[32m+     }[m
[32m+ [m
[32m+     // ==========================================[m
[32m+     // LIMPAR MENSAGEM[m
[32m+     // ==========================================[m
[32m+ [m
[32m+     const mensagem =[m
[32m+         document.getElementById([m
[32m+             "mensagem-pagamento"[m
[32m+         );[m
[32m+ [m
[32m+     if (mensagem) {[m
[32m+         mensagem.innerHTML = `[m
[32m+             <span>[m
[32m+                 Após realizar o pagamento, aguarde a confirmação automática.[m
[32m+             </span>[m
[32m+         `;[m
[32m+     }[m
[32m+ [m
[32m+     // ==========================================[m
[32m+     // VERIFICAR PAGAMENTO[m
[32m+     // ==========================================[m
[32m+ [m
[32m+     verificarPagamento([m
[32m+         dados.chargeId[m
[32m+     );[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
  }[m
  [m
[32m +[m
[32m +// ==========================================[m
[32m +// FECHAR PIX[m
[32m +// ==========================================[m
[32m +[m
[32m +function fecharPix() {[m
[32m +[m
[32m +    const modal =[m
[32m +        document.getElementById("modal-pix");[m
[32m +[m
[32m +    if (modal) {[m
[32m +        modal.classList.remove("ativo");[m
[32m +    }[m
[32m +}[m
[32m +[m
[32m +[m
  // ==========================================[m
  // COPIAR PIX[m
  // ==========================================[m
[36m@@@ -556,23 -718,35 +1131,40 @@@[m [masync function copiarPix() [m
              "pix-copia-cola"[m
          );[m
  [m
[32m++<<<<<<< HEAD[m
[32m +    if (!campo || !campo.value) {[m
[32m +[m
[32m++=======[m
[32m+     if ([m
[32m+         !campo ||[m
[32m+         !campo.value[m
[32m+     ) {[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
          alert([m
[31m -            "Código Pix não encontrado."[m
[32m +            "O PIX copia e cola ainda não foi gerado."[m
          );[m
  [m
          return;[m
      }[m
  [m
      try {[m
[32m+         if ([m
[32m+             navigator.clipboard &&[m
[32m+             navigator.clipboard.writeText[m
[32m+         ) {[m
[32m+             await navigator.clipboard.writeText([m
[32m+                 campo.value[m
[32m+             );[m
[32m+         } else {[m
[32m+             campo.select();[m
  [m
[31m-         await navigator.clipboard.writeText([m
[31m-             campo.value[m
[31m-         );[m
[32m+             document.execCommand([m
[32m+                 "copy"[m
[32m+             );[m
[32m+         }[m
  [m
          alert([m
[31m -            "Código Pix copiado!"[m
[32m +            "PIX copia e cola copiado!"[m
          );[m
  [m
      } catch (erro) {[m
[36m@@@ -587,6 -767,395 +1183,398 @@@[m
      }[m
  }[m
  [m
[32m++<<<<<<< HEAD[m
[32m++=======[m
[32m+ // ==========================================[m
[32m+ // FECHAR PIX[m
[32m+ // ==========================================[m
[32m+ [m
[32m+ function fecharPix() {[m
[32m+     const pixModal =[m
[32m+         document.getElementById([m
[32m+             "modal-pix"[m
[32m+         );[m
[32m+ [m
[32m+     if (pixModal) {[m
[32m+         pixModal.style.display =[m
[32m+             "none";[m
[32m+     }[m
[32m+ [m
[32m+     document.body.classList.remove([m
[32m+         "modal-aberto"[m
[32m+     );[m
[32m+ }[m
[32m+ [m
[32m+ // ==========================================[m
[32m+ // VERIFICAR PAGAMENTO[m
[32m+ // ==========================================[m
[32m+ [m
[32m+ async function verificarPagamento([m
[32m+     chargeId[m
[32m+ ) {[m
[32m+     if (!chargeId) {[m
[32m+         console.error([m
[32m+             "Charge ID não informado."[m
[32m+         );[m
[32m+ [m
[32m+         return;[m
[32m+     }[m
[32m+ [m
[32m+     // ==========================================[m
[32m+     // PARAR INTERVALO ANTERIOR[m
[32m+     // ==========================================[m
[32m+ [m
[32m+     if (intervaloPagamento) {[m
[32m+         clearInterval([m
[32m+             intervaloPagamento[m
[32m+         );[m
[32m+ [m
[32m+         intervaloPagamento =[m
[32m+             null;[m
[32m+     }[m
[32m+ [m
[32m+     // ==========================================[m
[32m+     // CONSULTAR IMEDIATAMENTE[m
[32m+     // ==========================================[m
[32m+ [m
[32m+     await consultarStatusPagamento([m
[32m+         chargeId[m
[32m+     );[m
[32m+ [m
[32m+     // ==========================================[m
[32m+     // CONSULTAR A CADA 5 SEGUNDOS[m
[32m+     // ==========================================[m
[32m+ [m
[32m+     intervaloPagamento =[m
[32m+         setInterval([m
[32m+             async () => {[m
[32m+                 await consultarStatusPagamento([m
[32m+                     chargeId[m
[32m+                 );[m
[32m+             },[m
[32m+             5000[m
[32m+         );[m
[32m+ }[m
[32m+ [m
[32m+ // ==========================================[m
[32m+ // CONSULTAR STATUS DO PAGAMENTO[m
[32m+ // ==========================================[m
[32m+ [m
[32m+ async function consultarStatusPagamento([m
[32m+     chargeId[m
[32m+ ) {[m
[32m+     try {[m
[32m+         const resposta =[m
[32m+             await fetch([m
[32m+                 `/api/pagamento/status/${encodeURIComponent([m
[32m+                     chargeId[m
[32m+                 )}`[m
[32m+             );[m
[32m+ [m
[32m+         let dados;[m
[32m+ [m
[32m+         try {[m
[32m+             dados =[m
[32m+                 await resposta.json();[m
[32m+         } catch (erroJson) {[m
[32m+             console.error([m
[32m+                 "Resposta inválida do servidor."[m
[32m+             );[m
[32m+ [m
[32m+             return;[m
[32m+         }[m
[32m+ [m
[32m+         console.log([m
[32m+             "STATUS DO PAGAMENTO:",[m
[32m+             dados[m
[32m+         );[m
[32m+ [m
[32m+         const statusPix =[m
[32m+             document.getElementById([m
[32m+                 "status-pix"[m
[32m+             );[m
[32m+ [m
[32m+         // ==========================================[m
[32m+         // PAGAMENTO APROVADO[m
[32m+         // ==========================================[m
[32m+ [m
[32m+         if ([m
[32m+             resposta.ok &&[m
[32m+             dados.status === "PAID"[m
[32m+         ) {[m
[32m+             if (statusPix) {[m
[32m+                 statusPix.textContent =[m
[32m+                     "✅ PAGAMENTO APROVADO!";[m
[32m+             }[m
[32m+ [m
[32m+             if (intervaloPagamento) {[m
[32m+                 clearInterval([m
[32m+                     intervaloPagamento[m
[32m+                 );[m
[32m+ [m
[32m+                 intervaloPagamento =[m
[32m+                     null;[m
[32m+             }[m
[32m+ [m
[32m+             mostrarPagamentoAprovado([m
[32m+                 dados[m
[32m+             );[m
[32m+ [m
[32m+             return;[m
[32m+         }[m
[32m+ [m
[32m+         // ==========================================[m
[32m+         // PAGAMENTO PENDENTE[m
[32m+         // ==========================================[m
[32m+ [m
[32m+         if ([m
[32m+             dados.status === "PENDING"[m
[32m+         ) {[m
[32m+             if (statusPix) {[m
[32m+                 statusPix.textContent =[m
[32m+                     "🟡 AGUARDANDO PAGAMENTO...";[m
[32m+             }[m
[32m+ [m
[32m+             return;[m
[32m+         }[m
[32m+ [m
[32m+         // ==========================================[m
[32m+         // PROCESSANDO[m
[32m+         // ==========================================[m
[32m+ [m
[32m+         if ([m
[32m+             dados.status === "PROCESSANDO"[m
[32m+         ) {[m
[32m+             if (statusPix) {[m
[32m+                 statusPix.textContent =[m
[32m+                     "🟡 PROCESSANDO PAGAMENTO...";[m
[32m+             }[m
[32m+ [m
[32m+             return;[m
[32m+         }[m
[32m+ [m
[32m+         // ==========================================[m
[32m+         // CANCELADO / EXPIRADO[m
[32m+         // ==========================================[m
[32m+ [m
[32m+         if ([m
[32m+             dados.status === "CANCELED" ||[m
[32m+             dados.status === "CANCELLED" ||[m
[32m+             dados.status === "EXPIRED"[m
[32m+         ) {[m
[32m+             if (statusPix) {[m
[32m+                 statusPix.textContent =[m
[32m+                     "❌ PAGAMENTO EXPIRADO OU CANCELADO.";[m
[32m+             }[m
[32m+ [m
[32m+             if (intervaloPagamento) {[m
[32m+                 clearInterval([m
[32m+                     intervaloPagamento[m
[32m+                 );[m
[32m+ [m
[32m+                 intervaloPagamento =[m
[32m+                     null;[m
[32m+             }[m
[32m+ [m
[32m+             return;[m
[32m+         }[m
[32m+ [m
[32m+         // ==========================================[m
[32m+         // ERRO NA RESPOSTA[m
[32m+         // ==========================================[m
[32m+ [m
[32m+         if (!resposta.ok) {[m
[32m+             console.error([m
[32m+                 "ERRO AO CONSULTAR PAGAMENTO:",[m
[32m+                 dados[m
[32m+             );[m
[32m+ [m
[32m+             if (statusPix) {[m
[32m+                 statusPix.textContent =[m
[32m+                     "⚠️ Erro ao verificar pagamento.";[m
[32m+             }[m
[32m+ [m
[32m+             return;[m
[32m+         }[m
[32m+ [m
[32m+         // ==========================================[m
[32m+         // OUTROS STATUS[m
[32m+         // ==========================================[m
[32m+ [m
[32m+         if (statusPix) {[m
[32m+             statusPix.textContent =[m
[32m+                 `STATUS: ${[m
[32m+                     dados.status ||[m
[32m+                     "DESCONHECIDO"[m
[32m+                 }`;[m
[32m+         }[m
[32m+ [m
[32m+     } catch (erro) {[m
[32m+         console.error([m
[32m+             "ERRO AO CONSULTAR PAGAMENTO:",[m
[32m+             erro[m
[32m+         );[m
[32m+     }[m
[32m+ }[m
[32m+ [m
[32m+ // ==========================================[m
[32m+ // PAGAMENTO APROVADO[m
[32m+ // ==========================================[m
[32m+ [m
[32m+ function mostrarPagamentoAprovado([m
[32m+     dados = {}[m
[32m+ ) {[m
[32m+     const statusPix =[m
[32m+         document.getElementById([m
[32m+             "status-pix"[m
[32m+         );[m
[32m+ [m
[32m+     if (statusPix) {[m
[32m+         statusPix.textContent =[m
[32m+             "✅ PAGAMENTO APROVADO!";[m
[32m+     }[m
[32m+ [m
[32m+     const mensagem =[m
[32m+         document.getElementById([m
[32m+             "mensagem-pagamento"[m
[32m+         );[m
[32m+ [m
[32m+     if (mensagem) {[m
[32m+         let textoEntrega =[m
[32m+             "";[m
[32m+ [m
[32m+         // ==========================================[m
[32m+         // PRODUTO ENTREGUE[m
[32m+         // ==========================================[m
[32m+ [m
[32m+         if ([m
[32m+             dados.contaEntregue === true[m
[32m+         ) {[m
[32m+             textoEntrega = `[m
[32m+                 <div class="entrega-sucesso">[m
[32m+                     <strong>[m
[32m+                         Produto entregue com sucesso![m
[32m+                     </strong>[m
[32m+                 </div>[m
[32m+             `;[m
[32m+         } else {[m
[32m+             textoEntrega = `[m
[32m+                 <div class="entrega-processando">[m
[32m+                     Pagamento aprovado. Processando entrega...[m
[32m+                 </div>[m
[32m+             `;[m
[32m+         }[m
[32m+ [m
[32m+         // ==========================================[m
[32m+         // EMAIL[m
[32m+         // ==========================================[m
[32m+ [m
[32m+         const mensagemEmail =[m
[32m+             dados.emailEnviado === true[m
[32m+                 ? `[m
[32m+                     <div class="email-sucesso">[m
[32m+                         📧 O produto foi enviado para seu e-mail.[m
[32m+                     </div>[m
[32m+                 `[m
[32m+                 : `[m
[32m+                     <div class="email-processando">[m
[32m+                         📧 O envio do e-mail está sendo processado.[m
[32m+                     </div>[m
[32m+                 `;[m
[32m+ [m
[32m+         mensagem.innerHTML = `[m
[32m+             <div class="pagamento-aprovado">[m
[32m+ [m
[32m+                 <strong>[m
[32m+                     Pagamento aprovado com sucesso![m
[32m+                 </strong>[m
[32m+ [m
[32m+                 ${textoEntrega}[m
[32m+ [m
[32m+                 ${mensagemEmail}[m
[32m+ [m
[32m+             </div>[m
[32m+         `;[m
[32m+     }[m
[32m+ [m
[32m+     // ==========================================[m
[32m+     // LIMPAR CARRINHO[m
[32m+     // ==========================================[m
[32m+ [m
[32m+     carrinho = [];[m
[32m+ [m
[32m+     atualizarContador();[m
[32m+     atualizarCarrinho();[m
[32m+ }[m
[32m+ [m
[32m+ // ==========================================[m
[32m+ // FECHAR MODAIS CLICANDO FORA[m
[32m+ // ==========================================[m
[32m+ [m
[32m+ window.addEventListener([m
[32m+     "click",[m
[32m+     event => {[m
[32m+         const modais = [[m
[32m+             "modal-carrinho",[m
[32m+             "modal-checkout",[m
[32m+             "modal-pix"[m
[32m+         ];[m
[32m+ [m
[32m+         modais.forEach(id => {[m
[32m+             const modal =[m
[32m+                 document.getElementById(id);[m
[32m+ [m
[32m+             if ([m
[32m+                 modal &&[m
[32m+                 event.target === modal[m
[32m+             ) {[m
[32m+                 modal.style.display =[m
[32m+                     "none";[m
[32m+ [m
[32m+                 document.body.classList.remove([m
[32m+                     "modal-aberto"[m
[32m+                 );[m
[32m+             }[m
[32m+         });[m
[32m+     }[m
[32m+ );[m
[32m+ [m
[32m+ // ==========================================[m
[32m+ // TECLA ESC[m
[32m+ // ==========================================[m
[32m+ [m
[32m+ document.addEventListener([m
[32m+     "keydown",[m
[32m+     event => {[m
[32m+         if (event.key !== "Escape") {[m
[32m+             return;[m
[32m+         }[m
[32m+ [m
[32m+         const modais = [[m
[32m+             "modal-carrinho",[m
[32m+             "modal-checkout",[m
[32m+             "modal-pix"[m
[32m+         ];[m
[32m+ [m
[32m+         modais.forEach(id => {[m
[32m+             const modal =[m
[32m+                 document.getElementById(id);[m
[32m+ [m
[32m+             if ([m
[32m+                 modal &&[m
[32m+                 modal.style.display === "flex"[m
[32m+             ) {[m
[32m+                 modal.style.display =[m
[32m+                     "none";[m
[32m+             }[m
[32m+         });[m
[32m+ [m
[32m+         document.body.classList.remove([m
[32m+             "modal-aberto"[m
[32m+         );[m
[32m+     }[m
[32m+ );[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
  [m
  // ==========================================[m
  // INICIALIZAÇÃO[m
[36m@@@ -594,12 -1163,150 +1582,161 @@@[m
  [m
  document.addEventListener([m
      "DOMContentLoaded",[m
[32m++<<<<<<< HEAD[m
[32m +    function () {[m
[32m++=======[m
[32m+     () => {[m
[32m+         atualizarContador();[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
  [m
          atualizarCarrinho();[m
  [m
          console.log([m
[32m++<<<<<<< HEAD[m
[32m +            "HYPE STORE: script.js carregado corretamente."[m
[32m +        );[m
[32m +    }[m
[31m- );[m
[32m++);[m
[32m++=======[m
[32m+             "=========================================="[m
[32m+         );[m
[32m+ [m
[32m+         console.log([m
[32m+             "HYPE STORE - SCRIPT CARREGADO"[m
[32m+         );[m
[32m+ [m
[32m+         console.log([m
[32m+             "Sistema de carrinho ativo."[m
[32m+         );[m
[32m+ [m
[32m+         console.log([m
[32m+             "Sistema de checkout ativo."[m
[32m+         );[m
[32m+ [m
[32m+         console.log([m
[32m+             "Sistema PIX ativo."[m
[32m+         );[m
[32m+ [m
[32m+         console.log([m
[32m+             "=========================================="[m
[32m+         );[m
[32m+     }[m
[32m+ );[m
[32m+ /* =========================================================[m
[32m+    PREÇOS PÚBLICOS — CARREGADOS DO SERVIDOR[m
[32m+ ========================================================= */[m
[32m+ [m
[32m+ async function carregarPrecosPublicos() {[m
[32m+     try {[m
[32m+         const resposta = await fetch("/api/precos", {[m
[32m+             cache: "no-store"[m
[32m+         });[m
[32m+ [m
[32m+         if (!resposta.ok) {[m
[32m+             throw new Error("Não foi possível carregar os preços.");[m
[32m+         }[m
[32m+ [m
[32m+         const dados = await resposta.json();[m
[32m+ [m
[32m+         const mensal = Number(dados.mensal);[m
[32m+         const anual = Number(dados.anual);[m
[32m+ [m
[32m+         if (!Number.isFinite(mensal) || !Number.isFinite(anual)) {[m
[32m+             throw new Error("Preços inválidos recebidos do servidor.");[m
[32m+         }[m
[32m+ [m
[32m+         const formatar = valor =>[m
[32m+             Number(valor).toLocaleString("pt-BR", {[m
[32m+                 style: "currency",[m
[32m+                 currency: "BRL"[m
[32m+             });[m
[32m+ [m
[32m+         /* HERO — Nitro Mensal */[m
[32m+         const precoHero = document.querySelector(".hero-card-price strong");[m
[32m+ [m
[32m+         if (precoHero) {[m
[32m+             precoHero.textContent = formatar(mensal);[m
[32m+         }[m
[32m+ [m
[32m+         const botaoHero = document.querySelector([m
[32m+             ".hero-card-button"[m
[32m+         );[m
[32m+ [m
[32m+         if (botaoHero) {[m
[32m+             botaoHero.onclick = function () {[m
[32m+                 adicionarCarrinho([m
[32m+                     "Nitro Discord Mensal",[m
[32m+                     mensal,[m
[32m+                     "Mensal"[m
[32m+                 );[m
[32m+             };[m
[32m+         }[m
[32m+ [m
[32m+         /* PRODUTO — Nitro Mensal */[m
[32m+         const cardMensal = document.querySelector([m
[32m+             '.product-card[data-produto="nitro discord mensal"]'[m
[32m+         );[m
[32m+ [m
[32m+         if (cardMensal) {[m
[32m+             const preco = cardMensal.querySelector(".price strong");[m
[32m+ [m
[32m+             if (preco) {[m
[32m+                 preco.textContent = formatar(mensal);[m
[32m+             }[m
[32m+ [m
[32m+             const botao = cardMensal.querySelector(".buy-button");[m
[32m+ [m
[32m+             if (botao) {[m
[32m+                 botao.onclick = function () {[m
[32m+                     adicionarCarrinho([m
[32m+                         "Nitro Discord Mensal",[m
[32m+                         mensal,[m
[32m+                         "Mensal"[m
[32m+                     );[m
[32m+                 };[m
[32m+             }[m
[32m+         }[m
[32m+ [m
[32m+         /* PRODUTO — Nitro Anual */[m
[32m+         const cardAnual = document.querySelector([m
[32m+             '.product-card[data-produto="nitro discord anual"]'[m
[32m+         );[m
[32m+ [m
[32m+         if (cardAnual) {[m
[32m+             const preco = cardAnual.querySelector(".price strong");[m
[32m+ [m
[32m+             if (preco) {[m
[32m+                 preco.textContent = formatar(anual);[m
[32m+             }[m
[32m+ [m
[32m+             const botao = cardAnual.querySelector(".buy-button");[m
[32m+ [m
[32m+             if (botao) {[m
[32m+                 botao.onclick = function () {[m
[32m+                     adicionarCarrinho([m
[32m+                         "Nitro Discord Anual",[m
[32m+                         anual,[m
[32m+                         "Anual"[m
[32m+                     );[m
[32m+                 };[m
[32m+             }[m
[32m+         }[m
[32m+ [m
[32m+         console.log([m
[32m+             "[HYPE STORE] Preços carregados:",[m
[32m+             {[m
[32m+                 mensal,[m
[32m+                 anual[m
[32m+             }[m
[32m+         );[m
[32m+ [m
[32m+     } catch (erro) {[m
[32m+         console.error([m
[32m+             "[HYPE STORE] Erro ao carregar preços:",[m
[32m+             erro[m
[32m+         );[m
[32m+     }[m
[32m+ }[m
[32m+ [m
[32m+ window.addEventListener("DOMContentLoaded", carregarPrecosPublicos);[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
[1mdiff --cc server.js[m
[1mindex aad97ff,c552104..0000000[m
[1m--- a/server.js[m
[1m+++ b/server.js[m
[36m@@@ -1,4 -1,3 +1,7 @@@[m
[32m++<<<<<<< HEAD[m
[32m +require("dotenv").config();[m
[32m++=======[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
  [m
  const express = require("express");[m
  const fs = require("fs");[m
[36m@@@ -82,26 -189,26 +193,42 @@@[m [mfunction verificarSessaoAdmin(req) [m
  }[m
  [m
  [m
[31m- // ==========================================[m
[31m- // LER ESTOQUE[m
[31m- // ==========================================[m
[32m+ function exigirSessaoAdmin(req, res, next) {[m
[32m+     if (!verificarSessaoAdmin(req)) {[m
[32m+         return res.status(401).json({[m
[32m+             sucesso: false,[m
[32m+             erro: "Não autorizado."[m
[32m+         });[m
[32m+     }[m
  [m
[31m- function lerEstoque() {[m
[32m+     next();[m
[32m+ }[m
[32m+ /* =========================================================[m
[32m+    ARQUIVOS JSON[m
[32m+ ========================================================= */[m
  [m
[32m+ function lerJSON(caminho, valorPadrao) {[m
      try {[m
[32m++<<<<<<< HEAD[m
[32m +[m
[32m +        if (!fs.existsSync(CAMINHO_ESTOQUE)) {[m
[32m +[m
[32m +            console.error([m
[32m +                "ARQUIVO estoque.json NÃO ENCONTRADO."[m
[32m +            );[m
[32m +[m
[32m +            return {};[m
[32m +        }[m
[32m +[m
[32m +        const dados =[m
[32m +            fs.readFileSync([m
[32m +                CAMINHO_ESTOQUE,[m
[32m++=======[m
[32m+         if (!fs.existsSync(caminho)) {[m
[32m+             fs.writeFileSync([m
[32m+                 caminho,[m
[32m+                 JSON.stringify(valorPadrao, null, 2),[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
                  "utf8"[m
              );[m
  [m
[36m@@@ -154,179 -235,129 +255,150 @@@[m
      }[m
  }[m
  [m
[32m+ function salvarJSON(caminho, dados) {[m
[32m+     fs.writeFileSync([m
[32m+         caminho,[m
[32m+         JSON.stringify(dados, null, 2),[m
[32m+         "utf8"[m
[32m+     );[m
[32m+ }[m
  [m
[31m- // ==========================================[m
[31m- // IDENTIFICAR PRODUTO[m
[31m- // ==========================================[m
[31m- [m
[31m- function obterDadosProduto(itens) {[m
[31m- [m
[31m-     const item =[m
[31m-         Array.isArray(itens) &&[m
[31m-         itens.length > 0[m
[31m-             ? itens[0][m
[31m-             : {};[m
[31m- [m
[31m-     const nomeProduto =[m
[31m-         String([m
[31m-             item.nome || ""[m
[31m-         ).trim();[m
[32m+ /* =========================================================[m
[32m+    PEDIDOS[m
[32m+ ========================================================= */[m
  [m
[31m-     const opcao =[m
[31m-         String([m
[31m-             item.opcao || ""[m
[31m-         ).trim();[m
[32m+ function lerPedidos() {[m
[32m+     const dados = lerJSON(CAMINHO_PEDIDOS, []);[m
  [m
[31m-     let chaveEstoque =[m
[31m-         nomeProduto;[m
[32m+     if (Array.isArray(dados)) {[m
[32m+         return dados;[m
[32m+     }[m
  [m
      if ([m
[31m-         nomeProduto.toLowerCase() ===[m
[31m-         "nitro discord"[m
[32m+         dados &&[m
[32m+         Array.isArray(dados.pedidos)[m
      ) {[m
[32m++<<<<<<< HEAD[m
[32m +[m
[31m-         if ([m
[31m-             opcao.toLowerCase() ===[m
[31m-             "anual"[m
[31m-         ) {[m
[31m- [m
[31m-             chaveEstoque =[m
[31m-                 "Nitro Discord Anual";[m
[31m- [m
[31m-         } else if ([m
[31m-             opcao.toLowerCase() ===[m
[31m-             "mensal"[m
[31m-         ) {[m
[31m- [m
[31m-             chaveEstoque =[m
[31m-                 "Nitro Discord Mensal";[m
[31m-         }[m
[32m++        return {[m
[32m++            sucesso: false,[m
[32m++            erro:[m
[32m++                `Estoque do produto "${chaveEstoque}" não encontrado.`[m
[32m++        };[m
[32m++=======[m
[32m+         return dados.pedidos;[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
      }[m
  [m
[31m-     return {[m
[31m-         nomeProduto,[m
[31m-         opcao,[m
[31m-         chaveEstoque[m
[31m-     };[m
[32m+     return [];[m
  }[m
  [m
[32m+ function salvarPedidos(pedidos) {[m
[32m+     salvarJSON([m
[32m+         CAMINHO_PEDIDOS,[m
[32m+         Array.isArray(pedidos) ? pedidos : [][m
[32m+     );[m
[32m+ }[m
  [m
[31m- // ==========================================[m
[31m- // VERIFICAR ESTOQUE[m
[31m- // ==========================================[m
[31m- [m
[31m- function existeEstoqueDisponivel([m
[31m-     chaveEstoque[m
[31m- ) {[m
[31m- [m
[31m-     const estoque =[m
[31m-         lerEstoque();[m
[31m- [m
[31m-     if ([m
[31m-         !estoque ||[m
[31m-         !Array.isArray([m
[31m-             estoque[chaveEstoque][m
[31m-         )[m
[31m-     ) {[m
[32m+ function gerarIdPedido() {[m
[32m+     return `PED-${Date.now()}-${crypto[m
[32m+         .randomBytes(3)[m
[32m+         .toString("hex")[m
[32m+         .toUpperCase()}`;[m
[32m+ }[m
  [m
[31m-         return false;[m
[31m-     }[m
[32m+ function encontrarPedido(id) {[m
[32m+     const pedidos = lerPedidos();[m
  [m
[31m-     return estoque[[m
[31m-         chaveEstoque[m
[31m-     ].some([m
[31m-         conta =>[m
[31m-             conta &&[m
[31m-             conta.status ===[m
[31m-                 "disponivel"[m
[32m+     return pedidos.find([m
[32m+         pedido => String(pedido.id) === String(id)[m
      );[m
  }[m
  [m
[32m+ function atualizarPedido(id, alteracoes) {[m
[32m+     const pedidos = lerPedidos();[m
  [m
[31m- // ==========================================[m
[31m- // ENTREGAR PRODUTO[m
[31m- // ==========================================[m
[32m+     const indice = pedidos.findIndex([m
[32m+         pedido => String(pedido.id) === String(id)[m
[32m+     );[m
[32m+ [m
[32m+     if (indice === -1) {[m
[32m+         return null;[m
[32m+     }[m
  [m
[31m- function entregarProduto([m
[31m-     pedido[m
[31m- ) {[m
[32m+     pedidos[indice] = {[m
[32m+         ...pedidos[indice],[m
[32m+         ...alteracoes[m
[32m+     };[m
  [m
[31m-     const estoque =[m
[31m-         lerEstoque();[m
[32m+     salvarPedidos(pedidos);[m
  [m
[31m-     const dadosProduto =[m
[31m-         obterDadosProduto([m
[31m-             pedido.itens[m
[31m-         );[m
[32m+     return pedidos[indice];[m
[32m+ }[m
  [m
[31m-     const chaveEstoque =[m
[31m-         pedido.chaveEstoque ||[m
[31m-         dadosProduto.chaveEstoque;[m
[32m+ /* =========================================================[m
[32m+    ESTOQUE[m
[32m+ ========================================================= */[m
  [m
[31m-     if ([m
[31m-         !estoque ||[m
[31m-         !Array.isArray([m
[31m-             estoque[chaveEstoque][m
[31m-         )[m
[31m-     ) {[m
[32m+ function lerEstoque() {[m
[32m+     const dados = lerJSON(CAMINHO_ESTOQUE, {[m
[32m+         "Nitro Discord Mensal": [],[m
[32m+         "Nitro Discord Anual": [][m
[32m+     });[m
  [m
[32m+     if (!dados || typeof dados !== "object" || Array.isArray(dados)) {[m
          return {[m
[32m++<<<<<<< HEAD[m
[32m +            sucesso: false,[m
[32m +            erro:[m
[31m-                 `Estoque do produto "${chaveEstoque}" não encontrado.`[m
[32m++                `Produto "${chaveEstoque}" está sem estoque.`[m
[32m++=======[m
[32m+             "Nitro Discord Mensal": [],[m
[32m+             "Nitro Discord Anual": [][m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
          };[m
      }[m
  [m
[31m-     const indice =[m
[31m-         estoque[[m
[31m-             chaveEstoque[m
[31m-         ].findIndex([m
[31m-             conta =>[m
[31m-                 conta &&[m
[31m-                 conta.status ===[m
[31m-                     "disponivel"[m
[31m-         );[m
[32m+     return dados;[m
[32m+ }[m
  [m
[31m-     if (indice === -1) {[m
[32m+ function salvarEstoque(estoque) {[m
[32m+     salvarJSON(CAMINHO_ESTOQUE, estoque);[m
[32m+ }[m
  [m
[31m-         return {[m
[31m-             sucesso: false,[m
[31m-             erro:[m
[31m-                 `Produto "${chaveEstoque}" está sem estoque.`[m
[31m-         };[m
[31m-     }[m
[32m+ function obterDadosProduto(produto, opcao) {[m
[32m+     const estoque = lerEstoque();[m
  [m
[31m-     const conta =[m
[31m-         estoque[[m
[31m-             chaveEstoque[m
[31m-         ][indice];[m
[31m- [m
[31m-     estoque[[m
[31m-         chaveEstoque[m
[31m-     ][indice].status =[m
[31m-         "vendida";[m
[31m- [m
[31m-     estoque[[m
[31m-         chaveEstoque[m
[31m-     ][indice].vendidaEm =[m
[31m-         new Date().toISOString();[m
[31m- [m
[31m-     estoque[[m
[31m-         chaveEstoque[m
[31m-     ][indice].pedidoId =[m
[31m-         pedido.id;[m
[31m- [m
[31m-     const salvo =[m
[31m-         salvarEstoque([m
[31m-             estoque[m
[31m-         );[m
[32m+     if (produto === "Nitro Discord") {[m
[32m+         if ([m
[32m+             String(opcao).toLowerCase() === "mensal"[m
[32m+         ) {[m
[32m+             return {[m
[32m+                 chave: "Nitro Discord Mensal",[m
[32m+                 itens: estoque["Nitro Discord Mensal"] || [][m
[32m+             };[m
[32m+         }[m
  [m
[31m-     if (!salvo) {[m
[32m+         if ([m
[32m+             String(opcao).toLowerCase() === "anual"[m
[32m+         ) {[m
[32m+             return {[m
[32m+                 chave: "Nitro Discord Anual",[m
[32m+                 itens: estoque["Nitro Discord Anual"] || [][m
[32m+             };[m
[32m+         }[m
[32m+     }[m
  [m
[32m+     if (estoque[produto]) {[m
          return {[m
[32m++<<<<<<< HEAD[m
[32m +            sucesso: false,[m
[32m +            erro:[m
[32m +                "Não foi possível atualizar o estoque."[m
[32m++=======[m
[32m+             chave: produto,[m
[32m+             itens: estoque[produto][m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
          };[m
      }[m
  [m
[36m@@@ -343,180 -367,347 +408,377 @@@[m
      };[m
  }[m
  [m
[32m+ function encontrarEstoqueDisponivel(produto, opcao) {[m
[32m+     const dados = obterDadosProduto(produto, opcao);[m
  [m
[32m++<<<<<<< HEAD[m
[32m +// ==========================================[m
[32m +// EMAIL[m
[32m +// ==========================================[m
[32m +[m
[32m +function criarTransportador() {[m
[32m +[m
[32m +    if ([m
[32m +        !process.env.EMAIL_USUARIO ||[m
[32m +        !process.env.EMAIL_SENHA_APP[m
[32m +    ) {[m
[32m +[m
[32m +        console.error([m
[32m +            "EMAIL_USUARIO ou EMAIL_SENHA_APP não configurados."[m
[32m++=======[m
[32m+     const indice = dados.itens.findIndex(item => {[m
[32m+         return ([m
[32m+             !item.status ||[m
[32m+             String(item.status).toLowerCase() === "disponivel"[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
          );[m
[32m+     });[m
  [m
[32m+     if (indice === -1) {[m
          return null;[m
      }[m
  [m
[31m-     return nodemailer.createTransport({[m
[31m-         service: "gmail",[m
[31m-         auth: {[m
[31m-             user:[m
[31m-                 process.env.EMAIL_USUARIO,[m
[31m-             pass:[m
[31m-                 process.env.EMAIL_SENHA_APP[m
[31m-         }[m
[31m-     });[m
[32m+     return {[m
[32m+         chave: dados.chave,[m
[32m+         indice,[m
[32m+         item: dados.itens[indice][m
[32m+     };[m
  }[m
  [m
[32m+ function entregarProduto(pedido) {[m
[32m+     const estoque = lerEstoque();[m
  [m
[31m- // ==========================================[m
[31m- // ENVIAR PRODUTO POR EMAIL[m
[31m- // ==========================================[m
[32m+     const dados = obterDadosProduto([m
[32m+         pedido.produto,[m
[32m+         pedido.opcao[m
[32m+     );[m
  [m
[31m- async function enviarEmailProduto([m
[31m-     pedido,[m
[31m-     entrega[m
[31m- ) {[m
[32m+     if (!estoque[dados.chave]) {[m
[32m+         return {[m
[32m+             sucesso: false,[m
[32m+             erro: "Produto não encontrado no estoque."[m
[32m+         };[m
[32m+     }[m
  [m
[31m-     const transporter =[m
[31m-         criarTransportador();[m
[32m+     const indice = estoque[dados.chave].findIndex(item => {[m
[32m+         return ([m
[32m+             !item.status ||[m
[32m+             String(item.status).toLowerCase() === "disponivel"[m
[32m+         );[m
[32m+     });[m
  [m
[31m-     if (!transporter) {[m
[31m-         return false;[m
[32m+     if (indice === -1) {[m
[32m+         return {[m
[32m+             sucesso: false,[m
[32m+             erro: "Produto sem estoque."[m
[32m+         };[m
      }[m
  [m
[31m-     const texto = `[m
[31m- Olá![m
[31m- [m
[31m- Seu pagamento foi confirmado com sucesso.[m
[32m+     const item = estoque[dados.chave][indice];[m
  [m
[31m- PEDIDO:[m
[31m- ${pedido.id}[m
[32m+     estoque[dados.chave][indice] = {[m
[32m+         ...item,[m
[32m+         status: "vendida",[m
[32m+         vendidaEm: new Date().toISOString(),[m
[32m+         pedidoId: pedido.id[m
[32m+     };[m
  [m
[31m- PRODUTO:[m
[31m- ${pedido.produto || "Produto digital"}[m
[32m+     salvarEstoque(estoque);[m
  [m
[31m- ${pedido.opcao ? `OPÇÃO:\n${pedido.opcao}\n` : ""}[m
[32m+     return {[m
[32m+         sucesso: true,[m
[32m+         dados: item[m
[32m+     };[m
[32m+ }[m
  [m
[31m- DADOS DE ACESSO:[m
[32m+ /* =========================================================[m
[32m+    E-MAIL[m
[32m+ ========================================================= */[m
  [m
[31m- E-mail/Login:[m
[31m- ${entrega.email}[m
[32m+ let transporter = null;[m
  [m
[31m- Senha:[m
[31m- ${entrega.senha}[m
[32m+ if (EMAIL_USUARIO && EMAIL_SENHA_APP) {[m
[32m+     transporter = nodemailer.createTransport({[m
[32m+         service: "gmail",[m
[32m+         auth: {[m
[32m+             user: EMAIL_USUARIO,[m
[32m+             pass: EMAIL_SENHA_APP[m
[32m+         }[m
[32m+     });[m
[32m+ }[m
  [m
[31m- Obrigado por comprar na HYPE STORE![m
[31m- `;[m
[32m+ async function enviarEmailEntrega(pedido, dadosProduto) {[m
[32m+     if (!transporter) {[m
[32m+         throw new Error("E-mail não configurado.");[m
[32m+     }[m
  [m
[31m-     try {[m
[32m++<<<<<<< HEAD[m
[32m++    const texto = `[m
[32m++Olá![m
[32m++=======[m
[32m+     const destinatario = pedido.email;[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
  [m
[31m-         await transporter.sendMail({[m
[32m+     if (!destinatario) {[m
[32m+         throw new Error("Pedido sem e-mail.");[m
[32m+     }[m
  [m
[31m-             from:[m
[31m-                 `"HYPE STORE" <${process.env.EMAIL_USUARIO}>`,[m
[32m+     const emailProduto =[m
[32m+         dadosProduto.email ||[m
[32m+         dadosProduto.usuario ||[m
[32m+         "";[m
  [m
[31m-             to:[m
[31m-                 pedido.email,[m
[32m+     const senhaProduto =[m
[32m+         dadosProduto.senha ||[m
[32m+         "";[m
  [m
[31m-             subject:[m
[31m-                 `HYPE STORE - Pedido ${pedido.id} aprovado`,[m
[32m++<<<<<<< HEAD[m
[32m++${pedido.opcao ? `OPÇÃO:\n${pedido.opcao}\n` : ""}[m
[32m++=======[m
[32m+     const html = `[m
[32m+         <div style="font-family:Arial,sans-serif;background:#111;color:#fff;padding:30px">[m
[32m+             <div style="max-width:600px;margin:auto;background:#1a1a1a;padding:30px;border-radius:15px">[m
[32m+                 <h1 style="color:#9b59ff">HYPE STORE</h1>[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
[32m+ [m
[32m+                 <h2>Pagamento aprovado!</h2>[m
[32m+ [m
[32m+                 <p>Olá!</p>[m
[32m+ [m
[32m+                 <p>[m
[32m+                     Seu pedido <strong>${pedido.id}</strong> foi aprovado.[m
[32m+                 </p>[m
[32m+ [m
[32m+                 <hr style="border-color:#333">[m
[32m+ [m
[32m+                 <h3>Produto</h3>[m
[32m+ [m
[32m+                 <p>[m
[32m+                     <strong>${pedido.produto}</strong>[m
[32m+                     ${pedido.opcao ? `- ${pedido.opcao}` : ""}[m
[32m+                 </p>[m
[32m+ [m
[32m+                 <h3>Dados da conta</h3>[m
[32m+ [m
[32m+                 <div style="background:#0d0d0d;padding:20px;border-radius:10px">[m
[32m+                     <p>[m
[32m+                         <strong>E-mail/Usuário:</strong><br>[m
[32m+                         ${emailProduto || "Não informado"}[m
[32m+                     </p>[m
[32m+ [m
[32m+                     <p>[m
[32m+                         <strong>Senha:</strong><br>[m
[32m+                         ${senhaProduto || "Não informada"}[m
[32m+                     </p>[m
[32m+                 </div>[m
[32m+ [m
[32m+                 <br>[m
[32m+ [m
[32m+                 <p>[m
[32m+                     Obrigado por comprar na HYPE STORE![m
[32m+                 </p>[m
[32m+             </div>[m
[32m+         </div>[m
[32m+     `;[m
[32m+ [m
[32m+     await transporter.sendMail({[m
[32m+         from: `"HYPE STORE" <${EMAIL_USUARIO}>`,[m
[32m+         to: destinatario,[m
[32m+         subject: `HYPE STORE - Pedido ${pedido.id} aprovado`,[m
[32m+         html[m
[32m+     });[m
[32m+ }[m
  [m
[31m-             text:[m
[31m-                 texto[m
[31m-         });[m
[32m+ /* =========================================================[m
[32m+    ENTREGA AUTOMÁTICA[m
[32m+ ========================================================= */[m
  [m
[31m-         console.log([m
[31m-             "E-MAIL ENVIADO PARA:",[m
[31m-             pedido.email[m
[31m-         );[m
[32m+ const pedidosEmProcessamento = new Set();[m
  [m
[31m-         return true;[m
[32m+ async function processarPedidoPago(pedido) {[m
[32m+     if (!pedido) return;[m
  [m
[31m-     } catch (erro) {[m
[32m+     if (pedido.statusPagamento !== "PAID") {[m
[32m+         return;[m
[32m+     }[m
  [m
[31m-         console.error([m
[31m-             "ERRO AO ENVIAR E-MAIL:",[m
[31m-             erro[m
[31m-         );[m
[32m+     if ([m
[32m+         pedido.entregue === true &&[m
[32m+         pedido.emailEnviado === true[m
[32m+     ) {[m
[32m+         return;[m
[32m+     }[m
  [m
[31m-         return false;[m
[32m+     if (pedidosEmProcessamento.has(pedido.id)) {[m
[32m+         return;[m
      }[m
[31m- }[m
  [m
[32m+     pedidosEmProcessamento.add(pedido.id);[m
  [m
[31m- // ==========================================[m
[31m- // STATUS DO SERVIDOR[m
[31m- // ==========================================[m
[32m+     try {[m
[32m+         let pedidoAtual = encontrarPedido(pedido.id);[m
  [m
[31m- app.get([m
[31m-     "/api/status",[m
[31m-     (req, res) => {[m
[32m+         if (!pedidoAtual) {[m
[32m+             return;[m
[32m+         }[m
  [m
[31m-         res.json({[m
[31m-             online: true,[m
[31m-             mensagem:[m
[31m-                 "Servidor da HYPE STORE funcionando!"[m
[31m-         });[m
[31m-     }[m
[31m- );[m
[32m+         let dadosEntrega = null;[m
  [m
[32m+         if (!pedidoAtual.entregue) {[m
[32m+             const entrega = entregarProduto(pedidoAtual);[m
  [m
[31m- // ==========================================[m
[31m- // CONSULTAR ESTOQUE[m
[31m- // ==========================================[m
[32m+             if (!entrega.sucesso) {[m
[32m+                 atualizarPedido(pedidoAtual.id, {[m
[32m+                     status: "PAGO_SEM_ESTOQUE",[m
[32m+                     erroEntrega: entrega.erro[m
[32m+                 });[m
  [m
[31m- app.get([m
[31m-     "/api/estoque/:produto",[m
[31m-     (req, res) => {[m
[32m+                 console.error([m
[32m+                     `Pedido ${pedidoAtual.id}:`,[m
[32m+                     entrega.erro[m
[32m+                 );[m
  [m
[31m-         const produto =[m
[31m-             decodeURIComponent([m
[31m-                 req.params.produto[m
[31m-             );[m
[32m+                 return;[m
[32m+             }[m
[32m+ [m
[32m+             dadosEntrega = entrega.dados;[m
  [m
[31m-         const disponivel =[m
[31m-             existeEstoqueDisponivel([m
[31m-                 produto[m
[32m+             pedidoAtual = atualizarPedido([m
[32m+                 pedidoAtual.id,[m
[32m+                 {[m
[32m+                     entregue: true,[m
[32m+                     status: "PAGO"[m
[32m+                 }[m
              );[m
[32m+         } else {[m
[32m+             dadosEntrega = pedidoAtual.dadosEntrega || null;[m
[32m+         }[m
  [m
[31m-         res.json({[m
[31m-             produto,[m
[31m-             disponivel[m
[31m-         });[m
[32m+         if ([m
[32m+             dadosEntrega &&[m
[32m+             !pedidoAtual.dadosEntrega[m
[32m+         ) {[m
[32m+             pedidoAtual = atualizarPedido([m
[32m+                 pedidoAtual.id,[m
[32m+                 {[m
[32m+                     dadosEntrega[m
[32m+                 }[m
[32m+             );[m
[32m+         }[m
[32m+ [m
[32m+         if ([m
[32m+             !pedidoAtual.emailEnviado &&[m
[32m+             dadosEntrega[m
[32m+         ) {[m
[32m+             try {[m
[32m+                 await enviarEmailEntrega([m
[32m+                     pedidoAtual,[m
[32m+                     dadosEntrega[m
[32m+                 );[m
[32m+ [m
[32m+                 atualizarPedido([m
[32m+                     pedidoAtual.id,[m
[32m+                     {[m
[32m+                         emailEnviado: true,[m
[32m+                         emailEnviadoEm: new Date().toISOString(),[m
[32m+                         status: "ENTREGUE"[m
[32m+                     }[m
[32m+                 );[m
[32m+ [m
[32m+                 console.log([m
[32m+                     `Pedido ${pedidoAtual.id}: entrega enviada por e-mail.`[m
[32m+                 );[m
[32m+             } catch (erroEmail) {[m
[32m+                 console.error([m
[32m+                     `Erro ao enviar e-mail do pedido ${pedidoAtual.id}:`,[m
[32m+                     erroEmail.message[m
[32m+                 );[m
[32m+ [m
[32m+                 atualizarPedido([m
[32m+                     pedidoAtual.id,[m
[32m+                     {[m
[32m+                         erroEmail: erroEmail.message,[m
[32m+                         status: "PAGO_ENTREGA_PENDENTE"[m
[32m+                     }[m
[32m+                 );[m
[32m+             }[m
[32m+         }[m
[32m+     } finally {[m
[32m+         pedidosEmProcessamento.delete(pedido.id);[m
      }[m
[31m- );[m
[32m+ }[m
  [m
[32m+ /* =========================================================[m
[32m+    STATUS[m
[32m+ ========================================================= */[m
[32m+ [m
[32m+ app.get("/api/status", (req, res) => {[m
[32m+     res.json({[m
[32m+         online: true,[m
[32m+         mensagem: "Servidor da HYPE STORE funcionando!",[m
[32m+         turbofy: TURBOFY_API,[m
[32m+         estoque: CAMINHO_ESTOQUE,[m
[32m+         pedidos: CAMINHO_PEDIDOS,[m
[32m+         tickets: CAMINHO_TICKETS[m
[32m+     });[m
[32m+ });[m
  [m
[31m- // ==========================================[m
[31m- // CONSULTAR PEDIDO[m
[31m- // ==========================================[m
[32m+ /* =========================================================[m
[32m+    ESTOQUE API[m
[32m+ ========================================================= */[m
  [m
[31m- app.get([m
[31m-     "/api/pedidos/:id",[m
[31m-     (req, res) => {[m
[32m+ app.get("/api/estoque/:produto", (req, res) => {[m
[32m+     const produto = decodeURIComponent(req.params.produto);[m
  [m
[31m-         const pedidos =[m
[31m-             lerPedidos();[m
[32m+     const estoque = lerEstoque();[m
  [m
[31m-         const pedido =[m
[31m-             pedidos.find([m
[31m-                 item =>[m
[31m-                     String(item.id) ===[m
[31m-                     String(req.params.id)[m
[31m-             );[m
[32m+     const itens = estoque[produto] || [];[m
  [m
[31m-         if (!pedido) {[m
[32m+     const disponiveis = itens.filter(item => {[m
[32m+         return ([m
[32m+             !item.status ||[m
[32m+             String(item.status).toLowerCase() === "disponivel"[m
[32m+         );[m
[32m+     });[m
  [m
[31m-             return res.status(404).json({[m
[32m+     res.json({[m
[32m+         sucesso: true,[m
[32m+         produto,[m
[32m+         estoque: disponiveis.length[m
[32m+     });[m
[32m+ });[m
[32m+ [m
[32m+ /* =========================================================[m
[32m+    PEDIDOS[m
[32m+ ========================================================= */[m
[32m+ [m
[32m+ app.post("/api/pedidos", (req, res) => {[m
[32m+     try {[m
[32m+         const {[m
[32m+             nome,[m
[32m+             email,[m
[32m+             discord,[m
[32m+             produto,[m
[32m+             opcao,[m
[32m+             valor[m
[32m+         } = req.body || {};[m
[32m+ [m
[32m+         if (!email) {[m
[32m+             return res.status(400).json({[m
                  sucesso: false,[m
[32m++<<<<<<< HEAD[m
[32m +                erro:[m
[32m +                    "Pedido não encontrado."[m
[32m++=======[m
[32m+                 erro: "E-mail é obrigatório."[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
[32m+             });[m
[32m+         }[m
[32m+ [m
[32m+         if (!produto) {[m
[32m+             return res.status(400).json({[m
[32m+                 sucesso: false,[m
[32m+                 erro: "Produto é obrigatório."[m
              });[m
          }[m
  [m
[36m@@@ -524,968 -737,338 +808,1185 @@@[m
              sucesso: true,[m
              pedido[m
          });[m
[32m+     } catch (erro) {[m
[32m+         console.error([m
[32m+             "Erro ao criar pedido:",[m
[32m+             erro[m
[32m+         );[m
[32m+ [m
[32m+         res.status(500).json({[m
[32m+             sucesso: false,[m
[32m+             erro: "Erro interno ao criar pedido."[m
[32m+         });[m
      }[m
[32m++<<<<<<< HEAD[m
[32m +);[m
[32m +[m
[32m +[m
[32m +// ==========================================[m
[32m +// CRIAR PEDIDO[m
[32m +// ==========================================[m
[32m +[m
[32m +app.post([m
[32m +    "/api/pedidos",[m
[32m +    (req, res) => {[m
[32m +[m
[32m +        try {[m
[32m +[m
[32m +            const {[m
[32m +                nome,[m
[32m +                discord,[m
[32m +                email,[m
[32m +                itens[m
[32m +            } = req.body;[m
[32m +[m
[32m +            if ([m
[32m +                !nome ||[m
[32m +                !discord ||[m
[32m +                !email ||[m
[32m +                !Array.isArray(itens) ||[m
[32m +                itens.length === 0[m
[32m +            ) {[m
[32m +[m
[32m +                return res.status(400).json({[m
[32m +                    sucesso: false,[m
[32m +                    erro:[m
[32m +                        "Dados do pedido incompletos."[m
[32m +                });[m
[32m +            }[m
[32m +[m
[32m +            const dadosProduto =[m
[32m +                obterDadosProduto([m
[32m +                    itens[m
[32m +                );[m
[32m +[m
[32m +            const id =[m
[32m +                `HYPE-${Date.now()}`;[m
[32m +[m
[32m +            const pedidos =[m
[32m +                lerPedidos();[m
[32m +[m
[32m +            const pedido = {[m
[32m +[m
[32m +                id,[m
[32m +[m
[32m +                nome,[m
[32m +[m
[32m +                discord,[m
[32m +[m
[32m +                email,[m
[32m +[m
[32m +                itens,[m
[32m +[m
[32m +                produto:[m
[32m +                    dadosProduto.nomeProduto,[m
[32m +[m
[32m +                opcao:[m
[32m +                    dadosProduto.opcao,[m
[32m +[m
[32m +                chaveEstoque:[m
[32m +                    dadosProduto.chaveEstoque,[m
[32m +[m
[32m +                status:[m
[32m +                    "AGUARDANDO PAGAMENTO",[m
[32m +[m
[32m +                criadoEm:[m
[32m +                    new Date().toISOString()[m
[32m +            };[m
[32m +[m
[32m +            pedidos.push([m
[32m +                pedido[m
[32m +            );[m
[32m +[m
[32m +            salvarPedidos([m
[32m +                pedidos[m
[32m +            );[m
[32m +[m
[32m +            res.json({[m
[32m +                sucesso: true,[m
[32m +                pedidoId: id[m
[32m +            });[m
[32m +[m
[32m +        } catch (erro) {[m
[32m +[m
[32m +            console.error([m
[32m +                "ERRO AO CRIAR PEDIDO:",[m
[32m +                erro[m
[32m +            );[m
[32m +[m
[32m +            res.status(500).json({[m
[32m +                sucesso: false,[m
[32m +                erro:[m
[32m +                    "Erro interno ao criar pedido."[m
[32m +            });[m
[32m +        }[m
[32m +    }[m
[32m +);[m
[32m +[m
[32m +[m
[32m +// ==========================================[m
[32m +// GERAR PIX TURBOFYPAY[m
[32m +// ==========================================[m
[32m +[m
[32m +app.post([m
[32m +    "/api/pagamento/pix",[m
[32m +    async (req, res) => {[m
[32m +[m
[32m +        try {[m
[32m +[m
[32m +            const {[m
[32m +                nome,[m
[32m +                discord,[m
[32m +                email,[m
[32m +                itens,[m
[32m +                valor[m
[32m +            } = req.body;[m
[32m +[m
[32m +            if ([m
[32m +                !nome ||[m
[32m +                !discord ||[m
[32m +                !email ||[m
[32m +                !Array.isArray(itens) ||[m
[32m +                itens.length === 0 ||[m
[32m +                !valor[m
[32m +            ) {[m
[32m +[m
[32m +                return res.status(400).json({[m
[32m +                    sucesso: false,[m
[32m +                    erro:[m
[32m +                        "Dados do pagamento incompletos."[m
[32m +                });[m
[32m +            }[m
[32m +[m
[32m +            const valorNumerico =[m
[32m +                Number(valor);[m
[32m +[m
[32m +            if ([m
[32m +                !Number.isFinite([m
[32m +                    valorNumerico[m
[32m +                ) ||[m
[32m +                valorNumerico < 1.50[m
[32m +            ) {[m
[32m +[m
[32m +                return res.status(400).json({[m
[32m +                    sucesso: false,[m
[32m +                    erro:[m
[32m +                        "O valor mínimo do pagamento é R$ 1,50."[m
[32m +                });[m
[32m +            }[m
[32m +[m
[32m +[m
[32m +            // ==========================================[m
[32m +            // PRODUTO[m
[32m +            // ==========================================[m
[32m +[m
[32m +            const dadosProduto =[m
[32m +                obterDadosProduto([m
[32m +                    itens[m
[32m +                );[m
[32m +[m
[32m +[m
[32m +            // ==========================================[m
[32m +            // DIAGNÓSTICO DO ESTOQUE[m
[32m +            // ==========================================[m
[32m +[m
[32m +            console.log("");[m
[32m +            console.log([m
[32m +                "=========================================="[m
[32m +            );[m
[32m +            console.log([m
[32m +                "       DIAGNÓSTICO DO ESTOQUE"[m
[32m +            );[m
[32m +            console.log([m
[32m +                "=========================================="[m
[32m +            );[m
[32m +[m
[32m +            console.log([m
[32m +                "ITENS RECEBIDOS:",[m
[32m +                JSON.stringify([m
[32m +                    itens,[m
[32m +                    null,[m
[32m +                    2[m
[32m +                )[m
[32m +            );[m
[32m +[m
[32m +            console.log([m
[32m +                "NOME DO PRODUTO:",[m
[32m +                dadosProduto.nomeProduto[m
[32m +            );[m
[32m +[m
[32m +            console.log([m
[32m +                "OPÇÃO:",[m
[32m +                dadosProduto.opcao[m
[32m +            );[m
[32m +[m
[32m +            console.log([m
[32m +                "CHAVE DO ESTOQUE:",[m
[32m +                dadosProduto.chaveEstoque[m
[32m +            );[m
[32m +[m
[32m +            console.log([m
[32m +                "ESTOQUE DISPONÍVEL:",[m
[32m +                existeEstoqueDisponivel([m
[32m +                    dadosProduto.chaveEstoque[m
[32m +                )[m
[32m +            );[m
[32m +[m
[32m +            console.log([m
[32m +                "=========================================="[m
[32m +            );[m
[32m +            console.log("");[m
[32m +[m
[32m +[m
[32m +            if ([m
[32m +                !dadosProduto.nomeProduto[m
[32m +            ) {[m
[32m +[m
[32m +                return res.status(400).json({[m
[32m +                    sucesso: false,[m
[32m +                    erro:[m
[32m +                        "Produto não informado."[m
[32m +                });[m
[32m +            }[m
[32m +[m
[32m +[m
[32m +            // ==========================================[m
[32m +            // VERIFICAR ESTOQUE[m
[32m +            // ==========================================[m
[32m +[m
[32m +            if ([m
[32m +                !existeEstoqueDisponivel([m
[32m +                    dadosProduto.chaveEstoque[m
[32m +                )[m
[32m +            ) {[m
[32m +[m
[32m +                return res.status(400).json({[m
[32m +                    sucesso: false,[m
[32m +                    erro:[m
[32m +                        `O produto "${dadosProduto.chaveEstoque}" está sem estoque.`[m
[32m +                });[m
[32m +            }[m
[32m +[m
[32m +[m
[32m +            // ==========================================[m
[32m +            // CRIAR PEDIDO[m
[32m +            // ==========================================[m
[32m +[m
[32m +            const pedidoId =[m
[32m +                `HYPE-${Date.now()}`;[m
[32m +[m
[32m +            const pedidos =[m
[32m +                lerPedidos();[m
[32m +[m
[32m +            const novoPedido = {[m
[32m +[m
[32m +                id:[m
[32m +                    pedidoId,[m
[32m +[m
[32m +                nome,[m
[32m +[m
[32m +                discord,[m
[32m +[m
[32m +                email,[m
[32m +[m
[32m +                itens,[m
[32m +[m
[32m +                produto:[m
[32m +                    dadosProduto.nomeProduto,[m
[32m +[m
[32m +                opcao:[m
[32m +                    dadosProduto.opcao,[m
[32m +[m
[32m +                chaveEstoque:[m
[32m +                    dadosProduto.chaveEstoque,[m
[32m +[m
[32m +                valor:[m
[32m +                    valorNumerico,[m
[32m +[m
[32m +                status:[m
[32m +                    "AGUARDANDO PAGAMENTO",[m
[32m +[m
[32m +                criadoEm:[m
[32m +                    new Date().toISOString()[m
[32m +            };[m
[32m +[m
[32m +            pedidos.push([m
[32m +                novoPedido[m
[32m +            );[m
[32m +[m
[32m +            salvarPedidos([m
[32m +                pedidos[m
[32m +            );[m
[32m +[m
[32m +[m
[32m +            // ==========================================[m
[32m +            // VALOR EM CENTAVOS[m
[32m +            // ==========================================[m
[32m +[m
[32m +            const amountCents =[m
[32m +                Math.round([m
[32m +                    valorNumerico * 100[m
[32m +                );[m
[32m +[m
[32m +[m
[32m +            // ==========================================[m
[32m +            // TURBOFYPAY[m
[32m +            // ==========================================[m
[32m +[m
[32m +            console.log("");[m
[32m +            console.log([m
[32m +                "=========================================="[m
[32m +            );[m
[32m +            console.log([m
[32m +                "       GERANDO PIX TURBOFYPAY"[m
[32m +            );[m
[32m +            console.log([m
[32m +                "=========================================="[m
[32m +            );[m
[32m +            console.log([m
[32m +                "PEDIDO:",[m
[32m +                pedidoId[m
[32m +            );[m
[32m +            console.log([m
[32m +                "VALOR:",[m
[32m +                valorNumerico[m
[32m +            );[m
[32m +            console.log([m
[32m +                "CENTAVOS:",[m
[32m +                amountCents[m
[32m +            );[m
[32m +            console.log([m
[32m +                "=========================================="[m
[32m +            );[m
[32m +[m
[32m +[m
[32m +            const resposta =[m
[32m +                await fetch([m
[32m +                    `${TURBOFY_API}/sellers/pix`,[m
[32m +                    {[m
[32m +                        method: "POST",[m
[32m +[m
[32m +                        headers: {[m
[32m +[m
[32m +                            "Content-Type":[m
[32m +                                "application/json",[m
[32m +[m
[32m +                            "x-client-id":[m
[32m +                                process.env.TURBOFY_CLIENT_ID,[m
[32m +[m
[32m +                            "x-client-secret":[m
[32m +                                process.env.TURBOFY_CLIENT_SECRET,[m
[32m +[m
[32m +                            "x-idempotency-key":[m
[32m +                                pedidoId[m
[32m +                        },[m
[32m +[m
[32m +                        body:[m
[32m +                            JSON.stringify({[m
[32m +[m
[32m +                                amountCents,[m
[32m +[m
[32m +                                description:[m
[32m +                                    `Pedido ${pedidoId} - ${dadosProduto.nomeProduto}${dadosProduto.opcao ? ` ${dadosProduto.opcao}` : ""}`,[m
[32m +[m
[32m +                                externalRef:[m
[32m +                                    pedidoId,[m
[32m +[m
[32m +                                metadata: {[m
[32m +[m
[32m +                                    pedidoId,[m
[32m +[m
[32m +                                    produto:[m
[32m +                                        dadosProduto.nomeProduto,[m
[32m +[m
[32m +                                    opcao:[m
[32m +                                        dadosProduto.opcao[m
[32m +                                }[m
[32m +                            })[m
[32m +                    }[m
[32m +                );[m
[32m +[m
[32m +[m
[32m +            const dados =[m
[32m +                await resposta.json();[m
[32m +[m
[32m +[m
[32m +            console.log([m
[32m +                "RESPOSTA TURBOFYPAY:",[m
[32m +                JSON.stringify([m
[32m +                    dados,[m
[32m +                    null,[m
[32m +                    2[m
[32m +                )[m
[32m +            );[m
[32m +[m
[32m +[m
[32m +            // ==========================================[m
[32m +            // ERRO TURBOFYPAY[m
[32m +            // ==========================================[m
[32m +[m
[32m +            if (!resposta.ok) {[m
[32m +[m
[32m +                console.error([m
[32m +                    "ERRO TURBOFYPAY:",[m
[32m +                    dados[m
[32m +                );[m
[32m +[m
[32m +                return res.status([m
[32m +                    resposta.status[m
[32m +                ).json({[m
[32m +[m
[32m +                    sucesso: false,[m
[32m +[m
[32m +                    erro:[m
[32m +                        dados.message ||[m
[32m +                        dados.error ||[m
[32m +                        "Erro ao criar cobrança PIX."[m
[32m +                });[m
[32m +            }[m
[32m +[m
[32m +[m
[32m +            // ==========================================[m
[32m +            // VERIFICAR SE O PIX FOI GERADO[m
[32m +            // ==========================================[m
[32m +[m
[32m +            if ([m
[32m +                !dados?.pix?.qrCode &&[m
[32m +                !dados?.pix?.copyPaste[m
[32m +            ) {[m
[32m +[m
[32m +                console.error([m
[32m +                    "TURBOFYPAY NÃO RETORNOU QR CODE OU PIX COPIA E COLA."[m
[32m +                );[m
[32m +[m
[32m +                return res.status(502).json({[m
[32m +[m
[32m +                    sucesso: false,[m
[32m +[m
[32m +                    erro:[m
[32m +                        "A cobrança foi criada, mas a TurbofyPay não retornou os dados do PIX."[m
[32m +                });[m
[32m +            }[m
[32m +[m
[32m +[m
[32m +            // ==========================================[m
[32m +            // SALVAR DADOS DO PAGAMENTO[m
[32m +            // ==========================================[m
[32m +[m
[32m +            const pedidosAtualizados =[m
[32m +                lerPedidos();[m
[32m +[m
[32m +            const indicePedido =[m
[32m +                pedidosAtualizados.findIndex([m
[32m +                    pedido =>[m
[32m +                        pedido.id ===[m
[32m +                        pedidoId[m
[32m +                );[m
[32m +[m
[32m +            if ([m
[32m +                indicePedido !== -1[m
[32m +            ) {[m
[32m +[m
[32m +                pedidosAtualizados[[m
[32m +                    indicePedido[m
[32m +                ].chargeId =[m
[32m +                    dados.id;[m
[32m +[m
[32m +                pedidosAtualizados[[m
[32m +                    indicePedido[m
[32m +                ].statusPagamento =[m
[32m +                    dados.status ||[m
[32m +                    "PENDING";[m
[32m +[m
[32m +                pedidosAtualizados[[m
[32m +                    indicePedido[m
[32m +                ].pix =[m
[32m +                    dados;[m
[32m +[m
[32m +                salvarPedidos([m
[32m +                    pedidosAtualizados[m
[32m +                );[m
[32m +            }[m
[32m +[m
[32m +[m
[32m +            // ==========================================[m
[32m +            // RESPOSTA PARA O SITE[m
[32m +            // ==========================================[m
[32m +[m
[32m +            return res.json({[m
[32m +[m
[32m +                sucesso: true,[m
[32m +[m
[32m +                pedidoId,[m
[32m +[m
[32m +                chargeId:[m
[32m +                    dados.id,[m
[32m +[m
[32m +                qrCode:[m
[32m +                    dados?.pix?.qrCode ||[m
[32m +                    dados?.pix?.qr_code ||[m
[32m +                    "",[m
[32m +[m
[32m +                copyPaste:[m
[32m +                    dados?.pix?.copyPaste ||[m
[32m +                    dados?.pix?.copy_paste ||[m
[32m +                    "",[m
[32m +[m
[32m +                status:[m
[32m +                    dados.status ||[m
[32m +                    "PENDING"[m
[32m +            });[m
[32m++=======[m
[32m+ });[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
  [m
[32m+ app.get("/api/pedidos/:id", (req, res) => {[m
[32m+     const pedido = encontrarPedido(req.params.id);[m
  [m
[31m-         } catch (erro) {[m
[32m+     if (!pedido) {[m
[32m+         return res.status(404).json({[m
[32m+             sucesso: false,[m
[32m+             erro: "Pedido não encontrado."[m
[32m+         });[m
[32m+     }[m
  [m
[31m-             console.error([m
[31m-                 "ERRO AO GERAR PIX:",[m
[31m-                 erro[m
[31m-             );[m
[32m+     res.json({[m
[32m+         sucesso: true,[m
[32m+         pedido[m
[32m+     });[m
[32m+ });[m
[32m+ [m
[32m+ /* =========================================================[m
[32m+    TURBOFYPAY - CRIAR PIX[m
[32m+ ========================================================= */[m
[32m+ [m
[32m+ app.post("/api/pagamento/pix", async (req, res) => {[m
[32m+     try {[m
[32m+         const {[m
[32m+             pedidoId,[m
[32m+             valor,[m
[32m+             produto,[m
[32m+             opcao[m
[32m+         } = req.body || {};[m
[32m+ [m
[32m+         if (!pedidoId) {[m
[32m+             return res.status(400).json({[m
[32m+                 sucesso: false,[m
[32m+                 erro: "pedidoId é obrigatório."[m
[32m+             });[m
[32m+         }[m
  [m
[32m+         if ([m
[32m+             !TURBOFY_CLIENT_ID ||[m
[32m+             !TURBOFY_CLIENT_SECRET[m
[32m+         ) {[m
              return res.status(500).json({[m
[32m+                 sucesso: false,[m
[32m+                 erro: "Credenciais da TurbofyPay não configuradas."[m
[32m+             });[m
[32m+         }[m
[32m+ [m
[32m+         const valorNumerico = Number(valor);[m
  [m
[32m+         if (!Number.isFinite(valorNumerico)) {[m
[32m+             return res.status(400).json({[m
                  sucesso: false,[m
[32m+                 erro: "Valor inválido."[m
[32m+             });[m
[32m+         }[m
  [m
[31m-                 erro:[m
[31m-                     erro.message ||[m
[31m-                     "Erro interno ao gerar PIX."[m
[32m+         if (valorNumerico < 1.5) {[m
[32m+             return res.status(400).json({[m
[32m+                 sucesso: false,[m
[32m+                 erro: "O valor mínimo do pagamento é R$ 1,50"[m
              });[m
          }[m
[31m-     }[m
[31m- );[m
  [m
[32m+         const pedido = encontrarPedido(pedidoId);[m
  [m
[31m- // ==========================================[m
[31m- // VERIFICAR STATUS DO PIX[m
[31m- // ==========================================[m
[32m+         if (!pedido) {[m
[32m+             return res.status(404).json({[m
[32m+                 sucesso: false,[m
[32m+                 erro: "Pedido não encontrado."[m
[32m+             });[m
[32m+         }[m
  [m
[31m- app.get([m
[31m-     "/api/pagamento/status/:chargeId",[m
[31m-     async (req, res) => {[m
[32m+         const amountCents = Math.round([m
[32m+             valorNumerico * 100[m
[32m+         );[m
  [m
[31m-         const chargeId =[m
[31m-             req.params.chargeId;[m
[32m+         const idempotencyKey =[m
[32m+             `${pedidoId}-${Date.now()}`;[m
  [m
[31m-         try {[m
[32m+         const resposta = await fetch([m
[32m+             `${TURBOFY_API}/sellers/pix`,[m
[32m+             {[m
[32m+                 method: "POST",[m
  [m
[31m-             const resposta =[m
[31m-                 await fetch([m
[31m-                     `${TURBOFY_API}/sellers/pix/${chargeId}`,[m
[31m-                     {[m
[31m-                         method: "GET",[m
[32m+                 headers: {[m
[32m+                     "Content-Type": "application/json",[m
[32m+                     "x-client-id": TURBOFY_CLIENT_ID,[m
[32m+                     "x-client-secret": TURBOFY_CLIENT_SECRET,[m
[32m+                     "x-idempotency-key": idempotencyKey[m
[32m+                 },[m
  [m
[31m-                         headers: {[m
[32m+                 body: JSON.stringify({[m
[32m+                     amountCents,[m
  [m
[31m-                             "x-client-id":[m
[31m-                                 process.env.TURBOFY_CLIENT_ID,[m
[32m+                     description:[m
[32m+                         `Pedido ${pedidoId} - ${produto || pedido.produto} ${opcao || pedido.opcao || ""}`,[m
  [m
[31m-                             "x-client-secret":[m
[31m-                                 process.env.TURBOFY_CLIENT_SECRET[m
[31m-                         }[m
[32m+                     externalRef: pedidoId,[m
[32m+ [m
[32m+                     metadata: {[m
[32m+                         pedidoId,[m
[32m+                         produto: produto || pedido.produto,[m
[32m+                         opcao: opcao || pedido.opcao || ""[m
                      }[m
[31m-                 );[m
[32m+                 })[m
[32m+             }[m
[32m+         );[m
  [m
[32m+         const texto = await resposta.text();[m
  [m
[31m-             const dados =[m
[31m-                 await resposta.json();[m
[32m+         let dados;[m
  [m
[32m+         try {[m
[32m+             dados = JSON.parse(texto);[m
[32m+         } catch {[m
[32m+             dados = {[m
[32m+                 raw: texto[m
[32m+             };[m
[32m+         }[m
  [m
[31m-             console.log([m
[31m-                 "STATUS TURBOFYPAY:",[m
[31m-                 JSON.stringify([m
[31m-                     dados,[m
[31m-                     null,[m
[31m-                     2[m
[31m-                 )[m
[32m+         if (!resposta.ok) {[m
[32m+             console.error([m
[32m+                 "Erro TurbofyPay:",[m
[32m+                 resposta.status,[m
[32m+                 dados[m
              );[m
  [m
[32m+             return res.status(resposta.status).json({[m
[32m+                 sucesso: false,[m
[32m+                 erro:[m
[32m+                     dados?.message ||[m
[32m+                     dados?.error ||[m
[32m+                     "Erro ao criar pagamento.",[m
[32m+                 detalhes: dados[m
[32m+             });[m
[32m+         }[m
  [m
[31m-             if (!resposta.ok) {[m
[32m+         const chargeId =[m
[32m+             dados.chargeId ||[m
[32m+             dados.id ||[m
[32m+             dados.charge?.id ||[m
[32m+             dados.data?.chargeId ||[m
[32m+             dados.data?.id;[m
[32m+ [m
[32m+         const copyPaste =[m
[32m+             dados.pix?.copyPaste ||[m
[32m+             dados.copyPaste ||[m
[32m+             dados.pixCopyPaste ||[m
[32m+             dados.data?.pix?.copyPaste ||[m
[32m+             "";[m
[32m+ [m
[32m+         const expiresAt =[m
[32m+             dados.expiresAt ||[m
[32m+             dados.pix?.expiresAt ||[m
[32m+             dados.data?.expiresAt ||[m
[32m+             null;[m
[32m+ [m
[32m+         if (!chargeId) {[m
[32m+             console.error([m
[32m+                 "TurbofyPay não retornou chargeId:",[m
[32m+                 dados[m
[32m+             );[m
  [m
[31m-                 return res.status([m
[31m-                     resposta.status[m
[31m-                 ).json({[m
[32m+             return res.status(500).json({[m
[32m+                 sucesso: false,[m
[32m++<<<<<<< HEAD[m
[32m +[m
[31m-                     sucesso: false,[m
[32m++                erro:[m
[32m++                    erro.message ||[m
[32m++                    "Erro interno ao gerar PIX."[m
[32m++=======[m
[32m+                 erro: "A TurbofyPay não retornou o ID da cobrança.",[m
[32m+                 detalhes: dados[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
[32m+             });[m
[32m+         }[m
  [m
[31m-                     erro:[m
[31m-                         dados.message ||[m
[31m-                         dados.error ||[m
[31m-                         "Erro ao consultar pagamento."[m
[32m+         atualizarPedido([m
[32m+             pedidoId,[m
[32m+             {[m
[32m+                 chargeId,[m
[32m+                 copyPaste,[m
[32m+                 expiresAt,[m
[32m+                 valor: valorNumerico,[m
[32m+                 statusPagamento: "PENDING",[m
[32m+                 status: "AGUARDANDO_PAGAMENTO",[m
[32m+                 atualizadoEm: new Date().toISOString()[m
[32m+             }[m
[32m+         );[m
[32m+ [m
[32m+         res.json({[m
[32m+             sucesso: true,[m
[32m+             pedidoId,[m
[32m+             chargeId,[m
[32m+             copyPaste,[m
[32m+             expiresAt,[m
[32m+             status: "PENDING"[m
[32m+         });[m
[32m+     } catch (erro) {[m
[32m+         console.error([m
[32m+             "Erro ao criar PIX:",[m
[32m+             erro[m
[32m+         );[m
[32m+ [m
[32m+         res.status(500).json({[m
[32m+             sucesso: false,[m
[32m+             erro: "Erro interno ao criar pagamento PIX.",[m
[32m+             detalhes: erro.message[m
[32m+         });[m
[32m+     }[m
[32m+ });[m
[32m+ [m
[32m+ /* =========================================================[m
[32m+    TURBOFYPAY - CONSULTAR PAGAMENTO[m
[32m+ ========================================================= */[m
[32m+ [m
[32m+ app.get([m
[32m+     "/api/pagamento/status/:chargeId",[m
[32m+     async (req, res) => {[m
[32m+         try {[m
[32m+             const chargeId = req.params.chargeId;[m
[32m+ [m
[32m+             if ([m
[32m+                 !TURBOFY_CLIENT_ID ||[m
[32m+                 !TURBOFY_CLIENT_SECRET[m
[32m+             ) {[m
[32m+                 return res.status(500).json({[m
[32m+                     sucesso: false,[m
[32m+                     erro: "Credenciais da TurbofyPay não configuradas."[m
                  });[m
              }[m
  [m
[32m+             const resposta = await fetch([m
[32m+                 `${TURBOFY_API}/sellers/pix/${encodeURIComponent(chargeId)}`,[m
[32m+                 {[m
[32m+                     method: "GET",[m
  [m
[32m++<<<<<<< HEAD[m
[32m +            const status =[m
[32m +                String([m
[32m +                    dados.status ||[m
[32m +                    ""[m
[32m +                ).toUpperCase();[m
[32m +[m
[32m +[m
[32m +            const pedidos =[m
[32m +                lerPedidos();[m
[32m +[m
[32m +[m
[32m +            const indicePedido =[m
[32m +                pedidos.findIndex([m
[32m +                    pedido =>[m
[32m +                        pedido.chargeId ===[m
[32m +                        chargeId[m
[32m +                );[m
[32m +[m
[32m +[m
[32m +            if ([m
[32m +                indicePedido === -1[m
[32m +            ) {[m
[32m +[m
[32m +                return res.json({[m
[32m +[m
[32m +                    sucesso: true,[m
[32m +[m
[32m +                    status,[m
[32m +[m
[32m +                    chargeId,[m
[32m +[m
[32m +                    mensagem:[m
[32m +                        "Pagamento consultado, mas pedido não encontrado."[m
[32m +                });[m
[32m +            }[m
[32m +[m
[32m +[m
[32m +            const pedido =[m
[32m +                pedidos[[m
[32m +                    indicePedido[m
[32m +                ];[m
[32m +[m
[32m +[m
[32m +            // ==========================================[m
[32m +            // PAGAMENTO AINDA NÃO FOI PAGO[m
[32m +            // ==========================================[m
[32m +[m
[32m +            if ([m
[32m +                status !== "PAID"[m
[32m +            ) {[m
[32m +[m
[32m +                pedido.statusPagamento =[m
[32m +                    status;[m
[32m +[m
[32m +                salvarPedidos([m
[32m +                    pedidos[m
[32m +                );[m
[32m +[m
[32m +                return res.json({[m
[32m +[m
[32m +                    sucesso: true,[m
[32m +[m
[32m +                    status,[m
[32m +[m
[32m +                    chargeId[m
[32m +                });[m
[32m +            }[m
[32m +[m
[32m +[m
[32m +            // ==========================================[m
[32m +            // EVITAR PROCESSAMENTO DUPLICADO[m
[32m +            // ==========================================[m
[32m +[m
[32m +            if ([m
[32m +                pedidosEmProcessamento.has([m
[32m +                    pedido.id[m
[32m +                )[m
[32m +            ) {[m
[32m +[m
[32m +                return res.json({[m
[32m +[m
[32m +                    sucesso: true,[m
[32m +[m
[32m +                    status: "PAID",[m
[32m +[m
[32m +                    chargeId,[m
[32m +[m
[32m +                    processando: true[m
[32m +                });[m
[32m +            }[m
[32m +[m
[32m +[m
[32m +            pedidosEmProcessamento.add([m
[32m +                pedido.id[m
[32m++=======[m
[32m+                     headers: {[m
[32m+                         "x-client-id": TURBOFY_CLIENT_ID,[m
[32m+                         "x-client-secret": TURBOFY_CLIENT_SECRET[m
[32m+                     }[m
[32m+                 }[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
              );[m
  [m
[32m+             const texto = await resposta.text();[m
[32m+ [m
[32m+             let dados;[m
  [m
              try {[m
[32m++<<<<<<< HEAD[m
[32m +[m
[32m +                pedido.statusPagamento =[m
[32m +                    "PAID";[m
[32m +[m
[32m +                pedido.status =[m
[32m +                    "PAGO";[m
[32m +[m
[32m +[m
[32m +                // ==========================================[m
[32m +                // CASO JÁ TENHA SIDO ENTREGUE[m
[32m +                // ==========================================[m
[32m +[m
[32m +                if ([m
[32m +                    pedido.contaEntregue[m
[32m +                ) {[m
[32m +[m
[32m +                    let emailEnviado =[m
[32m +                        pedido.emailEnviado ||[m
[32m +                        false;[m
[32m +[m
[32m +[m
[32m +                    if ([m
[32m +                        !emailEnviado[m
[32m +                    ) {[m
[32m +[m
[32m +                        const entrega = {[m
[32m +[m
[32m +                            email:[m
[32m +                                pedido.contaEmail ||[m
[32m +                                "",[m
[32m +[m
[32m +                            senha:[m
[32m +                                pedido.contaSenha ||[m
[32m +                                ""[m
[32m +                        };[m
[32m +[m
[32m +[m
[32m +                        emailEnviado =[m
[32m +                            await enviarEmailProduto([m
[32m +                                pedido,[m
[32m +                                entrega[m
[32m +                            );[m
[32m +[m
[32m +[m
[32m +                        pedido.emailEnviado =[m
[32m +                            emailEnviado;[m
[32m +[m
[32m +                        pedido.emailEnviadoEm =[m
[32m +                            emailEnviado[m
[32m +                                ? new Date().toISOString()[m
[32m +                                : null;[m
[32m +                    }[m
[32m +[m
[32m +[m
[32m +                    salvarPedidos([m
[32m +                        pedidos[m
[32m +                    );[m
[32m +[m
[32m +[m
[32m +                    return res.json({[m
[32m +[m
[32m +                        sucesso: true,[m
[32m +[m
[32m +                        status: "PAID",[m
[32m +[m
[32m +                        chargeId,[m
[32m +[m
[32m +                        entregue: true,[m
[32m +[m
[32m +                        emailEnviado,[m
[32m +[m
[32m +                        conta: {[m
[32m +[m
[32m +                            email:[m
[32m +                                pedido.contaEmail,[m
[32m +[m
[32m +                            senha:[m
[32m +                                pedido.contaSenha[m
[32m +                        }[m
[32m +                    });[m
[32m +                }[m
[32m +[m
[32m +[m
[32m +                // ==========================================[m
[32m +                // ENTREGAR CONTA[m
[32m +                // ==========================================[m
[32m +[m
[32m +                const entrega =[m
[32m +                    entregarProduto([m
[32m +                        pedido[m
[32m +                    );[m
[32m +[m
[32m +[m
[32m +                if ([m
[32m +                    !entrega.sucesso[m
[32m +                ) {[m
[32m +[m
[32m +                    pedido.erroEntrega =[m
[32m +                        entrega.erro;[m
[32m +[m
[32m +                    salvarPedidos([m
[32m +                        pedidos[m
[32m +                    );[m
[32m +[m
[32m +                    return res.status(500).json({[m
[32m +[m
[32m +                        sucesso: false,[m
[32m +[m
[32m +                        status: "PAID",[m
[32m +[m
[32m +                        chargeId,[m
[32m +[m
[32m +                        erro:[m
[32m +                            entrega.erro[m
[32m +                    });[m
[32m +                }[m
[32m +[m
[32m +[m
[32m +                // ==========================================[m
[32m +                // SALVAR CONTA NO PEDIDO[m
[32m +                // ==========================================[m
[32m +[m
[32m +                pedido.contaEntregue =[m
[32m +                    true;[m
[32m +[m
[32m +                pedido.contaEmail =[m
[32m +                    entrega.email;[m
[32m +[m
[32m +                pedido.contaSenha =[m
[32m +                    entrega.senha;[m
[32m +[m
[32m +                pedido.entregueEm =[m
[32m +                    new Date().toISOString();[m
[32m +[m
[32m +[m
[32m +                // ==========================================[m
[32m +                // ENVIAR EMAIL[m
[32m +                // ==========================================[m
[32m +[m
[32m +                const emailEnviado =[m
[32m +                    await enviarEmailProduto([m
[32m +                        pedido,[m
[32m +                        entrega[m
[32m +                    );[m
[32m +[m
[32m +                pedido.emailEnviado =[m
[32m +                    emailEnviado;[m
[32m +[m
[32m +                pedido.emailEnviadoEm =[m
[32m +                    emailEnviado[m
[32m +                        ? new Date().toISOString()[m
[32m +                        : null;[m
[32m +[m
[32m +[m
[32m +                salvarPedidos([m
[32m +                    pedidos[m
[32m +                );[m
[32m +[m
[32m +[m
[32m +                return res.json({[m
[32m +[m
[32m +                    sucesso: true,[m
[32m +[m
[32m +                    status: "PAID",[m
[32m +[m
[32m +                    chargeId,[m
[32m +[m
[32m +                    entregue: true,[m
[32m +[m
[32m +                    emailEnviado,[m
[32m +[m
[32m +                    conta: {[m
[32m +[m
[32m +                        email:[m
[32m +                            entrega.email,[m
[32m +[m
[32m +                        senha:[m
[32m +                            entrega.senha[m
[32m +                    }[m
[32m +                });[m
[32m +[m
[32m +[m
[32m +            } finally {[m
[32m +[m
[32m +                pedidosEmProcessamento.delete([m
[32m +                    pedido.id[m
[32m +                );[m
[32m++=======[m
[32m+                 dados = JSON.parse(texto);[m
[32m+             } catch {[m
[32m+                 dados = {[m
[32m+                     raw: texto[m
[32m+                 };[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
              }[m
  [m
[32m+             if (!resposta.ok) {[m
[32m+                 return res.status(resposta.status).json({[m
[32m+                     sucesso: false,[m
[32m+                     erro:[m
[32m+                         dados?.message ||[m
[32m+                         dados?.error ||[m
[32m+                         "Erro ao consultar pagamento.",[m
[32m+                     detalhes: dados[m
[32m+                 });[m
[32m+             }[m
  [m
[31m-         } catch (erro) {[m
[32m+             const status = String([m
[32m+                 dados.status ||[m
[32m+                 dados.data?.status ||[m
[32m+                 dados.charge?.status ||[m
[32m+                 ""[m
[32m+             ).toUpperCase();[m
  [m
[31m-             console.error([m
[31m-                 "ERRO AO CONSULTAR PAGAMENTO:",[m
[31m-                 erro[m
[32m+             const pedido = lerPedidos().find([m
[32m+                 item =>[m
[32m+                     String(item.chargeId) ===[m
[32m+                     String(chargeId)[m
              );[m
  [m
[31m-             return res.status(500).json({[m
[32m+             if (pedido) {[m
[32m+                 if (status === "PAID") {[m
[32m+                     atualizarPedido([m
[32m+                         pedido.id,[m
[32m+                         {[m
[32m+                             statusPagamento: "PAID",[m
[32m+                             status: "PAGO",[m
[32m+                             atualizadoEm:[m
[32m+                                 new Date().toISOString()[m
[32m+                         }[m
[32m+                     );[m
  [m
[31m-                 sucesso: false,[m
[32m+                     const pedidoAtualizado =[m
[32m+                         encontrarPedido(pedido.id);[m
  [m
[32m++<<<<<<< HEAD[m
[32m +                erro:[m
[32m +                    erro.message ||[m
[32m +                    "Erro ao consultar pagamento."[m
[32m +            });[m
[32m +        }[m
[32m +    }[m
[32m +);[m
[32m +[m
[32m +[m
[32m +// ==========================================[m
[32m +// TESTE DE EMAIL[m
[32m +// ==========================================[m
[32m +[m
[32m +app.get([m
[32m +    "/teste-email",[m
[32m +    async (req, res) => {[m
[32m +[m
[32m +        try {[m
[32m +[m
[32m +            const transporter =[m
[32m +                criarTransportador();[m
[32m +[m
[32m +            if (!transporter) {[m
[32m +[m
[32m +                return res.status(500).json({[m
[32m +[m
[32m +                    sucesso: false,[m
[32m +[m
[32m +                    erro:[m
[32m +                        "E-mail não configurado."[m
[32m +                });[m
[32m++=======[m
[32m+                     await processarPedidoPago([m
[32m+                         pedidoAtualizado[m
[32m+                     );[m
[32m+                 } else {[m
[32m+                     atualizarPedido([m
[32m+                         pedido.id,[m
[32m+                         {[m
[32m+                             statusPagamento:[m
[32m+                                 status || "PENDING",[m
[32m+                             atualizadoEm:[m
[32m+                                 new Date().toISOString()[m
[32m+                         }[m
[32m+                     );[m
[32m+                 }[m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
              }[m
  [m
[31m- [m
[31m-             await transporter.sendMail({[m
[31m- [m
[31m-                 from:[m
[31m-                     `"HYPE STORE" <${process.env.EMAIL_USUARIO}>`,[m
[31m- [m
[31m-                 to:[m
[31m-                     process.env.EMAIL_USUARIO,[m
[31m- [m
[31m-                 subject:[m
[31m-                     "Teste HYPE STORE",[m
[31m- [m
[31m-                 text:[m
[31m-                     "Teste de envio de e-mail da HYPE STORE funcionando."[m
[31m-             });[m
[31m- [m
[32m+             const pedidoFinal =[m
[32m+                 pedido[m
[32m+                     ? encontrarPedido(pedido.id)[m
[32m+                     : null;[m
  [m
              res.json({[m
[31m- [m
                  sucesso: true,[m
[31m- [m
[31m-                 mensagem:[m
[31m-                     "E-mail de teste enviado."[m
[32m+                 chargeId,[m
[32m+                 status,[m
[32m+                 pedidoId: pedidoFinal?.id || null,[m
[32m+                 pedido: pedidoFinal || null,[m
[32m+                 dados[m
              });[m
[31m- [m
[31m- [m
          } catch (erro) {[m
[31m- [m
              console.error([m
[31m-                 "ERRO NO TESTE DE EMAIL:",[m
[32m+                 "Erro ao consultar PIX:",[m
                  erro[m
              );[m
  [m
[36m@@@ -1500,40 -1081,1241 +1999,1259 @@@[m
      }[m
  );[m
  [m
[32m+ /* =========================================================[m
[32m+    MONITORAMENTO AUTOMÁTICO DOS PEDIDOS[m
[32m+ ========================================================= */[m
  [m
[31m- // ==========================================[m
[31m- // INICIAR SERVIDOR[m
[31m- // ==========================================[m
[32m+ async function verificarPagamentosAutomaticamente() {[m
[32m+     try {[m
[32m+         const pedidos = lerPedidos();[m
  [m
[31m- app.listen([m
[31m-     PORT,[m
[31m-     () => {[m
[32m+         for (const pedido of pedidos) {[m
[32m+             if ([m
[32m+                 !pedido.chargeId ||[m
[32m+                 pedido.statusPagamento === "PAID"[m
[32m+             ) {[m
[32m+                 continue;[m
[32m+             }[m
  [m
[31m-         console.log("");[m
[31m-         console.log([m
[31m-             "=========================================="[m
[31m-         );[m
[31m-         console.log([m
[31m-             "          HYPE STORE ONLINE"[m
[31m-         );[m
[31m-         console.log([m
[31m-             "=========================================="[m
[31m-         );[m
[31m-         console.log([m
[31m-             `PORTA: ${PORT}`[m
[31m-         );[m
[31m-         console.log([m
[31m-             "PIX TURBOFYPAY ATIVO"[m
[31m-         );[m
[31m-         console.log([m
[31m-             "ESTOQUE AUTOMÁTICO ATIVO"[m
[31m-         );[m
[31m-         console.log([m
[31m-             "E-MAIL AUTOMÁTICO ATIVO"[m
[31m-         );[m
[31m-         console.log([m
[31m-             "=========================================="[m
[31m-         );[m
[31m-         console.log("");[m
[31m-     }[m
[31m- );[m
[32m+             try {[m
[32m+                 const resposta = await fetch([m
[32m+                     `${TURBOFY_API}/sellers/pix/${encodeURIComponent(pedido.chargeId)}`,[m
[32m+                     {[m
[32m+                         method: "GET",[m
[32m+ [m
[32m+                         headers: {[m
[32m+                             "x-client-id": TURBOFY_CLIENT_ID,[m
[32m+                             "x-client-secret": TURBOFY_CLIENT_SECRET[m
[32m+                         }[m
[32m+                     }[m
[32m+                 );[m
[32m+ [m
[32m+                 if (!resposta.ok) {[m
[32m+                     continue;[m
[32m+                 }[m
[32m+ [m
[32m+                 const dados = await resposta.json();[m
[32m+ [m
[32m+                 const status = String([m
[32m+                     dados.status ||[m
[32m+                     dados.data?.status ||[m
[32m+                     dados.charge?.status ||[m
[32m+                     ""[m
[32m+                 ).toUpperCase();[m
[32m+ [m
[32m+                 if (!status) {[m
[32m+                     continue;[m
[32m+                 }[m
[32m+ [m
[32m+                 if (status === "PAID") {[m
[32m+                     atualizarPedido([m
[32m+                         pedido.id,[m
[32m+                         {[m
[32m+                             statusPagamento: "PAID",[m
[32m+                             status: "PAGO",[m
[32m+                             atualizadoEm:[m
[32m+                                 new Date().toISOString()[m
[32m+                         }[m
[32m+                     );[m
[32m+ [m
[32m+                     await processarPedidoPago([m
[32m+                         encontrarPedido(pedido.id)[m
[32m+                     );[m
[32m+                 } else {[m
[32m+                     atualizarPedido([m
[32m+                         pedido.id,[m
[32m+                         {[m
[32m+                             statusPagamento: status,[m
[32m+                             atualizadoEm:[m
[32m+                                 new Date().toISOString()[m
[32m+                         }[m
[32m+                     );[m
[32m+                 }[m
[32m+             } catch (erro) {[m
[32m+                 console.error([m
[32m+                     `Erro verificando pedido ${pedido.id}:`,[m
[32m+                     erro.message[m
[32m+                 );[m
[32m+             }[m
[32m+         }[m
[32m+     } catch (erro) {[m
[32m+         console.error([m
[32m+             "Erro no monitoramento:",[m
[32m+             erro[m
[32m+         );[m
[32m+     }[m
[32m+ }[m
[32m+ [m
[32m+ setInterval([m
[32m+     verificarPagamentosAutomaticamente,[m
[32m+     10000[m
[32m+ );[m
[32m+ [m
[32m+ /* =========================================================[m
[32m+    ADMIN - LOGIN[m
[32m+ ========================================================= */[m
[32m+ [m
[32m+ app.post("/api/admin/login", (req, res) => {[m
[32m+     try {[m
[32m+         const { senha } = req.body || {};[m
[32m+ [m
[32m+         if (!ADMIN_PASSWORD) {[m
[32m+             return res.status(500).json({[m
[32m+                 sucesso: false,[m
[32m+                 erro: "Senha administrativa não configurada."[m
[32m+             });[m
[32m+         }[m
[32m+ [m
[32m+         if ([m
[32m+             typeof senha !== "string" ||[m
[32m+             senha !== ADMIN_PASSWORD[m
[32m+         ) {[m
[32m+             return res.status(401).json({[m
[32m+                 sucesso: false,[m
[32m+                 erro: "Senha incorreta."[m
[32m+             });[m
[32m+         }[m
[32m+ [m
[32m+         const token = gerarTokenSessao();[m
[32m+ [m
[32m+         sessoesAdmin.set(token, {[m
[32m+             criadoEm: Date.now(),[m
[32m+             expiraEm: Date.now() + TEMPO_SESSAO[m
[32m+         });[m
[32m+ [m
[32m+         res.setHeader([m
[32m+             "Set-Cookie",[m
[32m+             [[m
[32m+                 `admin_token=${encodeURIComponent(token)}`,[m
[32m+                 "HttpOnly",[m
[32m+                 "Path=/",[m
[32m+                 "SameSite=Lax",[m
[32m+                 `Max-Age=${Math.floor(TEMPO_SESSAO / 1000)}`[m
[32m+             ].join("; ")[m
[32m+         );[m
[32m+ [m
[32m+         res.json({[m
[32m+             sucesso: true,[m
[32m+             mensagem: "Login realizado."[m
[32m+         });[m
[32m+     } catch (erro) {[m
[32m+         console.error([m
[32m+             "Erro login admin:",[m
[32m+             erro[m
[32m+         );[m
[32m+ [m
[32m+         res.status(500).json({[m
[32m+             sucesso: false,[m
[32m+             erro: "Erro interno."[m
[32m+         });[m
[32m+     }[m
[32m+ });[m
[32m+ [m
[32m+ app.post("/api/admin/logout", (req, res) => {[m
[32m+     const token = obterCookie([m
[32m+         req,[m
[32m+         "admin_token"[m
[32m+     );[m
[32m+ [m
[32m+     if (token) {[m
[32m+         sessoesAdmin.delete(token);[m
[32m+     }[m
[32m+ [m
[32m+     res.setHeader([m
[32m+         "Set-Cookie",[m
[32m+         [[m
[32m+             "admin_token=",[m
[32m+             "HttpOnly",[m
[32m+             "Path=/",[m
[32m+             "SameSite=Lax",[m
[32m+             "Max-Age=0"[m
[32m+         ].join("; ")[m
[32m+     );[m
[32m+ [m
[32m+     res.json({[m
[32m+         sucesso: true[m
[32m+     });[m
[32m+ });[m
[32m+ [m
[32m+ app.get("/api/admin/me", (req, res) => {[m
[32m+     const autenticado =[m
[32m+         verificarSessaoAdmin(req);[m
[32m+ [m
[32m+     res.json({[m
[32m+         autenticado[m
[32m+     });[m
[32m+ });[m
[32m+ [m
[32m+ /* =========================================================[m
[32m+    TICKETS[m
[32m+ ========================================================= */[m
[32m+ [m
[32m+ /*[m
[32m+    O tickets.json usa:[m
[32m+ [m
[32m+    {[m
[32m+        "tickets": [][m
[32m+    }[m
[32m+ [m
[32m+    A função abaixo converte isso para o array[m
[32m+    utilizado pelas rotas.[m
[32m+ */[m
[32m+ function lerPrecos() {[m
[32m+     const padrao = {[m
[32m+         "Nitro Discord Mensal": 5.00,[m
[32m+         "Nitro Discord Anual": 40.00[m
[32m+     };[m
[32m+ [m
[32m+     const dados = lerJSON(CAMINHO_PRECOS, padrao);[m
[32m+ [m
[32m+     if (!dados || typeof dados !== "object" || Array.isArray(dados)) {[m
[32m+         return padrao;[m
[32m+     }[m
[32m+ [m
[32m+     const mensal = Number(dados["Nitro Discord Mensal"]);[m
[32m+     const anual = Number(dados["Nitro Discord Anual"]);[m
[32m+ [m
[32m+     return {[m
[32m+         "Nitro Discord Mensal": Number.isFinite(mensal) && mensal > 0 ? mensal : 5.00,[m
[32m+         "Nitro Discord Anual": Number.isFinite(anual) && anual > 0 ? anual : 40.00[m
[32m+     };[m
[32m+ }[m
[32m+ [m
[32m+ function salvarPrecos(precos) {[m
[32m+     salvarJSON(CAMINHO_PRECOS, precos);[m
[32m+ }[m
[32m+ [m
[32m+ function normalizarProdutoEstoque(produto) {[m
[32m+     const p = String(produto || "").trim().toLowerCase();[m
[32m+ [m
[32m+     if (["mensal", "nitro mensal", "nitro discord mensal"].includes(p)) {[m
[32m+         return "Nitro Discord Mensal";[m
[32m+     }[m
[32m+ [m
[32m+     if (["anual", "nitro anual", "nitro discord anual"].includes(p)) {[m
[32m+         return "Nitro Discord Anual";[m
[32m+     }[m
[32m+ [m
[32m+     return null;[m
[32m+ }[m
[32m+ [m
[32m+ function gerarIdEstoque() {[m
[32m+     return "STK-" + Date.now().toString(36) + "-" + crypto.randomBytes(3).toString("hex");[m
[32m+ }[m
[32m+ function lerTickets() {[m
[32m+     const dados = lerJSON(CAMINHO_TICKETS, {[m
[32m+         tickets: [][m
[32m+     });[m
[32m+ [m
[32m+     /*[m
[32m+        Formato atual:[m
[32m+        {[m
[32m+            "tickets": [][m
[32m+        }[m
[32m+     */[m
[32m+     if ([m
[32m+         dados &&[m
[32m+         !Array.isArray(dados) &&[m
[32m+         Array.isArray(dados.tickets)[m
[32m+     ) {[m
[32m+         return dados.tickets;[m
[32m+     }[m
[32m+ [m
[32m+     /*[m
[32m+        Compatibilidade com formato antigo:[m
[32m+        [...][m
[32m+     */[m
[32m+     if (Array.isArray(dados)) {[m
[32m+         return dados;[m
[32m+     }[m
[32m+ [m
[32m+     return [];[m
[32m+ }[m
[32m+ [m
[32m+ /*[m
[32m+    Salva sempre no formato:[m
[32m+ [m
[32m+    {[m
[32m+        "tickets": [][m
[32m+    }[m
[32m+ */[m
[32m+ function salvarTickets(tickets) {[m
[32m+     salvarJSON(CAMINHO_TICKETS, {[m
[32m+         tickets: Array.isArray(tickets)[m
[32m+             ? tickets[m
[32m+             : [][m
[32m+     });[m
[32m+ }[m
[32m+ [m
[32m+ function gerarIdTicket() {[m
[32m+     return `TICKET-${Math.floor([m
[32m+         1000 + Math.random() * 9000[m
[32m+     )}`;[m
[32m+ }[m
[32m+ [m
[32m+ function gerarTokenTicket() {[m
[32m+     return crypto[m
[32m+         .randomBytes(32)[m
[32m+         .toString("hex");[m
[32m+ }[m
[32m+ [m
[32m+ /*[m
[32m+    Remove o token antes de enviar[m
[32m+    para cliente/admin.[m
[32m+ */[m
[32m+ function prepararTicketPublico(ticket) {[m
[32m+     if (!ticket) return null;[m
[32m+ [m
[32m+     const copia = {[m
[32m+         ...ticket[m
[32m+     };[m
[32m+ [m
[32m+     delete copia.token;[m
[32m+ [m
[32m+     return copia;[m
[32m+ }[m
[32m+ [m
[32m+ function impedirCachePrivado(res) {[m
[32m+     res.setHeader([m
[32m+         "Cache-Control",[m
[32m+         "no-store, no-cache, must-revalidate, private"[m
[32m+     );[m
[32m+ [m
[32m+     res.setHeader([m
[32m+         "Pragma",[m
[32m+         "no-cache"[m
[32m+     );[m
[32m+ [m
[32m+     res.setHeader([m
[32m+         "Expires",[m
[32m+         "0"[m
[32m+     );[m
[32m+ }[m
[32m+ [m
[32m+ /* =========================================================[m
[32m+    CRIAR TICKET[m
[32m+ ========================================================= */[m
[32m+ [m
[32m+ app.post("/api/tickets", (req, res) => {[m
[32m+     try {[m
[32m+         const {[m
[32m+             nome,[m
[32m+             email,[m
[32m+             discord,[m
[32m+             assunto,[m
[32m+             mensagem[m
[32m+         } = req.body || {};[m
[32m+ [m
[32m+         if (!nome || !email || !mensagem) {[m
[32m+             return res.status(400).json({[m
[32m+                 sucesso: false,[m
[32m+                 erro: "Nome, e-mail e mensagem são obrigatórios."[m
[32m+             });[m
[32m+         }[m
[32m+ [m
[32m+         const tickets = lerTickets();[m
[32m+ [m
[32m+         let id = gerarIdTicket();[m
[32m+ [m
[32m+         /*[m
[32m+            Evita ID duplicado.[m
[32m+         */[m
[32m+         while ([m
[32m+             tickets.some([m
[32m+                 ticket => String(ticket.id) === String(id)[m
[32m+             )[m
[32m+         ) {[m
[32m+             id = gerarIdTicket();[m
[32m+         }[m
[32m+ [m
[32m+         const token = gerarTokenTicket();[m
[32m+ [m
[32m+         const agora =[m
[32m+             new Date().toISOString();[m
[32m+ [m
[32m+         const ticket = {[m
[32m+             id,[m
[32m+             token,[m
[32m+ [m
[32m+             nome: String(nome).trim(),[m
[32m+             email: String(email).trim(),[m
[32m+             discord: String(discord || "").trim(),[m
[32m+             assunto: String([m
[32m+                 assunto || "Suporte"[m
[32m+             ).trim(),[m
[32m+ [m
[32m+             status: "ABERTO",[m
[32m+ [m
[32m+             criadoEm: agora,[m
[32m+             atualizadoEm: agora,[m
[32m+ [m
[32m+             mensagens: [[m
[32m+                 {[m
[32m+                     id: crypto[m
[32m+                         .randomBytes(8)[m
[32m+                         .toString("hex"),[m
[32m+ [m
[32m+                     autor: "cliente",[m
[32m+ [m
[32m+                     texto: String([m
[32m+                         mensagem[m
[32m+                     ).trim(),[m
[32m+ [m
[32m+                     criadoEm: agora[m
[32m+                 }[m
[32m+             ][m
[32m+         };[m
[32m+ [m
[32m+         tickets.push(ticket);[m
[32m+ [m
[32m+         salvarTickets(tickets);[m
[32m+ [m
[32m+         /*[m
[32m+            O TOKEN É ENTREGUE SOMENTE AQUI.[m
[32m+         */[m
[32m+         res.json({[m
[32m+             sucesso: true,[m
[32m+ [m
[32m+             ticket: {[m
[32m+                 id: ticket.id,[m
[32m+                 token: ticket.token,[m
[32m+                 status: ticket.status,[m
[32m+                 criadoEm: ticket.criadoEm[m
[32m+             }[m
[32m+         });[m
[32m+     } catch (erro) {[m
[32m+         console.error([m
[32m+             "Erro ao criar ticket:",[m
[32m+             erro[m
[32m+         );[m
[32m++<<<<<<< HEAD[m
[32m++        console.log([m
[32m++            "PIX TURBOFYPAY ATIVO"[m
[32m++        );[m
[32m++        console.log([m
[32m++            "ESTOQUE AUTOMÁTICO ATIVO"[m
[32m++        );[m
[32m++        console.log([m
[32m++            "E-MAIL AUTOMÁTICO ATIVO"[m
[32m++        );[m
[32m++        console.log([m
[32m++            "=========================================="[m
[32m++        );[m
[32m++        console.log("");[m
[32m++    }[m
[32m++);[m
[32m++=======[m
[32m+ [m
[32m+         res.status(500).json({[m
[32m+             sucesso: false,[m
[32m+             erro: "Erro interno ao criar ticket.",[m
[32m+             detalhes: erro.message[m
[32m+         });[m
[32m+     }[m
[32m+ });[m
[32m+ [m
[32m+ /* =========================================================[m
[32m+    CLIENTE - CONSULTAR TICKET[m
[32m+ ========================================================= */[m
[32m+ [m
[32m+ app.get([m
[32m+     "/api/tickets/:id",[m
[32m+     (req, res) => {[m
[32m+         impedirCachePrivado(res);[m
[32m+ [m
[32m+         try {[m
[32m+             const id = String([m
[32m+                 req.params.id || ""[m
[32m+             ).trim();[m
[32m+ [m
[32m+             const token = String([m
[32m+                 req.query.token || ""[m
[32m+             ).trim();[m
[32m+ [m
[32m+             if (!token) {[m
[32m+                 return res.status(401).json({[m
[32m+                     sucesso: false,[m
[32m+                     erro: "Token do ticket não informado."[m
[32m+                 });[m
[32m+             }[m
[32m+ [m
[32m+             const tickets = lerTickets();[m
[32m+ [m
[32m+             const ticket = tickets.find([m
[32m+                 item => String(item.id) === id[m
[32m+             );[m
[32m+ [m
[32m+             if (!ticket) {[m
[32m+                 return res.status(404).json({[m
[32m+                     sucesso: false,[m
[32m+                     erro: "Ticket não encontrado."[m
[32m+                 });[m
[32m+             }[m
[32m+ [m
[32m+             if ([m
[32m+                 !ticket.token ||[m
[32m+                 ticket.token !== token[m
[32m+             ) {[m
[32m+                 return res.status(401).json({[m
[32m+                     sucesso: false,[m
[32m+                     erro: "Acesso negado."[m
[32m+                 });[m
[32m+             }[m
[32m+ [m
[32m+             res.json({[m
[32m+                 sucesso: true,[m
[32m+                 ticket: prepararTicketPublico(ticket)[m
[32m+             });[m
[32m+         } catch (erro) {[m
[32m+             console.error([m
[32m+                 "Erro ao consultar ticket:",[m
[32m+                 erro[m
[32m+             );[m
[32m+ [m
[32m+             res.status(500).json({[m
[32m+                 sucesso: false,[m
[32m+                 erro: "Erro interno ao consultar ticket."[m
[32m+             });[m
[32m+         }[m
[32m+     }[m
[32m+ );[m
[32m+ [m
[32m+ /* =========================================================[m
[32m+    CLIENTE - ENVIAR MENSAGEM[m
[32m+ ========================================================= */[m
[32m+ [m
[32m+ /* ===== BLOQUEIO DE TICKET FECHADO ===== */[m
[32m+ app.use((req, res, next) => {[m
[32m+     if (req.method === "POST" && req.path.match(/^\/api\/tickets\/[^\/]+\/mensagens$/)) {[m
[32m+         try {[m
[32m+             const id = String(req.path.split("/")[3] || "").trim();[m
[32m+             const tickets = lerTickets();[m
[32m+             const ticket = tickets.find(item => String(item.id) === id);[m
[32m+ [m
[32m+             if (ticket && String(ticket.status || "").trim().toLowerCase() === "fechado") {[m
[32m+                 return res.status(409).json({[m
[32m+                     sucesso: false,[m
[32m+                     fechado: true,[m
[32m+                     mensagem: "Este ticket está fechado. Abra um novo ticket para continuar o atendimento."[m
[32m+                 });[m
[32m+             }[m
[32m+         } catch (erro) {[m
[32m+             console.error("Erro ao verificar ticket fechado:", erro);[m
[32m+         }[m
[32m+     }[m
[32m+ [m
[32m+     next();[m
[32m+ });[m
[32m+ /* ===== FIM DO BLOQUEIO ===== */[m
[32m+ app.post([m
[32m+     "/api/tickets/:id/mensagens",[m
[32m+     (req, res) => {[m
[32m+         impedirCachePrivado(res);[m
[32m+ [m
[32m+         try {[m
[32m+             const id = String([m
[32m+                 req.params.id || ""[m
[32m+             ).trim();[m
[32m+ [m
[32m+             const {[m
[32m+                 token,[m
[32m+                 texto,[m
[32m+                 mensagem[m
[32m+             } = req.body || {};[m
[32m+ [m
[32m+             const textoFinal =[m
[32m+                 texto || mensagem || "";[m
[32m+ [m
[32m+             if (!token) {[m
[32m+                 return res.status(401).json({[m
[32m+                     sucesso: false,[m
[32m+                     erro: "Token do ticket não informado."[m
[32m+                 });[m
[32m+             }[m
[32m+ [m
[32m+             if ([m
[32m+                 !textoFinal ||[m
[32m+                 !String(textoFinal).trim()[m
[32m+             ) {[m
[32m+                 return res.status(400).json({[m
[32m+                     sucesso: false,[m
[32m+                     erro: "Mensagem vazia."[m
[32m+                 });[m
[32m+             }[m
[32m+ [m
[32m+             const tickets = lerTickets();[m
[32m+ [m
[32m+             const indice = tickets.findIndex([m
[32m+                 item => String(item.id) === id[m
[32m+             );[m
[32m+ [m
[32m+             if (indice === -1) {[m
[32m+                 return res.status(404).json({[m
[32m+                     sucesso: false,[m
[32m+                     erro: "Ticket não encontrado."[m
[32m+                 });[m
[32m+             }[m
[32m+ [m
[32m+             const ticket = tickets[indice];[m
[32m+ [m
[32m+             if ([m
[32m+                 !ticket.token ||[m
[32m+                 ticket.token !== String(token).trim()[m
[32m+             ) {[m
[32m+                 return res.status(401).json({[m
[32m+                     sucesso: false,[m
[32m+                     erro: "Acesso negado."[m
[32m+                 });[m
[32m+             }[m
[32m+ [m
[32m+             const agora =[m
[32m+                 new Date().toISOString();[m
[32m+ [m
[32m+             ticket.mensagens =[m
[32m+                 Array.isArray(ticket.mensagens)[m
[32m+                     ? ticket.mensagens[m
[32m+                     : [];[m
[32m+ [m
[32m+             ticket.mensagens.push({[m
[32m+                 id: crypto[m
[32m+                     .randomBytes(8)[m
[32m+                     .toString("hex"),[m
[32m+ [m
[32m+                 autor: "cliente",[m
[32m+ [m
[32m+                 texto: String([m
[32m+                     textoFinal[m
[32m+                 ).trim(),[m
[32m+ [m
[32m+                 criadoEm: agora[m
[32m+             });[m
[32m+ [m
[32m+             if ([m
[32m+                 ticket.status === "RESOLVIDO" ||[m
[32m+                 ticket.status === "FECHADO"[m
[32m+             ) {[m
[32m+                 ticket.status = "ABERTO";[m
[32m+             }[m
[32m+ [m
[32m+             ticket.atualizadoEm = agora;[m
[32m+ [m
[32m+             tickets[indice] = ticket;[m
[32m+ [m
[32m+             salvarTickets(tickets);[m
[32m+ [m
[32m+             res.json({[m
[32m+                 sucesso: true,[m
[32m+                 ticket: prepararTicketPublico(ticket)[m
[32m+             });[m
[32m+         } catch (erro) {[m
[32m+             console.error([m
[32m+                 "Erro ao enviar mensagem:",[m
[32m+                 erro[m
[32m+             );[m
[32m+ [m
[32m+             res.status(500).json({[m
[32m+                 sucesso: false,[m
[32m+                 erro: "Erro interno.",[m
[32m+                 detalhes: erro.message[m
[32m+             });[m
[32m+         }[m
[32m+     }[m
[32m+ );[m
[32m+ [m
[32m+ /* =========================================================[m
[32m+    ADMIN - LISTAR TICKETS[m
[32m+ ========================================================= */[m
[32m+ [m
[32m+ app.get([m
[32m+     "/api/admin/tickets",[m
[32m+     autenticarAdmin,[m
[32m+     (req, res) => {[m
[32m+         impedirCachePrivado(res);[m
[32m+ [m
[32m+         try {[m
[32m+             const tickets = lerTickets();[m
[32m+ [m
[32m+             const lista = tickets.filter(ticket => String(ticket.status || "").trim().toLowerCase() !== "fechado").map(ticket => ({[m
[32m+                 id: ticket.id,[m
[32m+                 nome: ticket.nome,[m
[32m+                 email: ticket.email,[m
[32m+                 discord: ticket.discord,[m
[32m+                 assunto: ticket.assunto,[m
[32m+                 status: ticket.status,[m
[32m+                 criadoEm: ticket.criadoEm,[m
[32m+                 atualizadoEm: ticket.atualizadoEm,[m
[32m+ [m
[32m+                 mensagens:[m
[32m+                     Array.isArray(ticket.mensagens)[m
[32m+                         ? ticket.mensagens.length[m
[32m+                         : 0[m
[32m+             }));[m
[32m+ [m
[32m+             res.json({[m
[32m+                 sucesso: true,[m
[32m+                 tickets: lista[m
[32m+             });[m
[32m+         } catch (erro) {[m
[32m+             console.error([m
[32m+                 "Erro ao listar tickets:",[m
[32m+                 erro[m
[32m+             );[m
[32m+ [m
[32m+             res.status(500).json({[m
[32m+                 sucesso: false,[m
[32m+                 erro: "Erro interno ao listar tickets."[m
[32m+             });[m
[32m+         }[m
[32m+     }[m
[32m+ );[m
[32m+ [m
[32m+ /* =========================================================[m
[32m+    ADMIN - ABRIR TICKET[m
[32m+ ========================================================= */[m
[32m+ [m
[32m+ app.get([m
[32m+     "/api/admin/tickets/:id",[m
[32m+     autenticarAdmin,[m
[32m+     (req, res) => {[m
[32m+         impedirCachePrivado(res);[m
[32m+ [m
[32m+         try {[m
[32m+             const id = String([m
[32m+                 req.params.id || ""[m
[32m+             ).trim();[m
[32m+ [m
[32m+             const tickets = lerTickets();[m
[32m+ [m
[32m+             const ticket = tickets.find([m
[32m+                 item => String(item.id) === id[m
[32m+             );[m
[32m+ [m
[32m+             if (!ticket) {[m
[32m+                 return res.status(404).json({[m
[32m+                     sucesso: false,[m
[32m+                     erro: "Ticket não encontrado."[m
[32m+                 });[m
[32m+             }[m
[32m+ [m
[32m+             res.json({[m
[32m+                 sucesso: true,[m
[32m+                 ticket: prepararTicketPublico(ticket)[m
[32m+             });[m
[32m+         } catch (erro) {[m
[32m+             console.error([m
[32m+                 "Erro ao abrir ticket:",[m
[32m+                 erro[m
[32m+             );[m
[32m+ [m
[32m+             res.status(500).json({[m
[32m+                 sucesso: false,[m
[32m+                 erro: "Erro interno ao abrir ticket."[m
[32m+             });[m
[32m+         }[m
[32m+     }[m
[32m+ );[m
[32m+ [m
[32m+ /* =========================================================[m
[32m+    ADMIN - RESPONDER TICKET[m
[32m+ ========================================================= */[m
[32m+ [m
[32m+ function responderTicketComoAdmin(req, res) {[m
[32m+     impedirCachePrivado(res);[m
[32m+ [m
[32m+     try {[m
[32m+         const id = String([m
[32m+             req.params.id || ""[m
[32m+         ).trim();[m
[32m+ [m
[32m+         const {[m
[32m+             texto,[m
[32m+             mensagem[m
[32m+         } = req.body || {};[m
[32m+ [m
[32m+         const textoFinal =[m
[32m+             texto || mensagem || "";[m
[32m+ [m
[32m+         if ([m
[32m+             !textoFinal ||[m
[32m+             !String(textoFinal).trim()[m
[32m+         ) {[m
[32m+             return res.status(400).json({[m
[32m+                 sucesso: false,[m
[32m+                 erro: "Mensagem vazia."[m
[32m+             });[m
[32m+         }[m
[32m+ [m
[32m+         const tickets = lerTickets();[m
[32m+ [m
[32m+         const indice = tickets.findIndex([m
[32m+             item => String(item.id) === id[m
[32m+         );[m
[32m+ [m
[32m+         if (indice === -1) {[m
[32m+             return res.status(404).json({[m
[32m+                 sucesso: false,[m
[32m+                 erro: "Ticket não encontrado."[m
[32m+             });[m
[32m+         }[m
[32m+ [m
[32m+         const ticket = tickets[indice];[m
[32m+ [m
[32m+         const agora =[m
[32m+             new Date().toISOString();[m
[32m+ [m
[32m+         ticket.mensagens =[m
[32m+             Array.isArray(ticket.mensagens)[m
[32m+                 ? ticket.mensagens[m
[32m+                 : [];[m
[32m+ [m
[32m+         ticket.mensagens.push({[m
[32m+             id: crypto[m
[32m+                 .randomBytes(8)[m
[32m+                 .toString("hex"),[m
[32m+ [m
[32m+             autor: "admin",[m
[32m+ [m
[32m+             texto: String([m
[32m+                 textoFinal[m
[32m+             ).trim(),[m
[32m+ [m
[32m+             criadoEm: agora[m
[32m+         });[m
[32m+ [m
[32m+         ticket.atualizadoEm = agora;[m
[32m+ [m
[32m+         if ([m
[32m+             ticket.status === "FECHADO"[m
[32m+         ) {[m
[32m+             ticket.status = "ABERTO";[m
[32m+         }[m
[32m+ [m
[32m+         tickets[indice] = ticket;[m
[32m+ [m
[32m+         salvarTickets(tickets);[m
[32m+ [m
[32m+         res.json({[m
[32m+             sucesso: true,[m
[32m+             ticket: prepararTicketPublico(ticket)[m
[32m+         });[m
[32m+     } catch (erro) {[m
[32m+         console.error([m
[32m+             "Erro ao responder ticket:",[m
[32m+             erro[m
[32m+         );[m
[32m+ [m
[32m+         res.status(500).json({[m
[32m+             sucesso: false,[m
[32m+             erro: "Erro interno.",[m
[32m+             detalhes: erro.message[m
[32m+         });[m
[32m+     }[m
[32m+ }[m
[32m+ [m
[32m+ app.post([m
[32m+     "/api/admin/tickets/:id/respostas",[m
[32m+     autenticarAdmin,[m
[32m+     responderTicketComoAdmin[m
[32m+ );[m
[32m+ [m
[32m+ /*[m
[32m+    Compatibilidade com versões do admin.html[m
[32m+    que utilizem /mensagens.[m
[32m+ */[m
[32m+ app.post([m
[32m+     "/api/admin/tickets/:id/mensagens",[m
[32m+     autenticarAdmin,[m
[32m+     responderTicketComoAdmin[m
[32m+ );[m
[32m+ [m
[32m+ /* =========================================================[m
[32m+    ADMIN - ALTERAR STATUS[m
[32m+ ========================================================= */[m
[32m+ [m
[32m+ [m
[32m+ /* =========================================================[m
[32m+    ADMIN - FECHAR TICKET[m
[32m+    Fechamento independente de "Resolvido"[m
[32m+ ========================================================= */[m
[32m+ app.patch([m
[32m+     "/api/admin/tickets/:id/fechar",[m
[32m+     autenticarAdmin,[m
[32m+     (req, res) => {[m
[32m+         impedirCachePrivado(res);[m
[32m+ [m
[32m+         try {[m
[32m+             const id = String(req.params.id || "").trim();[m
[32m+             const tickets = lerTickets();[m
[32m+ [m
[32m+             const ticket = tickets.find([m
[32m+                 item => String(item.id) === id[m
[32m+             );[m
[32m+ [m
[32m+             if (!ticket) {[m
[32m+                 return res.status(404).json({[m
[32m+                     sucesso: false,[m
[32m+                     mensagem: "Ticket não encontrado."[m
[32m+                 });[m
[32m+             }[m
[32m+ [m
[32m+             ticket.status = "fechado";[m
[32m+             ticket.atualizadoEm = new Date().toISOString();[m
[32m+ [m
[32m+             salvarTickets(tickets);[m
[32m+ [m
[32m+             return res.json({[m
[32m+                 sucesso: true,[m
[32m+                 fechado: true,[m
[32m+                 mensagem: "Ticket fechado com sucesso.",[m
[32m+                 ticket[m
[32m+             });[m
[32m+ [m
[32m+         } catch (erro) {[m
[32m+             console.error("Erro ao fechar ticket:", erro);[m
[32m+ [m
[32m+             return res.status(500).json({[m
[32m+                 sucesso: false,[m
[32m+                 mensagem: "Erro interno ao fechar o ticket."[m
[32m+             });[m
[32m+         }[m
[32m+     }[m
[32m+ );[m
[32m+ app.patch([m
[32m+     "/api/admin/tickets/:id/status",[m
[32m+     autenticarAdmin,[m
[32m+     (req, res) => {[m
[32m+         impedirCachePrivado(res);[m
[32m+ [m
[32m+         try {[m
[32m+             const id = String([m
[32m+                 req.params.id || ""[m
[32m+             ).trim();[m
[32m+ [m
[32m+             const {[m
[32m+                 status[m
[32m+             } = req.body || {};[m
[32m+ [m
[32m+             const statusNormalizado =[m
[32m+                 String([m
[32m+                     status || ""[m
[32m+                 ).toUpperCase();[m
[32m+ [m
[32m+             const statusPermitidos = [[m
[32m+                 "ABERTO",[m
[32m+                 "EM_ATENDIMENTO",[m
[32m+                 "RESOLVIDO",[m
[32m+                 "FECHADO"[m
[32m+             ];[m
[32m+ [m
[32m+             if ([m
[32m+                 !statusPermitidos.includes([m
[32m+                     statusNormalizado[m
[32m+                 )[m
[32m+             ) {[m
[32m+                 return res.status(400).json({[m
[32m+                     sucesso: false,[m
[32m+                     erro: "Status inválido."[m
[32m+                 });[m
[32m+             }[m
[32m+ [m
[32m+             const tickets = lerTickets();[m
[32m+ [m
[32m+             const indice = tickets.findIndex([m
[32m+                 item => String(item.id) === id[m
[32m+             );[m
[32m+ [m
[32m+             if (indice === -1) {[m
[32m+                 return res.status(404).json({[m
[32m+                     sucesso: false,[m
[32m+                     erro: "Ticket não encontrado."[m
[32m+                 });[m
[32m+             }[m
[32m+ [m
[32m+             tickets[indice].status =[m
[32m+                 statusNormalizado;[m
[32m+ [m
[32m+             tickets[indice].atualizadoEm =[m
[32m+                 new Date().toISOString();[m
[32m+ [m
[32m+             salvarTickets(tickets);[m
[32m+ [m
[32m+             res.json({[m
[32m+                 sucesso: true,[m
[32m+                 ticket: prepararTicketPublico([m
[32m+                     tickets[indice][m
[32m+                 )[m
[32m+             });[m
[32m+         } catch (erro) {[m
[32m+             console.error([m
[32m+                 "Erro ao alterar status:",[m
[32m+                 erro[m
[32m+             );[m
[32m+ [m
[32m+             res.status(500).json({[m
[32m+                 sucesso: false,[m
[32m+                 erro: "Erro interno.",[m
[32m+                 detalhes: erro.message[m
[32m+             });[m
[32m+         }[m
[32m+     }[m
[32m+ );[m
[32m+ [m
[32m+ /* =========================================================[m
[32m+    TESTE DE E-MAIL[m
[32m+ ========================================================= */[m
[32m+ [m
[32m+ app.get([m
[32m+     "/teste-email",[m
[32m+     async (req, res) => {[m
[32m+         try {[m
[32m+             if (!transporter) {[m
[32m+                 return res.status(500).json({[m
[32m+                     sucesso: false,[m
[32m+                     erro: "E-mail não configurado."[m
[32m+                 });[m
[32m+             }[m
[32m+ [m
[32m+             await transporter.sendMail({[m
[32m+                 from: `"HYPE STORE" <${EMAIL_USUARIO}>`,[m
[32m+                 to: EMAIL_USUARIO,[m
[32m+                 subject: "HYPE STORE - Teste de e-mail",[m
[32m+                 text: "Teste de envio de e-mail da HYPE STORE."[m
[32m+             });[m
[32m+ [m
[32m+             res.json({[m
[32m+                 sucesso: true,[m
[32m+                 mensagem: "E-mail de teste enviado."[m
[32m+             });[m
[32m+         } catch (erro) {[m
[32m+             console.error([m
[32m+                 "Erro teste e-mail:",[m
[32m+                 erro[m
[32m+             );[m
[32m+ [m
[32m+             res.status(500).json({[m
[32m+                 sucesso: false,[m
[32m+                 erro: erro.message[m
[32m+             });[m
[32m+         }[m
[32m+     }[m
[32m+ );[m
[32m+ [m
[32m+ /* =========================================================[m
[32m+    GARANTIR ARQUIVOS[m
[32m+ ========================================================= */[m
[32m+ [m
[32m+ function garantirArquivos() {[m
[32m+     if (!fs.existsSync(CAMINHO_PEDIDOS)) {[m
[32m+         salvarPedidos([]);[m
[32m+     }[m
[32m+ [m
[32m+     if (!fs.existsSync(CAMINHO_TICKETS)) {[m
[32m+         salvarTickets([]);[m
[32m+     } else {[m
[32m+         /*[m
[32m+            Corrige automaticamente tickets.json caso[m
[32m+            esteja vazio ou em formato incompatível.[m
[32m+         */[m
[32m+         const dados = lerJSON([m
[32m+             CAMINHO_TICKETS,[m
[32m+             {[m
[32m+                 tickets: [][m
[32m+             }[m
[32m+         );[m
[32m+ [m
[32m+         if ([m
[32m+             !Array.isArray(dados) &&[m
[32m+             !([m
[32m+                 dados &&[m
[32m+                 Array.isArray(dados.tickets)[m
[32m+             )[m
[32m+         ) {[m
[32m+             salvarTickets([]);[m
[32m+         } else if (Array.isArray(dados)) {[m
[32m+             /*[m
[32m+                Converte formato antigo para o atual.[m
[32m+             */[m
[32m+             salvarTickets(dados);[m
[32m+         }[m
[32m+     }[m
[32m+ [m
[32m+     if (!fs.existsSync(CAMINHO_ESTOQUE)) {[m
[32m+         salvarEstoque({[m
[32m+             "Nitro Discord Mensal": [],[m
[32m+             "Nitro Discord Anual": [][m
[32m+         });[m
[32m+     }[m
[32m+ }[m
[32m+ [m
[32m+ garantirArquivos();[m
[32m+ [m
[32m+ /* =========================================================[m
[32m+    INICIAR SERVIDOR[m
[32m+ ========================================================= */[m
[32m+ [m
[32m+ [m
[32m+ app.get("/api/precos", (req, res) => {[m
[32m+     const precos = lerPrecos();[m
[32m+     res.json({[m
[32m+         sucesso: true,[m
[32m+         mensal: precos["Nitro Discord Mensal"],[m
[32m+         anual: precos["Nitro Discord Anual"][m
[32m+     });[m
[32m+ });[m
[32m+ [m
[32m+ app.get("/api/admin/precos", exigirSessaoAdmin, (req, res) => {[m
[32m+     const precos = lerPrecos();[m
[32m+     res.json({[m
[32m+         sucesso: true,[m
[32m+         mensal: precos["Nitro Discord Mensal"],[m
[32m+         anual: precos["Nitro Discord Anual"][m
[32m+     });[m
[32m+ });[m
[32m+ [m
[32m+ app.put("/api/admin/precos", exigirSessaoAdmin, (req, res) => {[m
[32m+     const mensal = Number(req.body.mensal);[m
[32m+     const anual = Number(req.body.anual);[m
[32m+ [m
[32m+     if (!Number.isFinite(mensal) || mensal <= 0 || !Number.isFinite(anual) || anual <= 0) {[m
[32m+         return res.status(400).json({[m
[32m+             sucesso: false,[m
[32m+             erro: "Informe preços válidos."[m
[32m+         });[m
[32m+     }[m
[32m+ [m
[32m+     salvarPrecos({[m
[32m+         "Nitro Discord Mensal": mensal,[m
[32m+         "Nitro Discord Anual": anual[m
[32m+     });[m
[32m+ [m
[32m+     res.json({[m
[32m+         sucesso: true,[m
[32m+         mensal,[m
[32m+         anual[m
[32m+     });[m
[32m+ });[m
[32m+ [m
[32m+ app.get("/api/admin/estoque", exigirSessaoAdmin, (req, res) => {[m
[32m+     const estoque = lerEstoque();[m
[32m+ [m
[32m+     res.json({[m
[32m+         sucesso: true,[m
[32m+         mensal: estoque["Nitro Discord Mensal"] || [],[m
[32m+         anual: estoque["Nitro Discord Anual"] || [][m
[32m+     });[m
[32m+ });[m
[32m+ [m
[32m+ app.post("/api/admin/estoque", exigirSessaoAdmin, (req, res) => {[m
[32m+     const produto = normalizarProdutoEstoque(req.body.produto);[m
[32m+     const email = String(req.body.email || "").trim();[m
[32m+     const senha = String(req.body.senha || "").trim();[m
[32m+ [m
[32m+     if (!produto) {[m
[32m+         return res.status(400).json({[m
[32m+             sucesso: false,[m
[32m+             erro: "Produto inválido."[m
[32m+         });[m
[32m+     }[m
[32m+ [m
[32m+     if (!email || !senha) {[m
[32m+         return res.status(400).json({[m
[32m+             sucesso: false,[m
[32m+             erro: "Email e senha são obrigatórios."[m
[32m+         });[m
[32m+     }[m
[32m+ [m
[32m+     const estoque = lerEstoque();[m
[32m+ [m
[32m+     if (!Array.isArray(estoque[produto])) {[m
[32m+         estoque[produto] = [];[m
[32m+     }[m
[32m+ [m
[32m+     estoque[produto].push({[m
[32m+         id: gerarIdEstoque(),[m
[32m+         email,[m
[32m+         senha,[m
[32m+         status: "disponivel",[m
[32m+         criadoEm: new Date().toISOString()[m
[32m+     });[m
[32m+ [m
[32m+     salvarEstoque(estoque);[m
[32m+ [m
[32m+     res.json({[m
[32m+         sucesso: true,[m
[32m+         mensagem: "Conta adicionada ao estoque."[m
[32m+     });[m
[32m+ });[m
[32m+ [m
[32m+ app.delete("/api/admin/estoque/:produto/:id", exigirSessaoAdmin, (req, res) => {[m
[32m+     const produto = normalizarProdutoEstoque(req.params.produto);[m
[32m+     const id = String(req.params.id || "");[m
[32m+ [m
[32m+     if (!produto) {[m
[32m+         return res.status(400).json({[m
[32m+             sucesso: false,[m
[32m+             erro: "Produto inválido."[m
[32m+         });[m
[32m+     }[m
[32m+ [m
[32m+     const estoque = lerEstoque();[m
[32m+     const lista = Array.isArray(estoque[produto]) ? estoque[produto] : [];[m
[32m+ [m
[32m+     const indice = lista.findIndex(item =>[m
[32m+         String(item.id || "") === id &&[m
[32m+         String(item.status || "disponivel").toLowerCase() === "disponivel"[m
[32m+     );[m
[32m+ [m
[32m+     if (indice === -1) {[m
[32m+         return res.status(404).json({[m
[32m+             sucesso: false,[m
[32m+             erro: "Conta disponível não encontrada."[m
[32m+         });[m
[32m+     }[m
[32m+ [m
[32m+     lista.splice(indice, 1);[m
[32m+     estoque[produto] = lista;[m
[32m+ [m
[32m+     salvarEstoque(estoque);[m
[32m+ [m
[32m+     res.json({[m
[32m+         sucesso: true,[m
[32m+         mensagem: "Conta removida do estoque."[m
[32m+     });[m
[32m+ });[m
[32m+ app.listen(PORT, () => {[m
[32m+     console.log("");[m
[32m+     console.log("======================================");[m
[32m+     console.log("       HYPE STORE - SERVIDOR");[m
[32m+     console.log("======================================");[m
[32m+     console.log([m
[32m+         `Servidor da HYPE STORE funcionando na porta ${PORT}`[m
[32m+     );[m
[32m+     console.log([m
[32m+         `TurbofyPay: ${TURBOFY_API}`[m
[32m+     );[m
[32m+     console.log([m
[32m+         `Estoque: ${CAMINHO_ESTOQUE}`[m
[32m+     );[m
[32m+     console.log([m
[32m+         `Pedidos: ${CAMINHO_PEDIDOS}`[m
[32m+     );[m
[32m+     console.log([m
[32m+         `Tickets: ${CAMINHO_TICKETS}`[m
[32m+     );[m
[32m+     console.log([m
[32m+         `E-mail configurado: ${transporter ? "SIM" : "NÃO"}`[m
[32m+     );[m
[32m+     console.log([m
[32m+         `Admin configurado: ${ADMIN_PASSWORD ? "SIM" : "NÃO"}`[m
[32m+     );[m
[32m+     console.log("======================================");[m
[32m+     console.log("");[m
[32m+ });[m
[32m+ [m
[32m+ [m
[32m+ [m
[32m+ [m
[32m+ [m
[32m++>>>>>>> caeddf6 (Atualiza estoque, precos e painel administrativo)[m
