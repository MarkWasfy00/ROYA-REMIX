import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'

import { useTheme } from './routes/resources/theme-switch';
import { ClientHintCheck, useHints } from './client/client-hints'
import { getTheme, setTheme, type Theme } from './utils/theme.server'
import { getHints } from './client/client-hints';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { GeneralErrorBoundary } from './components/GeneralErrorBoundry/GeneralErrorBoundry';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { parseWithZod } from '@conform-to/zod';
import { invariantResponse } from '@epic-web/invariant';
import { z } from 'zod';
import { Server } from './utils/server';

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
}

interface Categories {
  categories: Category[]
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

interface Contacts {
  contact: Contact[]
}


export async function loader({ request }: LoaderFunctionArgs) {
  const contact = await fetch(`${Server.apiv1}/contact`, { cache: "force-cache" })
  const categories = await fetch(`${Server.apiv1}/categories`, { cache: "force-cache" })
  const contactData: Contacts = await contact.json()
  const categoriesData: Categories = await categories.json()

  return json({
    requestInfo: {
      hints: getHints(request),
      userPrefs: {
        theme: getTheme(request),
      },
    },
    categories: categoriesData.categories , 
    contact: contactData.contact[0]
  });
}

const ThemeFormSchema = z.object({
  theme: z.enum(['system', 'light', 'dark']),
});


export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: ThemeFormSchema });

  invariantResponse(submission.status === 'success', 'Invalid theme received');

  const { theme } = submission.value;
  const responseInit = {
    headers: { 'set-cookie': setTheme(theme) },
  };
  return json({ result: submission.reply() }, responseInit);
}


export function Document({
  children,
  theme = 'light',
}: {
  children: React.ReactNode;
  theme?: Theme;
}) {

  return (
    <html lang="en" className={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ClientHintCheck />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const theme = useTheme();

  return (
    <Document theme={theme}>
      <Outlet />
    </Document>
  );
}


export function ErrorBoundary() {
  return (
    <Document >
      <GeneralErrorBoundary>
        <Outlet />
      </GeneralErrorBoundary>
    </Document>
  );
}