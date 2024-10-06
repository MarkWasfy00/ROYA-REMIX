import styles from './Map.module.scss';

const Map = () => {

  return (
    <iframe
      className={styles.iframe}
      id="gmap_canvas"
      src="https://maps.google.com/maps?q=Roya%20technology&t=&z=13&ie=UTF8&iwloc=&output=embed"
      title="Google Map"
    />
  );
};

export default Map;
