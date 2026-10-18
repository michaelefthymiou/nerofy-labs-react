import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

/* Pages are prerendered at build time; hydrate them. In dev there is no
   prerendered HTML, so render from scratch. */
if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)
