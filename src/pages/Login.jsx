import { Link } from 'react-router-dom';

export default function Login(){ 
    return(
        <div class="flex justify-center flex-col w-[100%] items-center">
            <h1 class="">Faça o seu Login</h1>
            <form class="flex flex-col w-[50%] justify-center" action="" method="post">
                <label htmlFor="">Usuario</label>
                <input type="text" />

                <label htmlFor="">Senha</label>
                <input type="text" />

                <span class="flex ">
                    <button><Link to="/cadastro">Me cadastrar</Link></button>
                    <button><Link to="/home">Acessar</Link></button>
                </span>
            </form>
        </div>
    )
}
