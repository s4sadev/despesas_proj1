import {getAuth, onAuthStateChanged} from 'firebase/auth';
import { useEffect } from 'react';
import {useState} from 'react'
import {useNavigate} from "react-router-dom";


export default function ProtectPage({ children }){
  const [carregando, setCarregando] = useState(true)  
  
  const navigate = useNavigate()
  
    function verificarUsuario(){
      const auth = getAuth();

      const unsubscribe = onAuthStateChanged(auth, (user)=> {

        
        if (user){
          setCarregando(false)
          // ser estiver logado
          console.log('usuario logado', user.email)
          
        }

        else {
          console.log('usuario não logado')
          navigate('/ ')
        }
      })

      return unsubscribe
    }

  useEffect(()=> {
    const unsubscribe = verificarUsuario()

    return () => unsubscribe();
  }, [navigate]);


  if(carregando){
    return <p>carregando...</p>
  }
    return(
      <div>
        { children }
      </div>
    )
}
  
  
