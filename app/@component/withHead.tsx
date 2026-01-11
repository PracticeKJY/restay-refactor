import Head from "next/head"

const withHead = (Component: any, title: string, description: string) => {
  const Wrapper = (props: any) => {
    return (
      <>
        <Head>
          <title>{title}</title>
          <meta name="description" content={description} />
        </Head>

        <Component {...props} />
      </>
    )
  }

  return Wrapper
}

export default withHead
