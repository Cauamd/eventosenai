'use client';
import { useState } from 'react';
import { cadastrarParticipante } from '@/lib/api';

export default function FormParticipante({ onCadastrado, onMensagem }) {
  const [form, setForm] = useState({ nome: '', email: '', turma: '' });

  function alterar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function enviar(e) {
    e.preventDefault();
    try {
      const { ok, dados } = await cadastrarParticipante(form);
      if (!ok) return onMensagem({ tipo: 'erro', texto: dados?.erro || 'Erro ao cadastrar' });
      onMensagem({ tipo: 'sucesso', texto: 'Participante cadastrado!' });
      setForm({ nome: '', email: '', turma: '' });
      onCadastrado();
    } catch {
      onMensagem({ tipo: 'erro', texto: 'Não foi possível conectar à API' });
    }
  }

  return (
    <form onSubmit={enviar} className="form">
      <h2>Cadastrar participante</h2>
      <input name="nome" placeholder="Nome" value={form.nome} onChange={alterar} required />
      <input name="email" type="email" placeholder="E-mail" value={form.email} onChange={alterar} required />
      <input name="turma" placeholder="Turma" value={form.turma} onChange={alterar} />
      <button type="submit">Cadastrar</button>
    </form>
  );
}
