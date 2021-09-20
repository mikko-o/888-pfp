import styled from '@emotion/styled'
import ClipLoader from 'react-spinners/ClipLoader'
import { InvisibleButton, Loading } from '../styles'
import { Token as TokenInterface } from '../types'

interface AssetsProps {
  tokens: TokenInterface[]
  onSelect: (token: TokenInterface) => void
  loading: boolean
  canLoadMore: boolean
  loadMore: () => void
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 3rem;
  width: 100%;
`

const Assets: React.FC<AssetsProps> = ({
  tokens,
  onSelect,
  loadMore,
  loading,
  canLoadMore,
}) => {
  return (
    <Container>
      {tokens.length === 0 && loading ? (
        <Loading>
          <ClipLoader color="white" />
        </Loading>
      ) : (
        tokens.map((token) => (
          <InvisibleButton onClick={() => onSelect(token)}>
            <NFT key={token.id} token={token} />
          </InvisibleButton>
        ))
      )}
      {tokens.length > 0 ? (
        loading ? (
          <Loading>
            <ClipLoader color="white" />
          </Loading>
        ) : canLoadMore ? (
          <InvisibleButton onClick={() => loadMore()}>
            Load more
          </InvisibleButton>
        ) : null
      ) : null}
    </Container>
  )
}

export default Assets

interface NFTProps {
  token: TokenInterface
}

const Image = styled.img`
  border-radius: 0.2rem;
  width: 70%;
  margin: 0.7rem;
`

const NFT: React.FC<NFTProps> = ({ token }) => {
  const url = token.image_preview_url ?? token.imge_url ?? token.original_url
  if (!url) return null
  return <Image alt={token.name} src={url} />
}
