import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import Card from '../components/card'

import { supabase } from '../config/config'

export async function getStaticProps() {
	let { data: parks, error } = await supabase
		.from('parks')
		.select('*')
		.eq('favorite', true)
		.order('ID', { ascending: true })

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

			<main className='flex flex-col items-center justify-center flex-1 pt-4 pb-0 min-h-100'>
				<h1>Featured Parks</h1>
				<div className='flex flex-wrap items-center justify-center max-w-2xl mb-8'>
					{parks.map((park) => (
						<Card park={park} key={park.ID} />
					))}
				</div>
				<div>Map of all ATL park locations?</div>
			</main>

			<footer className={styles.footer}>Built by Blake</footer>
		</div>
	)
}
