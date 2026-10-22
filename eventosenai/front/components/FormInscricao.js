'use client';
import { useState } from 'react';

export default function FormInscricao({ eventos, participantes, onInscrever }) {
  const [eventoId, setEventoId] = useState('');
  const [participanteId, setParticipanteId] = useState('');

  function enviar(e) {
    e.preventDefault();
    if (!eventoId || !participanteId) return;
    onInscrever(Number(eventoId), Number(participanteId));
  }

  return (
    <form onSubmit={enviar} className="form">
      <h2>Inscrever em evento</h2>
      <select value={eventoId} onChange={e => setEventoId(e.target.value)} required>
        <option value="">Selecione o evento</option>
        {eventos.map(ev => (
          <option key={ev.id} value={ev.id} disabled={ev.vagas_restantes <= 0}>
            {ev.titulo}{ev.vagas_restantes <= 0 ? ' (Lotado)' : ''}
          </option>
        ))}
      </select>
      <select value={participanteId} onChange={e => setParticipanteId(e.target.value)} required>
        <option value="">Selecione o participante</option>
        {participantes.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
      </select>
      <button type="submit">Inscrever</button>
    </form>
  );
}
