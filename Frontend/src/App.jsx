import { AuthProvider } from './contexts/AuthContext.jsx'
import Authentication from './pages/Authentication.jsx'
import LandingPage from './pages/LandingPage.jsx'
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom'
import VideoMeetComponent from './pages/VideoMeet.jsx'
import HomeComponent from './pages/home.jsx'

function App() {
  
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<LandingPage/>} />
            <Route path='/auth' element = {<Authentication/>} />
            <Route path='/home' element={<HomeComponent/>}/>
            <Route path='/:url' element= {<VideoMeetComponent/>}/>
          </Routes>
        </AuthProvider>
      </Router>
    </>
  )
}

export default App
