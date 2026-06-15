const SCROLL_TO_TOP_THRESHOLD_VIEWPORTS = 1.5

type ScrollToTarget = Pick<Window, 'scrollTo'>

export function shouldShowScrollToTop(
  scrollY: number,
  viewportHeight: number,
): boolean {
  return scrollY > viewportHeight * SCROLL_TO_TOP_THRESHOLD_VIEWPORTS
}

export function scrollToPageTop(target: ScrollToTarget = window): void {
  target.scrollTo({ top: 0, behavior: 'smooth' })
}
