import './App.css';
import Navbar from "./components/Navbar.js"
import About from "./pages/About.js"
import Home from "./pages/Home.js"
import Login from "./pages/Login.js"
import Kviz from "./pages/Kviz.js"

function App() {
  let component
  switch(window.location.pathname){
    case "/":
      component = <Home />
      break
      case "/kviz":
        component = <Kviz />
        break
      case "/login":
        component = <Login />
        break
      case "/about":
        component = <About />
        break
  }
  return (
    <>
      <Navbar />
      <div className="container">{component}</div>
   </>
  );
}


export default App;
