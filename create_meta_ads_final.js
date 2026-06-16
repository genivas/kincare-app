import fs from 'fs';

const TOKEN = "EAF9ScXAdJJIBRgGyQZCzKZAhtjURYu9BVEpnZCm0vfjiZBktUKZA8y4hHwItjgkEbANo4ItCssusKbR7MnEfhF8dLSSQI37YKrNnLHABWmcXZBiTyd3xzhzLCiZBarrfyWnc5gYl7LtJJObS12KnnswAflu4z7rxOi5WTSI6gCYIcMcZCihW8ZBeC6Q5tLPcSA7AeRiuDd33qm9Wr1RYJ0bNh1pFQbZAtb68jeZAqaZB5hLp0iEM8gaXzp7nSvuP2ZBkoYq2gQGU2UfhqK7haN7IXwNsyuFzbM6J4";
const AD_ACCOUNT_ID = "act_1307675959739790";
const PAGE_ID = "61590421246616";
const API_VERSION = "v19.0";
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

async function run() {
  try {
    console.log("🚀 Iniciando a Criação Completa (Campanha + AdSet + Ad) no Meta Ads...");

    // 0. Obter a última imagem enviada
    let imgRes = await fetch(`${BASE_URL}/${AD_ACCOUNT_ID}/adimages?fields=hash,name&access_token=${TOKEN}`);
    let imgJson = await imgRes.json();
    if (!imgJson.data || imgJson.data.length === 0) throw new Error("Nenhuma imagem encontrada na conta.");
    const imageHash = imgJson.data[0].hash;
    console.log(`📸 Imagem selecionada automaticamente (Hash: ${imageHash})`);

    // 1. Criar a Campanha
    console.log("\n[1/4] Criando a Campanha...");
    let campData = new URLSearchParams({
      name: "KinCare Launch - Full Automation",
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
    console.log("✅ Campanha criada! ID:", campaignId);

    // 2. Criar o AdSet
    console.log("\n[2/4] Criando o Conjunto de Anúncios...");
    let adSetData = new URLSearchParams({
      name: "EUA - Caregivers 35-65+",
      campaign_id: campaignId,
      daily_budget: "1000",
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
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    adSetData.append('start_time', tomorrow.toISOString());

    let adSetRes = await fetch(`${BASE_URL}/${AD_ACCOUNT_ID}/adsets`, { method: 'POST', body: adSetData });
    let adSetJson = await adSetRes.json();
    if (adSetJson.error) {
       adSetData.delete('targeting');
       adSetData.append('targeting', JSON.stringify({ geo_locations: { countries: ["US"] }, age_min: 35, targeting_automation: { advantage_audience: 0 } }));
       adSetRes = await fetch(`${BASE_URL}/${AD_ACCOUNT_ID}/adsets`, { method: 'POST', body: adSetData });
       adSetJson = await adSetRes.json();
    }
    if (adSetJson.error) throw new Error("Erro no AdSet: " + JSON.stringify(adSetJson.error));
    const adSetId = adSetJson.id;
    console.log("✅ Conjunto de Anúncios criado! ID:", adSetId);

    // 3. Criar AdCreative
    console.log("\n[3/4] Criando o Criativo do Anúncio...");
    const adCopy = "Taking care of an aging parent is stressful enough. Stop the medication guessing games.\n\nKinCare is the ultimate shared caregiving log for families. When one person gives the medication, everyone else gets notified instantly.\n\n✅ Complete peace of mind\n👇 Try KinCare Free for 14 Days";
    
    let creativeData = new URLSearchParams({
      name: "KinCare Image Creative",
      object_story_spec: JSON.stringify({
        page_id: PAGE_ID,
        link_data: {
          image_hash: imageHash,
          link: "https://kincare.app", // Substitua pelo link real se necessário
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
    console.log("✅ Criativo criado! ID:", creativeId);

    // 4. Criar o Ad
    console.log("\n[4/4] Publicando o Anúncio Final...");
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

    console.log("\n🎉 PARABÉNS! TUDO FOO CRIADO COM SUCESSO!");
    console.log("Você agora tem uma campanha pronta, segmentada, com a imagem e a legenda, esperando o seu clique para 'Ativar'!");

  } catch (error) {
    console.error("\n❌ Erro:", error.message);
  }
}

run();
