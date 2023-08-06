import WithAction from './NavBar.tsx';
import { Global, css } from "@emotion/react";
import "@fontsource/space-mono/400.css";
import "@fontsource/space-mono/700.css";

function App() {

  return (
    <div className='App'>
      <Global
        styles={css`
          body {
            font-family: 'Space Mono', sans-serif;
          }
        `}
      />
      <WithAction />
    </div>
  )
}

export default App
