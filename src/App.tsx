import { AppProvider } from './context/AppContext'
import { Layout } from './components/Layout/Layout'
import './App.css'

export default function App() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  )
}
