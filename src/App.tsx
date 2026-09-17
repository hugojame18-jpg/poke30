import { Suspense, lazy, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductPage from './pages/ProductPage'
import NotFound from './pages/NotFound'
const Checkout = lazy(() => import('./pages/Checkout'))
const Blog = lazy(() => import('./pages/Misc').then((m) => ({ default: m.Blog })))
const ArticlePage = lazy(() => import('./pages/Misc').then((m) => ({ default: m.ArticlePage })))
const FaqPage = lazy(() => import('./pages/Misc').then((m) => ({ default: m.FaqPage })))
const Account = lazy(() => import('./pages/Misc').then((m) => ({ default: m.Account })))
import WelcomePopup from './components/WelcomePopup'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Suspense fallback={<div className="min-h-[60vh]" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/boutique" element={<Catalog />} />
          <Route path="/boutique/:universe" element={<Catalog />} />
          <Route path="/collection-30-ans" element={<Catalog collection30 />} />
          <Route path="/produit/:slug" element={<ProductPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<ArticlePage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/commande" element={<Checkout />} />
          <Route path="/compte" element={<Account />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
      <WelcomePopup />
    </>
  )
}
