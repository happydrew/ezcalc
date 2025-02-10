import type { AppProps } from 'next/app'
import { type ReactElement } from 'react'
import Script from 'next/script';
import Head from 'next/head';
import '../style.css';

export default function App({ Component, pageProps }: AppProps): ReactElement {
  // useEffect(() => {
  //   document.documentElement.classList.add('dark')
  // }, []);

  return (<>
    <Head>
      <meta name="saashub-verification" content="zm6rcf35ll2n" />
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4907197973761221"
        crossOrigin="anonymous"></script>
    </Head >

    {/* Google tag (gtag.js)  */}
    <Script async src="https://www.googletagmanager.com/gtag/js?id=G-54K88LRQBS"
      strategy='afterInteractive'>
    </Script>
    <Script>
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-54K88LRQBS');
      `}
    </Script>

    <Component {...pageProps} />
  </>)
}
