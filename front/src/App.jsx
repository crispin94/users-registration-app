import { useState } from 'react';
import RegistrationForm from './components/RegistrationForm';
import UsersTable from './components/UsersTable';

function App() {
  const [refresh, setRefresh] = useState(false);
  const reloadUsers = () => setRefresh(!refresh);

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center py-4">

      <div className="w-100" style={{ maxWidth: '1200px' }}>
        <div style={{ 
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <RegistrationForm onUserAdded={reloadUsers} />
        </div>
        <UsersTable refresh={refresh} onUpdated={reloadUsers} />

      </div>
    </div>
  );
}

export default App;