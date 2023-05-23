import { AppProps } from "next/app"
import { RecoilRoot } from "recoil"
import "../styles/globals.css"
import Head from "next/head"
import { Gowun_Dodum } from "next/font/google"

const gowunDodum = Gowun_Dodum({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
})

const metadata = {
  title: "여행, 그리고 휴식 -Restay ",
  description: "restay homepage",
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/restay.png" />
      </Head>
      <main className={gowunDodum.className}>
        <RecoilRoot>
          <Component {...pageProps} />
        </RecoilRoot>
      </main>
    </>
  )
}

export default MyApp
