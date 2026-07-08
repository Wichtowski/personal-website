export const ROUTES = ["/", "/github", "/portfolio", "/articles", "/contact"];

let _direction = 1;

export function getRouteIndex(pathname: string): number {
  if (pathname === "/") {
    return ROUTES.indexOf("/");
  }

  if (pathname.startsWith("/github")) {
    return ROUTES.indexOf("/github");
  }

  if (pathname.startsWith("/portfolio")) {
    return ROUTES.indexOf("/portfolio");
  }

  if (pathname.startsWith("/articles") || pathname.startsWith("/blog")) {
    return ROUTES.indexOf("/articles");
  }

  if (pathname.startsWith("/contact")) {
    return ROUTES.indexOf("/contact");
  }

  return -1;
}

export function getRouteDirection(fromPathname: string, toPathname: string): number {
  const fromIndex = getRouteIndex(fromPathname);
  const toIndex = getRouteIndex(toPathname);

  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
    return _direction;
  }

  return toIndex > fromIndex ? 1 : -1;
}

export function setNavDirection(d: number) {
  _direction = d;
}

export function getNavDirection(): number {
  return _direction;
}
