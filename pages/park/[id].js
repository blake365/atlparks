import { useRouter } from 'next/router'
import Layout from '../../components/layout'
import { supabase } from '../../config/config'

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
	console.log(params.id)
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
	const router = useRouter()
	const { id } = router.query

	let park = null
	if (parkData) {
		park = parkData[0]
	}

	console.log('component', park)

	return (
		<div>
			<p>Park Id: {id}</p>
			{park ? <p>Park Name: {park.Name}</p> : 'loading'}
		</div>
	)
}

export default Park
