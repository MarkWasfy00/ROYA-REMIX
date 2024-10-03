import { useState } from 'react';
import styles from './Header.module.scss'; // Import SCSS module
import { IoMenu } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { HiX } from "react-icons/hi";
import { RiArrowDropDownLine } from "react-icons/ri";
import { Link, useLoaderData } from '@remix-run/react';
import { Server } from '~/utils/server';
import Modes from '../Modes/Modes';

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
}

interface Contact {
  landline: string;
  mobile_number: string;
  twitter_account: string;
  instagram_account: string;
  facebook_account: string;
  linkedin_account: string;
  email: string;
}

interface Header {
  categories: Category[],
  contact: Contact
}





const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeparmentsOpen, setIsDeparmentsOpen] = useState(false);
  const headerData = useLoaderData<Header>()


  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDeparments = () => {
    setIsDeparmentsOpen(!isDeparmentsOpen)
  }

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <Link to="/" className={styles.logo}>
          <img
            src="/svgs/white-logo.svg"
            width={50}
            height={50}
            alt="Roya Technology logo"
          />
        </Link>
        <div className={styles.base}>
          <div className={styles.menu} onClick={toggleMenu}>
             { isOpen ? <HiX /> : <IoMenu /> }
          </div>
          <div className={styles.navigator}>
            <div className={styles.left}>
              <Link className={styles.linker} to="/">Home</Link>
              <div className={styles.dropmenuview}>
                <div className={styles.linker} onClick={() => setIsDeparmentsOpen(true)}>Departments</div>
                {
                  isDeparmentsOpen ? (
                    <div className={styles.drop}>
                      {
                        headerData.categories.map(itm => (
                            <Link onClick={() => setIsDeparmentsOpen(false)} to={`/${itm.name}`} key={itm.id} className={styles.dropitm}>{itm.name}</Link>
                          )
                        )
                      }
                      <Link onClick={() => setIsDeparmentsOpen(false)} to={`/all`} key={"all"} className={styles.dropitm}>All Departments</Link>
                    </div>
                  ): null
                }
              </div>
            </div>
            <div className={styles.mid}>
              <Link to="#footer">Contact us</Link>
            </div>
          </div>
          <div className={styles.social}>
            <Link to={headerData.contact.instagram_account} target='_blank' aria-label="Instagram" className={styles.icon}><FaInstagram /></Link>
            <Link to={headerData.contact.twitter_account} target='_blank' aria-label="Twitter" className={styles.icon}><FaXTwitter /></Link>
            <Link to={headerData.contact.facebook_account} target='_blank' aria-label="Facebook" className={styles.icon}><FaFacebookF /></Link>
            <Link to={headerData.contact.linkedin_account} target='_blank' aria-label="Linkedin" className={styles.icon}><FaLinkedin /></Link>
          </div>
          <div className={styles.switch}>
            <Modes /> 
          </div>
        </div>
        
        {
          isOpen ? (
            <ul className={styles.navmobile}>
              <li className={styles.mobilelink} >
                <Link to={"/"} >Home</Link>
                <RiArrowDropDownLine />
                </li>
              <li onClick={toggleDeparments} className={styles.mobilelink} >
                <Link to={"/"} >Departments</Link>
                <RiArrowDropDownLine  />
              </li>
              {
                isDeparmentsOpen ? (
                  headerData.categories.map(itm => (
                    <Link key={itm.id} to={`/${itm.name}`} onClick={() => setIsOpen(false)} className={styles.departmentsLink}>{itm.name}</Link>
                  ))
                ): null
              }
              {
                isDeparmentsOpen ? (
                  <Link key={"all"} to={`/all`} onClick={() => setIsOpen(false)} className={styles.departmentsLink}>All Departments</Link>
                ) : null
              }
              <li className={styles.mobilelink} >
                <Link to={"#footer"} >Contact Us</Link>
                <RiArrowDropDownLine />
              </li>
            </ul>
          ) : null
        }
      </nav>
      {
        isDeparmentsOpen ? <div className={styles.backshadow} onClick={() => setIsDeparmentsOpen(false)}></div> : null
      }
    </header>
  );
};

export default Header;
