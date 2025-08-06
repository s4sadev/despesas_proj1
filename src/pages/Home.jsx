import React, { use } from "react";
import trash from '../assets/trash.png' 
import edit from '../assets/edit.png'
import receita_ico from '../assets/mais_card.png'
import despesa_ico from '../assets/menos_card.png'
import padrao from '../assets/ico_padrao.png'
import { useEffect, useState } from 'react';
import '../App';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore'; //aqui podemos exportar as funções necessaria do CRUD
import '../index.css'; // ou './main.css'
import {
  Dialog,
  DialogTitle,
  DialogPanel,
  Transition,
  Disclosure, 
  DisclosureButton, 
  DisclosurePanel ,
} from '@headlessui/react';


import { db } from '../firebase/firebasedb';


import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";



export function Home() {
  const auth = getAuth(); // obtém a instância atual


  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenSave, setIsOpenSave] = useState(false);
  // const [tipoCard, setTipoCard] = useState("");
  const [despesaDash, setDespesaDash] = useState([])
  const [ItemRef, setItemRef] = useState([]);
  const [listaDados, setListaDados] = useState([]);
  const [listaDespesa, setListaDespesa] = useState([])
  const [listaReceita, setListaReceita] = useState([])
  const [despesa, setDespesa] = useState()
  const [receita, setReceita] = useState()
  const [filtros, setFiltros] = useState(false)

  const [tipoFiltro, setTipoFiltro] = useState(" ")
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
        return despesa_ico;
      
      case "Receita":
        return receita_ico;

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
    setValor(item.valor)
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

async function buscarPropriedadePorId(id, propriedade) {
  try {
    const ref = doc(db, "suaColecao", id); // troque "suaColecao" pelo nome da sua coleção
    const docSnap = await getDoc(ref);

    if (docSnap.exists()) {
      const dados = docSnap.data();
      setValor(dados) // retorna só a propriedade desejada
    } else {
      console.log("Documento não encontrado.");
      return 0;
    }
  } catch (erro) {
    console.error("Erro ao buscar documento:", erro);
    return null;
  }
}

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

function formatarValor(valor) {
  // Remove tudo que não for número ou vírgula
  let valorNumerico = valor.replace(/[^\d,]/g, "");

  // Substitui vírgula por ponto para usar como número float
  valorNumerico = valorNumerico.replace(",", ".");

  // Converte para float
  const numero = parseFloat(valorNumerico);

  // Se não for número, retorna vazio
  if (isNaN(numero)) return "";

  // Formata como moeda brasileira
  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

    
             
  useEffect(() => {
    console.log('[DEBUG] Chamando buscarDados()...');
    const unsubscribe = buscarDados();

    // Verifica o retorno imediatamente
    console.log('[DEBUG] Retorno de buscarDados():', unsubscribe);
    console.log('[DEBUG] Tipo do retorno:', typeof unsubscribe);


    // function aplicarFiltros(lista) {
    //   return lista.filter(item => {
    //     const nomeOk = filtroNome === "" || (item.descricao || "").toLowerCase().includes(filtroNome.toLowerCase());
    //     const categoriaOk = filtroCategoria === "" || (item.categoria || "").toLowerCase().includes(filtroCategoria.toLowerCase());
    //     const valorOk = filtroValor === "" || parseFloat(item.valor) === parseFloat(filtroValor);
    //     const periodoOk =
    //       (filtroPeriodo.inicio === "" || new Date(item.periodo) >= new Date(filtroPeriodo.inicio)) &&
    //       (filtroPeriodo.fim === "" || new Date(item.periodo) <= new Date(filtroPeriodo.fim));
    //     return nomeOk && categoriaOk && valorOk && periodoOk;
    //   });
    // }

    return () => {

    // <div className="filtros flex flex-wrap gap-2 p-2">
    //   <input type="text" placeholder="Filtrar por nome" value={filtroNome} onChange={e => setFiltroNome(e.target.value)} className="border p-1 rounded" />
    //   <input type="text" placeholder="Filtrar por categoria" value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)} className="border p-1 rounded" />
    //   <input type="number" placeholder="Filtrar por valor" value={filtroValor} onChange={e => setFiltroValor(e.target.value)} className="border p-1 rounded" />
    //   <input type="date" value={filtroPeriodo.inicio} onChange={e => setFiltroPeriodo({ ...filtroPeriodo, inicio: e.target.value })} className="border p-1 rounded" />
    //   <input type="date" value={filtroPeriodo.fim} onChange={e => setFiltroPeriodo({ ...filtroPeriodo, fim: e.target.value })} className="border p-1 rounded" />
    // </div>

      console.log('[DEBUG] Executando cleanup...');
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
        console.log('[DEBUG] Listener removido com sucesso');
      } else {
        console.warn('[DEBUG] Nada para limpar - unsubscribe não é função');
      }
    };      
  }, []);  


  const [tipoFiltroLista, setTipoFiltroLista]= useState([])
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroValor, setFiltroValor] = useState("");
  const [filtroPeriodo, setFiltroPeriodo] = useState({ inicio: "", fim: "" });

  function aplicarFiltros(lista) {
  return lista.filter(item => {
    const nomeOk = filtroNome === "" || (item.descricao || "").toLowerCase().includes(filtroNome.toLowerCase());
    const categoriaOk = filtroCategoria === "" || (item.categoria || "").toLowerCase().includes(filtroCategoria.toLowerCase());
    const valorOk = filtroValor === "" || parseFloat(item.valor) === parseFloat(filtroValor);
    const periodoOk =
      (filtroPeriodo.inicio === "" || new Date(item.periodo) >= new Date(filtroPeriodo.inicio)) &&
      (filtroPeriodo.fim === "" || new Date(item.periodo) <= new Date(filtroPeriodo.fim));
    return nomeOk && categoriaOk && valorOk && periodoOk;
  });
}
  const [uid, setUid] = useState(null);
    const [carregando, setCarregando] = useState(true);


useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        console.log("✅ UID carregado:", user.uid);
      } else {
        console.warn("Usuário não logado");
      }
      setCarregando(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let unsubscribe;

    if (uid) {
      console.log("[DEBUG] Chamando buscarDados()...");
      buscarDados(uid).then((unsub) => {
        unsubscribe = unsub;
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
      else console.log("[DEBUG] Nada para limpar - unsubscribe não é função");
    };
  }, [uid]);


  useEffect(() => {
    const unsubscribe = buscarPorTipo(uid, tipoFiltro, (dados) => {
      // aqui você pode setar no estado, por exemplo
      var listaX = []
      dados.forEach(e => {
          listaX.push(e)
      });

      setTipoFiltroLista(listaX)
      setListaDados(listaX)
      console.log("Aqui dados", dados)
      console.log("Aqui é a lista: ", tipoFiltro)
    });


    return () => unsubscribe?.();
  }, [tipoFiltro]);



  useEffect(() => {
    const unsubscribe = buscarPorTipo(uid, "Despesa", (dados) => {
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
    const unsubscribe = buscarPorTipo(uid, 
      "Receita", (dados) => {
      // aqui você pode setar no estado, por exemplo
      setDespesaDash(dados);

      var listaR = []
      dados.forEach(e => {
          listaR.push(e.valor)
      });
      setListaReceita(listaR);

      console.log("Aqui dados", dados)
      console.log("Aqui é a lista despesa: ", listaReceita)
    });


    return () => unsubscribe?.();
  }, []);



  useEffect(() => {
    async function fetchValor() {
      const resultado = await buscarPropriedadePorId(editarItem.id, "valor");
      setValor(resultado); // atualiza o estado com o valor do Firestore
    }

    if (editarItem?.id) fetchValor();
  }, [editarItem.id]);

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
  if (!uid) {
    console.warn("UID ainda não disponível.");
    return;
  }

  const ref = collection(db, "despesas"); // ou o nome correto
  const filtro = query(ref, where("uid", "==", uid));

  const unsubscribe = onSnapshot(filtro, (querySnapshot) => {
    console.log('🚨 querySnapshot recebida:', querySnapshot);

    const novosDados = querySnapshot.docs.map((doc) => {
      const dados = doc.data();
      console.log("Tipo:", dados.tipo);

      return {
        id: doc.id,
        ...dados,
        periodo: dados.periodo ? converterTimestamp(dados.periodo) : null,
      };
    });

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

function buscarPorTipo(uid, tipoDesejado, callback) {
  if (!uid) {
    console.warn("UID não fornecido");
    return;
  }

  const baseRef = ref; // assume que ref já é sua referência à coleção

  // Verifica se tipo foi passado corretamente (string não vazia)
  const filtro =
    tipoDesejado && tipoDesejado.trim() !== ""
      ? query(baseRef, where("tipo", "==", tipoDesejado), where("uid", "==", uid))
      : query(baseRef, where("uid", "==", uid)); // sem filtro de tipo

  const unsubscribe = onSnapshot(filtro, (querySnapshot) => {
    const dadosFiltrados = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`[DEBUG] Documentos do tipo "${tipoDesejado || "todos"}":`, dadosFiltrados);

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
      uid: uid,
      descricao: descricaoIn,
      valor: valorIn,
      categoria: categoriaIn,
      periodo: periodoIn,
      tipo: tipoIn,
    };

    addDoc(ref, dados).then((docRef) => {
      console.log('Documento salvo com ID:', docRef.id);
      window.alert("Deu certo!")
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

  function identificarTipo(e){ 
    const tipoFiltro = e.target.value

    setTipoFiltro(tipoFiltro)
  }

  function statusFiltros(status){
    if(status == false){
      return "hidden"
    }
    else{
      console.log(status)
      return " "
    }
  }
  return (
    <>
      <header>
        <nav className='p-3 rounded-lg bg-[#f6f6f6] flex items-center'>
          <img className="w-[50px] h-[50px]" src={padrao} alt="" />
          <h1 className="text-start text-3xl font-bold">Minhas Despesas</h1>
        </nav>
      </header>

      <main>
        <section id="dash" className='flex gap-13 flex-row flex-wrap justify-center'>

          <div className="card-dash bg-green-100 border-green-200" id="mais">
            <h1 className="text-start m-2">Receitas</h1>
            <p className='text-lg m-2'>
              {formatarParaReais(CalcularReceita(listaReceita))}
            </p>
          </div>

          <div className="card-dash bg-red-100 border-red-200" id="menos">
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
        
        <section id="busca" className='flex flex-col items-center justify-center'>
          <div className="flex flex-row  w-[85%] mb-6 mt-6 justify-between">
            
            <div id="buscar" className="flex flex-row items-center">
              <p className="mr-2">Buscar</p>
              <span id="filtros-busca" className={`flex flex-row max-w-[300px] w-full items-start justify-between`}>
                <input
                  className="border p-1  min-w-[108px] max-w-[250px] w-full"
                  type="text"
                  placeholder="Buscar por nome"
                  value={filtroNome}
                  onChange={(e) => setFiltroNome(e.target.value)}
                />
              </span>
            </div>

            <span className="m-[0px] min-w-[45px] max-w-[75px]" id="add">
              <button className="m-[0px] w-full" onClick={() => OpenModalSave()} id="edit">
                Adicionar
              </button>
            </span>
          </div>
          
          <div className="flex flex-row  w-[85%] " >
              <Disclosure as="div" className={"flex flex-col items-start"}>
                {/* <span className='flex flex-col justify-center items-center'> */}
                <DisclosureButton className='flex flex-row mt-[0px] ml-[1px] pl-[0px] justify-center items-center gap-2 g-transparent border-none outline-none shadow-none' onClick={(e) => setFiltros(!filtros)}>
                  <p>Filtros</p>
                  <svg className="w-[20px] h-[12px]" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 16-4 4-4-4"></path><path d="M17 20V4"></path><path d="m3 8 4-4 4 4"></path><path d="M7 4v16"></path></svg>
                </DisclosureButton>

                <DisclosurePanel className={`flex flex-row items-center`}>
                {/* <div className={`flex flex-row items-center`}> */}
                  <select name="" id="" onChange={(e)=> identificarTipo(e)}>
                    <option className="" selected value=" ">------</option>
                    <option className="" value="Receita">Receitas</option>
                    <option className="" value="Despesa">Despesas</option>
                  </select>
                {/* </div> */}

                </DisclosurePanel>
                {/* </span> */}
              </Disclosure>
          </div>

        </section>

        {carregando ? (
          <p>Carregando usuario</p>
        ): uid ? (
          <section id="dados" className='p-4 rounded-lg bg-[#f6f6f6]' flex justify-between>
            <ul className="list-none gap-4 flex flex-wrap items-start justify-center">
              {aplicarFiltros(listaDados).map((item, index) => (
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
                          <img src={trash} className="" alt="" />
                        </button>

                        <button className="p-1  m-1 max-w-[25px] max-h-[25px] w-full h-full" onClick={() => OpenModalEdit(item)} id="edit">
                          <img src={edit} alt="" />
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
        ): (
          <p>Nenhum usuario logado</p>
        )}





      </main>


      <div>

        {/* Adicionar registro*/}


        <Dialog open={isOpenEdit} onClose={() => setIsOpenEdit(false)}>
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4 ">
            <DialogPanel className=" max-w-lg space-y-4 rounded-lg bg-white p-5 shadow-xl">
              <DialogTitle className="font-bold">Editar registro</DialogTitle>
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
                <span>
                <label className="mr-1" htmlFor="">R$</label>
                <input
                  className="w-[150px]"
                  type="text"
                  value={dadosEdit.valor}
                  onChange={(e) => {
                    let valorFormatado = formatarParaReaisInput(e.target.value)
                    setDadosEdit({ ...dadosEdit, valor: valorFormatado });                  }}
                />

                </span>

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
            <DialogPanel className="max-w-lg space-y-4 border rounded-lg bg-white p-5 shadow-xl">
              <DialogTitle className="font-bold">Adicionar registro</DialogTitle>
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
                  <button className="bg-red-600 text-white" onClick={() => closeModalSave()}>Cancelar</button>
                  <button className="bg-green-600 text-white" type="submit">Salvar</button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </Dialog>
      </div>
    </>
  );


}

export default Home;