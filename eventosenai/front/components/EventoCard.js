'use client';
import { useState } from 'react';
import { getInscritos } from '@/lib/api';

function formatarData(iso) {
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export default function EventoCard({ evento }) {
  const lotado = evento.vagas_restantes <= 0;
  const [inscritos, setInscritos] = useState(null);
  const [erro, setErro] = useState(null);

  async function alternarInscritos() {
    if (inscritos) { setInscritos(null); return; }
    try {
      setErro(null);
      setInscritos(await getInscritos(evento.id));
    } catch (e) {
      setErro(e.message);
    }
  }

  return (
    <article className="card">
      <h3>{evento.titulo}</h3>
      <span className="tag">{evento.categoria}</span>
      <p>{formatarData(evento.data_evento)} · {evento.local}</p>
      <p>
        {lotado
          ? <strong className="lotado">Lotado</strong>
          : <>Vagas restantes: <strong>{evento.vagas_restantes}</strong></>}
      </p>
      <button onClick={alternarInscritos}>{inscritos ? 'Ocultar inscritos' : 'Ver inscritos'}</button>
      {erro && <p className="erro">{erro}</p>}
      {inscritos && (
        inscritos.length === 0
          ? <p>Nenhum inscrito ainda.</p>
          : <ul>{inscritos.map(i => <li key={i.id}>{i.nome}</li>)}</ul>
      )}
    </article>
  );
}
