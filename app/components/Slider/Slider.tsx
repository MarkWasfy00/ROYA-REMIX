import styles from "./Slider.module.scss"
import { Swiper, SwiperSlide } from 'swiper/react';
import {  Autoplay } from 'swiper/modules';
import 'swiper/scss';
import 'swiper/scss/zoom';
import { Link } from '@remix-run/react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { FaExpandAlt } from "react-icons/fa";
import { useState } from 'react';
import { Swiper as SwiperType } from 'swiper';
import { Server } from "../../utils/server"


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

  return (
    <section className={styles.section}>
      <Swiper
          modules={[Autoplay]}
          slidesPerView={"auto"}
          // centeredSlides={true}
          // spaceBetween={20}
          // zoom={{ maxRatio: 2 }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: false,
          }}
          speed={800}
          onSwiper={(swiper) => setSwiperInstance(swiper)}
          className={`${styles.swiperparent} mySwiper`}
      >
        {
          slidesInfo.map(itm => (
            <SwiperSlide key={itm.id} className={styles.swiperbody} style={{ backgroundImage: `url(${Server.media}${itm.image})` }} >
              <div className={styles.head}>
                <div className={styles.title}>{itm.name}</div>
                <div className={styles.info}>{itm.description}</div>
                <div className={styles.path}>
                  <div className={styles.link}>
                    <Link to={`/${itm.name}`}>SOLUTIONS</Link>
                  </div>
                  <div className={styles.icon}>
                    <MdKeyboardArrowRight />
                  </div>
                </div>
              </div>
              <div className={styles.bot}>
                <FaExpandAlt />
              </div>
            </SwiperSlide>
          ))
        }
      </Swiper>

      <div className={styles.swipers}>
        <div className={styles.prev} onClick={() => swiperInstance?.slidePrev()}><MdKeyboardArrowLeft /></div>
        <div className={styles.next} onClick={() => swiperInstance?.slideNext()}><MdKeyboardArrowRight /></div>
      </div>
    </section>
  );
}

export default Slider;
