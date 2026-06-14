import Image from 'next/image'
import Link from 'next/link'

import ImageNotFound from '@/shared/assets/images/not-found.png'

export default function NotFound() {
  return (
    <div className="container not-found">
      <Image
        src={ImageNotFound}
        alt="404"
        width={500}
        height={500}
        loading="eager"
      />
      <h1 className="">404 Not Found</h1>
      <p>Could not find the requested photo.</p>
      <Link href="/">Return Home</Link>
    </div>
  )
}
