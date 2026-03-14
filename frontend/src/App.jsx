import { Route, Routes } from 'react-router-dom'
import '../src/assets/style/App.css'
import NavBar from './components/NavBar'
import AddTask from './components/AddTask'
import List from './components/List'
import UpdateTask from './components/UpdateTask'
import Login from './components/Login'
import Signup from './components/signup'
import Protected from './components/Protected'

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Protected><List /></Protected>} />
        <Route path="/add" element={<Protected><AddTask /></Protected>} />
        <Route path="/update/:id" element={<Protected><UpdateTask /></Protected>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  )
}

export default App
