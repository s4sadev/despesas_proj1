import { useEffect, useState } from 'react';
import './App.css';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore'; //aqui podemos exportar as funções necessaria do CRUD
import './index.css'; // ou './main.css'
import {
  Dialog,
  DialogTitle,
  DialogPanel,
  Transition,
} from '@headlessui/react';
import { db } from '../firebasedb';

function App() {
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenSave, setIsOpenSave] = useState(false);

  const [ItemRef, setItemRef] = useState([]);
  const [listaDados, setListaDados] = useState([]);
  const [dadosEdit, setDadosEdit] = useState({
    id: '',
    descricao: '',
    valor: '',
    periodo: '',
    tipo: '',
    categoria: '',
  });
  const ref = collection(db, 'despesas');

  function closeModalEdit() {
    setIsOpenEdit(false);
  }

  function OpenModalEdit(item) {
    setItemRef(item); // recebe os dados do item atual;
    console.log(ItemRef);
    if (item) {
      setDadosEdit({
        id: item.id || '',
        descricao: item.descricao || '',
        valor: item.valor || '',
        categoria: item.categoria || '',
        periodo: item.periodo || '',
        tipo: item.tipo || '',
      });
    }
    setIsOpenEdit(true);
  }

  function closeModalSave() {
    setIsOpenSave(false);
  }

  function OpenModalSave() {
    setIsOpenSave(true);
  }

  useEffect(() => {
    console.log('[DEBUG] Chamando buscarDados()...');
    const unsubscribe = buscarDados();

    // Verifica o retorno imediatamente
    console.log('[DEBUG] Retorno de buscarDados():', unsubscribe);
    console.log('[DEBUG] Tipo do retorno:', typeof unsubscribe);

    return () => {
      console.log('[DEBUG] Executando cleanup...');
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
        console.log('[DEBUG] Listener removido com sucesso');
      } else {
        console.warn('[DEBUG] Nada para limpar - unsubscribe não é função');
      }
    };
  }, []);

  // READ - LER
  async function buscarDados() {
    const unsubscribe = onSnapshot(ref, (querySnapshot) => {
      // DEBUG 1: Verifica se está recebendo algo
      console.log('🚨 querySnapshot recebida:', querySnapshot);

      // DEBUG 2: Inspeciona cada documento bruto
      querySnapshot.docs.forEach((doc, index) => {
        console.log(`📄 Documento ${index + 1}:`, {
          id: doc.id,
          dadosBrutos: doc.data(),
          timestampBruto: doc.data().periodo, // Verifica o campo específico
        });
      });

      // Processamento normal
      const novosDados = querySnapshot.docs.map((doc) => {
        const dados = doc.data();
        return {
          id: doc.id,
          ...dados,
          periodo: dados.periodo ? converterTimestamp(dados.periodo) : null,
        };
      });

      // DEBUG 3: Verifica o resultado final
      console.log('✅ Dados processados:', novosDados);
      setListaDados(novosDados);
    });

    return unsubscribe;
  }
  function converterTimestamp(dadoBruto) {
    if (dadoBruto && typeof dadoBruto.seconds === 'number') {
      const date = new Date(dadoBruto.seconds * 1000);
      return date.toISOString().slice(0, 16);
    }

    // Se já for uma string (formato do datetime-local), retorna direto
    if (typeof dadoBruto === 'string') {
      return dadoBruto;
    }
  }

  // CREATE - SALVAR
  function salvarDados(e) {
    e.preventDefault();

    const form = e.target;

    // Verifica se o formulário é válido
    if (!form.checkValidity()) {
      form.reportValidity(); // mostra as mensagens de erro no navegador
      return;
    }

    const descricaoIn = e.target.descricaoSave.value;
    const valorIn = e.target.valorSave.value;
    const categoriaIn = e.target.categoriaSave.value;
    const periodoIn = e.target.periodoSave.value;
    const tipoIn = e.target.tipoSave.value;
    const dados = {
      descricao: descricaoIn,
      valor: valorIn,
      categoria: categoriaIn,
      periodo: periodoIn,
      tipo: tipoIn,
    };

    addDoc(ref, dados).then((docRef) => {
      console.log('Documento salvo com ID:', docRef.id);
      window.alert('Documento salvo!');
    });

    setIsOpenSave(false).catch((erro) => {
      console.error('Erro ao salvar:', erro);
    });
  }

  // UPDATE - ATUALIZAR
  async function editarItem(e, id) {
    e.preventDefault();

    const form = e.target;

    // Verifica se o formulário é válido
    if (!form.checkValidity()) {
      form.reportValidity(); // mostra as mensagens de erro no navegador
      return;
    }

    try {
      const referencia = doc(db, 'despesas', id);
      await updateDoc(referencia, {
        descricao: dadosEdit.descricao,
        valor: dadosEdit.valor,
        categoria: dadosEdit.categoria,
        periodo: dadosEdit.periodo,
        tipo: dadosEdit.tipo,
      });

      alert('Atualizado com sucesso!');
      buscarDados(); // recarrega a lista
      closeModalEdit(); // se tiver modal
    } catch (erro) {
      console.error('Erro ao editar:', erro);
      alert('Erro ao atualizar.');
    }
  }

  // DELETE
  async function removerItem(id) {
    const confirmacao = window.confirm('Tem certeza que deseja remover?');
    if (!confirmacao) return;

    try {
      await deleteDoc(doc(db, 'despesas', id));
      alert('Removido com sucesso!');

      // Atualiza a lista se quiser, ex:
      buscarDados(); // se tiver uma função que recarrega tudo
    } catch (erro) {
      console.error('Erro ao remover:', erro);
      alert('Erro ao remover o item.');
    }
  }

  return (
    <>
      <header>
        <nav>
          <h1>Minhas Despesas</h1>
        </nav>
      </header>

      <main>
        <section id="dash">
          <div className="card-dash" id="menos"></div>
          <div className="card-dash" id="mais"></div>
          <div className="card-dash" id="atual"></div>
        </section>
        <section id="busca">
          <div id="filtros-busca"></div>
          <span id="barra-busca"></span>
        </section>
        <section id="dados"></section>
      </main>
      <button onClick={() => OpenModalSave()} id="edit">
        Adicionar
      </button>

      <div>
        <h1 className="text-3xl font-bold text-blue-600">Oi 💙</h1>

        {/* Adicionar registro*/}

        <p>aqui são todas as transações registradas</p>

        <ul className="list-none">
          {listaDados.map((item, index) => (
            <li
              className="list-none border-2 m-2 rounded-lg p-px"
              key={item.id}
              id={item.id}
            >
              <span id="head-card" className="">
                <img
                  src="./assets/mais_card.png"
                  alt=""
                />
              </span>
              <span id="body-card" className=""></span>
              <span id="footer-card" className=""></span>
              <p id="descricao">{item.descricao}</p>
              <p>Valor: {item.valor}</p>
              <button onClick={() => removerItem(item.id)}>Remover</button>
              <button onClick={() => OpenModalEdit(item)} id="edit">
                Editar
              </button>
            </li>
          ))}
        </ul>

        <Dialog open={isOpenEdit} onClose={() => setIsOpenEdit(false)}>
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
              <DialogTitle className="font-bold">{ItemRef.periodo}</DialogTitle>
              <form
                className="flex flex-col"
                onSubmit={(e) => editarItem(e, ItemRef.id)}
              >
                <label htmlFor="">Descrição</label>
                <input
                  id="descricao"
                  type="text"
                  value={dadosEdit.descricao}
                  onChange={(e) =>
                    setDadosEdit({ ...dadosEdit, descricao: e.target.value })
                  }
                  required
                />

                <label htmlFor="">Valor</label>
                <input
                  id="valor"
                  type="number"
                  value={dadosEdit.valor}
                  onChange={(e) =>
                    setDadosEdit({ ...dadosEdit, valor: e.target.value })
                  }
                  required
                />

                <label htmlFor="">Categoria</label>
                <select
                  name=""
                  id="categoria"
                  className="border-1"
                  value={dadosEdit.categoria}
                  onChange={(e) =>
                    setDadosEdit({ ...dadosEdit, categoria: e.target.value })
                  }
                  required
                >
                  <option value="1">Alimento</option>
                  <option value="2">Higiene</option>
                  <option value="3">Fatura</option>
                </select>

                <label htmlFor="">Periodo</label>
                <input
                  required
                  id="periodo"
                  type="datetime-local"
                  value={dadosEdit.periodo}
                  onChange={(e) =>
                    setDadosEdit({ ...dadosEdit, periodo: e.target.value })
                  }
                />

                <label htmlFor="">Tipo</label>
                <select
                  className="border-1"
                  name=""
                  id="tipo"
                  value={dadosEdit.tipo}
                  onChange={(e) =>
                    setDadosEdit({ ...dadosEdit, tipo: e.target.value })
                  }
                  required
                >
                  <option value="7">Receita</option>
                  <option value="8">Despesa</option>
                </select>
                <div>
                  <button onClick={() => closeModalEdit()}>Cancelar</button>
                  <button type="submit">Salvar</button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        <Dialog open={isOpenSave} onClose={() => setIsOpenSave(false)}>
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
              <DialogTitle className="font-bold"></DialogTitle>
              <form className="flex flex-col" onSubmit={(e) => salvarDados(e)}>
                <label htmlFor="">Descrição</label>
                <input
                  name="descricaoSave"
                  id="descricao-save"
                  required
                  type="text"
                />

                <label htmlFor="">Valor</label>
                <input
                  id="valor-save"
                  name="valorSave"
                  required
                  type="number"
                />

                <label htmlFor="">Categoria</label>
                <select
                  name="categoriaSave"
                  id="categoria-save"
                  required
                  className="border-1"
                >
                  <option>Alimento</option>
                  <option>Higiene</option>
                  <option>Fatura</option>
                </select>

                <label htmlFor="">Periodo</label>
                <input
                  required
                  id="periodo-save"
                  name="periodoSave"
                  type="datetime-local"
                />

                <label htmlFor="">Tipo</label>
                <select
                  className="border-1"
                  name="tipoSave"
                  required
                  id="tipo-save"
                >
                  <option>Receita</option>
                  <option>Despesa</option>
                </select>

                <div>
                  <button onClick={() => closeModalSave()}>Cancelar</button>
                  <button type="submit">Salvar</button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </Dialog>
      </div>
    </>
  );
}

export default App;
