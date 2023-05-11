import './admin.css';
import { useState, useEffect } from 'react';
import { auth, db } from '../../firebaseConnection'
import { signOut } from 'firebase/auth'
import { addDoc, collection, onSnapshot, query, orderBy, where, doc, deleteDoc, updateDoc} from 'firebase/firestore'
import { toast } from 'react-toastify'

function Admin(){

  const [tarefa, setTarefa] = useState(''); 
  //Variavel para receber o valor que está no input
  const [user, setUser] = useState({});
  //Variavel para pegarmos as informações salvas do usuário no local storage
  const [tarefasRegistradas, setTarefasRegistradas] = useState([]);
  //Variavel para pegarmos as tarefas que estão registradas
  const [edit, setEdit] = useState({});
  //Variavel para receber as tarefas registradas e edita-las

  useEffect(()=>{
    //Usamos o useEffect primeiramente para ficar monitorando se há a existência de tarefas através do Onsnapshot
    async function loadTarefas(){
      //Pegando detalhes usuário através do localStorage
      const userDetail = localStorage.getItem("@detailUser")
      setUser(JSON.parse(userDetail))

      if(userDetail){
        const data = JSON.parse(userDetail);
        //passando as informações do usuario para variavel
        const tarefaRef = collection(db, "tarefas");
        //Acessando banco de dados firabase e a coleção  de tarefas
        const q = query(tarefaRef, orderBy("created","desc"), where("userUid", "==", data?.uid));
        //Fazendo um query para pegar as tarefas de só um usuário e não misturar
        //Ordenando pela data na ordem decrescente e atribuindo propriedade Uid para diferenciar usuário
        const unsub = onSnapshot(q, (snapshot) =>{
          let lista = [];
          //Adicionando id, tarefa, userUid na nossa lista (snapshot monitorando se há algo novo/alteração)
          snapshot.forEach((doc)=>{
            lista.push({
              id: doc.id,
              tarefa: doc.data().tarefa,
              userUid: doc.data().userUid
            })
          })
          setTarefasRegistradas(lista)
        })
      }
    }

    loadTarefas()
  },[])

  //Criando função registrar tarefa
  async function handleRegisterTarefa(e){
    e.preventDefault();
    //Verificando se há o id de alguma tarefa para editar
    if(edit?.id){
      handleUpdate();
      return
    }
    //Adicionando documento banco de dados com as caracteristicas abaixo
    await addDoc(collection(db, "tarefas"),{
      tarefa: tarefa,
      created: new Date(),
      userUid: user?.uid
    })
    //caso de sucesso
    .then(()=>{
      toast.success('Tarefa registrada com sucesso')
    })
    //caso erro
    .catch(()=>{
      toast.error('Falha ao executar tarefa')
    })
  }

  //Criando a função de deslogar através do nosso signOut
  async function handleLogout(){
    await signOut(auth)
  }

  //Função de "concluir a tarefa" removendo-a do nosso firebase através do deleteDoc
  async function deleteTarefa(id){ //Recebe a propriedade Id passada no nosso "onClick"
    //Criando documento de referencia, passando db, coleção de tarefas e acessando o ID da tarefa especíifica
    const docRef = doc(db, 'tarefas', id);
    await deleteDoc(docRef); //Deletando o documento de referência passado
  }

  //Editando a tarefa
  function editarTarefa(data){
    setTarefa(data.tarefa)//Fazendo nosso input ter o mesmo texto da tarefa editar através parametro data e acessando a tarefa
    setEdit(data)//Passando todas informações disponíveis nosso data para variavel edit
  }

  async function handleUpdate(){
    const docRef = doc(db, 'tarefas', edit.id) //Criando documento referencia, documento tarefa e acessando o Id das informações passadas através do setEdit 
    await updateDoc(docRef, {
      tarefa: tarefa//atualizando documento através do updateDoc e com informações disponíveis através nosso edit
    })
    .then(() =>{
      setTarefa('');
      setEdit({});
      toast.success('Tarefa atualizada!')

    })
    .catch(()=>{
      setTarefa('');
      setEdit({});
      toast.error('Erro ao atualizar')
    })
  }

  return(
    <div className='adm-container'>
      <h1>Minhas tarefas</h1>

      <form onSubmit={handleRegisterTarefa} className='form'>
        <textarea
        placeholder='Digite sua tarefa'
        value={tarefa}
        onChange={(e)=>setTarefa(e.target.value)}/>
        {Object.keys(edit).length > 0 ? (
          //Aqui apenas ocorre verificação se o tamanho de edit > 0 então o botão ficará como atualizar tarefa
          //Se não houverem tarefas a serem atualizas, ou sseja edit.length = 0, botão ficará como Registrar tarefa
        <button type='submit' className='btn-tarefa'>Atualizar tarefa</button>
      ) :(
        <button type='submit' className='btn-tarefa' disabled = {tarefa ? false : true} style={{opacity: tarefa ? 1 : 0.5}}>Registrar tarefa</button>
      )
}
      </form>
        {tarefasRegistradas.map((data)=>{
          return(
            //Fazendo map para exibir as tarefas presentes, e os botões de editar e concluir com suas respectivas funções e passando parâmetros disponíveis
            <article className='list' key={data.id}>
            <h3>{data.tarefa}</h3>
            <div className='buttons'>
            <button className='btn-edit' onClick={()=> editarTarefa(data)}>Editar</button>
            <button className='btn-finish' onClick={()=> deleteTarefa(data.id)}>Concluir</button>
            </div>
        </article>
          )
          
        })}
        <div className='logout'><button id='logout-btn' onClick={handleLogout}>Sair</button></div>
    </div>
    
  )
}

export default Admin;