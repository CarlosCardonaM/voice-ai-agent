import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo/Logo';

function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1a1a1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div>
        <div style={{ marginBottom: '2rem' }}>
          <Logo size="xlarge" variant="light" />
        </div>
        <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
          Plataforma profesional de IA de voz
        </p>
        <button
          onClick={() => navigate('/setup')}
          style={{
            padding: '15px 30px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            borderRadius: '8px',
            backgroundColor: 'white',
            color: '#1976d2',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#f0f0f0';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'white';
            e.target.style.transform = 'scale(1)';
          }}
        >
          Comenzar Ahora
        </button>
      </div>
    </div>
  );
}

export default Landing;
