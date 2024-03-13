import styled from 'styled-components'
import { Button, Heading, Text, LogoIcon } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import Link from 'next/link'

const StyledNotFound = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  justify-content: center;
`
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  gap: 10px; /* Adjust the gap between buttons as needed */
`;
const ComingSoon = () => {
  const { t } = useTranslation()

  return (
    <Page>
      
        
        
        <ButtonContainer>
          <Link href="/swap" passHref>
            <Button as="a" scale="sm">
              {t('Open App')}
            </Button>
          </Link>
          <Link href="/burn" passHref>
            <Button as="a" scale="sm">
              {t('Burn')}
            </Button>
          </Link>
          <Link href="https://info.dextop.pro/" passHref>
            <Button as="a" scale="sm">
              {t('Info')}
            </Button>
          </Link>
        </ButtonContainer>
<br></br>
        <iframe
          src="https://info.dextop.pro/"
          title="Example iframe"
          width="100%"
          height="1000"
          style={{
            border: '3px solid green', 
            borderRadius: '10px', 
          }}
        ></iframe>


      
    </Page>
  )
}

export default ComingSoon
