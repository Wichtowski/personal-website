export const ROUTES = ["/", "/github", "/portfolio", "/articles", "/contact"];

let _direction = 1;

export function setNavDirection(d: number) {
  _direction = d;
}

export function getNavDirection(): number {
  return _direction;
}
