import styled from '@emotion/styled'
import { useWeb3React } from '@web3-react/core'
import { FiDownload } from 'react-icons/fi'
import { InvisibleButton } from '../styles'
import ConnectWallet from './ConnectWallet'

const Container = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`

const Right = styled.header`
  display: flex;
  align-items: center;
`

const Gap = styled.div`
  width: 4rem;
`

interface HeaderProps {
  download: () => void
}

const Header: React.FC<HeaderProps> = ({ download }) => {
  const { account } = useWeb3React()
  return (
    <Container>
      <div />
      <Right>
        {account ? (
          <InvisibleButton>
            <FiDownload size={32} onClick={() => download()} />
          </InvisibleButton>
        ) : null}
        <Gap />
        <ConnectWallet />
      </Right>
    </Container>
  )
}

export default Header
