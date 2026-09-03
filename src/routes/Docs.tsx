import { useEffect } from 'react'
import { Link, NavLink, Navigate, useParams } from 'react-router-dom'

import { DOC_GROUPS, DOC_PAGES, findDoc } from '../docs/pages'

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Documentation">
      {DOC_GROUPS.map((group) => (
        <div key={group} className="mb-6">
          <p className="label mb-2">{group}</p>
          <ul className="space-y-0 border-t border-rule">
            {DOC_PAGES.filter((p) => p.group === group).map((p) => (
              <li key={p.slug} className="border-b border-rule">
                <NavLink
                  to={`/docs/${p.slug}`}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    [
                      'block py-2.5 text-[0.9rem] leading-snug transition-colors',
                      isActive ? 'text-accent' : 'text-ink-soft hover:text-ink',
                    ].join(' ')
                  }
                >
                  {p.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

export function Docs() {
  const { slug } = useParams()
  const page = findDoc(slug)

  // Land on the first page when no slug is given, and send an unknown slug there too rather
  // than rendering an empty shell.
  useEffect(() => {
    if (page) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [slug, page])

  if (!page) return <Navigate to="/docs/overview" replace />

  const index = DOC_PAGES.findIndex((p) => p.slug === page.slug)
  const prev = DOC_PAGES[index - 1]
  const next = DOC_PAGES[index + 1]

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 lg:py-14">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2">
        <Link to="/" className="label hover:!text-ink">
          Roxy
        </Link>
        <span className="label !text-ink-faint">/</span>
        <Link to="/docs/overview" className="label hover:!text-ink">
          Docs
        </Link>
        <span className="label !text-ink-faint">/</span>
        <span className="label !text-accent">{page.group}</span>
      </div>

      {/* Mobile: the whole nav collapses into one disclosure rather than pushing the content
          a screen and a half down. */}
      <details className="panel mt-5 lg:hidden">
        <summary className="label cursor-pointer list-none px-4 py-3 marker:content-none">
          Browse documentation
        </summary>
        <div className="border-t border-rule px-4 pt-4 pb-1">
          <SidebarNav />
        </div>
      </details>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:mt-10 lg:grid-cols-12 lg:gap-12">
        {/* Sidebar */}
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-8">
            <SidebarNav />
          </div>
        </aside>

        {/* Content */}
        <article className="lg:col-span-6 xl:col-span-6">
          <h1 className="display text-[1.5rem] leading-tight sm:text-[1.75rem]">{page.title}</h1>
          <p className="prose-serif mt-3 text-[1rem] leading-relaxed text-ink-soft">
            {page.summary}
          </p>

          <div className="mt-10 space-y-12">
            {page.sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="display border-b border-rule pb-2 text-[0.95rem]">{s.heading}</h2>
                <div className="prose-serif mt-4 text-[0.95rem] leading-relaxed text-ink-soft">
                  {s.body}
                </div>
              </section>
            ))}
          </div>

          {/* Prev / next */}
          <div className="mt-16 grid grid-cols-1 gap-3 border-t border-rule pt-6 sm:grid-cols-2">
            {prev ? (
              <Link
                to={`/docs/${prev.slug}`}
                className="panel px-4 py-3 transition-colors hover:border-rule-strong"
              >
                <span className="label">Previous</span>
                <span className="display mt-1 block text-[0.85rem] text-ink">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                to={`/docs/${next.slug}`}
                className="panel px-4 py-3 text-right transition-colors hover:border-rule-strong sm:text-right"
              >
                <span className="label">Next</span>
                <span className="display mt-1 block text-[0.85rem] text-ink">{next.title}</span>
              </Link>
            )}
          </div>
        </article>

        {/* On this page. Hidden below xl, where it would crush the content column. */}
        <aside className="hidden xl:col-span-3 xl:block">
          <div className="sticky top-8">
            <p className="label mb-2">On this page</p>
            <ul className="space-y-0 border-t border-rule">
              {page.sections.map((s) => (
                <li key={s.id} className="border-b border-rule">
                  <a
                    href={`#${s.id}`}
                    className="block py-2 text-[0.82rem] leading-snug text-ink-muted transition-colors hover:text-accent"
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
