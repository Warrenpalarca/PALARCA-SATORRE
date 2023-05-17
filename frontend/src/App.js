import { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

function App() {
  const [notes, setNotes] = useState(null);
  const [createForm, setCreateForm] = useState({
    title: ""
  });
  const [updateForm, setUpdateForm] = useState({
    _id: null,
    title: ""
  });
  const [isListVisible, setIsListVisible] = useState(true); // New state variable

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost:3000/notes");
      setNotes(res.data.notes);
    } catch (error) {
      console.log(error);
    }
  };

  const updateCreateFormField = (e) => {
    const { name, value } = e.target;
    setCreateForm({
      ...createForm,
      [name]: value
    });
  };

  const createNote = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/notes", createForm);
      setNotes([...notes, res.data.note]);
      setCreateForm({ title: "" });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteNote = async (_id) => {
    try {
      await axios.delete(`http://localhost:3000/notes/${_id}`);
      const newNotes = notes.filter((note) => note._id !== _id);
      setNotes(newNotes);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateFieldChange = (e) => {
    const { value, name } = e.target;
    setUpdateForm({
      ...updateForm,
      [name]: value
    });
  };

  const toggleUpdate = (note) => {
    setUpdateForm({
      title: note.title,
      _id: note._id
    });
  };

  const updateNote = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:3000/notes/${updateForm._id}`,
        { title: updateForm.title }
      );
      const newNotes = [...notes];
      const noteIndex = notes.findIndex((note) => note._id === updateForm._id);
      newNotes[noteIndex] = res.data.note;
      setNotes(newNotes);
      setUpdateForm({
        _id: null,
        title: ""
      });
    } catch (error) {
      console.log(error);
    }
  };

  const toggleListVisibility = () => {
    setIsListVisible(!isListVisible);
  };

  return (
    <div id="app" className="App">
        {updateForm._id ? (
          <div className="actionPanel">
            <form onSubmit={updateNote} className="actionForm">
              <h1 className="actionTitle">CLASS-007</h1>
              <div className="inputContainer">
                <input
                  onChange={handleUpdateFieldChange}
                  value={updateForm.title}
                  name="title"
                  className="inputField"
                  required
                />
              </div>
              <button type="submit" className="actionButton">
                UPDATE STUDENT DETAIL
              </button>
            </form>
          </div>
        ) : (
          <div className="actionPanel">
            <form onSubmit={createNote} className="actionForm">
              <h1 className="actionTitle">CLASS-007</h1>
              <div className="inputContainer">
                <input
                  placeholder="Add Item here:"
                  onChange={updateCreateFormField}
                  value={createForm.title}
                  name="title"
                  className="inputField"
                  required
                />
              </div>
              <button type="submit" className="actionButton">
                ADD STUDENT
              </button>
            </form>
          </div>
        )}
        <div className="listContainer">
          <h1 className="listTitle">
            OFFICIAL STUDENT LIST
            <button onClick={toggleListVisibility} id="hidelist">
              {isListVisible ? "Hide" : "Show"} List
            </button>
          </h1>
          {isListVisible && (
            <>
              {notes && notes.length > 0 ? (
                <table className="taskTable">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>STUDENT NAME</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notes.map((note, index) => (
                      <tr key={note._id}>
                        <td>{index + 1}</td>
                        <td>{note.title}</td>
                        <td>
                          <button
                            onClick={() => toggleUpdate(note)}
                            className="optionButton"
                          >
                            Update Detail
                          </button>
                          <button
                            onClick={() => deleteNote(note._id)}
                            className="optionButtondelete"
                          >
                            Delete Student
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="noNotes">Student list is empty</p>
              )}
            </>
          )}
        </div>
    </div>
  );
  

}

export default App;