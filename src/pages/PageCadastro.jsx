
import { Link } from 'react-router-dom';

import { auth } from "../firebase/firebaseAuth"

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";

import { useNavigate } from 'react-router-dom';

import { useEffect, useState } from 'react';
export default function PageCadastro() {
    const provider = new GoogleAuthProvider();
    const navigate = useNavigate();
    const [estiloInput, setEstiloInput] = useState(false)
    const [valorDigitado, setValorDigitado] = useState("")
    const [mostrarAlert, setMostrarAlert] = useState(false)

    function EnviarDados(e) {
        e.preventDefault();

        // capturar dados/inputs
        const email = e.target.email.value
        const senha = e.target.senha.value

        // realizar a validação
        createUserWithEmailAndPassword(auth, email, senha)
            .then((usercredential) => {
                console.log('usuario criado!', usercredential.user)
                window.alert("Usuario criado com sucesso!")


            })
            .catch((erro) => {
                console.error('erro ao logar: ', erro.message)
                window.alert("Erro ao criar usuario", erro.message)
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
                <h1 className="font-bold text-xl">Faça o seu cadastro</h1>
                <span class="flex w-[100%] justify-end">
                    <button class="flex  border-2" onClick={AtivarPopUp}>Cadastre-se com o Google</button>
                </span>


                <form action="" className="flex flex-col w-full" onSubmit={(e) => EnviarDados(e)}>

                    <label htmlFor="">Email</label>
                    <input required type="text" className="m-0 border p-2 rounded" name="email" />

                    <label htmlFor="">Senha</label>
                    <input required type="text" className={`m-0 border p-2 rounded focus:outline-none ${estiloInput ? "border-red-500" : "border-black"
                        }`}
                        onChange={(e) => setValorDigitado(e.target.value)} name="senha" />

                    <p
                        className={`text-left text-red-500 text-sm ${mostrarAlert ? "inline" : "hidden"
                            }`}
                    >
                        A quantidade mínima de caracteres é 6
                    </p>

                    <span className="flex flex-col items-center w-full justify-center mt-4 gap-2">
                        <Link to="/"><button type="button">Voltar para o Login</button></Link>
                        <button type="submit" className="border-2 w-full bg-green-500 border-green-600 font-bold text-white hover:bg-green-500/90 py-2 rounded">Criar conta</button>
                    </span>

                </form>
            </div>


        </div>


    )

}