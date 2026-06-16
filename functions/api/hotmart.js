export async function onRequestPost(context) {
  try {
    // 1. Get the webhook secret from Cloudflare environment variables
    // In the Cloudflare dashboard, add HOTMART_WEBHOOK_SECRET
    const EXPECTED_SECRET = context.env.HOTMART_WEBHOOK_SECRET || 'MY_SECRET_KEY_123';

    // 2. Parse the Hotmart request payload
    // Hotmart sends an application/json payload for Webhooks (Postback)
    const request = context.request;
    
    // Optional: Hotmart sometimes sends hottok header
    const hottok = request.headers.get('x-hottok') || request.headers.get('hottok');
    if (hottok && hottok !== EXPECTED_SECRET && EXPECTED_SECRET !== 'MY_SECRET_KEY_123') {
       return new Response("Unauthorized Token", { status: 401 });
    }

    const payload = await request.json();

    // Hotmart payload structure (example)
    // payload.event === 'PURCHASE_APPROVED'
    // payload.data.buyer.email
    
    const event = payload.event;
    
    if (event !== 'PURCHASE_APPROVED') {
      return new Response("Ignored non-approved event", { status: 200 });
    }

    const buyerEmail = payload.data?.buyer?.email;
    const buyerName = payload.data?.buyer?.name || 'VIP User';

    if (!buyerEmail) {
      return new Response("No email provided", { status: 400 });
    }

    // 3. Save the email as a VIP Invite in Firestore using the REST API
    const projectId = "kincare-818c5";
    // We replace @ and . to make it a valid document ID without issues, or just use the email directly.
    const safeEmailId = buyerEmail.toLowerCase().trim();

    // The REST endpoint to create/overwrite a document in Firestore
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/vip_invites/${encodeURIComponent(safeEmailId)}`;

    // Build the document structure required by Firestore REST API
    const firestoreDoc = {
      fields: {
        email: { stringValue: safeEmailId },
        name: { stringValue: buyerName },
        status: { stringValue: 'approved' },
        createdAt: { timestampValue: new Date().toISOString() }
      }
    };

    const firestoreResponse = await fetch(firestoreUrl, {
      method: 'PATCH', // PATCH with no updateMask acts as an upsert in Firestore REST API
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(firestoreDoc)
    });

    if (!firestoreResponse.ok) {
      const errTxt = await firestoreResponse.text();
      console.error("Firestore Error:", errTxt);
      return new Response("Error saving to database: " + errTxt, { status: 500 });
    }

    return new Response("Purchase approved and access granted!", { status: 200 });

  } catch (error) {
    console.error(error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}
