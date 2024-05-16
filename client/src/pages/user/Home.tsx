
import heroImage01 from "../../assets/images/hero-img01.png";
import heroImage02 from "../../assets/images/hero-img02.png";
import heroImage03 from "../../assets/images/hero-img03.png";
import icon01 from "../../assets/images/icon01.png";
import icon02 from "../../assets/images/icon02.png";
import icon03 from "../../assets/images/icon03.png";
import { Link, Navigate, useLocation, useNavigate,} from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import {  useAppSelector } from "../../app/hooks";
//import Testimonal from "../../components/user/Testimonal";



const Home = () => {

  const location = useLocation();

  let navigate = useNavigate();
  const {currentUser} = useAppSelector(state => state.user);
  if(currentUser && location.pathname === '/' ){
    return <Navigate to="/home" />
  }

  /*useEffect(() => {
    const userInfoString = localStorage.getItem("userInfo");
    if (userInfoString) {
      const userInfo = JSON.parse(userInfoString);
     if(userInfo){
      navigate('/chats');
     }
    }
  },[navigate])*/

  return (
    <>
      {/* ===== hero section ===== */}

      <section className="hero__section pt-[60px] 2xl:h-[800px]">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-[90px] items-center justify-between">
            {/* ===== hero content ===== */}
            <div>
              <div className="lg:w-[570px]">
                <h1 className="text-[36px] leading-[46px] text-headingColor font-[800] md:text-[60px] md:leading-[70px]">
                  We help patients live a healthy, longer life.
                </h1>
                <p className="text__para">
                  Our mission is to empower patients to lead healthy and
                  fulfilling lives, enabling them to thrive and enjoy every
                  moment. Through our comprehensive healthcare services, we
                  strive to extend longevity while ensuring quality of life.
                </p>
                <button className="btn" onClick={()=>navigate('/find-doctors')}>Request an Appointment</button>
              </div>

              {/* ===== hero counter ===== */}
              <div className="mt-[30px] lg:mt-[70px] flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-[30px]">
                <div>
                  <h2 className="text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor">
                    30+
                  </h2>
                  <span className="w-[100px] h-2 bg-yellowColor rounded-full block mt-[-14px]"></span>
                  <p className="text__para">Year of Experience</p>
                </div>
                <div>
                  <h2 className="text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor">
                    15+
                  </h2>
                  <span className="w-[100px] h-2 bg-purpleColor rounded-full block mt-[-14px]"></span>
                  <p className="text__para">Clinic Location</p>
                </div>
                <div>
                  <h2 className="text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor">
                    100%
                  </h2>
                  <span className="w-[100px] h-2 bg-irisBlueColor rounded-full block mt-[-14px]"></span>
                  <p className="text__para">Patient Satisfaction</p>
                </div>
              </div>
            </div>
            {/* ===== hero content ===== */}

            <div className="flex gap-[30px] justify-end">
              <div>
                <img className="w-full" src={heroImage01} alt="" />
              </div>
              <div className="mt-[30px]">
                <img className="w-full mb-[30px]" src={heroImage02} alt="" />
                <img className="w-full" src={heroImage03} alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== hero section ===== */}
      <section>
        <div className="container">
          <div className="lg:w-[470px] mx-auto">
            <h2 className="heading text-center">
              Providing the best medical services
            </h2>
            <p className="text__para text-center">
              World-class care for everyone. Our health System offers unmatched,
              expert health care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]">

            <div className="py-[30px] px-5">
              <div className="flex items-center justify-center">
                <img src={icon01} alt="" />
              </div>

              <div className="mt-[30px]">
                <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">
                  Find a Doctor
                </h2>
                <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center">
                  World-class care for everyone. Our health System offers 
                  unmatched, expert health care. From the lab to the clinic.
                </p>
                <Link to='/find-doctors' className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-30px mx-auto flex item-center justify-center group hover:bg-primaryColor hover:border-none">
                  <FaArrowRight className="group-hover:text-white w-6 h-6 mt-2"/>
                </Link>
              </div>
            </div>

            <div className="py-[30px] px-5">
              <div className="flex items-center justify-center">
                <img src={icon02} alt="" />
              </div>

              <div className="mt-[30px]">
                <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">
                  Find a Location
                </h2>
                <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center">
                  World-class care for everyone. Our health System offers 
                  unmatched, expert health care. From the lab to the clinic.
                </p>
                <Link to='/find-doctors' className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-30px mx-auto flex item-center justify-center group hover:bg-primaryColor hover:border-none">
                  <FaArrowRight className="group-hover:text-white w-6 h-6 mt-2"/>
                </Link>
              </div>
            </div>

            <div className="py-[30px] px-5">
              <div className="flex items-center justify-center">
                <img src={icon03} alt="" />
              </div>

              <div className="mt-[30px]">
                <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">
                  Book Appointment
                </h2>
                <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center">
                  World-class care for everyone. Our health System offers 
                  unmatched, expert health care. From the lab to the clinic.
                </p>
                <Link to='/find-doctors' className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-30px mx-auto flex item-center justify-center group hover:bg-primaryColor hover:border-none">
                  <FaArrowRight className="group-hover:text-white w-6 h-6 mt-2"/>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

       {/* ===== testimonial ===== */}
       <section>
        <div className="container">
          <div className="xl:w-[470px] mx-auto">
            <h2 className="heading text-center">What our patient say</h2>
            <p className="text__para text-center">
              World-class care for everyone. Our health System offers unmatched,
              expert health care.
            </p>
          </div>
         {/* <Testimonal />*/} 
        </div>
       </section>
    </>
  );
};

export default Home;
