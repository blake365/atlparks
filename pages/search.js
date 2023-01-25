import { useEffect, useState } from 'react'
import { useForm } from '@mantine/form'
import {
	Checkbox,
	Select,
	TextInput,
	Title,
	Text,
	Textarea,
	Button,
	MultiSelect,
} from '@mantine/core'

import { supabase } from '../config/config'
import { NewCard } from '../components/newcard'

function addSeparator(str) {
	return str.split(' ').join(' | ')
}

const Search = () => {
	const [result, setResult] = useState([])
	const [loading, setLoading] = useState(false)

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
		setLoading(true)

		const filterByName = values.park
		const filterDescription = addSeparator(values.description)
		const filterAddress = addSeparator(values.location)
		const filterClassification = values.classification

		let query = supabase
			.from('parks')
			.select('*')
			.order('ID', { ascending: true })

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
			query = query.textSearch('Address', filterAddress)
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
		setLoading(false)
	}

	return (
		<main className='w-11/12 pb-4 mx-auto'>
			<Title align='center' mt='sm'>
				Find a Park
			</Title>
			<div className='flex flex-wrap mb-2 sm:flex-nowrap sm:h-screen'>
				{/* inputs */}
				<form
					onSubmit={form.onSubmit((values) => submitForm(values))}
					className='flex-shrink-0 mx-auto sm:w-70 w-80'
				>
					<div className='flex flex-col'>
						<Text weight='bold'>Search by:</Text>
						<TextInput
							label='Park Name'
							placeholder=''
							{...form.getInputProps('park')}
							size='xs'
						/>
						<TextInput
							label='Address'
							placeholder=''
							{...form.getInputProps('location')}
							size='xs'
						/>
						<Textarea
							label='Description'
							placeholder='search for any word or phrase'
							{...form.getInputProps('description')}
							size='xs'
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
							size='xs'
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
							size='xs'
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
							size='xs'
						/>
						<Text mt='sm'>Amenities:</Text>
						<Checkbox
							label='Playground'
							{...form.getInputProps('play', { type: 'checkbox' })}
							disabled={form.values.park}
							size='xs'
						/>
						<Checkbox
							label='Fields'
							{...form.getInputProps('field', { type: 'checkbox' })}
							disabled={form.values.park}
							size='xs'
						/>
						<Checkbox
							label='Basketball'
							{...form.getInputProps('basketball', { type: 'checkbox' })}
							disabled={form.values.park}
							size='xs'
						/>
						<Checkbox
							label='Tennis'
							{...form.getInputProps('tennis', { type: 'checkbox' })}
							disabled={form.values.park}
							size='xs'
						/>
						<Checkbox
							label='Pavilion'
							{...form.getInputProps('pavilion', { type: 'checkbox' })}
							disabled={form.values.park}
							size='xs'
						/>
						<Checkbox
							label='Pool / Splash Pad'
							{...form.getInputProps('pool', { type: 'checkbox' })}
							disabled={form.values.park}
							size='xs'
						/>
						<Checkbox
							label='Dog Park'
							{...form.getInputProps('dog', { type: 'checkbox' })}
							disabled={form.values.park}
							size='xs'
						/>
						<Checkbox
							label='Skate Park'
							{...form.getInputProps('skate', { type: 'checkbox' })}
							disabled={form.values.park}
							size='xs'
						/>
						<Button type='submit' loading={loading} mt='sm'>
							Search
						</Button>
					</div>
				</form>
				{/* outputs */}
				<div className='flex-grow overflow-y-scroll'>
					<div className='flex flex-wrap items-center justify-center mb-8'>
						{result &&
							result.map((park) => {
								return <NewCard park={park} key={park.ID} />
							})}
					</div>
				</div>
			</div>
		</main>
	)
}

export default Search
