import styled from '@emotion/styled'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'

const injected = new InjectedConnector({ supportedChainIds: [1] })

const Button = styled.button`
  background: none;
  color: rgba(255, 255, 255, 0.7);
  border: none;
  padding-right: 6vw;
  font: inherit;
  font-size: 1.4rem;
  cursor: pointer;
  outline: inherit;
  transition: color 0.1s;
  &:hover {
    color: white;
  }
`

const Account = styled.div`
  color: white;
  opacity: 0.8;
  font: inherit;
  font-size: 1.4rem;
  padding-right: 3rem;
`

const formatAccount = (acc?: string) =>
  acc
    ? `${acc.substring(0, 2)}${acc.substring(2, 4).toUpperCase()}...${acc
        .substring(acc.length - 4, acc.length)
        .toUpperCase()}`
    : ''

const ConnectWallet: React.FC = () => {
  const { activate, account } = useWeb3React()
  return (
    <div>
      {account ? (
        <Account>{formatAccount(account)}</Account>
      ) : (
        <Button onClick={() => activate(injected)}>Connect</Button>
      )}
    </div>
  )
}

export default ConnectWallet
