import styled from '@emotion/styled'
import { Token } from '../types'
import { FiPlusCircle } from 'react-icons/fi'
import { useSpring, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import { useState } from 'react'
import ReactModal from 'react-modal'
import Assets from './Assets'
import { InvisibleButton } from '../styles'

interface ModalProps {
  tokens: Token[]
  onSelect: (token: Token) => void
  loading: boolean
  loadMore: () => void
  canLoadMore: boolean
}

ReactModal.setAppElement('#root')

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#222222',
    border: 'none',
    borderRadius: '0.6rem',
    zIndex: 1000,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1000,
  },
}

const Icon = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 4rem;
`

const Container = styled.div`
  @media (min-width: 900px) {
    display: none;
  }
  height: 0;
`

const Content = styled.div`
  height: 70vh;
  width: 60vw;
  overflow: auto;
  display: flex;
  justify-content: center;
`

const Modal: React.FC<ModalProps> = ({
  tokens,
  onSelect,
  loadMore,
  loading,
  canLoadMore,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))
  const bind = useDrag(
    ({ down, offset: [ox, oy] }) =>
      api.start({ x: ox, y: oy, immediate: down }),
    {
      bounds: { left: -500, right: 30, top: -500, bottom: 50 },
    }
  )
  return (
    <Container>
      <animated.div {...bind()} style={{ x, y }}>
        <InvisibleButton onClick={() => setIsOpen((x) => !x)}>
          <Icon>
            <FiPlusCircle color="rgba(255, 255, 255, 0.7)" size={54} />
          </Icon>
        </InvisibleButton>
      </animated.div>
      <ReactModal
        isOpen={isOpen}
        style={modalStyles}
        onRequestClose={() => setIsOpen(false)}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
      >
        <Content>
          <Assets
            tokens={tokens}
            onSelect={(token: Token) => {
              onSelect(token)
              setIsOpen(false)
            }}
            loading={loading}
            loadMore={loadMore}
            canLoadMore={canLoadMore}
          />
        </Content>
      </ReactModal>
    </Container>
  )
}

export default Modal
