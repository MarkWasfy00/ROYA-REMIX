import styles from "./Slider.module.scss";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { Link } from '@remix-run/react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useState, useEffect, useRef } from 'react';
import { Swiper as SwiperType } from 'swiper';
import { Server } from "../../utils/server"; 

import 'swiper/scss';

interface Slide {
  id: number;
  name: string;
  description: string;
  image: string;
}

interface SliderProps {
  slidesInfo: Slide[];
}

const Slider: React.FC<SliderProps> = ({ slidesInfo }) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0); // Track the active index

  const swiperRef = useRef<HTMLDivElement>(null); // Ref to the swiper container

  // Handle hover to stop autoplay
  const handleMouseEnter = () => {
    if (swiperInstance && swiperInstance.autoplay) {
      swiperInstance.autoplay.stop(); // Stop autoplay
    }
  };

  // Handle mouse leave to resume autoplay
  const handleMouseLeave = () => {
    if (swiperInstance && swiperInstance.autoplay) {
      swiperInstance.autoplay.start(); // Resume autoplay
    }
  };

  
  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex); // Update activeIndex on slide change
  };

  // Attach hover event listeners to the Swiper wrapper on mount
  useEffect(() => {
    const swiperEl = swiperRef.current;

    if (swiperEl) {
      swiperEl.addEventListener("mouseenter", handleMouseEnter);
      swiperEl.addEventListener("mouseleave", handleMouseLeave);
    }

    // Clean up the event listeners when component unmounts
    return () => {
      if (swiperEl) {
        swiperEl.removeEventListener("mouseenter", handleMouseEnter);
        swiperEl.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [swiperInstance]);

  return (
    <section className={styles.section}>
      <div ref={swiperRef}> {/* Add ref to the wrapper */}
        <Swiper
          modules={[Autoplay]}
          slidesPerView={"auto"}
          spaceBetween={20}
          centeredSlides={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false, // Ensures interaction doesn't permanently disable autoplay
          }}
          speed={800}
          onSwiper={(swiper) => setSwiperInstance(swiper)}
          onSlideChange={(swiper) => handleSlideChange(swiper)}
          
          className={`${styles.swiperparent} mySwiper`}
        >
          {slidesInfo.map((itm, idx) => (
            <SwiperSlide key={itm.id} className={`${styles.swiperbody} ${idx === activeIndex ? styles.activeswiper: ""}`}>
              <div className={styles.image} style={{ backgroundImage: `url(${Server.media}${itm.image})` }} ></div>
              <div className={styles.content}>
                <div className={styles.head}>
                  <div className={styles.title}>{itm.name}</div>
                  <div className={styles.info}>{itm.description}</div>
                  <div className={styles.path}>
                    <div className={styles.link}>
                      <Link to={`/${itm.name}`}>SOLUTIONS</Link>
                    </div>
                    <div className={styles.icon}> <MdKeyboardArrowRight /> </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className={styles.swipers}>
        <div className={styles.prev} onClick={() => swiperInstance?.slidePrev()}>
          <MdKeyboardArrowLeft />
        </div>
        <div className={styles.next} onClick={() => swiperInstance?.slideNext()}>
          <MdKeyboardArrowRight />
        </div>
      </div>
    </section>
  );
};

export default Slider;
