import { BiMenu } from "react-icons/bi";
import logo from "../../../assets/images/Screenshot (257).png";

import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { signOut } from "../../../slices/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import axios from "axios";
import { BASE_URL } from "../../../config";
import { MdMessage } from "react-icons/md";



const Header = () => {
  const { currentUser, token } = useAppSelector((data) => data.user);

  const navLinks = [
    {
      path: currentUser ? "/home" : "/",
      display: "Home",
    },
    {
      path: "/find-doctors",
      display: "Find a Doctor",
    },
    {
      path: "/services",
      display: "Services",
    },
    {
      path: "/contact",
      display: "Contact",
    },
  ];

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const headerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [status, setStatus] = useState<boolean>(false);

  const handleStickyHeader = () => {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current?.classList.add("sticky__header");
      } else {
        headerRef.current?.classList.remove("sticky__header");
      }
    });
  };

  const authToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    handleStickyHeader();

    return () => window.removeEventListener("scroll", handleStickyHeader);
  });

  useEffect(() => {
    const blocked = async () => {
      await axios
        .get(
          `${BASE_URL}/auth/blocked/${"patient"}/${currentUser?._id}`,
          authToken
        )
        .then((res) => {
          const { is_blocked } = res.data;
          if (is_blocked) {
            setStatus(true);
          }
        })
        .catch((err) => {
          console.log(err?.response.data.message);
        });
    };
    blocked();
  }, []);

  if (status) {
    dispatch(signOut());
    navigate("/login");
  }

  const toggleMenu = () => menuRef.current?.classList.toggle("show__menu");

  return (
    <header className="header flex items-center" ref={headerRef}>
      <div className="container">
        <div className="flex items-center justify-between">
          {/* ===== logo ====== */}
          <div>
            <img src={logo} alt="" className="h-16 w-16" />
          </div>

          {/* ===== menu ====== */}
          <div className="navigation" ref={menuRef} onClick={toggleMenu}>
            <ul className="menu flex items-center gap-[2.7rem]">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.path}
                    className={(navClass) =>
                      navClass.isActive
                        ? "text-primaryColor text-[16px] leading-7 font-[600]"
                        : "text-primaryColor text-[16px] leading-7 font-[500] hover:text-primaryColor"
                    }
                  >
                    {link.display}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* ===== nav right ====== */}
          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="relative flex items-center gap-3 flex-row-reverse">
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    navigate("/profile/me");
                  }}
                >
                  <figure className="w-[35px] h-[35px] rounded-full">
                    <img
                      src={currentUser.photo}
                      className="w-full rounded-full"
                      alt=""
                    />
                  </figure>
                </div>
                <div>
                  <Link to='/chats' >
                  <MdMessage size={25} />
                  </Link>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <button className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]">
                  Login
                </button>
              </Link>
            )}

            <span className="md:hidden" onClick={toggleMenu}>
              <BiMenu className="w-6 h-6 cursor-pointer" />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
