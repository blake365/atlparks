import { useRouter } from 'next/router'
import Layout from '../../components/layout'
import { supabase } from '../../config/config'
import useEmblaCarousel from 'embla-carousel-react'

import styles from './park.module.css'

export async function getStaticPaths() {
	// Get all the homes IDs from the database
	let { data: parks, error } = await supabase.from('parks').select('ID')

	// console.log(parks)

	return {
		paths: parks.map((park) => ({
			params: { id: park.toString() },
		})),
		fallback: true,
	}
}

export async function getStaticProps({ params }) {
	// console.log(params.id)
	let { data: parkData, error } = await supabase
		.from('parks')
		.select('*')
		.eq('ID', params.id)

	// let park = 'hello'
	// console.log(parkData)

	return {
		props: {
			parkData,
		},
	}
}

const Park = ({ parkData }) => {
	// const router = useRouter()
	// const { id } = router.query

	let park = null
	if (parkData) {
		park = parkData[0]
	}

	const EmblaCarousel = () => {
		const [emblaRef] = useEmblaCarousel()

		return (
			<div className={styles.embla} ref={emblaRef}>
				<div className={styles.embla__container}>
					<div className={styles.embla__slide}>Slide 1</div>
					<div className={styles.embla__slide}>Slide 2</div>
					<div className={styles.embla__slide}>Slide 3</div>
				</div>
			</div>
		)
	}

	// console.log('component', park)

	return (
		<div className='pt-0 pb-8'>
			<main className='min-h-100 pt-16 pb-0 flex-1 flex flex-col justify-center items-center'>
				{park ? (
					<div>
						<h1 className='text-3xl font-bold'>{park.Name}</h1>
						<div>
							<EmblaCarousel />
						</div>
						<div>{park.description}</div>
					</div>
				) : (
					'loading'
				)}
			</main>
		</div>
	)
}

export default Park
