import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './styles/index.css';
import './styles/navbar.css';
import './styles/post-card.css';
import './styles/create-post.css';
import './styles/auth.css';
import './styles/modal.css';
import './styles/feed.css';
import './styles/responsive.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
