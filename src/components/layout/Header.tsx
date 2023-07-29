import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../Context";

function Header() {
  const navigate = useNavigate();
  const { toggleTheme, isDarkMode } = useContext(Context);
  return (
    <div className="header">
      <div className="left">
        <div
          onClick={() => {
            navigate(`/blog/`);
          }}
        >
          Kane
        </div>
        <div onClick={toggleTheme}>{!isDarkMode ? "🌙" : "🔆"}</div>
      </div>

      <div
        className="right"
        onClick={() => {
          navigate(`/blog/posts/2022/12/about`);
        }}
      >
        About
      </div>

    </div>
  );
}

export default Header;
