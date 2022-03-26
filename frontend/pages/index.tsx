import Link from 'next/link'
import type { ReactElement } from 'react'
import styles from '../styles/Home.module.css'
import { ToggleDarkMode } from '../hooks/ToggleDarkMode'

export default function Page() {
  return (
    <div className={styles.grid}>
        {/* <Link href='/chat'> */}
          <a className={styles.card}>
          <h2>Documentation &rarr;</h2>
          <p>Find in-depth information about Next.js features and API.</p>
          </a>
        {/* </Link> */}

        <Link href='/login'>
          <a className={styles.card}>
          <h2>Learn &rarr;</h2>
          <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>
        </Link>

        <a
        className={styles.card}
        >
        <h2>Examples &rarr;</h2>
        <p>Discover and deploy boilerplate example Next.js projects.</p>
        </a>

        <a
        className={styles.card}
        >
        <h2>Deploy &rarr;</h2>
        <p>
            Instantly deploy your Next.js site to a public URL with Vercel.
        </p>
        </a>
      <ToggleDarkMode/>
    </div>
  )
}

// Page.getLayout = function getLayout(page: ReactElement) {
//   return (
//     <>
//       {page}
//     </>
//   )
// }
