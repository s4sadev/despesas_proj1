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
  const [tipoCard, setTipoCard] = useState("");
  const [despesaDash, setDespesaDash] = useState([])
  const [ItemRef, setItemRef] = useState([]);
  const [listaDados, setListaDados] = useState([]);
  const [listaDespesa, setListaDespesa] = useState([])
  const [listaReceita, setListaReceita] = useState([])
  const [despesa, setDespesa] = useState()
  const [receita, setReceita] = useState()
  const [saldo, setSaldo] = useState()
  const [dadosEdit, setDadosEdit] = useState({
    id: '',
    descricao: '',
    valor: '',
    periodo: '',
    tipo: '',
    categoria: '',
  });
  const ref = collection(db, 'despesas');

  function tratarPeriodo(valorOriginal){
    const [data, hora] = valorOriginal.split("T"); // separa em ['2025-07-04', '11:09']
    const [ano, mes, dia] = data.split("-"); // separa em ['2025', '07', '04']

    const formatado = `${dia}/${mes}/${ano} ${hora}`;
    console.log(formatado); // 04/07/2025 11:09

    return formatado;

  }

async function buscarDespesa() {
  const ref = collection(db, "despesas");

  // ⬇️ Aqui aplicamos o filtro
  const filtro = query(ref, where("categoria", "==", "Despesa"));

  const resultado = onSnapshot(filtro, (querySnapshot) => {
    console.log("🚨 querySnapshot recebida:", querySnapshot);

    querySnapshot.docs.forEach((doc, index) => {
      console.log(`📄 Documento DA Despesa ${index + 1}:`, {
        id: doc.id,
        dadosBrutos: doc.data(),
        timestampBruto: doc.data().periodo,
      });
    });

    const novosDados = querySnapshot.docs.map((doc) => {
      const dados = doc.data();

      return {
        id: doc.id,
        ...dados,
        periodo: dados.periodo ? converterTimestamp(dados.periodo) : null,
      };
    });

    console.log("✅ Dados processados:", novosDados);
    setDespesaDash(novosDados);
  });

  return resultado; // ✅ agora sim retorna a função que pode ser usada no cleanup
}

  function getTipoImg(tipo){
    switch (tipo) {
      case "Despesa":
        return "src/assets/menos_card.png"
      
      case "Receita":
        return "src/assets/mais_card.png"

      default:
        console.log("Tipo não identificado", tipo);
        return `Tipo não identidicado ${tipo}`
    }
  }

  function getCategoriaStyle(categoria){
    switch (categoria) {
      case "Alimentação":
        return "bg-yellow-500 text-white"
      
      case "Higiene":
        return "bg-blue-500 text-white"

      case "Transporte":
        return "bg-gray-400 text-white"

      case "Saúde":
        return "bg-blue-200 text-white"

      case "Entretenimento":
        return "bg-red-400 text-white"      
      
      case "Moradia":
        return "bg-[#5c4323] text-white"
    
      default:
        console.log("Olha a categoria", categoria);
        return "bg-black text-white"
    }
  }

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

  function CalcularDespesa(listaDespesa){
    
    var totalD = 0;
    listaDespesa.forEach(u => {
      totalD += parseFloat(u);
    });
    return totalD
  }
  
  function CalcularReceita(listaReceita){
    
    var totalR = 0;
    listaReceita.forEach(e => {
      totalR += parseFloat(e);
    });
    return totalR
  }

  function CalcularSaldo(receita, despesa){
    var x = 0;
    x = receita - despesa;
    return x
  }

  const [valor, setValor] = useState("");

function handleChange(e) {
  const valorDigitado = e.target.value;
  const valorFormatado = formatarParaReaisInput(valorDigitado);
  setValor(valorFormatado);
}

  function formatarParaReais(valor) {
  return parseFloat(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatarParaReaisInput(valor) {
  valor = valor.replace(/\D/g, ""); // remove tudo que não for número
  valor = (Number(valor) / 100).toFixed(2); // divide por 100 e mantém duas casas decimais
  return valor
    .toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
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

  useEffect(() => {
    const unsubscribe = buscarPorTipo("Despesa", (dados) => {
      // aqui você pode setar no estado, por exemplo
      setDespesaDash(dados);

      var listaD = []
      dados.forEach(e => {
          listaD.push(e.valor)
      });
      setListaDespesa(listaD);

      console.log("Aqui dados", dados)
      console.log("Aqui é a lista despesa: ", listaDespesa)
    });

    return () => unsubscribe?.();
  }, []);

  useEffect(() => {
    const unsubscribe = buscarPorTipo("Receita", (dados) => {
      // aqui você pode setar no estado, por exemplo
      // setDespesaDash(dados);

      var listaR = []
      dados.forEach(e => {
          listaR.push(e.valor)
      });
      setListaReceita(listaR);

      console.log("Aqui dados", dados)
      console.log("Aqui é a lista Receita: ", listaReceita)
    });

    return () => unsubscribe?.();
  }, []);

  useEffect(() => {
    const D = CalcularDespesa(listaDespesa)
    const R = CalcularReceita(listaReceita)
    setDespesa(D)
    setReceita(R)
  }, [listaDespesa, listaReceita])

  useEffect(() => {
      console.log("Receita", receita)
      console.log("Despesa", despesa)
  },[receita,despesa])


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

        console.log("Aqui é o tipo do doc ", dados.tipo)
        // let typecard = ""; // declara primeiro
        // if (dados.tipo === "Receita") {
        //   typecard = "src/assets/mais_card.png"
        //   setTipoCard(typecard);
        // } else if (dados.tipo === "Despesa") {
        //   const olha= dados.tipo
        //   typecard = "src/assets/menos_card.png"
        //   setTipoCard(typecard);
        // } else {
        //   const olha= dados.tipo
        //   typecard = olha44
        //   setTipoCard(typecard);
        // }


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

  function buscarPorTipo(tipoDesejado, callback) {
  const ref = collection(db, "despesas");
  const filtro = query(ref, where("tipo", "==", tipoDesejado));

  const unsubscribe = onSnapshot(filtro, (querySnapshot) => {
    const dadosFiltrados = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    
    console.log(`[DEBUG] Documentos do tipo "${tipoDesejado}":`, dadosFiltrados);
    if (callback) callback(dadosFiltrados);
  });

  return unsubscribe;
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
        <nav className='p-3 rounded-lg bg-[#f6f6f6]'>
          <img src="" alt="" />
          <h1 className="text-start text-3xl font-bold ">Minhas Despesas</h1>
        </nav>
      </header>

      <main>
        <section id="dash" className='flex p-2 gap-4 flex-row flex-wrap justify-center'>

          <div className="card-dash bg-green-100" id="mais">
            <h1 className="text-start m-2">Receitas</h1>
            <p className='text-lg m-2'>
              {formatarParaReais(CalcularReceita(listaReceita))}
            </p>
          </div>

          <div className="card-dash bg-red-100" id="menos">
            <h1 className="text-start m-2">Depesas</h1>
            <p className='text-lg m-2'>
              {formatarParaReais( CalcularDespesa(listaDespesa))}
            </p>
          </div>


          <div className="card-dash" id="atual">
            <h1 className="text-start m-2">Saldo Atual</h1>
            <p className='text-lg m-2'>
              {formatarParaReais(CalcularSaldo(receita,despesa))}
            </p>
          </div>

        </section>

        <section id="busca" className='flex flex-row'>
          <div id="filtros-busca" className='flex flex-row items-center'>
            <h1>Filtros</h1>
            <button>/</button>
          </div>

          <span id="barra-busca">
            <input type="text"/>
            <button>Buscar</button>
          </span>

          <span id="add">
            <button onClick={() => OpenModalSave()} id="edit">
              Adicionar
          </button>
          </span>
        </section>

        <section id="dados" className='p-4 rounded-lg bg-[#f6f6f6]'>
          <ul className="list-none gap-4 flex flex-wrap justify-center">
            {listaDados.map((item, index) => (
              <li
                className="list-none rounded-lg border-2 flex flex-row justify-center max-w-[250px] max-h-[350px] w-full h-auto min-w-[195px] min-h-[90px]"
                key={item.id}
                id={item.id}
              >

                <span id="main" className="flex flex-col justify-around m-2">
                    <span id="body-card" className="min-w-[120px] flex flex-row gap-[3rem]">
                    
                      <span id="header">
                        <span id="img-header" className='flex flex-row items-start gap-2'>
                          <img
                            className='max-w-[25px] max-h-[25px] w-full h-full'
                            src={getTipoImg(item.tipo)}
                            alt=""
                          />
                          <span id="info-header" className='text-start'>
                            <p className="" id="descricao">{item.descricao}</p>
                            <hr className="border-t w-[100px] border-gray-300  " />
                            <p>{formatarParaReais(item.valor)}</p>
                          </span>
                        </span>
        
                      </span>

                    <span id="aside-card" className="flex flex-col max-w-[30px] justify-around max-h-[60px] min-w-[25px] min-h-[65px]">
                  
                      <button className="p-1 m-1  max-w-[25px] max-h-[25px] w-full h-full" onClick={() => removerItem(item.id)}>
                        <img src="src/assets/trash.png" className="" alt="" />
                      </button>

                      <button className="p-1  m-1 max-w-[25px] max-h-[25px] w-full h-full" onClick={() => OpenModalEdit(item)} id="edit">
                        <img src="src/assets/edit.png" alt="" />
                      </button>

                    </span>                
                    
                    </span>
              
                      <span id="footer-card" className='flex flex-row justify-around w-full max-h-[30px] h-full gap-1'>
                        <p className={`max-h-[30px]  ${getCategoriaStyle(item.categoria)} border-2 p-1 rounded-lg`}>{item.categoria}</p>
                        <p className='max-h-[50px] text-end pt-2 w-full'>{tratarPeriodo(item.periodo)}</p>
                    
                      </span>
                </span>

              </li>
            ))}
          </ul>

        </section>
      </main>


      <div>

        {/* Adicionar registro*/}


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
                  <option value="Receita">Receita</option>
                  <option value="Despesa">Despesa</option>
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

                  value={valor}
                  onChange={handleChange}
                />

                <label htmlFor="">Categoria</label>
                <select
                  name="categoriaSave"
                  id="categoria-save"
                  required
                  className="border-1"
                >
                  <option value="Alimentação" >Alimento</option >
                  <option value="Higiene" >Higiene</option >
                  <option value="Transporte" >Transporte</option>
                  <option value="Saúde">Saúde</option>
                  <option value="Moradia">Moradia</option>
                  <option value="Entretenimento">Entretenimento</option>
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
