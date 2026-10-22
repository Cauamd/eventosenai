'use client';
import { useEffect, useState } from 'react';
import { getEventos, getParticipantes, inscrever } from '@/lib/api';
import EventoCard from '@/components/EventoCard';
import FormParticipante from '@/components/FormParticipante';
import FormInscricao from '@/components/FormInscricao';

export default function Home() {
  const [eventos, setEventos] = useState([]);
  const [participantes, setParticipantes] = useState([]);
  const [mensagem, setMensagem] = useState(null);

  async function carregarEventos() {
    try {
      setEventos(await getEventos());
    } catch (erro) {
      setMensagem({ tipo: 'erro', texto: erro.message });
    }
  }

  async function carregarParticipantes() {
    try {
      setParticipantes(await getParticipantes());
    } catch (erro) {
      setMensagem({ tipo: 'erro', texto: erro.message });
    }
  }

  useEffect(() => { carregarEventos(); carregarParticipantes(); }, []);

  async function handleInscrever(eventoId, participanteId) {
    try {
      const { ok, dados } = await inscrever(eventoId, participanteId);
      if (!ok) {
        setMensagem({ tipo: 'erro', texto: dados?.erro || 'Erro ao inscrever' });
        carregarEventos();
        return;
      }
      setMensagem({ tipo: 'sucesso', texto: 'Inscrição realizada!' });
      carregarEventos();
    } catch {
      setMensagem({ tipo: 'erro', texto: 'Não foi possível conectar à API' });
    }
  }

  return (
    <main>
      <h1>EventoSENAI</h1>
      {mensagem && <p className={`msg ${mensagem.tipo}`}>{mensagem.texto}</p>}
      <section className="grid">
        {eventos.map(ev => <EventoCard key={ev.id} evento={ev} />)}
      </section>
      <section className="forms">
        <FormParticipante onCadastrado={carregarParticipantes} onMensagem={setMensagem} />
        <FormInscricao eventos={eventos} participantes={participantes} onInscrever={handleInscrever} />
      </section>
    </main>
  );
}
