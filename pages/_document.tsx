import { Html, Head, Main, NextScript } from "next/document"
import Script from "next/script"

const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.KAKAO_JS_KEY}&autoload=false`

export default function Document() {
  return (
    <Html lang="ko-KR">
      <Head />
      <body>
        <Main />
        <Script src={KAKAO_SDK_URL} strategy="beforeInteractive"></Script>
        <NextScript />
      </body>
    </Html>
  )
}
