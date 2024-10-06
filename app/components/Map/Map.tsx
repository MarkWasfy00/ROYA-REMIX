import { useTheme } from '~/routes/resources/theme-switch';
import styles from './Map.module.scss';

const Map = () => {
  const theme = useTheme()
  const greyScale = theme === "dark" ? "grayscale(100%)": "none";

  return (
    <iframe
      className={styles.iframe}
      id="gmap_canvas"
      src="https://maps.google.com/maps?q=Roya%20technology&t=&z=13&ie=UTF8&iwloc=&output=embed"
      title="Google Map"
      style={{ filter: greyScale }}
    />
  );
};

export default Map;
