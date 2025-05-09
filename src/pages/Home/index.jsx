import { useEffect, useState, useRef } from "react";
import "./style.css";
import { ToastContainer, toast } from 'react-toastify';
import Trash from "../../assets/trash-regular.png";
import Edit from "../../assets/edit-alt-regular.png";
import api from "../../services/api";

function Home() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState();
  const [emailError, setEmailError] = useState("");
  const notify = (text) => toast(text);

  const inputName = useRef();
  const inputAge = useRef();
  const inputEmail = useRef();

  function isEmailValid(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  }

  async function getUsers() {
    const userFromApi = await api.get("/usuarios");
    setUsers(userFromApi.data);
  }

  async function createUsers() {
    try {
      await api.post("/usuarios", {
        name: inputName.current.value,
        age: inputAge.current.value,
        email: inputEmail.current.value,
      });
     {
      notify("Usuário cadastrado com sucesso!");
      getUsers();
      resetForm();
      }
    } catch (error) {
      console.log(error);
      notify("Ocorreu um erro ao cadastrar o usuário.");
    }
  }

  async function updateUser(id) {
    try {
      await api.put(`/usuarios/${id}`, {
        name: inputName.current.value,
        age: inputAge.current.value,
        email: inputEmail.current.value,
      });
      notify("Usuário editado com sucesso!");
      getUsers();
      setEditingUser();
      resetForm();
    } catch (error) {
      console.log(error);
      notify("Ocorreu um erro ao atualizar o usuário.");
    }
    
  }

  async function deleteUser(id) {
    try {
      await api.delete(`/usuarios/${id}`);
    notify("Usuário deletado com sucesso!");
    getUsers();
    } catch (error) {
      console.log(error);
      notify("Ocorreu um erro ao deletar o usuário.");
    }
    
  }

  const handleEdit = (user) => {
    setEditingUser(user);
    inputName.current.value = user.name;
    inputAge.current.value = user.age;
    inputEmail.current.value = user.email;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  
    const email = inputEmail.current.value;
  
    if (!isEmailValid(email)) {
      if (!email.includes("@")) {
        setEmailError("Por favor, insira um email válido.");
      } else {
        setEmailError("Por favor, insira um email válido.");
      }
  
      setTimeout(() => {
        setEmailError("");
      }, 3000);
  
      return;
    }

    if (editingUser) {
      updateUser(editingUser.id);
    } else {
      createUsers();
    }
  };

  const resetForm = () => {
    inputName.current.value = "";
    inputAge.current.value = "";
    inputEmail.current.value = "";
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="container">
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <h1>{editingUser ? "Editar Usuário" : "Cadastro de Usuário"}</h1>
        <input
          placeholder="Nome"
          name="nome"
          type="text"
          ref={inputName}
          maxLength={50}
        />
        <input placeholder="Idade" name="idade" type="number" ref={inputAge} />
        <input
          placeholder="E-mail"
          name="email"
          type="email"
          ref={inputEmail}
          maxLength={50}
        />

        {emailError && <span className="error-message">{emailError}</span>}

        <button type="submit">{editingUser ? "Atualizar" : "Cadastrar"}</button>
      </form>

      <div className="card-container">
        {users.map((user) => (
          <div key={user.id} className="card">
            <div>
              <p>
                Nome: <span>{user.name}</span>
              </p>
              <p>
                Idade: <span>{user.age}</span>
              </p>
              <p>
                Email: <span>{user.email}</span>
              </p>
            </div>
            <div className="button-edit-delet">
              <button onClick={() => handleEdit(user)}>
                <img src={Edit} alt="Edit" />
              </button>
              <button onClick={() => deleteUser(user.id)}>
                <img src={Trash} alt="Delete" />
              </button>
            </div>
          </div>
          
        ))}
      </div>
    </div>
  );
}

export default Home;
