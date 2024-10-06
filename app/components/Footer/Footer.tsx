import styles from './Footer.module.scss'
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { TbDeviceLandlinePhone } from "react-icons/tb";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useTheme } from '~/routes/resources/theme-switch';
import { useLoaderData } from '@remix-run/react';
import Map from '../Map/Map';

interface Contact {
  landline: string;
  mobile_number: string;
  twitter_account: string;
  instagram_account: string;
  facebook_account: string;
  linkedin_account: string;
  email: string;
}

interface Footer {
  contact: Contact
}


const Footer= () => {
  const theme = useTheme()
  const footerData = useLoaderData<Footer>()

  return (
    <footer className={styles.footer} id='footer'>
        <div className={styles.info}>
        <div className={styles.contact}>
            <p>
                <a href={`tel:${footerData.contact.landline}`}><TbDeviceLandlinePhone /> {footerData.contact.landline}</a>
                <a href={`tel:${footerData.contact.mobile_number}`}><FaPhoneAlt /> {footerData.contact.mobile_number}</a>
                <a href={`mailto:${footerData.contact.email}`}><MdEmail /> {footerData.contact.email}</a>
            </p>
        </div>
        <div className={styles.socialmedia}>
            <a href={`${footerData.contact.instagram_account}`} target="_blank" aria-label="Instagram"><FaInstagram /></a>
            <a href={`${footerData.contact.twitter_account}`} target="_blank" aria-label="X (formerly Twitter)"><FaXTwitter /></a>
            <a href={`${footerData.contact.facebook_account}`} target="_blank" aria-label="Facebook"><FaFacebookF /></a>
            <a href={`${footerData.contact.linkedin_account}`} target="_blank" aria-label="LinkedIn"><FaLinkedin /></a>
        </div>
        <div className={styles.description}>
            <p>
            © 2024 Roya Technology. Specializing in Process Automation, Instrumentation, and Electrical solutions. Offering comprehensive services from design to project handover with expertise in EPC projects across Egypt.
            </p>
        </div>
        </div>
        <div className={styles.logo}>
            <img width={70} height={85} src={`${theme === "dark" ? "/svgs/white-logo.svg": "/svgs/black-logo.svg"}`} alt="Roya technology logo" />
        </div>
        <div className={styles.map}>
          <Map />
        </div>
    </footer>
  )
}

export default Footer