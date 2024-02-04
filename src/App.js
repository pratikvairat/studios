import "./App.css";
import { Route, Routes } from "react-router-dom";
import ChatsPage from "./pages/ChatsPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" Component={HomePage} />
        <Route path="/chats" Component={ChatsPage} />
      </Routes>
    </div>
  );
}

export default App;
