import React, { useCallback, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { FiGithub } from 'react-icons/fi'
import { Token as TokenInterface } from './types'
import Modal from './components/Modal'
import Assets from './components/Assets'
import InnerCircle from './components/InnerCircle'
import Header from './components/Header'
import { useWeb3React } from '@web3-react/core'

const PageContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-rows: 4rem auto;
  background-color: #121212;
`

const Footer = styled.footer`
  display: flex;
  align-items: center;
  padding-left: 2rem;
  height: 3rem;
  background-color: #121212;
`

const Content = styled.main`
  @media (min-width: 900px) {
    width: 100vw;
    height: calc(100vh - 4rem);
    display: grid;
    grid-template-columns: 1fr 20rem;
  }
  width: 100%;
  height: calc(100vh - 4rem);
  display: flex;
  align-items: center;
  justify-content: center;
`

const AssetContainer = styled.div`
  @media (min-width: 900px) {
    display: flex;
    height: 100%;
    overflow: auto;
    flex-direction: column;
    align-items: center;
  }
  display: none;
`

const limit = 12

function App() {
  const { account } = useWeb3React()
  const [page, setPage] = useState(0)
  const [download, setDownload] = useState<() => void>(() => () => {})
  const { tokens, loading, canLoadMore } = useTokens(
    account,
    page * limit,
    limit
  )
  const [selected, setSelected] = useState<TokenInterface | undefined>(
    undefined
  )
  const onSelect = (token: TokenInterface) => {
    setSelected(token)
  }
  useEffect(() => {
    if (selected === undefined && tokens.length > 0) {
      setSelected(tokens[0])
    }
  }, [tokens, selected])

  const loadMore = useCallback(() => {
    setPage((page) => page + 1)
  }, [])

  useEffect(() => {
    setPage(0)
  }, [account])

  return (
    <div>
      <PageContainer>
        <Header download={download} />
        <Content>
          <InnerCircle token={selected} setDownload={setDownload} />
          <AssetContainer>
            <Assets
              tokens={tokens}
              onSelect={onSelect}
              loadMore={loadMore}
              canLoadMore={canLoadMore}
              loading={loading}
            />
          </AssetContainer>
        </Content>
      </PageContainer>

      {account ? (
        <Modal
          tokens={tokens}
          onSelect={onSelect}
          loadMore={loadMore}
          canLoadMore={canLoadMore}
          loading={loading}
        />
      ) : null}

      <Footer>
        <a
          href="https://github.com/mikko-o/888-pfp"
          target="_blank"
          rel="noreferrer"
        >
          <FiGithub size={22} color="rgba(255, 255, 255, 0.7)" />
        </a>
      </Footer>
    </div>
  )
}

export default App

const useTokens = (
  address: string | null | undefined,
  offset: number,
  limit: number
) => {
  const [tokens, setTokens] = useState<TokenInterface[]>([])
  const [loading, setLoading] = useState(false)
  const [canLoadMore, setCanLoadMore] = useState(true)

  useEffect(() => {
    if (!address) return
    setLoading(true)
    fetch(
      `https://api.opensea.io/api/v1/assets?owner=${address}&order_direction=desc&offset=${offset}&limit=${limit}`
    )
      .then((res) => res.json())
      .then(({ assets }) => {
        if (assets.length < limit) setCanLoadMore(false)
        setTokens((existing) => [...existing, ...assets])
      })
      .then(() => setLoading(false))
      .catch(() => setLoading(false))
  }, [address, limit, offset])

  useEffect(() => {
    setTokens([])
  }, [address])

  return { tokens, loading, canLoadMore }
}
