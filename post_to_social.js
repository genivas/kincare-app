import fs from 'fs';

// Quando você gerar o NOVO token com as permissões extras, cole ele aqui:
const TOKEN = "COLE_O_NOVO_TOKEN_AQUI"; 
const PAGE_ID = "1225718517283308";
const API_VERSION = "v19.0";
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

// Configuração do Post que vamos publicar
const imageUrl = "https://kincare-app.pages.dev/relaxed_caregiver_1781057431720.png"; // O Meta precisa de uma URL pública da imagem
const message = "Caregiver burnout is real. It's time to lighten the mental load and stop the guessing games.\n\nWith the KinCare app, your entire family stays on the same page. When someone gives the medication or finishes a doctor's appointment, everyone gets notified instantly.\n\n🔗 Click the link in our bio to start your 14-Day Free Trial and finally get some peace of mind.\n\n#caregiver #elderlycare #agingparents #caregiversupport #alzheimersawareness #kincare";

async function run() {
  if (TOKEN === "COLE_O_NOVO_TOKEN_AQUI") {
      console.log("❌ Erro: Você precisa colar o NOVO token dentro do script (linha 4).");
      return;
  }

  try {
    console.log("🚀 Iniciando o Robô de Postagens Orgânicas...");

    // 1. Postar no Facebook Page
    console.log("\n[1/3] Publicando na Página do Facebook...");
    let fbData = new URLSearchParams({
      url: imageUrl,
      message: message,
      access_token: TOKEN
    });
    
    let fbRes = await fetch(`${BASE_URL}/${PAGE_ID}/photos`, { method: 'POST', body: fbData });
    let fbJson = await fbRes.json();
    if (fbJson.error) throw new Error("Erro no Facebook: " + JSON.stringify(fbJson.error));
    console.log("✅ Post publicado no Facebook! Post ID:", fbJson.post_id);

    // 2. Descobrir o ID da conta do Instagram atrelada à Página
    console.log("\n[2/3] Localizando a Conta do Instagram...");
    let igAccountRes = await fetch(`${BASE_URL}/${PAGE_ID}?fields=instagram_business_account&access_token=${TOKEN}`);
    let igAccountJson = await igAccountRes.json();
    if (igAccountJson.error) throw new Error("Erro ao buscar Conta IG: " + JSON.stringify(igAccountJson.error));
    if (!igAccountJson.instagram_business_account) throw new Error("Conta de Instagram não está vinculada ou Token não tem a permissão 'instagram_basic'.");
    
    const igAccountId = igAccountJson.instagram_business_account.id;
    console.log("✅ Conta do Instagram encontrada! ID:", igAccountId);

    // 3. Postar no Instagram (Processo de 2 etapas: Upload do Contêiner -> Publicação)
    console.log("\n[3/3] Publicando no Instagram...");
    
    // Etapa A: Criar Contêiner de Mídia
    let igMediaData = new URLSearchParams({
      image_url: imageUrl,
      caption: message,
      access_token: TOKEN
    });
    let mediaRes = await fetch(`${BASE_URL}/${igAccountId}/media`, { method: 'POST', body: igMediaData });
    let mediaJson = await mediaRes.json();
    if (mediaJson.error) throw new Error("Erro ao criar contêiner no IG: " + JSON.stringify(mediaJson.error));
    const creationId = mediaJson.id;

    // Etapa B: Publicar o Contêiner
    let igPublishData = new URLSearchParams({
      creation_id: creationId,
      access_token: TOKEN
    });
    let publishRes = await fetch(`${BASE_URL}/${igAccountId}/media_publish`, { method: 'POST', body: igPublishData });
    let publishJson = await publishRes.json();
    if (publishJson.error) throw new Error("Erro ao publicar no IG: " + JSON.stringify(publishJson.error));
    
    console.log("✅ Post publicado no Instagram! Media ID:", publishJson.id);

    console.log("\n🎉 ROBÔ FINALIZOU COM SUCESSO! Postagens no ar nas duas redes.");

  } catch (error) {
    console.error("\n❌ Erro Geral:", error.message);
  }
}

run();
