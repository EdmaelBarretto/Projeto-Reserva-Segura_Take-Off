import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* AuthProvider envolve o app inteiro para que qualquer página
        possa usar o useAuth() e ter acesso ao usuário logado */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
