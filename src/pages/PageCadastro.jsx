import { Link } from 'react-router-dom';

import {auth} from "../firebase/firebaseAuth"

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";


export default function PageCadastro(){
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
    return (
        <div>
            <span class="flex w-[100%] justify-end">
                <button class="flex  border-2">Cadastre-se com o Google</button>
            </span>


            <form action="" class="flex flex-col" onSubmit={(e) => EnviarDados(e)}>

                <label htmlFor="">Email</label>
                <input required type="text" name="email" />

                <label htmlFor="">Senha</label>
                <input required type="text" name="senha" />

                <span>
                    <button type="submit">Criar conta</button>
                    <Link to="/"><button>Voltar para o Login</button></Link>
                </span>

            </form>
            
        </div>


    )

}