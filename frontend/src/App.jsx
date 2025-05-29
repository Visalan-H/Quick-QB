import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Create from './pages/Create'
import SuggestionPortal from './pages/SuggestionPortal'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/suggestions" element={<SuggestionPortal />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
