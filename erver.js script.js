warning: in the working copy of 'script.js', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'server.js', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/script.js b/script.js[m
[1mindex 4602874..32617cd 100644[m
[1m--- a/script.js[m
[1m+++ b/script.js[m
[36m@@ -1,4 +1,4 @@[m
[31m-[m
[32m+[m[32m﻿[m
 // ==========================================[m
 // HYPE STORE - SCRIPT PRINCIPAL[m
 // ==========================================[m
[36m@@ -117,7 +117,7 @@[m [mfunction atualizarCarrinho() {[m
 [m
         listaCarrinho.innerHTML = `[m
             <p style="text-align:center;">[m
[31m-                Seu carrinho está vazio.[m
[32m+[m[32m                Seu carrinho estÃ¡ vazio.[m
             </p>[m
         `;[m
 [m
[36m@@ -164,7 +164,7 @@[m [mfunction atualizarCarrinho() {[m
                     <button[m
                         onclick="removerProduto(${index})"[m
                     >[m
[31m-                        ❌[m
[32m+[m[32m                        âŒ[m
                     </button>[m
 [m
                 `;[m
[36m@@ -236,7 +236,7 @@[m [mfunction abrirCheckout() {[m
     if (carrinho.length === 0) {[m
 [m
         alert([m
[31m-            "Seu carrinho está vazio."[m
[32m+[m[32m            "Seu carrinho estÃ¡ vazio."[m
         );[m
 [m
         return;[m
[36m@@ -305,7 +305,7 @@[m [masync function gerarPagamentoPix() {[m
     if (carrinho.length === 0) {[m
 [m
         alert([m
[31m-            "Seu carrinho está vazio."[m
[32m+[m[32m            "Seu carrinho estÃ¡ vazio."[m
         );[m
 [m
         return;[m
[36m@@ -345,7 +345,7 @@[m [masync function gerarPagamentoPix() {[m
     if (valor < 1.50) {[m
 [m
         alert([m
[31m-            "O valor mínimo do Pix é R$ 1,50."[m
[32m+[m[32m            "O valor mÃ­nimo do Pix Ã© R$ 1,50."[m
         );[m
 [m
         return;[m
[36m@@ -367,7 +367,7 @@[m [masync function gerarPagamentoPix() {[m
     try {[m
 [m
         // ==========================================[m
[31m-        // GARANTIR QUE A OPÇÃO ESTÁ SENDO ENVIADA[m
[32m+[m[32m        // GARANTIR QUE A OPÃ‡ÃƒO ESTÃ SENDO ENVIADA[m
         // ==========================================[m
 [m
         const itensParaEnviar =[m
[36m@@ -492,7 +492,7 @@[m [masync function gerarPagamentoPix() {[m
         ) {[m
 [m
             throw new Error([m
[31m-                "Pagamento não foi criado corretamente."[m
[32m+[m[32m                "Pagamento nÃ£o foi criado corretamente."[m
             );[m
         }[m
 [m
[36m@@ -513,7 +513,7 @@[m [masync function gerarPagamentoPix() {[m
 [m
         alert([m
             erro.message ||[m
[31m-            "Não foi possível gerar o pagamento."[m
[32m+[m[32m            "NÃ£o foi possÃ­vel gerar o pagamento."[m
         );[m
 [m
     } finally {[m
[36m@@ -532,121 +532,281 @@[m [masync function gerarPagamentoPix() {[m
 // MOSTRAR PAGAMENTO PIX[m
 // ==========================================[m
 [m
[31m-function mostrarPagamentoPix([m
[31m-    dados[m
[31m-) {[m
[32m+[m[32mfunction mostrarPagamentoPix(dados) {[m
[32m+[m
[32m+[m[32m    console.log([m
[32m+[m[32m        "DADOS DO PIX RECEBIDOS:",[m
[32m+[m[32m        dados[m
[32m+[m[32m    );[m
 [m
[31m-    fecharCheckout();[m
[32m+[m[32m    if (!dados) {[m
 [m
[31m-    const pixModal =[m
[31m-        document.getElementById([m
[31m-            "modal-pix"[m
[32m+[m[32m        alert([m
[32m+[m[32m            "Não foram recebidos os dados do PIX."[m
         );[m
 [m
[31m-    if (!pixModal) {[m
[32m+[m[32m        return;[m
[32m+[m[32m    }[m
[32m+[m
[32m+[m[32m    if (!dados.copyPaste) {[m
 [m
         console.error([m
[31m-            "Modal Pix não encontrado."[m
[32m+[m[32m            "PIX COPIA E COLA NÃO RECEBIDO:",[m
[32m+[m[32m            dados[m
[32m+[m[32m        );[m
[32m+[m
[32m+[m[32m        alert([m
[32m+[m[32m            "O servidor não retornou o PIX copia e cola."[m
         );[m
 [m
         return;[m
     }[m
 [m
[31m-    pixModal.style.display =[m
[31m-        "flex";[m
[31m-[m
     // ==========================================[m
[31m-    // QR CODE[m
[32m+[m[32m    // ESCONDER QR CODE[m
     // ==========================================[m
 [m
     const qrCode =[m
[31m-        document.getElementById([m
[31m-            "qr-code"[m
[31m-        );[m
[31m-[m
[31m-    if ([m
[31m-        qrCode &&[m
[31m-        dados.qrCode[m
[31m-    ) {[m
[32m+[m[32m        document.getElementById("qr-code");[m
 [m
[31m-        qrCode.src =[m
[31m-            dados.qrCode;[m
[32m+[m[32m    if (qrCode) {[m
 [m
         qrCode.style.display =[m
[31m-            "block";[m
[32m+[m[32m            "none";[m
[32m+[m[32m    }[m
[32m+[m
[32m+[m[32m    const qrCodeContainer =[m
[32m+[m[32m        document.getElementById("qr-code-container");[m
[32m+[m
[32m+[m[32m    if (qrCodeContainer) {[m
[32m+[m
[32m+[m[32m        qrCodeContainer.style.display =[m
[32m+[m[32m            "none";[m
     }[m
 [m
     // ==========================================[m
[31m-    // PIX COPIA E COLA[m
[32m+[m[32m    // MOSTRAR PIX COPIA E COLA[m
     // ==========================================[m
 [m
[31m-    const pixCopiaCola =[m
[32m+[m[32m    let pixCopiaCola =[m
         document.getElementById([m
             "pix-copia-cola"[m
         );[m
 [m
[31m-    if (pixCopiaCola) {[m
[32m+[m[32m    if (!pixCopiaCola) {[m
[32m+[m
[32m+[m[32m        pixCopiaCola =[m
[32m+[m[32m            document.createElement([m
[32m+[m[32m                "textarea"[m
[32m+[m[32m            );[m
[32m+[m
[32m+[m[32m        pixCopiaCola.id =[m
[32m+[m[32m            "pix-copia-cola";[m
 [m
[31m-        pixCopiaCola.value =[m
[31m-            dados.copyPaste || "";[m
[32m+[m[32m        pixCopiaCola.readOnly =[m
[32m+[m[32m            true;[m
[32m+[m
[32m+[m[32m        pixCopiaCola.style.width =[m
[32m+[m[32m            "100%";[m
[32m+[m
[32m+[m[32m        pixCopiaCola.style.minHeight =[m
[32m+[m[32m            "100px";[m
[32m+[m
[32m+[m[32m        pixCopiaCola.style.marginTop =[m
[32m+[m[32m            "15px";[m
[32m+[m
[32m+[m[32m        pixCopiaCola.style.padding =[m
[32m+[m[32m            "12px";[m
[32m+[m
[32m+[m[32m        pixCopiaCola.style.borderRadius =[m
[32m+[m[32m            "10px";[m
[32m+[m
[32m+[m[32m        pixCopiaCola.style.resize =[m
[32m+[m[32m            "none";[m
[32m+[m
[32m+[m[32m        const pagamentoPix =[m
[32m+[m[32m            document.getElementById([m
[32m+[m[32m                "pagamento-pix"[m
[32m+[m[32m            );[m
[32m+[m
[32m+[m[32m        if (pagamentoPix) {[m
[32m+[m
[32m+[m[32m            pagamentoPix.appendChild([m
[32m+[m[32m                pixCopiaCola[m
[32m+[m[32m            );[m
[32m+[m
[32m+[m[32m        } else {[m
[32m+[m
[32m+[m[32m            document.body.appendChild([m
[32m+[m[32m                pixCopiaCola[m
[32m+[m[32m            );[m
[32m+[m[32m        }[m
     }[m
 [m
[32m+[m[32m    pixCopiaCola.value =[m
[32m+[m[32m        dados.copyPaste;[m
[32m+[m
[32m+[m[32m    pixCopiaCola.style.display =[m
[32m+[m[32m        "block";[m
[32m+[m
     // ==========================================[m
[31m-    // ID DO PEDIDO[m
[32m+[m[32m    // MOSTRAR ÁREA DO PAGAMENTO[m
     // ==========================================[m
 [m
[31m-    const pedidoId =[m
[32m+[m[32m    const pagamentoPix =[m
         document.getElementById([m
[31m-            "pedido-id"[m
[32m+[m[32m            "pagamento-pix"[m
         );[m
 [m
[31m-    if (pedidoId) {[m
[32m+[m[32m    if (pagamentoPix) {[m
 [m
[31m-        pedidoId.textContent =[m
[31m-            dados.pedidoId || "";[m
[32m+[m[32m        pagamentoPix.style.display =[m
[32m+[m[32m            "block";[m
     }[m
 [m
[31m-    // ==========================================[m
[31m-    // STATUS[m
[31m-    // ==========================================[m
[32m+[m[32m    const areaPix =[m
[32m+[m[32m        document.getElementById([m
[32m+[m[32m            "area-pix"[m
[32m+[m[32m        );[m
 [m
[31m-    const statusPix =[m
[32m+[m[32m    if (areaPix) {[m
[32m+[m
[32m+[m[32m        areaPix.style.display =[m
[32m+[m[32m            "block";[m
[32m+[m[32m    }[m
[32m+[m
[32m+[m[32m    const modalPix =[m
         document.getElementById([m
[31m-            "status-pix"[m
[32m+[m[32m            "modal-pix"[m
         );[m
 [m
[31m-    if (statusPix) {[m
[32m+[m[32m    if (modalPix) {[m
 [m
[31m-        statusPix.textContent =[m
[31m-            "🟡 AGUARDANDO PAGAMENTO...";[m
[32m+[m[32m        modalPix.style.display =[m
[32m+[m[32m            "flex";[m
     }[m
 [m
     // ==========================================[m
[31m-    // LIMPAR MENSAGEM ANTERIOR[m
[32m+[m[32m    // BOTÃO COPIAR[m
     // ==========================================[m
 [m
[31m-    const mensagem =[m
[32m+[m[32m    let botaoCopiar =[m
         document.getElementById([m
[31m-            "mensagem-pagamento"[m
[32m+[m[32m            "btn-copiar-pix"[m
         );[m
 [m
[31m-    if (mensagem) {[m
[32m+[m[32m    if (!botaoCopiar) {[m
[32m+[m
[32m+[m[32m        botaoCopiar =[m
[32m+[m[32m            document.createElement([m
[32m+[m[32m                "button"[m
[32m+[m[32m            );[m
[32m+[m
[32m+[m[32m        botaoCopiar.id =[m
[32m+[m[32m            "btn-copiar-pix";[m
[32m+[m
[32m+[m[32m        botaoCopiar.type =[m
[32m+[m[32m            "button";[m
[32m+[m
[32m+[m[32m        botaoCopiar.textContent =[m
[32m+[m[32m            "COPIAR PIX";[m
[32m+[m
[32m+[m[32m        botaoCopiar.style.display =[m
[32m+[m[32m            "block";[m
[32m+[m
[32m+[m[32m        botaoCopiar.style.width =[m
[32m+[m[32m            "100%";[m
[32m+[m
[32m+[m[32m        botaoCopiar.style.marginTop =[m
[32m+[m[32m            "10px";[m
[32m+[m
[32m+[m[32m        botaoCopiar.style.padding =[m
[32m+[m[32m            "12px";[m
 [m
[31m-        mensagem.innerHTML = "";[m
[32m+[m[32m        botaoCopiar.style.cursor =[m
[32m+[m[32m            "pointer";[m
[32m+[m
[32m+[m[32m        if (pixCopiaCola.parentElement) {[m
[32m+[m
[32m+[m[32m            pixCopiaCola.parentElement.appendChild([m
[32m+[m[32m                botaoCopiar[m
[32m+[m[32m            );[m
[32m+[m
[32m+[m[32m        } else {[m
[32m+[m
[32m+[m[32m            document.body.appendChild([m
[32m+[m[32m                botaoCopiar[m
[32m+[m[32m            );[m
[32m+[m[32m        }[m
     }[m
 [m
[31m-    // ==========================================[m
[31m-    // VERIFICAR PAGAMENTO[m
[31m-    // ==========================================[m
[32m+[m[32m    botaoCopiar.onclick =[m
[32m+[m[32m        async function () {[m
[32m+[m
[32m+[m[32m            try {[m
[32m+[m
[32m+[m[32m                await navigator.clipboard.writeText([m
[32m+[m[32m                    dados.copyPaste[m
[32m+[m[32m                );[m
[32m+[m
[32m+[m[32m                botaoCopiar.textContent =[m
[32m+[m[32m                    "PIX COPIADO!";[m
[32m+[m
[32m+[m[32m                setTimeout([m
[32m+[m[32m                    () => {[m
[32m+[m
[32m+[m[32m                        botaoCopiar.textContent =[m
[32m+[m[32m                            "COPIAR PIX";[m
 [m
[31m-    verificarPagamento([m
[32m+[m[32m                    },[m
[32m+[m[32m                    2000[m
[32m+[m[32m                );[m
[32m+[m
[32m+[m[32m            } catch (erro) {[m
[32m+[m
[32m+[m[32m                pixCopiaCola.select();[m
[32m+[m
[32m+[m[32m                document.execCommand([m
[32m+[m[32m                    "copy"[m
[32m+[m[32m                );[m
[32m+[m
[32m+[m[32m                botaoCopiar.textContent =[m
[32m+[m[32m                    "PIX COPIADO!";[m
[32m+[m
[32m+[m[32m                setTimeout([m
[32m+[m[32m                    () => {[m
[32m+[m
[32m+[m[32m                        botaoCopiar.textContent =[m
[32m+[m[32m                            "COPIAR PIX";[m
[32m+[m
[32m+[m[32m                    },[m
[32m+[m[32m                    2000[m
[32m+[m[32m                );[m
[32m+[m[32m            }[m
[32m+[m[32m        };[m
[32m+[m
[32m+[m[32m    console.log([m
[32m+[m[32m        "=========================================="[m
[32m+[m[32m    );[m
[32m+[m
[32m+[m[32m    console.log([m
[32m+[m[32m        "PIX COPIA E COLA EXIBIDO!"[m
[32m+[m[32m    );[m
[32m+[m
[32m+[m[32m    console.log([m
[32m+[m[32m        "CHARGE ID:",[m
         dados.chargeId[m
     );[m
[31m-}[m
 [m
[31m-// ==========================================[m
[31m-// COPIAR PIX[m
[31m-// ==========================================[m
[32m+[m[32m    console.log([m
[32m+[m[32m        "STATUS:",[m
[32m+[m[32m        dados.status[m
[32m+[m[32m    );[m
[32m+[m
[32m+[m[32m    console.log([m
[32m+[m[32m        "=========================================="[m
[32m+[m[32m    );[m
[32m+[m[32m}[m
 [m
 async function copiarPix() {[m
 [m
[36m@@ -661,7 +821,7 @@[m [masync function copiarPix() {[m
     ) {[m
 [m
         alert([m
[31m-            "Código Pix não encontrado."[m
[32m+[m[32m            "CÃ³digo Pix nÃ£o encontrado."[m
         );[m
 [m
         return;[m
[36m@@ -674,7 +834,7 @@[m [masync function copiarPix() {[m
         );[m
 [m
         alert([m
[31m-            "Código Pix copiado!"[m
[32m+[m[32m            "CÃ³digo Pix copiado!"[m
         );[m
 [m
     } catch (erro) {[m
[36m@@ -686,7 +846,7 @@[m [masync function copiarPix() {[m
         );[m
 [m
         alert([m
[31m-            "Código Pix copiado!"[m
[32m+[m[32m            "CÃ³digo Pix copiado!"[m
         );[m
     }[m
 }[m
[36m@@ -800,7 +960,7 @@[m [masync function consultarStatusPagamento([m
             if (statusPix) {[m
 [m
                 statusPix.textContent =[m
[31m-                    "✅ PAGAMENTO APROVADO!";[m
[32m+[m[32m                    "âœ… PAGAMENTO APROVADO!";[m
             }[m
 [m
             if (intervaloPagamento) {[m
[36m@@ -831,7 +991,7 @@[m [masync function consultarStatusPagamento([m
             if (statusPix) {[m
 [m
                 statusPix.textContent =[m
[31m-                    "🟡 AGUARDANDO PAGAMENTO...";[m
[32m+[m[32m                    "ðŸŸ¡ AGUARDANDO PAGAMENTO...";[m
             }[m
 [m
             return;[m
[36m@@ -848,7 +1008,7 @@[m [masync function consultarStatusPagamento([m
             if (statusPix) {[m
 [m
                 statusPix.textContent =[m
[31m-                    "🟡 PROCESSANDO PAGAMENTO...";[m
[32m+[m[32m                    "ðŸŸ¡ PROCESSANDO PAGAMENTO...";[m
             }[m
 [m
             return;[m
[36m@@ -868,7 +1028,7 @@[m [masync function consultarStatusPagamento([m
             if (statusPix) {[m
 [m
                 statusPix.textContent =[m
[31m-                    "⚠️ Erro ao verificar pagamento.";[m
[32m+[m[32m                    "âš ï¸ Erro ao verificar pagamento.";[m
             }[m
 [m
             return;[m
[36m@@ -909,7 +1069,7 @@[m [mfunction mostrarPagamentoAprovado([m
     if (statusPix) {[m
 [m
         statusPix.textContent =[m
[31m-            "✅ PAGAMENTO APROVADO!";[m
[32m+[m[32m            "âœ… PAGAMENTO APROVADO!";[m
     }[m
 [m
     const mensagem =[m
[36m@@ -957,12 +1117,12 @@[m [mfunction mostrarPagamentoAprovado([m
                 dados.emailEnviado === true[m
                     ? `[m
                         <span style="color:#22c55e;">[m
[31m-                            📧 O produto foi enviado para seu e-mail.[m
[32m+[m[32m                            ðŸ“§ O produto foi enviado para seu e-mail.[m
                         </span>[m
                     `[m
                     : `[m
                         <span>[m
[31m-                            📧 O envio do e-mail está sendo processado.[m
[32m+[m[32m                            ðŸ“§ O envio do e-mail estÃ¡ sendo processado.[m
                         </span>[m
                     `[m
             }[m
[36m@@ -1020,7 +1180,7 @@[m [mwindow.addEventListener([m
 );[m
 [m
 // ==========================================[m
[31m-// INICIALIZAÇÃO[m
[32m+[m[32m// INICIALIZAÃ‡ÃƒO[m
 // ==========================================[m
 [m
 document.addEventListener([m
[36m@@ -1053,3 +1213,4 @@[m [mdocument.addEventListener([m
     }[m
 );[m
 [m
[41m+[m
[1mdiff --git a/server.js b/server.js[m
[1mindex 6d1881b..018a1f9 100644[m
[1m--- a/server.js[m
[1m+++ b/server.js[m
[36m@@ -961,17 +961,27 @@[m [mapp.post([m
 [m
 [m
             // ==========================================[m
[31m-            // RESPOSTA PARA O SITE[m
[31m-            // ==========================================[m
[32m+[m[32m// RESPOSTA PARA O SITE[m
[32m+[m[32m// ==========================================[m
[32m+[m
[32m+[m[32mreturn res.json({[m
 [m
[31m-            return res.json({[m
     sucesso: true,[m
[32m+[m
     pedidoId,[m
[31m-    chargeId: dados.id,[m
[31m-    qrCode: dados.pix.qrCode,[m
[31m-    copyPaste: dados.pix.copyPaste,[m
[31m-    expiresAt: dados.pix.expiresAt,[m
[31m-    status: dados.status || "PENDING"[m
[32m+[m
[32m+[m[32m    chargeId:[m
[32m+[m[32m        dados.id,[m
[32m+[m
[32m+[m[32m    copyPaste:[m
[32m+[m[32m        dados.pix?.copyPaste || "",[m
[32m+[m
[32m+[m[32m    expiresAt:[m
[32m+[m[32m        dados.pix?.expiresAt || null,[m
[32m+[m
[32m+[m[32m    status:[m
[32m+[m[32m        dados.status ||[m
[32m+[m[32m        "PENDING"[m
 });[m
 [m
 [m
[36m@@ -1470,3 +1480,4 @@[m [mapp.listen([m
     }[m
 );[m
 [m
[41m+[m
