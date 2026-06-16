import fs from 'fs';

const TOKEN = "EAF9ScXAdJJIBRgGyQZCzKZAhtjURYu9BVEpnZCm0vfjiZBktUKZA8y4hHwItjgkEbANo4ItCssusKbR7MnEfhF8dLSSQI37YKrNnLHABWmcXZBiTyd3xzhzLCiZBarrfyWnc5gYl7LtJJObS12KnnswAflu4z7rxOi5WTSI6gCYIcMcZCihW8ZBeC6Q5tLPcSA7AeRiuDd33qm9Wr1RYJ0bNh1pFQbZAtb68jeZAqaZB5hLp0iEM8gaXzp7nSvuP2ZBkoYq2gQGU2UfhqK7haN7IXwNsyuFzbM6J4";
const AD_ACCOUNT_ID = "act_1307675959739790";
// O ID da página que aparece no novo print do Business Suite
const PAGE_ID = "1225718517283308";
const API_VERSION = "v19.0";
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

// O AdSet ID que já criamos antes com sucesso
const adSetId = "120244643912860317"; 

async function run() {
  try {
    console.log("🚀 Iniciando a Injeção do Anúncio (AdCreative + Ad)...");

    // Usando o Hash da imagem que já sabemos que está no servidor do Meta
    const imageHash = "617b445fdc4c1dc9c5e07bd7a099306b";
    console.log(`📸 Imagem carregada direto do servidor do Meta (Hash: ${imageHash})`);

    console.log("\n[1/2] Criando o Criativo do Anúncio com a Página KinCare...");
    const adCopy = "Taking care of an aging parent is stressful enough. Stop the medication guessing games.\n\nKinCare is the ultimate shared caregiving log for families. When one person gives the medication, everyone else gets notified instantly.\n\n✅ Complete peace of mind\n👇 Try KinCare Free for 14 Days";
    
    let creativeData = new URLSearchParams({
      name: "KinCare Image Creative",
      object_story_spec: JSON.stringify({
        page_id: PAGE_ID,
        link_data: {
          image_hash: imageHash,
          link: "https://kincare.app", 
          message: adCopy,
          call_to_action: {
            type: "LEARN_MORE",
            value: { link: "https://kincare.app" }
          }
        }
      }),
      status: "PAUSED",
      access_token: TOKEN
    });
    let creativeRes = await fetch(`${BASE_URL}/${AD_ACCOUNT_ID}/adcreatives`, { method: 'POST', body: creativeData });
    let creativeJson = await creativeRes.json();
    if (creativeJson.error) throw new Error("Erro no Creative: " + JSON.stringify(creativeJson.error));
    const creativeId = creativeJson.id;
    console.log("✅ Criativo criado com sucesso! ID:", creativeId);

    console.log("\n[2/2] Publicando o Anúncio Final...");
    let adData = new URLSearchParams({
      name: "KinCare Ad 1 - Burnout",
      adset_id: adSetId,
      creative: JSON.stringify({ creative_id: creativeId }),
      status: "PAUSED",
      access_token: TOKEN
    });
    let adRes = await fetch(`${BASE_URL}/${AD_ACCOUNT_ID}/ads`, { method: 'POST', body: adData });
    let adJson = await adRes.json();
    if (adJson.error) throw new Error("Erro no Anúncio: " + JSON.stringify(adJson.error));
    const adId = adJson.id;
    console.log("✅ Anúncio Finalizado! ID:", adId);

    console.log("\n🎉 SUCESSO ABSOLUTO!");
    console.log("O Anúncio foi criado com a imagem e o texto e já está dentro daquele conjunto 'EUA - Caregivers 35-65+'!");

  } catch (error) {
    console.error("\n❌ Erro:", error.message);
  }
}

run();
