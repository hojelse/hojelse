import styled from 'styled-components'
import { NextPage } from "next/types"
import Link from 'next/link'
import Image from 'next/image'

const Layout: NextPage = () => {

  return <>
    <Page>
      <Box/>
    </Page>
  </>
}

const Page = styled.div`
  --gap-size: 10px;

  height: 100%;
  min-height: 100vh;
  width: 100%;
  background-color: hsl(0, 0%, 100%);
  display: grid;
  padding: var(--gap-size);
  gap: var(--gap-size);
`

const Box = styled.section`
  height: 100%;
  width: 100%;
  background-color: hsl(0, 0%, 85%);
  border-radius: 10px;
`

export default Layout