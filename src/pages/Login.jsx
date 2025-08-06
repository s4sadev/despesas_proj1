import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { loginEmail, loginGoogle } from '../services/auth'


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
        <div class="">
            <h1 class="">Faça o seu Login</h1>


            <form class="flex flex-col w-[90%]" action="" method="post" onSubmit={(e) => EnviarDados(e)}>
                <label htmlFor="">Email</label>
                <input type="text" required name='email' />

                <label htmlFor="">Senha</label>
                <input type="text" className={` focus:outline-none   ${estiloInput ? "border-red-500" : "border-black"}`} id="senha-input" onChange={(e) => setValorDigitado(e.target.value)} required name='senha' />
                <p className={`text-left text-red-500 ${mostrarAlert ? "inline" : "hidden"}`}>A quantidade minima de caracteres é 6</p>

                <span class="flex flx-row justify-between">
                    <Link to="/cadastro"><button type="button">Me cadastrar</button></Link>
                    <button type='submit'>Acessar</button>
                </span>

                <span className='flex w-[100%] justify-end'>
                    <button className='flex  border-2' onClick={() => AtivarPopUp()}>Logar com o google</button>
                </span>
            </form>

        </div>
    )
}
