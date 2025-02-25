import { useEffect, useState, useRef } from "react";
import "./style.css";
import Trash from "../../assets/trash-regular.png";
import Edit from "../../assets/edit-alt-regular.png";
import api from "../../services/api";

function Home() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState();
  const [emailError, setEmailError] = useState("");

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
    await api.post("/usuarios", {
      name: inputName.current.value,
      age: inputAge.current.value,
      email: inputEmail.current.value,
    });
    getUsers();
  }

  async function updateUser(id) {
    await api.put(`/usuarios/${id}`, {
      name: inputName.current.value,
      age: inputAge.current.value,
      email: inputEmail.current.value,
    });
    getUsers();
    setEditingUser();
  }

  async function deleteUser(id) {
    await api.delete(`/usuarios/${id}`);
    getUsers();
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
        setEmailError("Por favor, insira um email válido.");
      } else {
        setEmailError("Por favor, insira um email válido.");
      }
      return;
    }

    if (editingUser) {
      updateUser(editingUser.id);
    } else {
      createUsers();
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h1>{editingUser ? "Editar Usuário" : "Cadastro de Usuário"}</h1>
        <input placeholder="Nome" name="nome" type="text" ref={inputName} maxLength={30} />
        <input placeholder="Idade" name="idade" type="number" ref={inputAge} />
        <input placeholder="E-mail" name="email" type="email" ref={inputEmail} maxLength={30} />
        
        
        {emailError && <span className="error-message">{emailError}</span>}

        
        <button type="submit">
          {editingUser ? "Atualizar" : "Cadastrar"}
        </button>
      </form>

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
  );
}

export default Home;
