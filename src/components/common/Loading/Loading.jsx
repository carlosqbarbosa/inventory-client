import './Loading.css'

const Loading = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="loading-fullscreen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
    </div>
  )
}

export default Loading