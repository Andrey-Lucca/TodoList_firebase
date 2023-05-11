import { useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import {toast} from 'react-toastify';
import {signInWithEmailAndPassword} from 'firebase/auth';
import { auth } from "../../firebaseConnection";
import './home.css'

function Home() {
  
  const [email, setEmail] = useState('');
  //Variavel monitorada para email
  const [password, setPassword] = useState('');
  //Variavel monitorada para senha
  const navigate = useNavigate();
  //Criação variavel navigate para podermos fazer a navegação após login

  async function login(e){
    e.preventDefault();
    //casos de sucesso e erro de email
    if(email !== '' && password !== ''){
      //Se email e senha diferente de vazio então usuremos nosso entrarComEmaileSenha passando nosso auth, email e senha
      await signInWithEmailAndPassword(auth, email, password)
      .then(()=>{
        navigate('/admin', { replace: true});
        //Se caso de suceso navega para /admin
      })
      .catch(()=>{
        toast.error('Falha ao fazer o login')
      })
      //casos de erro preenchimento login
    }else if(email === '' && password !== ''){
      toast.warn('Preencha o email!');
    }else if(email !== '' && password === ''){
      toast.warn('Preencha a senha!')
    }else{
      toast.warn('Preencha os campos necessários para completar o login')
    }
  }
  
  return (
    <div className="container">
      <h1>Lista de tarefas</h1>
      <span>Gerencie suas tarefas do dia a dia!</span>
      
      <form className="form" onSubmit={login}>
        <input 
        type="text"
        placeholder="Digite seu email ex: teste@teste.com"
        value={email} //recebe valor que está em email
        //Quando mudar pegamos o que está sendo/foi digitado e passamos para o setEmail para atualizar nossa variavel email
        onChange={(e)=>setEmail(e.target.value)}
        />
        <input
        type="password"
        placeholder="Digite sua senha"
        value={password} //recebe valor que está em senha
        //Quando mudar pegamos o que está sendo/foi digitado e passamos para o setPassword para atualizar nossa variavel password
        onChange={(e)=>setPassword(e.target.value)}
        />
        <button type="submit">Acessar</button>
      </form>
    <Link to={'/register'} className="btn-link">Não possui uma conta? Cadastre-se!</Link>

    </div>
  );
}

export default Home;
