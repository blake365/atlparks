import { useEffect, useState, useRef } from 'react'
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
	NumberInput,
	Group,
	Alert,
	Divider,
} from '@mantine/core'

import { IconLocation } from '@tabler/icons'
import { supabase } from '../config/config'
import { NewCard } from '../components/newcard'
import Head from 'next/head'
import {
	formClassifications,
	formDistricts,
	formNpus,
} from '../config/formitems'

function addSeparator(str) {
	return str.split(' ').join(' | ')
}

const Search = () => {
	const [result, setResult] = useState(null)
	const [loading, setLoading] = useState(false)

	const [latitude, setLat] = useState(null)
	const [longitude, setLong] = useState(null)
	const [radius, setRadius] = useState(1)

	const resultRef = useRef(null)

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
		const storedValue = window.sessionStorage.getItem('user-form')
		if (storedValue) {
			try {
				form.setValues(JSON.parse(window.sessionStorage.getItem('user-form')))
			} catch (e) {
				console.log('Failed to parse stored value')
			}
		}
	}, [])

	useEffect(() => {
		window.sessionStorage.setItem('user-form', JSON.stringify(form.values))
	}, [form.values])

	const submitForm = async (values) => {
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
		resultRef.current.scrollIntoView({ behavior: 'smooth' })
		setLoading(false)
	}

	const handleLocationRequest = async (evt) => {
		evt.preventDefault()
		setLoading(true)
		// let radius = 1
		navigator.geolocation.getCurrentPosition((position) => {
			setLat(position.coords.latitude)
			setLong(position.coords.longitude)
		})

		if (latitude && longitude) {
			function createBoundingBox(lat, lng, miles) {
				const latDelta = milesToLatitudeDelta(miles)
				const lngDelta = milesToLongitudeDelta(miles, lat)
				return {
					north: lat + latDelta,
					south: lat - latDelta,
					east: lng + lngDelta,
					west: lng - lngDelta,
				}
			}

			function milesToLatitudeDelta(miles) {
				return miles / 69.17
			}

			function milesToLongitudeDelta(miles, lat) {
				return miles / (69.17 * Math.cos(lat))
			}

			const box = createBoundingBox(latitude, longitude, radius)
			console.log(box)

			const { data, error } = await supabase.rpc('parks_near_me', {
				lat: latitude,
				long: longitude,
				min_lat: box.south,
				min_long: box.west,
				max_lat: box.north,
				max_long: box.east,
			})
			// console.log(data)
			console.log(error)
			setResult(data)
			resultRef.current.scrollIntoView({ behavior: 'smooth' })
		}
		setLoading(false)
	}

	return (
		<main className='w-11/12 pb-4 mx-auto'>
			<Head>
				<title>Search for a Park in Atlanta, Georgia</title>
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
				/>
			</Head>
			<Title align='center' mt='sm'>
				Find a Park
			</Title>
			<div className='flex flex-wrap mb-2 sm:flex-nowrap sm:h-screen'>
				{/* inputs */}
				<form
					onSubmit={form.onSubmit((values) => submitForm(values))}
					className='mx-auto sm:flex-shrink-0 sm:w-80 w-96'
				>
					<div className='flex flex-col '>
						<Text weight='bold' mb='xs'>
							Search by:
						</Text>
						<Group spacing='xs' align='end' position='center'>
							<NumberInput
								w={130}
								min={1}
								max={5}
								step={1}
								value={radius}
								onChange={(val) => setRadius(val)}
								size='sm'
								label='radius (miles)'
							/>
							<Button
								onClick={handleLocationRequest}
								leftIcon={<IconLocation size={14} />}
								loading={loading}
							>
								Near Me
							</Button>
						</Group>
						<Divider my='sm' />
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
							data={formNpus}
							label='Neighborhood Planning Unit'
							{...form.getInputProps('npu')}
							clearable
							size='xs'
						/>
						<Select
							data={formDistricts}
							label='City Council District'
							description=''
							{...form.getInputProps('district')}
							clearable
							size='xs'
						/>
						<MultiSelect
							data={formClassifications}
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
					<div
						className='flex flex-wrap items-center justify-center mt-4 mb-8'
						ref={resultRef}
					>
						<div className='w-4/5 mx-auto'>
							{!result ? (
								<Alert color='blue' title='Explore Parks'>
									Try a combination of filters and search terms to find the
									perfect park
								</Alert>
							) : result.length === 0 ? (
								<Alert color='red' title='0 Parks Found'>
									Try a new combination of filters
								</Alert>
							) : (
								<Alert
									color='green'
									title={`${result.length} Park${
										result.length === 1 ? '' : 's'
									} Found`}
								></Alert>
							)}
						</div>
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
