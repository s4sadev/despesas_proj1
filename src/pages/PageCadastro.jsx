import { Link } from 'react-router-dom';

export default function PageCadastro(){
    return (
        <div>
            <span class="flex w-[100%] justify-end">
                <button class="flex  border-2">Cadastre-se com o Google</button>
            </span>


            <form action="" class="flex flex-col">
                <label htmlFor="">Usuario</label>
                <input type="text" />

                <label htmlFor="">Email</label>
                <input type="text" />

                <label htmlFor="">Senha</label>
                <input type="text" />

                <label htmlFor="">Confirme a senha</label>
                <input type="text" />

                <button>Criar conta</button>

            </form>
            
        </div>


    )

}