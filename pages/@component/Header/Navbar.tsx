import Container from "../Container"
import Logo from "./Logo"
import Search from "./Search"
import styles from "./Navbar.module.css"
import UserMenu from "./UserMenu"

const Navbar = () => {
  return (
    <div className={styles.navbarWrapper}>
      <Container>
        <div className={styles.navbarMenu}>
          <Logo />
          <Search />
          <UserMenu />
        </div>
      </Container>
    </div>
  )
}

export default Navbar
