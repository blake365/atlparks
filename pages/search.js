import { useEffect, useState } from 'react'
import { useForm } from '@mantine/form'
import {
	Checkbox,
	Group,
	Select,
	TextInput,
	Title,
	Text,
	Textarea,
	Button,
	Stack,
	MultiSelect,
} from '@mantine/core'

import { supabase } from '../config/config'
import { NewCard } from '../components/newcard'

function addSeparator(str) {
	return str.split(' ').join(' | ')
}

const Search = () => {
	const [result, setResult] = useState([])

	const form = useForm({
		initialValues: {
			park: '',
			location: '',
			description: '',
			npu: '',
			district: '',
			classification: '',
			play: false,
			field: false,
			basketball: false,
			tennis: false,
			pavilion: false,
			pool: false,
			dog: false,
			skate: false,
		},
	})

	useEffect(() => {
		const storedValue = window.localStorage.getItem('user-form')
		if (storedValue) {
			try {
				form.setValues(JSON.parse(window.localStorage.getItem('user-form')))
			} catch (e) {
				console.log('Failed to parse stored value')
			}
		}
	}, [])

	useEffect(() => {
		window.localStorage.setItem('user-form', JSON.stringify(form.values))
	}, [form.values])

	const submitForm = async (values) => {
		// create search statement
		// start loading
		// if nothing provided, don't search
		// if a park name is provided, ignore all other fields, set them to false, only search by name
		// if a description is provided, use full text search, apply separator
		// if an address is provided, use full text search, apply separator
		// if classification provided, add to search parameters
		// if npu or district is added, add to search parameters

		const filterByName = values.park
		const filterDescription = addSeparator(values.description)
		const filterAddress = addSeparator(values.location)
		const filterClassification = values.classification

		let query = supabase.from('parks').select('*')

		if (filterByName) {
			query = query.textSearch('Name', filterByName)
			const { data, error } = await query
			setResult(data)
			console.log(error)
		} else if (filterDescription) {
			query = query.textSearch('fts', filterDescription)
			const { data, error } = await query
			setResult(data)
			console.log(error)
		} else if (filterAddress) {
			query = query.textSearch('fts', filterAddress)
			const { data, error } = await query
			setResult(data)
			console.log(error)
		}

		if (filterClassification.length > 0) {
			query = query.in('Classification', filterClassification)
		}
		if (values.npu) {
			query = query.eq('NPU', values.npu)
		}
		if (values.district) {
			query = query.eq('Council_District', parseInt(values.district))
		}

		if (values.play) {
			query = query.is('Playground', true)
		}
		if (values.field) {
			query = query.is('Fields', true)
		}
		if (values.basketball) {
			query = query.is('Basketball', true)
		}
		if (values.tennis) {
			query = query.is('Tennis', true)
		}
		if (values.pavilion) {
			query = query.is('Pavilion', true)
		}
		if (values.pool) {
			query = query.is('Splash_pad', true)
		}
		if (values.dog) {
			query = query.is('Dog_park', true)
		}
		if (values.skate) {
			query = query.is('Skate_park', true)
		}

		const { data, error } = await query
		setResult(data)
		console.log(error)
	}

	return (
		<main className='flex flex-col items-center justify-center flex-1 w-11/12 pb-4 mx-auto min-h-100'>
			<Title>Find a Park</Title>
			<Group>
				{/* inputs */}
				<form onSubmit={form.onSubmit((values) => submitForm(values))}>
					<Stack style={{ width: 250 }} spacing='xs'>
						<Title order={3}>Search by:</Title>
						<TextInput
							label='Park Name'
							placeholder=''
							{...form.getInputProps('park')}
						/>
						<TextInput
							label='Address'
							placeholder=''
							{...form.getInputProps('location')}
						/>
						<Textarea
							label='Description'
							placeholder='search for any word or phrase'
							{...form.getInputProps('description')}
						/>
						<Select
							data={[
								'A',
								'B',
								'C',
								'D',
								'E',
								'F',
								'G',
								'H',
								'I',
								'J',
								'K',
								'L',
								'M',
								'N',
								'O',
								'P',
								'Q',
								'R',
								'S',
								'T',
								'V',
								'W',
								'X',
								'Y',
								'Z',
							]}
							label='Neighborhood Planning Unit'
							{...form.getInputProps('npu')}
							clearable
						/>
						<Select
							data={[
								'1',
								'2',
								'3',
								'4',
								'5',
								'6',
								'7',
								'8',
								'9',
								'10',
								'11',
								'12',
							]}
							label='City Council District'
							description=''
							{...form.getInputProps('district')}
							clearable
						/>
						<MultiSelect
							data={[
								'Nature Preserve',
								'Regional',
								'Neighborhood',
								'Community',
								'Playlot',
								'Greenspot',
								'Trail',
								'Plaza',
								'Park in Holding',
							]}
							label='Park Classification'
							description=''
							{...form.getInputProps('classification')}
							clearable
						/>
						<Text>Amenities:</Text>
						<Checkbox
							label='Playground'
							{...form.getInputProps('play', { type: 'checkbox' })}
							disabled={form.values.park}
						/>
						<Checkbox
							label='Fields'
							{...form.getInputProps('field', { type: 'checkbox' })}
							disabled={form.values.park}
						/>
						<Checkbox
							label='Basketball'
							{...form.getInputProps('basketball', { type: 'checkbox' })}
							disabled={form.values.park}
						/>
						<Checkbox
							label='Tennis'
							{...form.getInputProps('tennis', { type: 'checkbox' })}
							disabled={form.values.park}
						/>
						<Checkbox
							label='Pavilion'
							{...form.getInputProps('pavilion', { type: 'checkbox' })}
							disabled={form.values.park}
						/>
						<Checkbox
							label='Pool / Splash Pad'
							{...form.getInputProps('pool', { type: 'checkbox' })}
							disabled={form.values.park}
						/>
						<Checkbox
							label='Dog Park'
							{...form.getInputProps('dog', { type: 'checkbox' })}
							disabled={form.values.park}
						/>
						<Checkbox
							label='Skate Park'
							{...form.getInputProps('skate', { type: 'checkbox' })}
							disabled={form.values.park}
						/>
						<Button type='submit'>Search</Button>
					</Stack>
				</form>
				{/* outputs */}
				<div className='flex flex-wrap max-w-[960px] mb-8'>
					{result &&
						result.map((park) => {
							return <NewCard park={park} />
						})}
				</div>
			</Group>
		</main>
	)
}

export default Search
