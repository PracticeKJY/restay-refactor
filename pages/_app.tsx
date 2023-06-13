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
        <link rel="icon" href="/restay.png" />
      </Head>
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
    </>
  )
}

export default MyApp
