import styled from '@emotion/styled'

export const InvisibleButton = styled.button`
  background: none;
  color: rgba(255, 255, 255, 0.7);
  border: none;
  padding: 0;
  font: inherit;
  font-size: 1.3rem;
  cursor: pointer;
  outline: inherit;
  transition: color 0.1s;
  &:hover {
    color: white;
  }
`

export const Loading = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`
