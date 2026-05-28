import './App.css'
import { routes } from './routes'
import { RouterProvider } from 'react-router-dom'
import { LoaderProvider } from './components/Loader' // <-- YANGI QO'SHILDI

function App() {
  return (
    // Butun ilovani LoaderProvider bilan o'raymiz
    <LoaderProvider>
      <RouterProvider router={routes}/>
    </LoaderProvider>
  )
}

export default App