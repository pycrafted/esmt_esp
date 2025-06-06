import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import GSMForm from './components/gsm/GSMForm';
import HertzienForm from './components/hertzien/HertzienForm';
import OptiqueForm from './components/optique/OptiqueForm';
import UMTSForm from './components/umts/UMTSForm';
import Dashboard from './components/dashboard/Dashboard';
import Visualisation from './components/visualisation/Visualisation';

import './App.css';

const DashboardPage = () => <Dashboard />;
const GSM = () => <GSMForm />;
const UMTS = () => <UMTSForm />;
const Hertzien = () => <HertzienForm />;
const Optique = () => <OptiqueForm />;

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/gsm" element={<GSM />} />
          <Route path="/umts" element={<UMTS />} />
          <Route path="/hertzien" element={<Hertzien />} />
          <Route path="/optique" element={<Optique />} />
          <Route path="/visualisation" element={<Visualisation/>}/>
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
