import styled from 'styled-components'
import { NextPage } from "next/types"

const Layout: NextPage = () => {

  return <>
    <Page>
      <Box/>
      <BoxGrad/>
    </Page>
  </>
}

const Page = styled.div`
  --gap-size: 30px;

  height: 100%;
  min-height: 100vh;
  width: 100%;
  background-color: hsl(240, 3%, 8%);
  display: grid;
  padding: var(--gap-size);
  gap: var(--gap-size);
`

const Box = styled.section`
  height: 100%;
  width: 100%;
  background-color: hsl(240, 3%, 12%);
  border-radius: 10px;
`

const BoxGrad = styled(Box)`
  background: linear-gradient(
    hsl(307, 41%, 68%) 0% 10%,
    hsl(327, 55%, 62%) 10% 20%,
    hsl(294, 75%, 45%) 20% 40%,
    hsl(277, 85%, 45%) 40% 50%,
    hsl(260, 89%, 40%) 50% 70%,
    hsl(252, 75%, 32%) 70% 90%,
    hsl(250, 72%, 27%) 90% 0%
    );
`

export default Layout