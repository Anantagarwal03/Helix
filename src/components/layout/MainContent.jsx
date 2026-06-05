import OverviewView    from '../../views/OverviewView'
import MovieLibraryView from '../../views/MovieLibraryView'
import WhatIfView       from '../../views/WhatIfView'

const VIEWS = {
  overview:  <OverviewView />,
  library:   <MovieLibraryView />,
  simulator: <WhatIfView />,
}

const MainContent = ({ activePage }) => (
  // 21st.dev: flex-1 min-h-0, relative, overflow-y-auto, bg-background
  <main className="relative flex-1 min-w-0 h-screen overflow-y-auto" id="main-content">
    {/* Ambient background layers */}
    <div className="pointer-events-none fixed inset-0 z-0"
      style={{
        background: `
          radial-gradient(ellipse 70% 40% at 70% 10%, rgba(0,242,254,0.04) 0%, transparent 70%),
          radial-gradient(ellipse 50% 40% at 30% 90%, rgba(124,58,237,0.05) 0%, transparent 70%)
        `,
      }}
    />
    <div className="relative z-10 animate-fade-in">
      {VIEWS[activePage] ?? VIEWS.overview}
    </div>
  </main>
)

export default MainContent
