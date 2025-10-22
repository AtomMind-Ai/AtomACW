const API_URL = "http://127.0.0.1:8000";

async function postJSON(endpoint, data) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }

  return await res.json();
}

export async function askSuggest(text, instruction = "") {
  return await postJSON("/suggest", { text, instruction });
}

export async function askReview(text) {
  return await postJSON("/review", { text });
}

export async function askChat(question, document, memory = []) {
  return await postJSON("/chat", { text: question, document, memory });
}