import {BrowserRouter ,Routes, Route} from 'react-router-dom';
import Home from '../pages/Home';
import Register from '../pages/Register';
import Admin from '../pages/Admin';
import Private from './Private';

function RoutesApp(){
  return(
    //Aqui temos nosso controlador de rotas, para as páginas que queremos
    //Utilizando um private para forçar o usuário logar e não acessar tarefas de terceiros
    //3 caminhos, home, registro (registrar) e admin (tem a tarefa)
    <BrowserRouter>
      <Routes>
        <Route path='/' element = {<Home/>}/>
        <Route path='/register' element = {<Register/>}/>
        <Route path='/admin' element = {<Private> <Admin/> </Private>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default RoutesApp;