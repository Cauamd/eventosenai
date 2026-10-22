const API = process.env.NEXT_PUBLIC_API_URL;

async function pedir(caminho, opcoes) {
  const resposta = await fetch(`${API}${caminho}`, opcoes);
  const dados = resposta.status === 204 ? null : await resposta.json().catch(() => null);
  return { ok: resposta.ok, dados };
}

export async function getEventos() {
  const resposta = await fetch(`${API}/eventos`, { cache: 'no-store' });
  if (!resposta.ok) throw new Error('Erro ao buscar eventos');
  return resposta.json();
}

export async function getParticipantes() {
  const resposta = await fetch(`${API}/participantes`, { cache: 'no-store' });
  if (!resposta.ok) throw new Error('Erro ao buscar participantes');
  return resposta.json();
}

export async function getInscritos(eventoId) {
  const resposta = await fetch(`${API}/eventos/${eventoId}/inscritos`, { cache: 'no-store' });
  if (!resposta.ok) throw new Error('Erro ao buscar inscritos');
  return resposta.json();
}

export function cadastrarParticipante(participante) {
  return pedir('/participantes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(participante)
  });
}

export function inscrever(evento_id, participante_id) {
  return pedir('/inscricoes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ evento_id, participante_id })
  });
}
