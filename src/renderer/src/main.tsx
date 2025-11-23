import './assets/main.css'

import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import App from './App'

// scan({
//   enabled: true
// })

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <HashRouter>
    <App />
  </HashRouter>
  // </StrictMode>
)
