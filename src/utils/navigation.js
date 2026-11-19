export const isNavItemActive = (pathname, item) => (
  pathname === item.path || (item.label === 'Library' && pathname.startsWith('/film/'))
)
