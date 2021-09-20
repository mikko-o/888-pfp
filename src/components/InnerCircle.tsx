import styled from '@emotion/styled'
import { animated } from '@react-spring/web'
import { useCallback, useEffect, useRef } from 'react'
import { useSpring } from '@react-spring/core'
import { useGesture } from 'react-use-gesture'
import { Token } from '../types'
import innerCircle from '../888-maalavidaa-1-inner-circle.png'

const CircleContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Grid = styled.div`
  display: grid;
`

const Circle = styled.img`
  grid-column: 1;
  grid-row: 1;
  z-index: 100;
  width: 60vmin;
  -webkit-user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
`

const SelectedContainerOuter = styled.div`
  grid-column: 1;
  grid-row: 1;
  width: 60vmin;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const SelectedContainer = styled.div`
  width: 85%;
  height: 85%;
  border-radius: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Selected = styled.img`
  position: relative;
  height: 50vmin;
`

const Canvas = styled.canvas`
  border-radius: 100%;
  display: none;
  overflow: hidden;
`

const Download = styled.a`
  display: none;
`

interface InnerCircleProps {
  token?: Token
  setDownload: (fn: () => void) => void
}

const InnerCircle: React.FC<InnerCircleProps> = ({ token, setDownload }) => {
  const selectedUrl = token?.image_url ?? token?.original_url
  const ref = useRef(null)

  const [{ x, y, scale }, api] = useSpring(() => ({ x: 0, y: 0, scale: 1.0 }))
  const bind = useGesture(
    {
      onDrag: ({ down, delta: [dx, dy], memo = [x.get(), y.get()] }) => {
        api.start({ x: memo[0] + dx, y: memo[1] + dy, immediate: down })
      },
      onPinch: ({ delta: [dx, dy], event, memo = scale.get() }) => {
        event.preventDefault()
        const newScale = Math.max(memo + dx / 250, 0)
        api.start({ scale: newScale })
      },
    },
    {
      domTarget: ref,
      eventOptions: { passive: false },
    }
  )

  useEffect(() => {
    document.addEventListener('gesturestart', (e) => e.preventDefault())
    document.addEventListener('gesturechange', (e) => e.preventDefault())
  }, [])

  useEffect(() => {
    api.start({ x: 0, y: 0, scale: 1.0 })
  }, [token, api])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cicleRef = useRef<HTMLImageElement>(null)
  const pfpRef = useRef<HTMLImageElement>(null)
  const dlRef = useRef<HTMLAnchorElement>(null)

  const pfpToCanvasDl = useCallback(() => {
    if (
      !canvasRef.current ||
      !cicleRef.current ||
      !pfpRef.current ||
      !dlRef.current
    )
      return
    const width = cicleRef.current.width
    const height = cicleRef.current.height
    canvasRef.current.width = width
    canvasRef.current.height = height
    const context = canvasRef.current.getContext('2d')
    if (!context) return
    context.arc(
      width / 2,
      height / 2,
      width / 2 - 2,
      0,
      (2 * Math.PI * width * width) / 4
    )
    context.clip()
    let pfpWidth = pfpRef.current.getBoundingClientRect().width
    let pfpHeight = pfpRef.current.getBoundingClientRect().height
    const wstart = (width - pfpWidth) / 2 + x.get()
    const hstart = (height - pfpHeight) / 2 + y.get()
    context.drawImage(pfpRef.current, wstart, hstart, pfpWidth, pfpHeight)
    context.drawImage(cicleRef.current, 0, 0, width, height)
    dlRef.current.href = canvasRef.current
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream')
    dlRef.current.click()
  }, [x, y])

  useEffect(() => {
    setDownload(() => pfpToCanvasDl)
  }, [pfpToCanvasDl, setDownload])

  return (
    <div>
      <CircleContainer>
        <animated.div {...bind()} ref={ref} style={{ height: '100%' }}>
          <Grid>
            <Circle
              ref={cicleRef}
              src={innerCircle}
              alt="8 inner circle pfp frame by Maalavidaa"
            />
            {token ? (
              <SelectedContainerOuter>
                <SelectedContainer>
                  <animated.div style={{ x, y, scale }}>
                    <Selected
                      ref={pfpRef}
                      src={selectedUrl}
                      alt={token.name}
                      crossOrigin="anonymous"
                    />
                  </animated.div>
                </SelectedContainer>
              </SelectedContainerOuter>
            ) : null}
          </Grid>
        </animated.div>
      </CircleContainer>
      <Canvas ref={canvasRef} />
      <Download ref={dlRef} download="888-pfp.png" />
    </div>
  )
}

export default InnerCircle
