import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import Card from '../components/card'

import { supabase } from '../config/config'

export async function getStaticProps() {
	// Get the current home from the database

	let { data: parks, error } = await supabase
		.from('parks')
		.select('*')
		.eq('favorite', true)

	if (error) {
		console.log(error)
	}

	return {
		props: {
			parks,
		},
	}
}

export default function Home({ parks }) {
	return (
		<div className='pt-0 pb-8'>
			<Head>
				<title>Parks of Atlanta, Georgia</title>
				<meta name='description' content='Database of Atlanta Parks' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main className='min-h-100 pt-16 pb-0 flex-1 flex flex-col justify-center items-center'>
				<h1 className={styles.title}>
					Parks of <a>Atlanta</a>
				</h1>

				<div className='flex items-center justify-center flex-wrap max-w-2xl mb-8'>
					{parks.map((park) => (
						<Card park={park} key={park.ID} />
					))}
				</div>
			</main>

			<footer className={styles.footer}>
				<a
					href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
					target='_blank'
					rel='noopener noreferrer'
				>
					Powered by{' '}
					<span className={styles.logo}>
						<Image src='/vercel.svg' alt='Vercel Logo' width={72} height={16} />
					</span>
				</a>
			</footer>
		</div>
	)
}
