import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, redirect as redirect$1 } from "@remix-run/node";
import { RemixServer, useRouteLoaderData, useRevalidator, useFetchers, useFetcher, useLoaderData, Link, Outlet, json, redirect, Meta, Links, ScrollRestoration, Scripts, useParams } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { parseWithZod } from "@conform-to/zod";
import { getHintUtils } from "@epic-web/client-hints";
import { invariant, invariantResponse } from "@epic-web/invariant";
import { clientHint, subscribeToSchemeChange } from "@epic-web/client-hints/color-scheme";
import React, { useEffect, useState, useRef } from "react";
import { z } from "zod";
import * as cookie from "cookie";
import { IoMenu } from "react-icons/io5";
import { FaMoon, FaInstagram, FaFacebookF, FaLinkedin, FaPhoneAlt } from "react-icons/fa";
import { FaXTwitter, FaNewspaper } from "react-icons/fa6";
import { HiX } from "react-icons/hi";
import { RiArrowDropDownLine, RiArrowDropRightLine } from "react-icons/ri";
import { MdOutlineKeyboardArrowRight, MdEmail, MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { LuSun } from "react-icons/lu";
import { useForm, getFormProps } from "@conform-to/react";
import { ServerOnly } from "remix-utils/server-only";
import { TbDeviceLandlinePhone } from "react-icons/tb";
import ReactMarkdown from "react-markdown";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Ticker from "@andremov/react-ticker";
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
  const { revalidate } = useRevalidator();
  useEffect(
    () => subscribeToSchemeChange(() => revalidate()),
    [revalidate]
  );
  return /* @__PURE__ */ jsx(
    "script",
    {
      dangerouslySetInnerHTML: {
        __html: hintsUtils.getClientHintCheckScript()
      }
    }
  );
}
const ThemeFormSchema = z.object({
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
      schema: ThemeFormSchema
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
const header = "_header_1sgaa_1";
const navbar = "_navbar_1sgaa_6";
const logo$1 = "_logo_1sgaa_12";
const base = "_base_1sgaa_19";
const menu = "_menu_1sgaa_28";
const navigator = "_navigator_1sgaa_37";
const left = "_left_1sgaa_48";
const home = "_home_1sgaa_54";
const linker$1 = "_linker_1sgaa_63";
const dropmenuview = "_dropmenuview_1sgaa_78";
const drop = "_drop_1sgaa_78";
const dropitm = "_dropitm_1sgaa_89";
const sectionitems = "_sectionitems_1sgaa_99";
const sectionname = "_sectionname_1sgaa_102";
const sectionitem = "_sectionitem_1sgaa_99";
const mid = "_mid_1sgaa_131";
const social = "_social_1sgaa_143";
const icon$2 = "_icon_1sgaa_149";
const navmobile = "_navmobile_1sgaa_153";
const departmentsLink = "_departmentsLink_1sgaa_166";
const department = "_department_1sgaa_166";
const departmentprojects = "_departmentprojects_1sgaa_186";
const departmentproject = "_departmentproject_1sgaa_186";
const mobilelink = "_mobilelink_1sgaa_198";
const backshadow = "_backshadow_1sgaa_217";
const styles$9 = {
  header,
  navbar,
  logo: logo$1,
  base,
  menu,
  navigator,
  left,
  home,
  linker: linker$1,
  dropmenuview,
  drop,
  dropitm,
  sectionitems,
  sectionname,
  sectionitem,
  mid,
  social,
  icon: icon$2,
  navmobile,
  departmentsLink,
  department,
  departmentprojects,
  departmentproject,
  mobilelink,
  backshadow
};
const button = "_button_1w0de_1";
const mode$1 = "_mode_1w0de_16";
const icon$1 = "_icon_1w0de_25";
const styles$8 = {
  button,
  mode: mode$1,
  icon: icon$1
};
const Modes = ({
  userPreference
}) => {
  var _a;
  const fetcher = useFetcher();
  const requestInfo = useRequestInfo();
  const optimisticMode = useOptimisticThemeMode();
  const mode2 = optimisticMode ?? userPreference;
  const nextMode = mode2 === "dark" ? "light" : mode2 === "light" ? "dark" : "light";
  const [form] = useForm({
    id: "theme-switch",
    lastResult: (_a = fetcher.data) == null ? void 0 : _a.result
  });
  return /* @__PURE__ */ jsxs(fetcher.Form, { method: "POST", ...getFormProps(form), action: "/", children: [
    /* @__PURE__ */ jsx(ServerOnly, { children: () => /* @__PURE__ */ jsx("input", { type: "hidden", name: "redirectTo", value: requestInfo.path }) }),
    /* @__PURE__ */ jsx("input", { type: "hidden", name: "theme", value: nextMode }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        className: `${styles$8.button}`,
        type: "submit",
        children: [
          /* @__PURE__ */ jsx("div", { className: styles$8.mode, children: mode2 === "light" ? "Dark" : "Light" }),
          " ",
          /* @__PURE__ */ jsx("div", { className: styles$8.icon, children: mode2 === "light" ? /* @__PURE__ */ jsx(FaMoon, {}) : /* @__PURE__ */ jsx(LuSun, {}) })
        ]
      }
    )
  ] });
};
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeparmentsOpen, setIsDeparmentsOpen] = useState(false);
  const [openedDepartment, setOpenedDepartment] = useState("");
  const headerData = useLoaderData();
  const data = useLoaderData();
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const toggleDeparments = () => {
    setIsDeparmentsOpen(!isDeparmentsOpen);
  };
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("anti-scroll");
    } else {
      document.body.classList.remove("anti-scroll");
    }
    return () => {
      document.body.classList.remove("anti-scroll");
    };
  }, [isOpen]);
  return /* @__PURE__ */ jsxs("header", { className: styles$9.header, children: [
    /* @__PURE__ */ jsxs("nav", { className: styles$9.navbar, children: [
      /* @__PURE__ */ jsx(Link, { to: "/", className: styles$9.logo, children: /* @__PURE__ */ jsx(
        "img",
        {
          src: "/svgs/white-logo.svg",
          width: 50,
          height: 50,
          alt: "Roya Technology logo"
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: styles$9.base, children: [
        /* @__PURE__ */ jsx("div", { className: styles$9.menu, onClick: toggleMenu, children: isOpen ? /* @__PURE__ */ jsx(HiX, {}) : /* @__PURE__ */ jsx(IoMenu, {}) }),
        /* @__PURE__ */ jsxs("div", { className: styles$9.navigator, children: [
          /* @__PURE__ */ jsxs("div", { className: styles$9.left, children: [
            /* @__PURE__ */ jsx(Link, { className: styles$9.home, to: "/", children: "ROYA TECHNOLOGY" }),
            /* @__PURE__ */ jsxs("div", { className: styles$9.dropmenuview, children: [
              /* @__PURE__ */ jsxs("div", { className: styles$9.linker, onClick: () => setIsDeparmentsOpen(true), children: [
                "Sections ",
                /* @__PURE__ */ jsx(RiArrowDropDownLine, {})
              ] }),
              isDeparmentsOpen ? /* @__PURE__ */ jsxs("div", { className: styles$9.drop, children: [
                headerData.categories.map(
                  (itm) => /* @__PURE__ */ jsxs("div", { onClick: () => setIsDeparmentsOpen(false), className: styles$9.dropitm, children: [
                    /* @__PURE__ */ jsxs(Link, { to: `/${itm.name}`, className: styles$9.sectionname, children: [
                      itm.name,
                      " ",
                      /* @__PURE__ */ jsx(MdOutlineKeyboardArrowRight, {})
                    ] }),
                    itm.projects.length ? /* @__PURE__ */ jsx("div", { className: styles$9.sectionitems, children: itm.projects.map((project) => /* @__PURE__ */ jsxs(Link, { to: `/${itm.name}/${project.id}`, className: styles$9.sectionitem, children: [
                      project.name,
                      " "
                    ] }, project.id)) }) : null
                  ] }, itm.name)
                ),
                /* @__PURE__ */ jsx(Link, { onClick: () => setIsDeparmentsOpen(false), to: `/all`, className: styles$9.dropitm, children: "All Sections" }, "all")
              ] }) : null
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: styles$9.mid, children: /* @__PURE__ */ jsx(Link, { to: "#footer", children: "Contact us" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: styles$9.social, children: [
          /* @__PURE__ */ jsx(Link, { to: headerData.contact.instagram_account, target: "_blank", "aria-label": "Instagram", className: styles$9.icon, children: /* @__PURE__ */ jsx(FaInstagram, {}) }),
          /* @__PURE__ */ jsx(Link, { to: headerData.contact.twitter_account, target: "_blank", "aria-label": "Twitter", className: styles$9.icon, children: /* @__PURE__ */ jsx(FaXTwitter, {}) }),
          /* @__PURE__ */ jsx(Link, { to: headerData.contact.facebook_account, target: "_blank", "aria-label": "Facebook", className: styles$9.icon, children: /* @__PURE__ */ jsx(FaFacebookF, {}) }),
          /* @__PURE__ */ jsx(Link, { to: headerData.contact.linkedin_account, target: "_blank", "aria-label": "Linkedin", className: styles$9.icon, children: /* @__PURE__ */ jsx(FaLinkedin, {}) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: styles$9.switch, children: /* @__PURE__ */ jsx(Modes, { userPreference: data.requestInfo.userPrefs.theme }) })
      ] }),
      isOpen ? /* @__PURE__ */ jsxs("ul", { className: styles$9.navmobile, children: [
        /* @__PURE__ */ jsxs("li", { className: styles$9.mobilelink, children: [
          /* @__PURE__ */ jsx(Link, { onClick: () => setIsOpen(false), to: "/", children: "Home" }),
          /* @__PURE__ */ jsx(RiArrowDropDownLine, {})
        ] }),
        /* @__PURE__ */ jsxs("li", { onClick: toggleDeparments, className: styles$9.mobilelink, children: [
          /* @__PURE__ */ jsx(Link, { to: "/", children: "Sections" }),
          /* @__PURE__ */ jsx(RiArrowDropDownLine, {})
        ] }),
        isDeparmentsOpen ? headerData.categories.map((itm) => /* @__PURE__ */ jsxs("div", { onClick: () => setOpenedDepartment(openedDepartment === itm.name ? "" : itm.name), className: styles$9.departmentsLink, children: [
          /* @__PURE__ */ jsxs("div", { className: styles$9.department, children: [
            itm.name,
            " ",
            openedDepartment === itm.name ? /* @__PURE__ */ jsx(RiArrowDropDownLine, {}) : /* @__PURE__ */ jsx(RiArrowDropRightLine, {})
          ] }),
          openedDepartment === itm.name && /* @__PURE__ */ jsxs("div", { className: styles$9.departmentprojects, children: [
            itm.projects.map((pro) => /* @__PURE__ */ jsx(Link, { to: `/${itm.name}/${pro.id}`, onClick: () => setIsOpen(false), className: styles$9.departmentproject, children: pro.name }, pro.name)),
            /* @__PURE__ */ jsxs(Link, { to: `/${itm.name}`, onClick: () => setIsOpen(false), className: styles$9.departmentproject, children: [
              "All ",
              itm.name,
              " Projects"
            ] }, `${itm.name}-all`)
          ] })
        ] }, itm.name)) : null,
        isDeparmentsOpen ? /* @__PURE__ */ jsx(Link, { to: `/all`, onClick: () => setIsOpen(false), className: styles$9.departmentsLink, children: "All Sections" }, "all") : null,
        /* @__PURE__ */ jsx("li", { className: styles$9.mobilelink, children: /* @__PURE__ */ jsx(Link, { to: "#footer", onClick: () => setIsOpen(false), children: "Contact Us" }) })
      ] }) : null
    ] }),
    isDeparmentsOpen ? /* @__PURE__ */ jsx("div", { className: styles$9.backshadow, onClick: () => setIsDeparmentsOpen(false) }) : null
  ] });
};
const footer = "_footer_1g8r0_1";
const info$1 = "_info_1g8r0_14";
const contact = "_contact_1g8r0_19";
const socialmedia = "_socialmedia_1g8r0_38";
const description$2 = "_description_1g8r0_47";
const logo = "_logo_1g8r0_52";
const map = "_map_1g8r0_63";
const styles$7 = {
  footer,
  info: info$1,
  contact,
  socialmedia,
  description: description$2,
  logo,
  map
};
const iframe = "_iframe_1oz5g_1";
const styles$6 = {
  iframe
};
const Map = () => {
  const theme = useTheme();
  const greyScale = theme === "dark" ? "grayscale(100%)" : "none";
  return /* @__PURE__ */ jsx(
    "iframe",
    {
      className: styles$6.iframe,
      id: "gmap_canvas",
      src: "https://maps.google.com/maps?q=Roya%20technology&t=&z=13&ie=UTF8&iwloc=&output=embed",
      title: "Google Map",
      style: { filter: greyScale }
    }
  );
};
const Footer = () => {
  const theme = useTheme();
  const footerData = useLoaderData();
  return /* @__PURE__ */ jsxs("footer", { className: styles$7.footer, id: "footer", children: [
    /* @__PURE__ */ jsxs("div", { className: styles$7.info, children: [
      /* @__PURE__ */ jsx("div", { className: styles$7.contact, children: /* @__PURE__ */ jsxs("p", { children: [
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
      /* @__PURE__ */ jsxs("div", { className: styles$7.socialmedia, children: [
        /* @__PURE__ */ jsx("a", { href: `${footerData.contact.instagram_account}`, target: "_blank", "aria-label": "Instagram", children: /* @__PURE__ */ jsx(FaInstagram, {}) }),
        /* @__PURE__ */ jsx("a", { href: `${footerData.contact.twitter_account}`, target: "_blank", "aria-label": "X (formerly Twitter)", children: /* @__PURE__ */ jsx(FaXTwitter, {}) }),
        /* @__PURE__ */ jsx("a", { href: `${footerData.contact.facebook_account}`, target: "_blank", "aria-label": "Facebook", children: /* @__PURE__ */ jsx(FaFacebookF, {}) }),
        /* @__PURE__ */ jsx("a", { href: `${footerData.contact.linkedin_account}`, target: "_blank", "aria-label": "LinkedIn", children: /* @__PURE__ */ jsx(FaLinkedin, {}) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: styles$7.description, children: /* @__PURE__ */ jsx("p", { children: "© 2024 Roya Technology. Specializing in Process Automation, Instrumentation, and Electrical solutions. Offering comprehensive services from design to project handover with expertise in EPC projects across Egypt." }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: styles$7.logo, children: /* @__PURE__ */ jsx("img", { width: 70, height: 85, src: `${theme === "dark" ? "/svgs/white-logo.svg" : "/svgs/black-logo.svg"}`, alt: "Roya technology logo" }) }),
    /* @__PURE__ */ jsx("div", { className: styles$7.map, children: /* @__PURE__ */ jsx(Map, {}) })
  ] });
};
const BACKEND_URL = "https://roya-technology.com";
const Server = {
  apiv1: `${BACKEND_URL}/api`,
  media: `${BACKEND_URL}`
};
async function loader$4({ request }) {
  const contact2 = await fetch(`${Server.apiv1}/contact`, { cache: "force-cache" });
  const categories = await fetch(`${Server.apiv1}/headers`, { cache: "force-cache" });
  const contactData = await contact2.json();
  const categoriesData = await categories.json();
  return json({
    requestInfo: {
      hints: getHints(request),
      path: new URL(request.url).pathname,
      userPrefs: {
        theme: getTheme(request)
      }
    },
    categories: categoriesData.categories,
    contact: contactData.contact[0]
  });
}
const action = async ({ request }) => {
  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema: ThemeFormSchema
  });
  invariantResponse(submission.status === "success", "Invalid theme received");
  const { theme, redirectTo } = submission.value;
  const responseInit = {
    headers: { "set-cookie": setTheme(theme) }
  };
  if (redirectTo) {
    return redirect(redirectTo, responseInit);
  } else {
    return json({ result: submission.reply() }, responseInit);
  }
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
const title$4 = "_title_9k5mz_20";
const description$1 = "_description_9k5mz_24";
const styles$5 = {
  section: section$1,
  cover,
  blog,
  title: title$4,
  description: description$1
};
const loader$3 = async ({ request, params, context }) => {
  const { departments: departments2, blog: blog2 } = params;
  const response = await fetch(`${Server.apiv1}/project-id/${blog2}`, { cache: "force-cache" });
  const projects = await response.json();
  if (projects.status) {
    return redirect$1("/404");
  }
  return projects.project;
};
const meta$4 = ({ data }) => {
  const project = data;
  const theme = useTheme();
  return [
    { title: project.name },
    { name: "description", content: project.description },
    { name: "theme-color", content: theme === "dark" ? "#262626" : "#fff" }
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
const cardview = "_cardview_44jjc_11";
const top = "_top_44jjc_22";
const topreverse = "_topreverse_44jjc_32";
const bot$1 = "_bot_44jjc_37";
const title$3 = "_title_44jjc_45";
const description = "_description_44jjc_55";
const linker = "_linker_44jjc_65";
const link$1 = "_link_44jjc_65";
const card$1 = "_card_44jjc_11";
const fadeIn$1 = "_fadeIn_44jjc_1";
const styles$4 = {
  cardview,
  top,
  topreverse,
  bot: bot$1,
  title: title$3,
  description,
  linker,
  link: link$1,
  card: card$1,
  fadeIn: fadeIn$1
};
const Card = ({ project, card_no }) => {
  return /* @__PURE__ */ jsxs("div", { className: `${card_no < 2 ? styles$4.cardview : styles$4.card}`, children: [
    /* @__PURE__ */ jsx("div", { className: `${card_no === 1 ? styles$4.topreverse : styles$4.top}`, children: /* @__PURE__ */ jsx("img", { src: `${Server.media}${project.image}`, alt: project.name, width: 600, height: 300 }) }),
    /* @__PURE__ */ jsxs("div", { className: styles$4.bot, children: [
      /* @__PURE__ */ jsx("div", { className: styles$4.title, children: project.name }),
      /* @__PURE__ */ jsx("div", { className: styles$4.description, children: project.description }),
      /* @__PURE__ */ jsxs(Link, { className: styles$4.linker, to: `/${project.category_name}/${project.id}`, children: [
        /* @__PURE__ */ jsx(FaNewspaper, {}),
        /* @__PURE__ */ jsx("button", { className: styles$4.link, children: "VIEW" })
      ] })
    ] })
  ] });
};
const departments$2 = "_departments_1brre_1";
const title$2 = "_title_1brre_9";
const card = "_card_1brre_14";
const styles$3 = {
  departments: departments$2,
  title: title$2,
  card
};
const loader$2 = async ({ request, params, context }) => {
  const slug = params.departments;
  const response = await fetch(`${Server.apiv1}/projects/${slug}`, { cache: "force-cache" });
  const projects = await response.json();
  if (projects.status) {
    return redirect("/404");
  }
  return projects.projects;
};
const meta$3 = () => {
  const { departments: departments2 } = useParams();
  const theme = useTheme();
  return [
    { title: departments2 },
    { name: "description", content: `${departments2} Professional solutions for Software Development, Hardware Design, Repair, and Upgrades, delivering expert services to optimize performance and meet your technology needs.` },
    { name: "theme-color", content: theme === "dark" ? "#262626" : "#fff" }
  ];
};
const departments$1 = () => {
  const { departments: departments2 } = useParams();
  const projects = useLoaderData();
  return /* @__PURE__ */ jsxs("section", { className: styles$3.departments, children: [
    /* @__PURE__ */ jsx("div", { className: styles$3.title, children: `${departments2} Section` }),
    /* @__PURE__ */ jsx("div", { className: styles$3.card, children: projects.map((project, idx) => /* @__PURE__ */ jsx(Card, { project, card_no: idx }, project.id)) })
  ] });
};
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: departments$1,
  loader: loader$2,
  meta: meta$3
}, Symbol.toStringTag, { value: "Module" }));
const bg = "_bg_1fh2k_1";
const view = "_view_1fh2k_1";
const container$1 = "_container_1fh2k_10";
const title$1 = "_title_1fh2k_28";
const up = "_up_1fh2k_45";
const down = "_down_1fh2k_55";
const pattern = "_pattern_1fh2k_64";
const ticker = "_ticker_1fh2k_72";
const tickeritem = "_tickeritem_1fh2k_83";
const square = "_square_1fh2k_101";
const styles$2 = {
  bg,
  view,
  container: container$1,
  "switch": "_switch_1fh2k_25",
  title: title$1,
  up,
  down,
  pattern,
  ticker,
  tickeritem,
  square
};
const section = "_section_xp2y8_29";
const swiperparent = "_swiperparent_xp2y8_34";
const activeswiper = "_activeswiper_xp2y8_44";
const content = "_content_xp2y8_49";
const fadeIn = "_fadeIn_xp2y8_1";
const head = "_head_xp2y8_55";
const title = "_title_xp2y8_55";
const fadeInWithoutBackground = "_fadeInWithoutBackground_xp2y8_1";
const info = "_info_xp2y8_58";
const fadeInWithoutBackgroundAndTranslate = "_fadeInWithoutBackgroundAndTranslate_xp2y8_1";
const path = "_path_xp2y8_62";
const swiperbody = "_swiperbody_xp2y8_66";
const image = "_image_xp2y8_70";
const link = "_link_xp2y8_130";
const icon = "_icon_xp2y8_136";
const bot = "_bot_xp2y8_140";
const swipers = "_swipers_xp2y8_146";
const prev = "_prev_xp2y8_152";
const next = "_next_xp2y8_153";
const styles$1 = {
  section,
  swiperparent,
  activeswiper,
  content,
  fadeIn,
  head,
  title,
  fadeInWithoutBackground,
  info,
  fadeInWithoutBackgroundAndTranslate,
  path,
  swiperbody,
  image,
  link,
  icon,
  bot,
  swipers,
  prev,
  next
};
const Slider = ({ slidesInfo }) => {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);
  const handleMouseEnter = () => {
    if (swiperInstance && swiperInstance.autoplay) {
      swiperInstance.autoplay.stop();
    }
  };
  const handleMouseLeave = () => {
    if (swiperInstance && swiperInstance.autoplay) {
      swiperInstance.autoplay.start();
    }
  };
  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.activeIndex);
  };
  useEffect(() => {
    const swiperEl = swiperRef.current;
    if (swiperEl) {
      swiperEl.addEventListener("mouseenter", handleMouseEnter);
      swiperEl.addEventListener("mouseleave", handleMouseLeave);
    }
    return () => {
      if (swiperEl) {
        swiperEl.removeEventListener("mouseenter", handleMouseEnter);
        swiperEl.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [swiperInstance]);
  return /* @__PURE__ */ jsxs("section", { className: styles$1.section, children: [
    /* @__PURE__ */ jsxs("div", { ref: swiperRef, children: [
      " ",
      /* @__PURE__ */ jsx(
        Swiper,
        {
          modules: [Autoplay],
          slidesPerView: "auto",
          spaceBetween: 20,
          centeredSlides: true,
          autoplay: {
            delay: 3e3,
            disableOnInteraction: false
            // Ensures interaction doesn't permanently disable autoplay
          },
          speed: 800,
          onSwiper: (swiper) => setSwiperInstance(swiper),
          onSlideChange: (swiper) => handleSlideChange(swiper),
          className: `${styles$1.swiperparent} mySwiper`,
          children: slidesInfo.map((itm, idx) => /* @__PURE__ */ jsxs(SwiperSlide, { className: `${styles$1.swiperbody} ${idx === activeIndex ? styles$1.activeswiper : ""}`, children: [
            /* @__PURE__ */ jsx("div", { className: styles$1.image, style: { backgroundImage: `url(${Server.media}${itm.image})` } }),
            /* @__PURE__ */ jsx("div", { className: styles$1.content, children: /* @__PURE__ */ jsxs("div", { className: styles$1.head, children: [
              /* @__PURE__ */ jsx("div", { className: styles$1.title, children: itm.name }),
              /* @__PURE__ */ jsx("div", { className: styles$1.info, children: itm.description }),
              /* @__PURE__ */ jsxs("div", { className: styles$1.path, children: [
                /* @__PURE__ */ jsx("div", { className: styles$1.link, children: /* @__PURE__ */ jsx(Link, { to: `/${itm.name}`, children: "SOLUTIONS" }) }),
                /* @__PURE__ */ jsxs("div", { className: styles$1.icon, children: [
                  " ",
                  /* @__PURE__ */ jsx(MdKeyboardArrowRight, {}),
                  " "
                ] })
              ] })
            ] }) })
          ] }, itm.id))
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: styles$1.swipers, children: [
      /* @__PURE__ */ jsx("div", { className: styles$1.prev, onClick: () => swiperInstance == null ? void 0 : swiperInstance.slidePrev(), children: /* @__PURE__ */ jsx(MdKeyboardArrowLeft, {}) }),
      /* @__PURE__ */ jsx("div", { className: styles$1.next, onClick: () => swiperInstance == null ? void 0 : swiperInstance.slideNext(), children: /* @__PURE__ */ jsx(MdKeyboardArrowRight, {}) })
    ] })
  ] });
};
const loader$1 = async () => {
  const response = await fetch(`${Server.apiv1}/categories`, { cache: "force-cache" });
  const sponser = await fetch(`${Server.apiv1}/logos`, { cache: "force-cache" });
  const category = await response.json();
  const sponsers = await sponser.json();
  if (category.status || sponsers.status) {
    return redirect("/404");
  }
  return json({ categories: category.categories, logos: sponsers.logos });
};
const colors = ["#632bf3", "#f122c8", "#f16022", "#9ef344", "#44d3f3"];
const meta$2 = () => {
  const theme = useTheme();
  return [
    { title: "Roya Technology" },
    { name: "description", content: "Roya Technology, an Egyptian LLC, specializes in Process Automation, Instrumentation, and Electrical solutions. We offer end-to-end automation services including design, engineering, testing, commissioning, and startup. With extensive experience in EPC projects, we manage everything from bidding to project handover, delivering professional solutions for clients and partners." },
    { name: "theme-color", content: theme === "dark" ? "#262626" : "#fff" }
  ];
};
function Index() {
  const data = useLoaderData();
  return /* @__PURE__ */ jsxs("main", { className: styles$2.container, children: [
    /* @__PURE__ */ jsx("div", { className: styles$2.slider, children: /* @__PURE__ */ jsx(Slider, { slidesInfo: data.categories }) }),
    /* @__PURE__ */ jsx("div", { className: styles$2.pattern, children: /* @__PURE__ */ jsx("img", { src: "/background/pattern.webp", alt: "Pattern" }) }),
    /* @__PURE__ */ jsx("div", { className: styles$2.sponserticker, children: /* @__PURE__ */ jsx(Ticker, { duration: 20, children: colors.map((item, index) => /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          backgroundColor: item,
          margin: "5px",
          height: "250px",
          width: "200px"
        }
      },
      index
    )) }) }),
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
  const theme = useTheme();
  return [
    { title: "Page Not Found" },
    { name: "description", content: "Error 404" },
    { name: "theme-color", content: theme === "dark" ? "#262626" : "#fff" }
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
    return redirect("/404");
  }
  return projects.projects;
};
const meta = () => {
  const theme = useTheme();
  return [
    { title: "Expert Software Development, Hardware Design, Repair & Upgrade Services" },
    { name: "description", content: "At Roya Technology, we offer a wide range of services including Software Development, Hardware Design, Repair, and System Upgrades. Our expert team provides custom software solutions, innovative hardware designs, and reliable repair services to ensure optimal performance and seamless upgrades for all your technology needs." },
    { name: "theme-color", content: theme === "dark" ? "#262626" : "#fff" }
  ];
};
const departments = () => {
  useParams();
  const projects = useLoaderData();
  return /* @__PURE__ */ jsxs("section", { className: styles$3.departments, children: [
    /* @__PURE__ */ jsx("div", { className: styles$3.title, children: `All Sections` }),
    /* @__PURE__ */ jsx("div", { className: styles$3.card, children: projects.map((project, idx) => /* @__PURE__ */ jsx(Card, { project, card_no: idx }, project.id)) })
  ] });
};
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: departments,
  loader,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-rsUcF_IA.js", "imports": ["/assets/components-D9yW67jy.js"], "css": ["/assets/entry-CBBok9zg.css"] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/root-DlEWtJQY.js", "imports": ["/assets/components-D9yW67jy.js", "/assets/theme-switch-CZ2tQNSM.js", "/assets/iconBase-CTZDJq8B.js", "/assets/index-DSIQx5V1.js", "/assets/index-qrJB7iQp.js"], "css": ["/assets/entry-CBBok9zg.css", "/assets/root-DzwdVjLT.css"] }, "routes/$departments_.$blog": { "id": "routes/$departments_.$blog", "parentId": "root", "path": ":departments/:blog", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_departments_._blog-DKSJQdhn.js", "imports": ["/assets/components-D9yW67jy.js", "/assets/server-DQ4YMZus.js", "/assets/theme-switch-CZ2tQNSM.js"], "css": ["/assets/_departments_-BiAQL__1.css"] }, "routes/$departments": { "id": "routes/$departments", "parentId": "root", "path": ":departments", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-DqPfA4OA.js", "imports": ["/assets/components-D9yW67jy.js", "/assets/departments.module-LWUG77hh.js", "/assets/theme-switch-CZ2tQNSM.js", "/assets/server-DQ4YMZus.js", "/assets/index-DSIQx5V1.js", "/assets/iconBase-CTZDJq8B.js"], "css": ["/assets/departments-CXfF6zx2.css"] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-BV42Z_GA.js", "imports": ["/assets/components-D9yW67jy.js", "/assets/index-qrJB7iQp.js", "/assets/server-DQ4YMZus.js", "/assets/theme-switch-CZ2tQNSM.js", "/assets/iconBase-CTZDJq8B.js"], "css": ["/assets/_index-Ds1treat.css"] }, "routes/404": { "id": "routes/404", "parentId": "root", "path": "404", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/404-CgOmZbXC.js", "imports": ["/assets/components-D9yW67jy.js", "/assets/theme-switch-CZ2tQNSM.js"], "css": ["/assets/404-jmy2S5q2.css"] }, "routes/all": { "id": "routes/all", "parentId": "root", "path": "all", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/all-D0l5t6Es.js", "imports": ["/assets/components-D9yW67jy.js", "/assets/departments.module-LWUG77hh.js", "/assets/theme-switch-CZ2tQNSM.js", "/assets/server-DQ4YMZus.js", "/assets/index-DSIQx5V1.js", "/assets/iconBase-CTZDJq8B.js"], "css": ["/assets/departments-CXfF6zx2.css"] } }, "url": "/assets/manifest-9f69f30e.js", "version": "9f69f30e" };
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
