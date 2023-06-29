import { AppProps } from "next/app"
import "../styles/globals.css"
import Head from "next/head"
import { Gowun_Dodum } from "next/font/google"
import Navbar from "./@component/Header/Navbar"
import ToasterProvider from "./@provider/ToasterProvider"
import { SessionProvider } from "next-auth/react"
import Footer from "./@component/Footer/Footer"
import { Provider, createStore } from "jotai"
import { DevTools } from "jotai-devtools"
import ClientOnly from "./@component/ClientOnly"
const gowunDodum = Gowun_Dodum({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
})

const metadata = {
  title: "여행, 그리고 휴식 -Restay ",
  description: "restay homepage",
}

const customStore = createStore()

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta property="og:type" content="website" />
        <meta
          property="og:description"
          content="문득 어디로 떠나고 싶을 땐 Restay!  "
        />
        <meta property="og:url" content={"https://restay.vercel.app"} />
        <meta
          property="og:image"
          content={"https://restay.vercel.app/restay.png"}
        />
        <link rel="icon" href="/restay.png" />
      </Head>
      <ClientOnly>
        <ToasterProvider />
        <Provider store={customStore}>
          <DevTools store={customStore} />
          <SessionProvider session={session} basePath="/api/auth">
            <main className={gowunDodum.className}>
              <Navbar />
              <Component {...pageProps} />
              <Footer />
            </main>
          </SessionProvider>
        </Provider>
      </ClientOnly>
    </>
  )
}

export default MyApp
