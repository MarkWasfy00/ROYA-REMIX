import type {  MetaFunction } from "@remix-run/node";
import styles from "../styles/pages/index.module.scss"
import Slider from "~/components/Slider/Slider";
import { json, redirect, useLoaderData } from "@remix-run/react";
import { Server } from "~/utils/server";
import Recent from "~/components/Recent/Recent";


interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
}

interface Logos {
  id: number;
  name: string;
  image: string;
}

type Categories = {
  categories: Category[],
  logos: Logos[]
};




// Loader function runs on the server
export const loader = async () => {
  const response = await fetch(`${Server.apiv1}/categories`, { cache: "force-cache" })
  const sponser = await fetch(`${Server.apiv1}/logos`, { cache: "force-cache" })
  
  const category = await response.json()
  const sponsers = await sponser.json()

  if (category.status || sponsers.status) {
    return redirect("/404")
  }
  return json({ categories: category.categories, logos: sponsers.logos })
};


export const meta: MetaFunction = () => {
  return [
    { title: "Roya Technology" },
    { name: "description", content: "Roya Technology, an Egyptian LLC, specializes in Process Automation, Instrumentation, and Electrical solutions. We offer end-to-end automation services including design, engineering, testing, commissioning, and startup. With extensive experience in EPC projects, we manage everything from bidding to project handover, delivering professional solutions for clients and partners." },
  ];
};


export default function Index() {
  const data = useLoaderData<Categories>();

  return (
    <main className={styles.container}>
      
      {/* <div className={styles.switch}>
        <Modes /> 
      </div> */}
      {/* <div className={styles.title}>
        <div className={styles.up}>roya</div>
        <div className={styles.down}>technology</div>
      </div> */}
      <div className={styles.slider}>
        <Slider slidesInfo={data.categories} />
      </div>
      <div className={styles.pattern}>
        <img src={"/background/pattern.webp"} alt='Pattern' />
      </div>
      <div className={styles.tickertape}>
        <div className={styles.ticker}>
          {
            data.logos.map(sponser => (
              <div key={sponser.id} className={styles.tickeritem}>
                <img src={`${Server.media}${sponser.image}`} alt={sponser.name} />
              </div>
            ))
          }
        </div>
      </div>
      <div className={styles.recent}>
        <Recent />
      </div>
      <div className={styles.square}></div>
    </main>
  );
}

