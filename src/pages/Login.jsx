import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth } from "../firebase/firebaseAuth";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

export default function Login() {
  const [valorDigitado, setValorDigitado] = useState("");
  const [mostrarAlert, setMostrarAlert] = useState(false);
  const [estiloInput, setEstiloInput] = useState(false);

  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  function EnviarDados(e) {
    e.preventDefault();

    const email = e.target.email.value;
    const senha = e.target.senha.value;

    signInWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {
        console.log('Usuário logado!', userCredential.user);
        navigate('/home');
      })
      .catch((erro) => {
        console.error('Erro ao logar: ', erro.message);
      });
  }

  function AtivarPopUp() {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("Usuário autenticado com o Google", result.user);
        navigate('/home');
      })
      .catch((error) => {
        console.error("Erro ao autenticar com Google: ", error.message, error.code);
      });
  }

  function DetectarValorDigitado(valor) {
    if (valor.length > 0 && valor.length < 6) {
      setEstiloInput(true);
      setMostrarAlert(true);
    } else {
      setEstiloInput(false);
      setMostrarAlert(false);
    }
  }

  useEffect(() => {
    DetectarValorDigitado(valorDigitado);
  }, [valorDigitado]);

  return (
    <div className="flex justify-center flex-col w-full items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Faça o seu Login</h1>

      <form
        className="flex flex-col w-1/2 justify-center gap-2"
        onSubmit={EnviarDados}
      >
        <label htmlFor="email">Email</label>
        <input
          type="text"
          name="email"
          required
          className="border border-black p-2 rounded"
        />

        <label htmlFor="senha">Senha</label>
        <input
          type="password"
          name="senha"
          required
          id="senha-input"
          onChange={(e) => setValorDigitado(e.target.value)}
          className={`p-2 rounded border focus:outline-none ${
            estiloInput ? "border-red-500" : "border-black"
          }`}
        />

        <p className={`text-left text-red-500 ${mostrarAlert ? "inline" : "hidden"}`}>
          A quantidade mínima de caracteres é 6
        </p>

        <div className="flex justify-between mt-4 gap-4">
          <Link to="/cadastro">
            <button type="button" className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
              Me cadastrar
            </button>
          </Link>

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Acessar
          </button>
        </div>

        <button
          type="button"
          onClick={AtivarPopUp}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logar com o Google
        </button>
      </form>
    </div>
  );
}
