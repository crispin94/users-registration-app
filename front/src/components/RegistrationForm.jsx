import axios from "axios";
import { useState } from "react";

export default function RegistrationForm({ onUserAdded }) {
    const [user, setUser] = useState({ name: '', email: '', age: '', phone: '', address: '' });
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!user.name) newErrors.name = 'Name is required';
        if (!user.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(user.email)) newErrors.email = 'Email is invalid';
        if (!user.age) newErrors.age = 'Age is required';
        else if (user.age && !/^\d+$/.test(user.age) || parseInt(user.age) <= 0) newErrors.age = 'Age must be a positive number';
        if (!user.phone) newErrors.phone = 'Phone is required';
        if (user.phone && !/^\d{10}$/.test(user.phone)) newErrors.phone = 'Phone must be 10 digits';
        else if (user.phone && !/^\d+$/.test(user.phone)) newErrors.phone = 'Phone must be a number';
        if (!user.address) newErrors.address = 'Address is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        await axios.post('http://localhost:3001/api/users', user);
        onUserAdded();
        setUser({ name: '', email: '', age: '', phone: '', address: '' });
        setErrors({});
    };

    return (
        <form className="card p-4 shadow-sm mt-4" onSubmit={handleSubmit}>
            <h3 className="mb-3">Registro de Usuarios</h3>
            <div className="mb-3">
                <label className="form-label">Nombre completo</label>
                <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
                <div className="invalid-feedback">{errors.name}</div>
            </div>
            <div className="mb-3">
                <label>Email</label>
                <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
                <div className="invalid-feedback">{errors.email}</div>
            </div>
            <div className="mb-3">
                <label>Edad</label>
                <input
                    type="text"
                    className={`form-control ${errors.age ? 'is-invalid' : ''}`}
                    value={user.age}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || (/^\d{1,2}$/.test(val) && +val >= 0)) {
                            setUser({ ...user, age: val });
                        }
                    }}
                    min="0"
                    max="99"
                    placeholder="Edad"
                />
                <div className="invalid-feedback">{errors.age}</div>
            </div>

            <div className="mb-3">
                <label>Teléfono</label>
                <input
                    type="text"
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                    value={user.phone}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d{0,10}$/.test(val)) {
                            setUser({ ...user, phone: val });
                        }
                    }}
                    placeholder="Teléfono (10 dígitos)"
                    inputMode="numeric"
                />
                <div className="invalid-feedback">{errors.phone}</div>
            </div>

            <div className="mb-3">
                <label>Dirección</label>
                <input
                    type="text"
                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                    value={user.address}
                    onChange={(e) => setUser({ ...user, address: e.target.value })}
                />
                <div className="invalid-feedback">{errors.address}</div>
            </div>
            <button className="btn btn-primary w-100" type="submit">Registrar</button>
        </form>
    )
}
