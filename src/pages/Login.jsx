import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { loginEmail, loginGoogle } from '../services/auth'

import google_ico from '../assets/google-ico.png';

import '../App.css'

import { auth } from "../firebase/firebaseAuth"

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";

import { useNavigate } from 'react-router-dom';

// temos as funções, agora precisamos capturar o valor digitado e passar para a veriavel da forma correta

export default function Login() {
    const teste = `border-color-500`
    const [valorDigitado, setValorDigitado] = useState("")
    const [mostrarAlert, setMostrarAlert] = useState(false)
    const [estiloInput, setEstiloInput] = useState(false)
    const provider = new GoogleAuthProvider();
    const navigate = useNavigate();

    function EnviarDados(e) {
        e.preventDefault();

        // capturar dados/inputs
        const email = e.target.email.value
        const senha = e.target.senha.value

        // realizar a validação
        signInWithEmailAndPassword(auth, email, senha)
            .then((usercredential) => {
                console.log('usuario logado!', usercredential.user)
                navigate('/home')


            })
            .catch((erro) => {
                console.error('erro ao logar: ', erro.message)
            })
    }

    function AtivarPopUp() {
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log("Usuario autenticado com o google", result.user)
                navigate('/home')
            })
            .catch((error) => {
                console.error("Erro ao autenticar com Google: ", error.message, error.code)
            })
    }


    function DetectarValorDigitado(valor) {
        if (valor.length > 0 && valor.length < 6) {
            setEstiloInput(true)
            setMostrarAlert(true)
            console.log("tem mais de 6!")
        }
        else {
            const estilo2 = {
                border: "solid 1px black",
            }
            setEstiloInput(false)
            setMostrarAlert(false)
            console.log("Não tem mais de 6")
        }
    }
    useEffect(() => {
        console.log(valorDigitado)
        DetectarValorDigitado(valorDigitado)

    }, [valorDigitado]);

    return (
        <div className="bg-rose-300 flex flex-row justify-center items-center min-h-screen bg-[url('/sua-imagem.jpg')] bg-cover bg-no-repeat bg-center px-4">
            <div className="bg-white w-[90%] max-w-md min-w-[268px] h-[55%] p-6 flex flex-col items-center gap-2 justify-center border shadow-lg rounded-lg">

                <h1 className="font-bold text-xl">Bem-vindo! Faça o seu Login</h1>

                <form
                    className="flex flex-col w-full"
                    action=""
                    method="post"
                    onSubmit={(e) => EnviarDados(e)}
                >
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        name="email"
                        id="email"
                        className="m-0 border p-2 rounded"
                        placeholder="Digite seu email"
                        required
                    />

                    <label htmlFor="senha">Senha</label>
                    <input
                        type="text"
                        name="senha"
                        id="senha-input"
                        placeholder="Digite sua senha"
                        className={`m-0 border p-2 rounded focus:outline-none ${estiloInput ? "border-red-500" : "border-black"
                            }`}
                        onChange={(e) => setValorDigitado(e.target.value)}
                        required
                    />

                    <p
                        className={`text-left text-red-500 text-sm ${mostrarAlert ? "inline" : "hidden"
                            }`}
                    >
                        A quantidade mínima de caracteres é 6
                    </p>

                    <span className="flex flex-col items-center w-full justify-center mt-4 gap-2">
                        <button
                            type="submit"
                            className="border-2 w-full bg-green-500 border-green-600 font-bold text-white hover:bg-green-500/90 py-2 rounded"
                        >
                            Login
                        </button>

                        <button
                            type="button"
                            onClick={() => AtivarPopUp()}
                            className="flex items-center justify-center w-full border-2 gap-2 py-2 rounded"
                        >
                            <img
                                className="max-w-[20px] max-h-[20px] w-full h-full p-1"
                                src={google_ico}
                                alt="Google"
                            />
                            Logar com o Google
                        </button>

                        <p className="text-sm mt-2 text-center">
                            Não tem uma conta?{" "}
                            <Link to="/cadastro" className="text-rose-500 font-medium">
                                Cadastre-se clicando aqui!
                            </Link>
                        </p>
                    </span>
                </form>
            </div>
        </div>

    )
}
