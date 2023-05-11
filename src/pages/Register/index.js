import { useState} from "react";
import { Link, useNavigate} from "react-router-dom";
import {createUserWithEmailAndPassword} from 'firebase/auth';
import { auth } from "../../firebaseConnection";
import {toast} from 'react-toastify'

function Register() {
  
  const [email, setEmail] = useState('');
  //Variavel monitorada para email
  const [password, setPassword] = useState('');
  //Variavel monitorada para senha
  const navigate = useNavigate();
  //Criação variavel navigate para podermos fazer a navegação após login


  async function handleRegister(e){
    e.preventDefault();
    if(email !== '' && password !== ''){
      //Criamos registro do usuário com propriedade Criarusuariocomsenha e email do firebase, passando como parametro auth, email e senha
      await createUserWithEmailAndPassword(auth, email, password)
      .then(()=>{
        //Se der certo a criação vamos ser encaminhados para página admin graças ao useNavigate
        navigate('/admin', {replace:true})
      })
      .catch(()=>{
        //Caso de erro mostrará essa notificação
        toast.error('Erro ao se cadastrar')
      })
      //casos preenchimento email e senha errados
    }else if(email === '' && password !== ''){
      toast.warn('Ainda falta o email para realizar o cadastro');
    }else if(email !== '' && password === ''){
      toast.warn('Ainda falta a senha para realizar o cadastro')
    }else{
      toast.warn('Preencha os campos necessários para se registrar')
    }
  }
  
  return (
    <div className="container">
      <h1>Registre-se</h1>
      <span>Vamos criar sua conta</span>
      
      <form className="form" onSubmit={handleRegister}>
        <input 
        type="text"
        placeholder="Digite seu email ex: teste@teste.com"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        />
        <input
        type="password"
        placeholder="Digite sua senha"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        />
        <button type="submit">Registrar</button>
      </form>
    <Link to={'/'} className="btn-link">Se já possui uma conta, faça o login</Link>

    </div>
  );
}

export default Register;