import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BeerTable } from './BeerTable';
import { AuthPage } from './AuthPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BeerTable />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}

export default App;