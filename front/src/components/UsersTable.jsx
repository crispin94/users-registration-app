import { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

export default function UsersTable({ refresh, onUpdated }) {
  const [users, setUsers] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:3001/api/users')
      .then(response => {
        setTimeout(() => {
          setUsers(response.data);
          setLoading(false);
        }, 1000);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, [refresh]);

  const saveEdit = async (index) => {
    try {
      await axios.put(`http://localhost:3001/api/users/${index}`, editData);
      setEditingIndex(null);
      setMessage('Usuario actualizado correctamente');
      setTimeout(() => setMessage(''), 3000);
      if (onUpdated) onUpdated();
    } catch (error) {
      console.error('Error saving user:', error);
      setMessage('Error al actualizar el usuario');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async () => {
    if (userToDelete === null) return;
    try {
      await axios.delete(`http://localhost:3001/api/users/${userToDelete}`);
      setMessage('Usuario eliminado correctamente');
      setTimeout(() => setMessage(''), 3000);
      if (onUpdated) onUpdated();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      setMessage('Error al eliminar el usuario');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setShowConfirmModal(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="card mt-5 p-4 shadow-sm w-100">
      <h5>Usuarios Registrados</h5>

      {message && (
        <div className="alert alert-success mt-3" role="alert">
          {message}
        </div>
      )}

      {loading ? (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : (
        <table className="table table-bordered table-hover mt-3">
          <thead className="table-light">
            <tr>
              <th style={{ width: '15%' }}>Nombre</th>
              <th style={{ width: '20%' }}>Email</th>
              <th style={{ width: '5%' }}>Edad</th>
              <th style={{ width: '15%' }}>Teléfono</th>
              <th style={{ width: '25%' }}>Dirección</th>
              <th style={{ width: '20%' }} className='text-nowrap'>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={i} className={editingIndex === i ? 'table-warning' : ''}>
                <td>
                  {editingIndex === i ? (
                    <input
                      className="form-control"
                      value={editData.name || ''}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    />
                  ) : user.name}
                </td>
                <td>
                  {editingIndex === i ? (
                    <input
                      className="form-control"
                      value={editData.email || ''}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    />
                  ) : user.email}
                </td>
                <td>
                  {editingIndex === i ? (
                    <input
                      type="text"
                      className="form-control"
                      value={editData.age || ''}
                      onChange={(e) => setEditData({ ...editData, age: e.target.value })}
                    />
                  ) : user.age}
                </td>
                <td>
                  {editingIndex === i ? (
                    <input
                      className="form-control"
                      value={editData.phone || ''}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    />
                  ) : user.phone}
                </td>
                <td>
                  {editingIndex === i ? (
                    <input
                      className="form-control"
                      value={editData.address || ''}
                      onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                    />
                  ) : user.address}
                </td>
                <td>
                  {editingIndex === i ? (
                    <div className="d-flex gap-2">
                      <button className="btn btn-success btn-sm" onClick={() => saveEdit(i)}>
                        <i className="bi bi-check"></i> Guardar
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => setEditingIndex(null)}>
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => {
                          setEditingIndex(i);
                          setEditData(user);
                        }}
                      >
                        <i className="bi bi-pencil"></i> Editar
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          setUserToDelete(i);
                          setShowConfirmModal(true);
                        }
                        }
                      >
                        <i className="bi bi-trash"></i> Eliminar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/*aqui definimos el modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar a este usuario? Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>

  );
}
