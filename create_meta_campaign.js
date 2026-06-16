import fs from 'fs';
import path from 'path';

const TOKEN = "EAF9ScXAdJJIBRgGyQZCzKZAhtjURYu9BVEpnZCm0vfjiZBktUKZA8y4hHwItjgkEbANo4ItCssusKbR7MnEfhF8dLSSQI37YKrNnLHABWmcXZBiTyd3xzhzLCiZBarrfyWnc5gYl7LtJJObS12KnnswAflu4z7rxOi5WTSI6gCYIcMcZCihW8ZBeC6Q5tLPcSA7AeRiuDd33qm9Wr1RYJ0bNh1pFQbZAtb68jeZAqaZB5hLp0iEM8gaXzp7nSvuP2ZBkoYq2gQGU2UfhqK7haN7IXwNsyuFzbM6J4";
const AD_ACCOUNT_ID = "act_1307675959739790";
const PAGE_ID = "61590421246616";
const API_VERSION = "v19.0";
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

async function run() {
  try {
    console.log("🚀 Iniciando a Criação da Campanha Automática no Meta Ads...");

    // 1. Criar a Campanha (Objetivo: Tráfego para a Landing Page)
    console.log("\n[1/3] Criando a Campanha...");
    let campData = new URLSearchParams({
      name: "KinCare Launch - Smart Targeting",
      objective: "OUTCOME_TRAFFIC",
      status: "PAUSED",
      special_ad_categories: "[]",
      is_adset_budget_sharing_enabled: "false",
      access_token: TOKEN
    });
    let campRes = await fetch(`${BASE_URL}/${AD_ACCOUNT_ID}/campaigns`, { method: 'POST', body: campData });
    let campJson = await campRes.json();
    if (campJson.error) throw new Error("Erro na Campanha: " + JSON.stringify(campJson.error));
    const campaignId = campJson.id;
    console.log("✅ Campanha criada com sucesso! ID:", campaignId);

    // 2. Criar o Conjunto de Anúncios (Segmentação: EUA, 35-65 anos)
    console.log("\n[2/3] Criando o Conjunto de Anúncios (Targeting)...");
    let adSetData = new URLSearchParams({
      name: "EUA - Caregivers 35-65+",
      campaign_id: campaignId,
      daily_budget: "1000", // $10.00
      billing_event: "IMPRESSIONS",
      optimization_goal: "LINK_CLICKS",
      bid_amount: "50",
      targeting: JSON.stringify({
        geo_locations: { countries: ["US"] },
        age_min: 35,
        age_max: 65,
        targeting_automation: { advantage_audience: 0 },
        publisher_platforms: ["facebook", "instagram"]
      }),
      status: "PAUSED",
      access_token: TOKEN
    });
    
    // Calcula tempo de inicio (amanhã) para evitar erro de start_time no passado
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    adSetData.append('start_time', tomorrow.toISOString());

    let adSetRes = await fetch(`${BASE_URL}/${AD_ACCOUNT_ID}/adsets`, { method: 'POST', body: adSetData });
    let adSetJson = await adSetRes.json();
    if (adSetJson.error) {
       console.log("Aviso: A segmentação exata pode falhar devido a regras da conta. Tentando criar AdSet genérico para garantir a estrutura...");
       adSetData.delete('targeting');
       adSetData.append('targeting', JSON.stringify({ geo_locations: { countries: ["US"] }, age_min: 35, targeting_automation: { advantage_audience: 0 } }));
       adSetRes = await fetch(`${BASE_URL}/${AD_ACCOUNT_ID}/adsets`, { method: 'POST', body: adSetData });
       adSetJson = await adSetRes.json();
    }
    if (adSetJson.error) throw new Error("Erro no Conjunto de Anúncios: " + JSON.stringify(adSetJson.error));
    const adSetId = adSetJson.id;
    console.log("✅ Conjunto de Anúncios criado com sucesso! ID:", adSetId);

    console.log("\n🎉 Automação da Estrutura Concluída!");
    console.log("A Campanha e a Segmentação foram injetadas no seu Gerenciador de Anúncios em modo Rascunho (PAUSED).");
    console.log("Próximo passo: Abra o Gerenciador de Anúncios e adicione o seu Vídeo/Imagem nas configurações do Anúncio!");
    
  } catch (error) {
    console.error("\n❌ Erro durante a execução:", error.message);
  }
}

run();
