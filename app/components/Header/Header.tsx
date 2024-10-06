import { useEffect, useState } from 'react';
import styles from './Header.module.scss'; // Import SCSS module
import { IoMenu } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { HiX } from "react-icons/hi";
import { RiArrowDropDownLine } from "react-icons/ri";
import { Link, useLoaderData } from '@remix-run/react';
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import Modes from '../Modes/Modes';
import { loader } from '~/root';

interface Category {
  name: string;
  projects: {
    id: number;
    name: string;
  }[]
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
  const [openedDepartment, setOpenedDepartment] = useState("")
  const headerData = useLoaderData<Header>()
  const data = useLoaderData<typeof loader>()

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDeparments = () => {
    setIsDeparmentsOpen(!isDeparmentsOpen)
  }

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('anti-scroll');
    } else {
      document.body.classList.remove('anti-scroll');
    }

    // Cleanup function to remove the class when the component unmounts
    return () => {
      document.body.classList.remove('anti-scroll');
    };
  }, [isOpen]); // Depend on isActive, so it runs when isActive changes



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
              <Link className={styles.home} to="/">ROYA TECHNOLOGY</Link>
              <div className={styles.dropmenuview}>
                <div className={styles.linker} onClick={() => setIsDeparmentsOpen(true)}>Departments <RiArrowDropDownLine /></div>
                {
                  isDeparmentsOpen ? (
                    <div className={styles.drop}>
                      {
                        headerData.categories.map(itm => (
                            <div onClick={() => setIsDeparmentsOpen(false)}  key={itm.name} className={styles.dropitm}>
                              <Link to={`/${itm.name}`} className={styles.sectionname}>{itm.name} <MdOutlineKeyboardArrowRight /></Link>
                              {
                                itm.projects.length ? (
                                  <div className={styles.sectionitems}>
                                    {
                                      itm.projects.map(project => (
                                        <Link to={`/${itm.name}/${project.id}`} key={project.id} className={styles.sectionitem}>{project.name}</Link>
                                      ))
                                    }
                                  </div>
                                ): null
                              }
                            </div>
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
            <Modes userPreference={data.requestInfo.userPrefs.theme} />
          </div>
        </div>
        
        {
          isOpen ? (
            <ul className={styles.navmobile}>
              <li className={styles.mobilelink} >
                <Link onClick={() => setIsOpen(false)} to={"/"} >Home</Link>
                <RiArrowDropDownLine />
                </li>
              <li onClick={toggleDeparments} className={styles.mobilelink} >
                <Link to={"/"} >Departments</Link>
                <RiArrowDropDownLine  />
              </li>
              {
                isDeparmentsOpen ? (
                  headerData.categories.map((itm) => (
                    <div key={itm.name}  onClick={() => setOpenedDepartment(openedDepartment === itm.name ? "" : itm.name)} className={styles.departmentsLink}>
                      <div className={styles.department}>{itm.name}</div>

                      { 
                        openedDepartment === itm.name &&  <div className={styles.departmentprojects}>
                          {
                            itm.projects.map(pro => (
                              <Link key={pro.name} to={`/${itm.name}/${pro.id}`} onClick={() => setIsOpen(false)} className={styles.departmentproject}>{pro.name}</Link>
                            ))
                          }
                          <Link key={`${itm.name}-all`} to={`/${itm.name}`} onClick={() => setIsOpen(false)} className={styles.departmentproject}>All {itm.name}</Link>
                        </div>
                      }
                    </div>
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
