// GitHub Pages serves project sites under /<repository>, while local preview uses /.
export function publicAsset(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return path.startsWith("/") ? `${basePath}${path}` : path;
}
