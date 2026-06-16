import fs from 'fs';

const TOKEN = "EAF9ScXAdJJIBRp9ZCHv0ZBsv2tVZBqMplzNJJBZBXCMAL4UNZCNu548ZAZAiG5fFDqiqzndixxMW2v5vVVsHAUuBDmHK3awAKbLaNuaDzrJPuah0pYdEeJ4JDdpKFoVjKZBe1voWEReZBrNVIV9wOCwO07SQiB9BARkmA1ySxn20GqXzPvZClBNWdT7XZBFZAsF5dWctOOJZCwy4Q9HpEohJKZBEynQ39A8QPuZAjjnUeId8ZCH6K5ffh2tHsZBSwVO92hLY7c871nZBTY3JZCXZBWoKrypKK1PGvbJaY3foJwZDZD";
const AD_ACCOUNT_ID = "act_1307675959739790";
const PAGE_ID = "1225718517283308";
const API_VERSION = "v19.0";
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

// Nossas 3 imagens mapeadas com seus Hashes na biblioteca do Meta
const creativesData = [
  {
    name: "Ad 1 - Stressed Caregiver (Burnout)",
    hash: "617b445fdc4c1dc9c5e07bd7a099306b",
    copy: "Taking care of an aging parent is stressful enough. Stop the medication guessing games.\n\nKinCare is the ultimate shared caregiving log for families. When one person gives the medication, everyone else gets notified instantly.\n\n✅ Complete peace of mind\n👇 Try KinCare Free for 14 Days"
  },
  {
    name: "Ad 2 - Relaxed Caregiver (Peace of Mind)",
    hash: "94fe11ed0a998d2b6776b693f5ce79bd",
    copy: "The hardest part about taking care of aging parents isn't the work... it's the constant anxiety when you're not there.\n\nI just open the KinCare app, and I can see exactly what my sister logged for Dad's morning routine. I can finally focus on work without panicking.\n\n👇 Start your 14-Day Free Trial"
  },
  {
    name: "Ad 3 - Happy Elderly (Goal)",
    hash: "2b1430fa8e77ef30652f639c216e5b3d",
    copy: "Don't let tech companies tax your family. KinCare is built differently.\n\nOne subscription covers your entire caregiving circle. Organize medications, assign tasks, and keep everyone on the same page for less than the price of a Netflix subscription.\n\n👇 Try KinCare Free for 14 Days"
  }
];

async function run() {
  try {
    console.log("🚀 Iniciando a Criação da Campanha Meta Ads V2 (3 Criativos)...");

    // 1. Criar a Campanha
    console.log("\n[1/4] Criando a Campanha...");
    let campData = new URLSearchParams({
      name: "KinCare Launch - Multi-Creative Testing",
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
      name: "EUA - Caregivers 35-65+ (Testando 3 Imagens)",
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

    // 3 & 4. Criar os AdCreatives e Ads num Loop
    console.log("\n[3/4] e [4/4] Criando os 3 Criativos e Anúncios...");
    for (let i = 0; i < creativesData.length; i++) {
        const item = creativesData[i];
        console.log(`\n👉 Processando: ${item.name}...`);
        
        let creativeData = new URLSearchParams({
            name: `Creative - ${item.name}`,
            object_story_spec: JSON.stringify({
              page_id: PAGE_ID,
              link_data: {
                image_hash: item.hash,
                link: "https://kincare-app.pages.dev/", 
                message: item.copy,
                call_to_action: {
                  type: "LEARN_MORE",
                  value: { link: "https://kincare-app.pages.dev/" }
                }
              }
            }),
            status: "PAUSED",
            access_token: TOKEN
        });
        
        let creativeRes = await fetch(`${BASE_URL}/${AD_ACCOUNT_ID}/adcreatives`, { method: 'POST', body: creativeData });
        let creativeJson = await creativeRes.json();
        if (creativeJson.error) throw new Error(`Erro no Creative ${i+1}: ` + JSON.stringify(creativeJson.error));
        const creativeId = creativeJson.id;
        console.log(`   ✅ Criativo criado! ID: ${creativeId}`);

        let adData = new URLSearchParams({
            name: item.name,
            adset_id: adSetId,
            creative: JSON.stringify({ creative_id: creativeId }),
            status: "PAUSED",
            access_token: TOKEN
        });
        let adRes = await fetch(`${BASE_URL}/${AD_ACCOUNT_ID}/ads`, { method: 'POST', body: adData });
        let adJson = await adRes.json();
        if (adJson.error) throw new Error(`Erro no Anúncio ${i+1}: ` + JSON.stringify(adJson.error));
        console.log(`   ✅ Anúncio Finalizado! ID: ${adJson.id}`);
    }

    console.log("\n🎉 CAMPANHA DE TESTE A/B CRIADA COM SUCESSO!");
    console.log("Abra seu Gerenciador de Anúncios para conferir. A estrutura está toda pronta e Pausada.");

  } catch (error) {
    console.error("\n❌ Erro:", error.message);
  }
}

run();
