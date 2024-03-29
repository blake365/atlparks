import { useEffect, useState } from 'react'
import {
	createStyles,
	Table,
	ScrollArea,
	Title,
	ActionIcon,
	Select,
	Checkbox,
	MultiSelect,
	Button,
	Drawer,
} from '@mantine/core'
import { supabase } from '../config/config'

import { useForm } from '@mantine/form'

import { IconAlertTriangle, IconEdit, IconPhoto } from '@tabler/icons'
import DrawerContents from './drawercontents'

import { incompleteCheck } from '../utils/functions.jsx'
import Link from 'next/link'
import PhotoDrawer from './drawerphoto'
import DrawerNew from './drawernew'
import {
	formClassifications,
	formDistricts,
	formNpus,
} from '../config/formitems'

const useStyles = createStyles((theme) => ({
	header: {
		position: 'sticky',
		top: 0,
		zIndex: 5,
		backgroundColor:
			theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		transition: 'box-shadow 150ms ease',

		'&::after': {
			content: '""',
			position: 'absolute',
			left: 0,
			right: 0,
			bottom: 0,
			borderBottom: `1px solid ${
				theme.colorScheme === 'dark'
					? theme.colors.dark[3]
					: theme.colors.gray[2]
			}`,
		},
	},

	scrolled: {
		boxShadow: theme.shadows.sm,
	},
}))

// TODO:
// add filter by lack of information

export default function ParkTable() {
	const { classes, cx } = useStyles()
	const [scrolled, setScrolled] = useState(false)
	const [parks, setParks] = useState([])
	const [loading, setLoading] = useState(false)
	const [selected, setSelected] = useState(null)
	const [opened, setOpened] = useState(false)
	const [drawerType, setDrawerType] = useState('edit')

	// console.log(selected)

	const form = useForm({
		initialValues: {
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

	// const [status, setStatus] = useState('')

	// useEffect(() => {
	// 	const fetchParks = async () => {
	// 		const { data, error } = await supabase
	// 			.from('parks')
	// 			.select('*')
	// 			.order('ID', { ascending: true })
	// 		// console.log(data)
	// 		if (error) {
	// 			console.error(error)
	// 		}

	// 		return data
	// 	}

	// 	fetchParks().then((data) => {
	// 		setParks(data)
	// 	})
	// }, [])

	const submitForm = async (values) => {
		setLoading(true)

		const filterClassification = values.classification

		let query = supabase
			.from('parks')
			.select('*')
			.order('ID', { ascending: true })

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
		setParks(data)
		console.log(error)
		setLoading(false)
	}

	const updateLocations = async () => {
		setLoading(true)
		const { error } = await supabase.rpc('set_location_func')
		// console.log(data)
		console.log(error)
		setLoading(false)
	}

	const updateAlphabetical = async () => {
		setLoading(true)
		const { error } = await supabase.rpc('alphabetical_sort')
		// console.log(data)
		console.log(error)
		setLoading(false)
	}

	const rows = parks.map((row) => (
		<tr key={row.ID}>
			<td className='flex items-center h-full space-x-2 align-middle'>
				<ActionIcon
					color='green'
					variant='outline'
					size='sm'
					m='xs'
					onClick={() => {
						setSelected(row)
						setDrawerType('edit')
						setOpened(true)
					}}
				>
					<IconEdit />
				</ActionIcon>
				<ActionIcon
					color='blue'
					variant='outline'
					size='sm'
					m='xs'
					onClick={() => {
						setSelected(row)
						setDrawerType('picture')
						setOpened(true)
					}}
				>
					<IconPhoto />
				</ActionIcon>
				{incompleteCheck(row) ? (
					<IconAlertTriangle color='red' size={16} />
				) : (
					''
				)}
			</td>
			<td>
				<Link href={`/park/${row.ID}`} className='hover:underline'>
					{row.Name}
				</Link>{' '}
			</td>
			<td>{row.Address}</td>
			<td>{row.Acreage}</td>
			<td>{row.Classification}</td>
			<td>{row.NPU}</td>
			<td>{row.Council_District}</td>
			<td>{row.Zip_Code}</td>
			<td>{row.latitude}</td>
			<td>{row.longitude}</td>
		</tr>
	))

	return (
		<div>
			<Drawer
				opened={opened}
				onClose={() => setOpened(false)}
				title={selected ? `Edit ${selected?.Name}` : 'Add A New Park'}
				padding='xl'
				size='xl'
				position='right'
			>
				{drawerType === 'edit' ? (
					<DrawerContents selected={selected} />
				) : drawerType === 'new' ? (
					<DrawerNew />
				) : (
					<PhotoDrawer selected={selected} />
				)}
			</Drawer>
			<Title order={2}>Park Data Management</Title>
			<div>
				<form onSubmit={form.onSubmit((values) => submitForm(values))}>
					<div className='flex flex-col'>
						<div className='flex flex-row justify-start flex-shrink space-x-2'>
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
						</div>
						<div className='flex flex-row flex-wrap items-end space-x-2 space-y-1'>
							<Checkbox
								label='Playground'
								{...form.getInputProps('play', { type: 'checkbox' })}
								size='xs'
							/>
							<Checkbox
								label='Fields'
								{...form.getInputProps('field', { type: 'checkbox' })}
								size='xs'
							/>
							<Checkbox
								label='Basketball'
								{...form.getInputProps('basketball', { type: 'checkbox' })}
								size='xs'
							/>
							<Checkbox
								label='Tennis'
								{...form.getInputProps('tennis', { type: 'checkbox' })}
								size='xs'
							/>
							<Checkbox
								label='Pavilion'
								{...form.getInputProps('pavilion', { type: 'checkbox' })}
								size='xs'
							/>
							<Checkbox
								label='Pool / Splash Pad'
								{...form.getInputProps('pool', { type: 'checkbox' })}
								size='xs'
							/>
							<Checkbox
								label='Dog Park'
								{...form.getInputProps('dog', { type: 'checkbox' })}
								size='xs'
							/>
							<Checkbox
								label='Skate Park'
								{...form.getInputProps('skate', { type: 'checkbox' })}
								size='xs'
							/>
						</div>
					</div>
					<div>
						<Button type='submit' loading={loading} mt='sm'>
							Filter / Refresh
						</Button>
						<Button
							color='green'
							mx='sm'
							onClick={() => {
								setDrawerType('new')
								setOpened(true)
							}}
						>
							Add Park
						</Button>
						<Button
							color='orange'
							mx='sm'
							onClick={() => {
								updateLocations()
							}}
							loading={loading}
						>
							SQL:Update Locations
						</Button>
						<Button
							color='orange'
							mx='sm'
							onClick={() => {
								updateAlphabetical()
							}}
							loading={loading}
						>
							SQL:Update Alphabetical List
						</Button>
					</div>
				</form>
			</div>

			<ScrollArea
				sx={{ minHeight: 300, height: 700 }}
				onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
			>
				<Table sx={{ minWidth: 700 }}>
					<thead
						className={cx(classes.header, { [classes.scrolled]: scrolled })}
					>
						<tr>
							<th>Edit</th>
							<th>Name</th>
							<th>Address</th>
							<th>Acres</th>
							<th>Class</th>
							<th>NPU</th>
							<th>District</th>
							<th>Zip Code</th>
							<th>Latitude</th>
							<th>Longitude</th>
						</tr>
					</thead>
					<tbody>{rows}</tbody>
				</Table>
			</ScrollArea>
		</div>
	)
}
