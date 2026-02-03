import { useEffect, useState } from 'react'
import './App.css';
import api from './utils/api';

const App = () => {

  useEffect(() => {
    api.get('/')
      .then(response => {
        if(groups.length === 0){
          setGroups(response.data.grupos);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  type Group = {
    _id: string;
    name: string;
    students: string[];
    subject: string;
  };

  const [groups, setGroups] = useState<Group[]>([]);

  const [name, setName] = useState<string>('');

  const [firstClick, setFirstClick] = useState<string>('');

  const handleGroupClick = (groupId: string) => {
    if (!firstClick) {
      setFirstClick(groupId);
      alert(`Esta decisión se puede tomar una sola vez. Si la pones mal trastocarás todo el orden de grupos de prácticas. Si estás seguro de que quieres entrar en el grupo ${groups.find(g => g._id === groupId)?.name} y tu nombre completo con apellidos es "${name}" vuelve a pulsar el mismo botón para confirmar.`);
    } else if (firstClick !== groupId) {
      setFirstClick('');
      alert('Has pulsado un grupo diferente al primero. No estabas tan seguro. Vuelve a empezar.');
    } else {
      api.put(`/${groupId}`, { student: name }).then(() => {
        alert(`Has sido inscrito correctamente en el grupo ${groups.find(g => g._id === groupId)?.name}. Recarga la página para ver los cambios.Por favor no intentes inscribirte de nuevo, ya que solo se permite una inscripción por alumno.`);
        setFirstClick('');
      }).catch(error => {
        console.error('Error enrolling student:', error);
        alert('Hubo un error al inscribirte en el grupo. Por favor, inténtalo de nuevo.');
        setFirstClick('');
      });
    }
  }



  return (
    <div className="mainContainer">
      <h1>Selección de grupo de prácticas de Programación de Interfaces Web</h1>
      <h3>Instrucciones:</h3>
      <p>
        Seleccionar un único grupo según el horario disponible. Cada alumno se
        puede inscribir una ÚNICA vez sin posibilidad de volver a hacerlo.
        Elegid con conocimiento y decisión. Los grupos se bloquaran
        automáticamente cuando estén llenos.
      </p>
      <input
        type="text"
        placeholder="Introduce tu nombre completo"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="selectContainer">
        {groups &&
          groups.length > 0 &&
          groups
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((group) => (
              <button
                key={group._id}
                className="groupButton"
                disabled={group.students.length >= 24 || !name}
                onClick={() => handleGroupClick(group._id)}
              >
                <h4>{group.name}</h4>
                <p>Asignatura: {group.subject}</p>
                <p>Plazas disponibles: {24 - group.students.length}/24</p>
              </button>
            ))}
      </div>
      <h2>Horarios disponibles:</h2>
      <img src="/assets/images/timeTable.png" alt="Horarios disponibles" />
      <h2>Alumnos registrados actualmente:</h2>
      {groups &&
        groups.length > 0 &&
        groups.map((group) => (
          <div key={group._id} className="registeredGroup">
            <h3>
              {group.name} ({group.students.length} alumnos)
            </h3>
            <ul>
              {group.students.sort().map((student, index) => (
                <li
                  key={index}
                  style={{
                    color: groups.some(
                      (g) => g.students.filter((s) => s === student).length > 1,
                    )
                      ? "red"
                      : "black",
                  }}
                >
                  {student}
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
}

export default App
