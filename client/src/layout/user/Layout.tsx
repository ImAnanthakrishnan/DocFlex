import Header from '../../components/user/header/Header'
import Routers from '../../routes/user/Router'
import Footer from '../../components/user/footer/Footer'

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Routers />
      </main>
      <Footer />
    </>
  )
}

export default Layout
