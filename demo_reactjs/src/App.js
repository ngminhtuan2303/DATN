import './App.scss';
import Header from './components/Header';
import TableUsers from './pages/UserPage/TableUsers';
import Container from 'react-bootstrap/Container';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import TableAdminUsers from './pages/AdminPage/AdminTable';
import TableSearchUsers from './pages/SearchPage/TableSearchUser';
import Blank from './components/Blank';
function App() {

  return (
    <>
      
      <div className='app-container'>
        <Container>
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Blank />}>
              <Route path="Login" element={<LoginPage />} />
              <Route index element={<TableSearchUsers/>}/>
            </Route>
            <Route element={<Header/>}>
              {/* <Route path="/" element={<Home />} /> */}
              <Route path="Users" element={<TableUsers/>}/>
              <Route path="Admin" element={<TableAdminUsers/>}/>
              
            </Route>
            
          </Routes>
        </BrowserRouter>
        </Container>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
