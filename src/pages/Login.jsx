import { Link } from 'react-router-dom';

export default function Login(){ 
    return(
        <div class="flex justify-center flex-col w-[100%] items-center">
            <h1 class="title-login">Faça o seu Login</h1>
            <form class="flex flex-col w-[50%] justify-center" action="" method="post">
                <label htmlFor="">Usuario</label>
                <input type="text" />

                <label htmlFor="">Senha</label>
                <input type="text" />

                <span class="flex ">
                <div class="btn-cadastro">
                    <Link to="/cadastro"><button>Me cadastrar</button></Link> 
                    
                </div>
                <div class="btn-acessar">
                 <Link to="/home"> <button>Acessar</button></Link>
                 </div>
                   
                </span>
            

            </form>
            
        </div>
    )
}

<link rel="stylesheet" href="style.css"></link>
