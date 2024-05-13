import './style.css';

const Page404 = () => {
   
  return (
    <div>
    <header className="top-header">
    </header>

    {/* Dust particles */}
    <div>
      <div className="starsec"></div>
      <div className="starthird"></div>
      <div className="starfourth"></div>
      <div className="starfifth"></div>
    </div>
    {/* End Dust particles */}

    <div className="lamp__wrap">
      <div className="lamp">
        <div className="cable"></div>
        <div className="cover"></div>
        <div className="in-cover">
          <div className="bulb"></div>
        </div>
        <div className="light"></div>
      </div>
    </div>
    {/* END Lamp */}
    <section className="error">
      {/* Content */}
      <div className="error__content">
        <div className="error__message message">
          <h1 className="message__title text-secondary">Page Not Found</h1>
          <p className="message__text text-secondary">We're sorry, the page you were looking for isn't found here. The link you followed may either be broken or no longer exists. Please try again, or take a look at our.</p>
        </div>
        <div className="m-4">
          {/*<button onClick={() => navigate('https://codepen.io/uiswarup/full/yLzypyY')} className="border border-warning px-5 py-2 text-warning">GO BACK</button>*/}
        </div>
      </div>
      {/* END Content */}
    </section>
  </div>
  )
}

export default Page404
