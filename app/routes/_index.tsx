import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import styles from "../styles/pages/index.module.scss"
import Slider from "~/components/Slider/Slider";
import { json, redirect, useLoaderData } from "@remix-run/react";
import { getCategories } from "~/utils/api";
import Modes from "~/components/Modes/Modes";
import { Server } from "~/utils/server";


interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
}

interface CategoriesContent {
  categories: {
    id: number;
    name: string;
    description: string;
    image: string;
  }[],
  status?: string;
}

type Categories = Category[];




// Loader function runs on the server
export const loader = async () => {
  const response = await fetch(`${Server.apiv1}/categories`, { cache: "force-cache" })
  const category: CategoriesContent = await response.json()

  if (category.status) {
    return redirect("/404")
  }

  return json(category.categories)
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
      <div className={styles.title}>
        <div className={styles.up}>roya</div>
        <div className={styles.down}>technology</div>
      </div>
      <div className={styles.slider}>
        <Slider slidesInfo={data} />
      </div>
      <div className={styles.pattern}>
        <img src={"/background/pattern.webp"} alt='Pattern' />
      </div>
      <div className={styles.tickertape}>
        <div className={styles.ticker}>
          <div className={styles.tickeritem}>
            <img src="/logos/1.png" alt="" />
          </div>
          <div className={styles.tickeritem}>
            <img src="/logos/2.png" alt="" />
          </div>
          <div className={styles.tickeritem}>
            <img src="/logos/3.png" alt="" />
          </div>
          <div className={styles.tickeritem}>
            <img src="/logos/4.png" alt="" />
          </div>
          <div className={styles.tickeritem}>
            <img src="/logos/5.png" alt="" />
          </div>
          <div className={styles.tickeritem}>
            <img src="/logos/6.png" alt="" />
          </div>
        </div>
      </div>
      <div className={styles.square}></div>
    </main>
  );
}

