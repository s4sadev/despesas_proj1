
import { Link } from 'react-router-dom';

import {auth} from "../firebase/firebaseAuth"

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

import { useNavigate } from 'react-router-dom';


export default function PageCadastro(){
    const provider = new GoogleAuthProvider();
    const navigate = useNavigate();

    function EnviarDados(e){
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

    function AtivarPopUp(){
        signInWithPopup(auth, provider)
        .then((result)=> {
            console.log("Usuario autenticado com o google", result.user)
            navigate('/home')
        })
        .catch((error) => {
            console.error("Erro ao autenticar com Google: ", error.message, error.code)
        })
    }

    
    return (
        <div>
            <span class="flex w-[100%] justify-end">
                <button class="flex  border-2" onClick={AtivarPopUp}>Cadastre-se com o Google</button>
            </span>


            <form action="" className="flex flex-col" onSubmit={(e) => EnviarDados(e)}>

                <label htmlFor="">Email</label>
                <input required type="text" name="email" />

                <label htmlFor="">Senha</label>
                <input required type="text" name="senha" />

                <span className='flex flex-row justify-between'>
                    <Link to="/"><button type="button">Voltar para o Login</button></Link>
                    <button type="submit">Criar conta</button>
                </span>

            </form>
            
        </div>


    )

}