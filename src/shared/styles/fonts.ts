import {Be_Vietnam_Pro, Outfit} from 'next/font/google'

export const fontVietnam = Be_Vietnam_Pro({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-vietnam'
})

export const fontOutfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit'
})