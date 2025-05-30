import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import GSMForm from './components/gsm/GSMForm';
import HertzienForm from './components/hertzien/HertzienForm';
import './App.css';

const Dashboard = () => <div>Bienvenue sur le Dashboard</div>;
const GSM = () => <GSMForm />;
const UMTS = () => <div>Module UMTS (à implémenter)</div>;
const Hertzien = () => <HertzienForm />;
const Optique = () => <div>Module Bilan Optique (à implémenter)</div>;

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/gsm" element={<GSM />} />
          <Route path="/umts" element={<UMTS />} />
          <Route path="/hertzien" element={<Hertzien />} />
          <Route path="/optique" element={<Optique />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
