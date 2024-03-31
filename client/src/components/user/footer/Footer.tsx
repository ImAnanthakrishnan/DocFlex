import logo from "../../../assets/images/Screenshot (257).png";
import { RiLinkedinFill } from "react-icons/ri";
import {
  AiFillGoogleCircle,
  AiFillGithub,
  AiOutlineInstagram,
} from "react-icons/ai";
import { Link } from "react-router-dom";

const socialLinks = [
  {
    path: "mailto:ananthakrishhh2002@gmail.com",
    icon: <AiFillGoogleCircle className="group-hover:text-white w-4 h-5" />,
  },
  {
    path: "https://github.com/ImAnanthakrishnan",
    icon: <AiFillGithub className="group-hover:text-white w-4 h-5" />,
  },
  {
    path: "https://www.instagram.com/swag_zwa_gg_er",
    icon: <AiOutlineInstagram className="group-hover:text-white w-4 h-5" />,
  },
  {
    path: "https://www.linkedin.com/in/anantha-krishnan-s-82780b266/",
    icon: <RiLinkedinFill className="group-hover:text-white w-4 h-5" />,
  },
];

const quickLinks01 = [
  {
    path: "/home",
    display: "Home",
  },
  {
    path: "/",
    display: "About Us",
  },
  {
    path: "/services",
    display: "Services",
  },
  {
    path: "/",
    display: "Blog",
  },
];

const quickLinks02 = [
  {
    path: "/find-a-doctor",
    display: "Find a Doctor",
  },
  {
    path: "/",
    display: "Find a Location",
  },
  {
    path: "/",
    display: "Get a Opinion",
  },
];

const quickLinks03 = [
  {
    path: "/",
    display: "Donate",
  },
  {
    path: "/contact",
    display: "Contact Us",
  },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="pb-16 pt-10 border-t-2">
    <div className="container">
      <div className="flex justify-between flex-col md:flex-row flex-wrap gap-[30px]">
        <div>
          <img className="h-12 w-12" src={logo} alt="" />
          <p className="text-[16px] leading-7 font-[400] text-textColor mt-4">
            Copyright © {year} developed by Anantha krishnan all right reserved
          </p>

          <div className="flex items-center gap-3">
            {socialLinks.map((links, index) => (
              <Link
                to={links.path}
                key={index}
                className="w-9 h-9 border border-solid border-[#181A1E] rounded-full
              flex items-center justify-center group hover:bg-primaryColor hover:border-none"
              >
                {links.icon}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-[20px] leading-[30px] font-[700] mb-6 text-headingColor">
            Quick Links
          </h2>
          <ul>
            {quickLinks01.map((item, index) => (
              <li key={index} className="mb-4">
                <Link
                  to={item.path}
                  className="text-[16px] leading-7 font-[400] text-textColor"
                >
                  {item.display}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-[20px] leading-[30px] font-[700] mb-6 text-headingColor">
            I want to
          </h2>
          <ul>
            {quickLinks02.map((item, index) => (
              <li key={index} className="mb-4">
                <Link
                  to={item.path}
                  className="text-[16px] leading-7 font-[400] text-textColor"
                >
                  {item.display}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-[20px] leading-[30px] font-[700] mb-6 text-headingColor">
            Support
          </h2>
          <ul>
            {quickLinks03.map((item, index) => (
              <li key={index} className="mb-4">
                <Link
                  to={item.path}
                  className="text-[16px] leading-7 font-[400] text-textColor"
                >
                  {item.display}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  </footer>
  );
};

export default Footer;
