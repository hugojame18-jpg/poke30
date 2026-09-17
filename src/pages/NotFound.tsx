import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-28 text-center">
      <p className="font-display text-8xl font-extrabold text-gold-400">404</p>
      <h1 className="mt-4 font-display text-3xl font-bold">Ce Pokémon s’est enfui…</h1>
      <p className="mt-2 text-slate-600">La page que vous cherchez n’existe pas ou plus.</p>
      <Link to="/" className="mt-8 inline-block rounded-full bg-ink-900 px-6 py-3 font-bold text-white hover:bg-ink-700">
        Retour à l’accueil
      </Link>
    </div>
  )
}
