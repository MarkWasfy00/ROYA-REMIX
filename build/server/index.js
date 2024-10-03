import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, redirect } from "@remix-run/node";
import { RemixServer, useRouteLoaderData, useFetchers, useFetcher, useLoaderData, Link, Outlet, json, Meta, Links, ScrollRestoration, Scripts, redirect as redirect$1, useParams } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { parseWithZod } from "@conform-to/zod";
import { getHintUtils } from "@epic-web/client-hints";
import { invariant, invariantResponse } from "@epic-web/invariant";
import { clientHint } from "@epic-web/client-hints/color-scheme";
import { z } from "zod";
import * as cookie from "cookie";
import React, { useState } from "react";
import { IoMenu } from "react-icons/io5";
import { FaMoon, FaInstagram, FaFacebookF, FaLinkedin, FaPhoneAlt, FaExpandAlt } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { HiX } from "react-icons/hi";
import { RiArrowDropDownLine } from "react-icons/ri";
import { LuSun } from "react-icons/lu";
import { useForm, getFormProps } from "@conform-to/react";
import { TbDeviceLandlinePhone } from "react-icons/tb";
import { MdEmail, MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error2) {
          reject(error2);
        },
        onError(error2) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error2);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error2) {
          reject(error2);
        },
        onError(error2) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error2);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
function useRequestInfo() {
  const data = useRouteLoaderData("root");
  invariant(data == null ? void 0 : data.requestInfo, "No requestInfo found in root loader");
  return data.requestInfo;
}
function useHints() {
  const requestInfo = useRequestInfo();
  return requestInfo.hints;
}
const hintsUtils = getHintUtils({ theme: clientHint });
const { getHints } = hintsUtils;
function ClientHintCheck() {
  return /* @__PURE__ */ jsx(
    "script",
    {
      dangerouslySetInnerHTML: {
        __html: hintsUtils.getClientHintCheckScript()
      }
    }
  );
}
const ThemeFormSchema$1 = z.object({
  theme: z.enum(["system", "light", "dark"]),
  // this is useful for progressive enhancement
  redirectTo: z.string().optional()
});
function useTheme() {
  const hints = useHints();
  const requestInfo = useRequestInfo();
  const optimisticMode = useOptimisticThemeMode();
  if (optimisticMode) {
    return optimisticMode === "system" ? hints.theme : optimisticMode;
  }
  return requestInfo.userPrefs.theme ?? hints.theme;
}
function useOptimisticThemeMode() {
  const fetchers = useFetchers();
  const themeFetcher = fetchers.find(
    (f) => f.formAction === "/"
  );
  if (themeFetcher && themeFetcher.formData) {
    const submission = parseWithZod(themeFetcher.formData, {
      schema: ThemeFormSchema$1
    });
    if (submission.status === "success") {
      return submission.value.theme;
    }
  }
}
const cookieName = "en_theme";
function getTheme(request) {
  const cookieHeader = request.headers.get("cookie");
  const parsed = cookieHeader ? cookie.parse(cookieHeader)[cookieName] : "light";
  if (parsed === "light" || parsed === "dark") return parsed;
  return null;
}
function setTheme(theme) {
  if (theme === "system") {
    return cookie.serialize(cookieName, "", { path: "/", maxAge: -1 });
  } else {
    return cookie.serialize(cookieName, theme, { path: "/", maxAge: 31536e3 });
  }
}
class GeneralErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  // This lifecycle method is called when an error is thrown
  static getDerivedStateFromError(error2) {
    return { hasError: true };
  }
  // This lifecycle method can be used to log errors
  componentDidCatch(error2, errorInfo) {
    console.error("Error caught in GeneralErrorBoundary:", error2, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return /* @__PURE__ */ jsxs(Document, { theme: "light", children: [
        " ",
        /* @__PURE__ */ jsx("h1", { children: "Something went wrong." }),
        /* @__PURE__ */ jsx("p", { children: "We're sorry for the inconvenience. Please try again later." })
      ] });
    }
    return this.props.children;
  }
}
const header = "_header_131wp_1";
const navbar = "_navbar_131wp_6";
const logo$1 = "_logo_131wp_10";
const base = "_base_131wp_17";
const menu = "_menu_131wp_26";
const navigator = "_navigator_131wp_35";
const left = "_left_131wp_45";
const linker$1 = "_linker_131wp_51";
const dropmenuview = "_dropmenuview_131wp_62";
const drop = "_drop_131wp_62";
const dropitm = "_dropitm_131wp_75";
const mid = "_mid_131wp_83";
const social = "_social_131wp_95";
const icon$1 = "_icon_131wp_101";
const navmobile = "_navmobile_131wp_105";
const departmentsLink = "_departmentsLink_131wp_121";
const mobilelink = "_mobilelink_131wp_131";
const backshadow = "_backshadow_131wp_150";
const styles$8 = {
  header,
  navbar,
  logo: logo$1,
  base,
  menu,
  navigator,
  left,
  linker: linker$1,
  dropmenuview,
  drop,
  dropitm,
  mid,
  social,
  icon: icon$1,
  navmobile,
  departmentsLink,
  mobilelink,
  backshadow
};
const button = "_button_axfg0_1";
const mode$1 = "_mode_axfg0_10";
const light = "_light_axfg0_19";
const dark = "_dark_axfg0_24";
const styles$7 = {
  button,
  mode: mode$1,
  light,
  dark
};
let currentTheme = "light";
const Modes = () => {
  const fetcher = useFetcher();
  const resolvedTheme = useOptimisticThemeMode() || currentTheme;
  const [form] = useForm({ id: "theme-switch" });
  const [buttonState, setButtonState] = useState(resolvedTheme === "dark" ? "Light" : "Dark");
  const toggleMode = () => {
    const newMode = resolvedTheme === "dark" ? "light" : "dark";
    currentTheme = newMode;
    fetcher.submit(
      {
        theme: newMode
        // Send the newMode
      },
      {
        method: "post",
        action: "/"
        // Your action path in Remix
      }
    );
    setButtonState(newMode === "dark" ? "Light" : "Dark");
  };
  const buttonIcon = resolvedTheme === "light" ? /* @__PURE__ */ jsx(FaMoon, {}) : /* @__PURE__ */ jsx(LuSun, {});
  return /* @__PURE__ */ jsxs(fetcher.Form, { method: "POST", ...getFormProps(form), action: "/", children: [
    /* @__PURE__ */ jsx("input", { type: "hidden", name: "theme", value: resolvedTheme === "dark" ? "light" : "dark" }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `${styles$7.button} ${resolvedTheme === "light" ? styles$7.dark : styles$7.light}`,
        onClick: toggleMode,
        children: [
          /* @__PURE__ */ jsx("div", { className: styles$7.mode, children: buttonState }),
          " ",
          /* @__PURE__ */ jsx("div", { className: styles$7.icon, children: buttonIcon })
        ]
      }
    )
  ] });
};
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeparmentsOpen, setIsDeparmentsOpen] = useState(false);
  const headerData = useLoaderData();
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const toggleDeparments = () => {
    setIsDeparmentsOpen(!isDeparmentsOpen);
  };
  return /* @__PURE__ */ jsxs("header", { className: styles$8.header, children: [
    /* @__PURE__ */ jsxs("nav", { className: styles$8.navbar, children: [
      /* @__PURE__ */ jsx(Link, { to: "/", className: styles$8.logo, children: /* @__PURE__ */ jsx(
        "img",
        {
          src: "/svgs/white-logo.svg",
          width: 50,
          height: 50,
          alt: "Roya Technology logo"
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: styles$8.base, children: [
        /* @__PURE__ */ jsx("div", { className: styles$8.menu, onClick: toggleMenu, children: isOpen ? /* @__PURE__ */ jsx(HiX, {}) : /* @__PURE__ */ jsx(IoMenu, {}) }),
        /* @__PURE__ */ jsxs("div", { className: styles$8.navigator, children: [
          /* @__PURE__ */ jsxs("div", { className: styles$8.left, children: [
            /* @__PURE__ */ jsx(Link, { className: styles$8.linker, to: "/", children: "Home" }),
            /* @__PURE__ */ jsxs("div", { className: styles$8.dropmenuview, children: [
              /* @__PURE__ */ jsx("div", { className: styles$8.linker, onClick: () => setIsDeparmentsOpen(true), children: "Departments" }),
              isDeparmentsOpen ? /* @__PURE__ */ jsxs("div", { className: styles$8.drop, children: [
                headerData.categories.map(
                  (itm) => /* @__PURE__ */ jsx(Link, { onClick: () => setIsDeparmentsOpen(false), to: `/${itm.name}`, className: styles$8.dropitm, children: itm.name }, itm.id)
                ),
                /* @__PURE__ */ jsx(Link, { onClick: () => setIsDeparmentsOpen(false), to: `/all`, className: styles$8.dropitm, children: "All Departments" }, "all")
              ] }) : null
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: styles$8.mid, children: /* @__PURE__ */ jsx(Link, { to: "#footer", children: "Contact us" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: styles$8.social, children: [
          /* @__PURE__ */ jsx(Link, { to: headerData.contact.instagram_account, target: "_blank", "aria-label": "Instagram", className: styles$8.icon, children: /* @__PURE__ */ jsx(FaInstagram, {}) }),
          /* @__PURE__ */ jsx(Link, { to: headerData.contact.twitter_account, target: "_blank", "aria-label": "Twitter", className: styles$8.icon, children: /* @__PURE__ */ jsx(FaXTwitter, {}) }),
          /* @__PURE__ */ jsx(Link, { to: headerData.contact.facebook_account, target: "_blank", "aria-label": "Facebook", className: styles$8.icon, children: /* @__PURE__ */ jsx(FaFacebookF, {}) }),
          /* @__PURE__ */ jsx(Link, { to: headerData.contact.linkedin_account, target: "_blank", "aria-label": "Linkedin", className: styles$8.icon, children: /* @__PURE__ */ jsx(FaLinkedin, {}) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: styles$8.switch, children: /* @__PURE__ */ jsx(Modes, {}) })
      ] }),
      isOpen ? /* @__PURE__ */ jsxs("ul", { className: styles$8.navmobile, children: [
        /* @__PURE__ */ jsxs("li", { className: styles$8.mobilelink, children: [
          /* @__PURE__ */ jsx(Link, { to: "/", children: "Home" }),
          /* @__PURE__ */ jsx(RiArrowDropDownLine, {})
        ] }),
        /* @__PURE__ */ jsxs("li", { onClick: toggleDeparments, className: styles$8.mobilelink, children: [
          /* @__PURE__ */ jsx(Link, { to: "/", children: "Departments" }),
          /* @__PURE__ */ jsx(RiArrowDropDownLine, {})
        ] }),
        isDeparmentsOpen ? headerData.categories.map((itm) => /* @__PURE__ */ jsx(Link, { to: `/${itm.name}`, onClick: () => setIsOpen(false), className: styles$8.departmentsLink, children: itm.name }, itm.id)) : null,
        isDeparmentsOpen ? /* @__PURE__ */ jsx(Link, { to: `/all`, onClick: () => setIsOpen(false), className: styles$8.departmentsLink, children: "All Departments" }, "all") : null,
        /* @__PURE__ */ jsxs("li", { className: styles$8.mobilelink, children: [
          /* @__PURE__ */ jsx(Link, { to: "#footer", children: "Contact Us" }),
          /* @__PURE__ */ jsx(RiArrowDropDownLine, {})
        ] })
      ] }) : null
    ] }),
    isDeparmentsOpen ? /* @__PURE__ */ jsx("div", { className: styles$8.backshadow, onClick: () => setIsDeparmentsOpen(false) }) : null
  ] });
};
const footer = "_footer_8no81_1";
const info$1 = "_info_8no81_14";
const contact = "_contact_8no81_19";
const socialmedia = "_socialmedia_8no81_38";
const description$2 = "_description_8no81_47";
const logo = "_logo_8no81_52";
const styles$6 = {
  footer,
  info: info$1,
  contact,
  socialmedia,
  description: description$2,
  logo
};
const Footer = () => {
  const theme = useTheme();
  const footerData = useLoaderData();
  return /* @__PURE__ */ jsxs("footer", { className: styles$6.footer, id: "footer", children: [
    /* @__PURE__ */ jsxs("div", { className: styles$6.info, children: [
      /* @__PURE__ */ jsx("div", { className: styles$6.contact, children: /* @__PURE__ */ jsxs("p", { children: [
        /* @__PURE__ */ jsxs("a", { href: `tel:${footerData.contact.landline}`, children: [
          /* @__PURE__ */ jsx(TbDeviceLandlinePhone, {}),
          " ",
          footerData.contact.landline
        ] }),
        /* @__PURE__ */ jsxs("a", { href: `tel:${footerData.contact.mobile_number}`, children: [
          /* @__PURE__ */ jsx(FaPhoneAlt, {}),
          " ",
          footerData.contact.mobile_number
        ] }),
        /* @__PURE__ */ jsxs("a", { href: `mailto:${footerData.contact.email}`, children: [
          /* @__PURE__ */ jsx(MdEmail, {}),
          " ",
          footerData.contact.email
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: styles$6.socialmedia, children: [
        /* @__PURE__ */ jsx("a", { href: `${footerData.contact.instagram_account}`, target: "_blank", "aria-label": "Instagram", children: /* @__PURE__ */ jsx(FaInstagram, {}) }),
        /* @__PURE__ */ jsx("a", { href: `${footerData.contact.twitter_account}`, target: "_blank", "aria-label": "X (formerly Twitter)", children: /* @__PURE__ */ jsx(FaXTwitter, {}) }),
        /* @__PURE__ */ jsx("a", { href: `${footerData.contact.facebook_account}`, target: "_blank", "aria-label": "Facebook", children: /* @__PURE__ */ jsx(FaFacebookF, {}) }),
        /* @__PURE__ */ jsx("a", { href: `${footerData.contact.linkedin_account}`, target: "_blank", "aria-label": "LinkedIn", children: /* @__PURE__ */ jsx(FaLinkedin, {}) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: styles$6.description, children: /* @__PURE__ */ jsx("p", { children: "© 2024 Roya Technology. Specializing in Process Automation, Instrumentation, and Electrical solutions. Offering comprehensive services from design to project handover with expertise in EPC projects across Egypt." }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: styles$6.logo, children: /* @__PURE__ */ jsx("img", { width: 70, height: 85, src: `${theme === "dark" ? "/svgs/white-logo.svg" : "/svgs/black-logo.svg"}`, alt: "Roya technology logo" }) })
  ] });
};
const BACKEND_URL = "https://roya-technology.com";
const Server = {
  apiv1: `${BACKEND_URL}/api`,
  media: `${BACKEND_URL}`
};
async function loader$4({ request }) {
  const contact2 = await fetch(`${Server.apiv1}/contact`, { cache: "force-cache" });
  const categories = await fetch(`${Server.apiv1}/categories`, { cache: "force-cache" });
  const contactData = await contact2.json();
  const categoriesData = await categories.json();
  return json({
    requestInfo: {
      hints: getHints(request),
      userPrefs: {
        theme: getTheme(request)
      }
    },
    categories: categoriesData.categories,
    contact: contactData.contact[0]
  });
}
const ThemeFormSchema = z.object({
  theme: z.enum(["system", "light", "dark"])
});
const action = async ({ request }) => {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: ThemeFormSchema });
  invariantResponse(submission.status === "success", "Invalid theme received");
  const { theme } = submission.value;
  const responseInit = {
    headers: { "set-cookie": setTheme(theme) }
  };
  return json({ result: submission.reply() }, responseInit);
};
function Document({
  children,
  theme = "light"
}) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", className: theme, children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {}),
      /* @__PURE__ */ jsx(ClientHintCheck, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx(Header, {}),
      children,
      /* @__PURE__ */ jsx(Footer, {}),
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function App() {
  const theme = useTheme();
  return /* @__PURE__ */ jsx(Document, { theme, children: /* @__PURE__ */ jsx(Outlet, {}) });
}
function ErrorBoundary() {
  return /* @__PURE__ */ jsx(Document, { children: /* @__PURE__ */ jsx(GeneralErrorBoundary, { children: /* @__PURE__ */ jsx(Outlet, {}) }) });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Document,
  ErrorBoundary,
  action,
  default: App,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
const section$1 = "_section_9k5mz_1";
const cover = "_cover_9k5mz_13";
const blog = "_blog_9k5mz_20";
const title$3 = "_title_9k5mz_20";
const description$1 = "_description_9k5mz_24";
const styles$5 = {
  section: section$1,
  cover,
  blog,
  title: title$3,
  description: description$1
};
const loader$3 = async ({ request, params, context }) => {
  const { departments: departments2, blog: blog2 } = params;
  const response = await fetch(`${Server.apiv1}/project-id/${blog2}`, { cache: "force-cache" });
  const projects = await response.json();
  if (projects.status) {
    return redirect("/404");
  }
  return projects.project;
};
const meta$4 = ({ data }) => {
  const project = data;
  return [
    { title: project.name },
    { name: "description", content: project.description }
  ];
};
const Blog = ({ params }) => {
  const project = useLoaderData();
  return /* @__PURE__ */ jsxs("section", { className: styles$5.section, children: [
    /* @__PURE__ */ jsx("div", { className: styles$5.cover, children: /* @__PURE__ */ jsx("img", { src: `${Server.media}${project.image}`, alt: project.name, width: 900, height: 300 }) }),
    /* @__PURE__ */ jsxs("div", { className: styles$5.blog, children: [
      /* @__PURE__ */ jsx("div", { className: styles$5.title, children: project.name }),
      /* @__PURE__ */ jsx("div", { className: styles$5.description, children: /* @__PURE__ */ jsx(ReactMarkdown, { children: project.content }) })
    ] })
  ] });
};
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Blog,
  loader: loader$3,
  meta: meta$4
}, Symbol.toStringTag, { value: "Module" }));
const card = "_card_4kyzb_1";
const top = "_top_4kyzb_9";
const bot$1 = "_bot_4kyzb_12";
const title$2 = "_title_4kyzb_21";
const description = "_description_4kyzb_25";
const linker = "_linker_4kyzb_34";
const link$1 = "_link_4kyzb_34";
const styles$4 = {
  card,
  top,
  bot: bot$1,
  title: title$2,
  description,
  linker,
  link: link$1
};
const Card = ({ project }) => {
  return /* @__PURE__ */ jsxs("div", { className: styles$4.card, children: [
    /* @__PURE__ */ jsx("div", { className: styles$4.top, children: /* @__PURE__ */ jsx("img", { src: `${Server.media}${project.image}`, alt: project.name, width: 600, height: 300 }) }),
    /* @__PURE__ */ jsxs("div", { className: styles$4.bot, children: [
      /* @__PURE__ */ jsx("div", { className: styles$4.title, children: project.name }),
      /* @__PURE__ */ jsx("div", { className: styles$4.description, children: project.description }),
      /* @__PURE__ */ jsx(Link, { className: styles$4.linker, to: `/${project.category_name}/${project.id}`, children: /* @__PURE__ */ jsx("button", { className: styles$4.link, children: "VIEW" }) })
    ] })
  ] });
};
const departments$2 = "_departments_1b8ri_1";
const styles$3 = {
  departments: departments$2
};
const loader$2 = async ({ request, params, context }) => {
  const slug = params.departments;
  const response = await fetch(`${Server.apiv1}/projects/${slug}`, { cache: "force-cache" });
  const projects = await response.json();
  if (projects.status) {
    return redirect$1("/404");
  }
  return projects.projects;
};
const meta$3 = () => {
  const { departments: departments2 } = useParams();
  return [
    { title: departments2 },
    { name: "description", content: `${departments2} Professional solutions for Software Development, Hardware Design, Repair, and Upgrades, delivering expert services to optimize performance and meet your technology needs.` }
  ];
};
const departments$1 = () => {
  const projects = useLoaderData();
  return /* @__PURE__ */ jsx("section", { className: styles$3.departments, children: projects.map((project) => /* @__PURE__ */ jsx(Card, { project }, project.id)) });
};
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: departments$1,
  loader: loader$2,
  meta: meta$3
}, Symbol.toStringTag, { value: "Module" }));
const container$1 = "_container_8lmpl_1";
const title$1 = "_title_8lmpl_19";
const up = "_up_8lmpl_35";
const down = "_down_8lmpl_45";
const pattern = "_pattern_8lmpl_54";
const tickertape = "_tickertape_8lmpl_62";
const ticker = "_ticker_8lmpl_62";
const tickeritem = "_tickeritem_8lmpl_93";
const square = "_square_8lmpl_107";
const styles$2 = {
  container: container$1,
  "switch": "_switch_8lmpl_16",
  title: title$1,
  up,
  down,
  pattern,
  tickertape,
  ticker,
  tickeritem,
  square
};
const section = "_section_dhq87_2";
const swiperparent = "_swiperparent_dhq87_7";
const swiperbody = "_swiperbody_dhq87_13";
const head = "_head_dhq87_19";
const title = "_title_dhq87_24";
const info = "_info_dhq87_36";
const path = "_path_dhq87_45";
const link = "_link_dhq87_51";
const icon = "_icon_dhq87_56";
const bot = "_bot_dhq87_59";
const swipers = "_swipers_dhq87_65";
const prev = "_prev_dhq87_71";
const next = "_next_dhq87_72";
const styles$1 = {
  section,
  swiperparent,
  swiperbody,
  head,
  title,
  info,
  path,
  link,
  icon,
  bot,
  swipers,
  prev,
  next
};
const Slider = ({ slidesInfo }) => {
  const [swiperInstance, setSwiperInstance] = useState(null);
  return /* @__PURE__ */ jsxs("section", { className: styles$1.section, children: [
    /* @__PURE__ */ jsx(
      Swiper,
      {
        modules: [Autoplay],
        slidesPerView: "auto",
        autoplay: {
          delay: 3e3,
          disableOnInteraction: false
        },
        pagination: {
          clickable: false
        },
        speed: 800,
        onSwiper: (swiper) => setSwiperInstance(swiper),
        className: `${styles$1.swiperparent} mySwiper`,
        children: slidesInfo.map((itm) => /* @__PURE__ */ jsxs(SwiperSlide, { className: styles$1.swiperbody, style: { backgroundImage: `url(${Server.media}${itm.image})` }, children: [
          /* @__PURE__ */ jsxs("div", { className: styles$1.head, children: [
            /* @__PURE__ */ jsx("div", { className: styles$1.title, children: itm.name }),
            /* @__PURE__ */ jsx("div", { className: styles$1.info, children: itm.description }),
            /* @__PURE__ */ jsxs("div", { className: styles$1.path, children: [
              /* @__PURE__ */ jsx("div", { className: styles$1.link, children: /* @__PURE__ */ jsx(Link, { to: `/${itm.name}`, children: "SOLUTIONS" }) }),
              /* @__PURE__ */ jsx("div", { className: styles$1.icon, children: /* @__PURE__ */ jsx(MdKeyboardArrowRight, {}) })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: styles$1.bot, children: /* @__PURE__ */ jsx(FaExpandAlt, {}) })
        ] }, itm.id))
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: styles$1.swipers, children: [
      /* @__PURE__ */ jsx("div", { className: styles$1.prev, onClick: () => swiperInstance == null ? void 0 : swiperInstance.slidePrev(), children: /* @__PURE__ */ jsx(MdKeyboardArrowLeft, {}) }),
      /* @__PURE__ */ jsx("div", { className: styles$1.next, onClick: () => swiperInstance == null ? void 0 : swiperInstance.slideNext(), children: /* @__PURE__ */ jsx(MdKeyboardArrowRight, {}) })
    ] })
  ] });
};
const loader$1 = async () => {
  const response = await fetch(`${Server.apiv1}/categories`, { cache: "force-cache" });
  const category = await response.json();
  if (category.status) {
    return redirect$1("/404");
  }
  return json(category.categories);
};
const meta$2 = () => {
  return [
    { title: "Roya Technology" },
    { name: "description", content: "Roya Technology, an Egyptian LLC, specializes in Process Automation, Instrumentation, and Electrical solutions. We offer end-to-end automation services including design, engineering, testing, commissioning, and startup. With extensive experience in EPC projects, we manage everything from bidding to project handover, delivering professional solutions for clients and partners." }
  ];
};
function Index() {
  const data = useLoaderData();
  return /* @__PURE__ */ jsxs("main", { className: styles$2.container, children: [
    /* @__PURE__ */ jsxs("div", { className: styles$2.title, children: [
      /* @__PURE__ */ jsx("div", { className: styles$2.up, children: "roya" }),
      /* @__PURE__ */ jsx("div", { className: styles$2.down, children: "technology" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: styles$2.slider, children: /* @__PURE__ */ jsx(Slider, { slidesInfo: data }) }),
    /* @__PURE__ */ jsx("div", { className: styles$2.pattern, children: /* @__PURE__ */ jsx("img", { src: "/background/pattern.webp", alt: "Pattern" }) }),
    /* @__PURE__ */ jsx("div", { className: styles$2.tickertape, children: /* @__PURE__ */ jsxs("div", { className: styles$2.ticker, children: [
      /* @__PURE__ */ jsx("div", { className: styles$2.tickeritem, children: /* @__PURE__ */ jsx("img", { src: "/logos/1.png", alt: "" }) }),
      /* @__PURE__ */ jsx("div", { className: styles$2.tickeritem, children: /* @__PURE__ */ jsx("img", { src: "/logos/2.png", alt: "" }) }),
      /* @__PURE__ */ jsx("div", { className: styles$2.tickeritem, children: /* @__PURE__ */ jsx("img", { src: "/logos/3.png", alt: "" }) }),
      /* @__PURE__ */ jsx("div", { className: styles$2.tickeritem, children: /* @__PURE__ */ jsx("img", { src: "/logos/4.png", alt: "" }) }),
      /* @__PURE__ */ jsx("div", { className: styles$2.tickeritem, children: /* @__PURE__ */ jsx("img", { src: "/logos/5.png", alt: "" }) }),
      /* @__PURE__ */ jsx("div", { className: styles$2.tickeritem, children: /* @__PURE__ */ jsx("img", { src: "/logos/6.png", alt: "" }) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: styles$2.square })
  ] });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  loader: loader$1,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
const container = "_container_xjett_1";
const notfound = "_notfound_xjett_8";
const styles = {
  container,
  notfound
};
const meta$1 = () => {
  return [
    { title: "Page Not Found" },
    { name: "description", content: "Error 404" }
  ];
};
const error = () => {
  return /* @__PURE__ */ jsx("main", { className: styles.container, children: /* @__PURE__ */ jsx("section", { className: styles.notfound, children: "404 | Page Not Found" }) });
};
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: error,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
const loader = async ({ request, params, context }) => {
  params.departments;
  const response = await fetch(`${Server.apiv1}/project-all`, { cache: "force-cache" });
  const projects = await response.json();
  if (projects.status) {
    return redirect$1("/404");
  }
  return projects.projects;
};
const meta = () => {
  return [
    { title: "Expert Software Development, Hardware Design, Repair & Upgrade Services" },
    { name: "description", content: "At Roya Technology, we offer a wide range of services including Software Development, Hardware Design, Repair, and System Upgrades. Our expert team provides custom software solutions, innovative hardware designs, and reliable repair services to ensure optimal performance and seamless upgrades for all your technology needs." }
  ];
};
const departments = () => {
  useParams();
  const projects = useLoaderData();
  return /* @__PURE__ */ jsx("section", { className: styles$3.departments, children: projects.map((project) => /* @__PURE__ */ jsx(Card, { project }, project.id)) });
};
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: departments,
  loader,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-BIW1uDls.js", "imports": ["/assets/jsx-runtime-IdAWuXfe.js", "/assets/components-BQa44x4m.js"], "css": ["/assets/entry-1aBxUsCs.css"] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/root-ZhB7hOWl.js", "imports": ["/assets/jsx-runtime-IdAWuXfe.js", "/assets/components-BQa44x4m.js", "/assets/index-D0OXSROV.js"], "css": ["/assets/entry-1aBxUsCs.css", "/assets/root-BP0g2Xxf.css"] }, "routes/$departments_.$blog": { "id": "routes/$departments_.$blog", "parentId": "root", "path": ":departments/:blog", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_departments_._blog-BO62O6oM.js", "imports": ["/assets/jsx-runtime-IdAWuXfe.js", "/assets/server-DQ4YMZus.js", "/assets/components-BQa44x4m.js"], "css": ["/assets/_departments_-BiAQL__1.css"] }, "routes/$departments": { "id": "routes/$departments", "parentId": "root", "path": ":departments", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-Bm4SaUAQ.js", "imports": ["/assets/jsx-runtime-IdAWuXfe.js", "/assets/departments.module-n7XWWlj_.js", "/assets/components-BQa44x4m.js", "/assets/server-DQ4YMZus.js"], "css": ["/assets/departments-DKbxpmfW.css"] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-Do1NUaoS.js", "imports": ["/assets/jsx-runtime-IdAWuXfe.js", "/assets/index-D0OXSROV.js", "/assets/server-DQ4YMZus.js", "/assets/components-BQa44x4m.js"], "css": ["/assets/_index-BI54aAkO.css"] }, "routes/404": { "id": "routes/404", "parentId": "root", "path": "404", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/404-BmI0wb5Z.js", "imports": ["/assets/jsx-runtime-IdAWuXfe.js"], "css": ["/assets/404-jmy2S5q2.css"] }, "routes/all": { "id": "routes/all", "parentId": "root", "path": "all", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/all-Dn1v4HfS.js", "imports": ["/assets/jsx-runtime-IdAWuXfe.js", "/assets/departments.module-n7XWWlj_.js", "/assets/components-BQa44x4m.js", "/assets/server-DQ4YMZus.js"], "css": ["/assets/departments-DKbxpmfW.css"] } }, "url": "/assets/manifest-4dad23ec.js", "version": "4dad23ec" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "unstable_singleFetch": false, "unstable_lazyRouteDiscovery": false, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/$departments_.$blog": {
    id: "routes/$departments_.$blog",
    parentId: "root",
    path: ":departments/:blog",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/$departments": {
    id: "routes/$departments",
    parentId: "root",
    path: ":departments",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route3
  },
  "routes/404": {
    id: "routes/404",
    parentId: "root",
    path: "404",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/all": {
    id: "routes/all",
    parentId: "root",
    path: "all",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
