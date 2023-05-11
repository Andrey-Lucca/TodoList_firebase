import { Navigate } from "react-router-dom";
import { auth } from "../firebaseConnection";
import { useState, useEffect } from "react";
import {onAuthStateChanged} from 'firebase/auth';

function Private({children}){
  
  const [user, setUser] = useState(false);
  //variavel para usuario
  const [loading, setLoading] = useState(true);
  //variavel carregamento

  useEffect(()=>{
    async function checkLogin(){
      const unsub = onAuthStateChanged(auth, (user)=>{
        //Verificando se há algum usuário logado através do onAuthStateChanged, passando nosso auth e um usuário
        if(user){
          const userData = {
            uid: user.uid,
            email: user.email
            //Se há usuário quero acesso ao seu uid e email
          }

          localStorage.setItem('@detailUser', JSON.stringify(userData));
          //Passando essas propriedades para localStorage
          setLoading(false); //Para de carregar
          setUser(true); //Confirma a existência usuário e vai para página admin
        }

        else{
          setLoading(false);
          setUser(false);
        }
      })
    }
    checkLogin()
  }, [])

  if(loading){
    return(
      <div></div> //Se está carregando não retorna nada
    )
  }
  
  if(!user){
    return <Navigate to='/'/>
    //Se não possui usuário vai para página inicial
  }

  return children;
}

export default Private;
