import {
	Select,
	Checkbox,
	Button,
	TextInput,
	NumberInput,
	Textarea,
} from '@mantine/core'

import { supabase } from '../config/config'

import { useForm } from '@mantine/form'
import { useState } from 'react'
import {
	formClassifications,
	formDistricts,
	formNpus,
} from '../config/formitems'

// TODO:
// also create associated row in likes table, could be tricky...

function DrawerNew() {
	const [loading, setLoading] = useState(false)

	const editform = useForm({
		initialValues: {
			Name: '',
			Address: '',
			Acreage: 0,
			Zip_Code: 0,
			NPU: '',
			Council_District: 0,
			latitude: 0,
			longitude: 0,
			Classification: '',
			description: '',
			Playground: false,
			Fields: false,
			Basketball: false,
			Tennis: false,
			Pavilion: false,
			Splash_pad: false,
			Dog_park: false,
			Skate_park: false,
			favorite: false,
			website: '',
		},
	})

	const submitForm = async (values) => {
		setLoading(true)
		values.Council_District = Number(values.Council_District)
		// console.log(selected.ID)
		console.log(values)
		const { status, data, error } = await supabase
			.from('parks')
			.insert({
				Name: values.Name,
				Address: values.Address,
				Acreage: values.Acreage,
				Classification: values.Classification,
				NPU: values.NPU,
				Council_District: values.Council_District,
				Zip_Code: values.Zip_Code,
				latitude: values.latitude,
				longitude: values.longitude,
				Playground: values.Playground,
				Splash_pad: values.Splash_pad,
				Dog_park: values.Dog_park,
				Fields: values.Fields,
				Basketball: values.Basketball,
				Tennis: values.Tennis,
				Pavilion: values.Pavilion,
				Skate_park: values.Skate_park,
				description: values.description,
				favorite: values.favorite,
				website: values.website,
			})
			.select()

		const { status1, error1 } = await supabase.from('likes').insert({
			Name: data[0].Name,
			ID: data[0].ID,
			likes: 0,
		})

		console.log(error)
		// console.log(status)
		// console.log(data)
		console.log(status1)
		console.log(error1)

		setLoading(false)
	}

	return (
		<form
			onSubmit={editform.onSubmit((values) => {
				console.log(values)
				submitForm(values)
			})}
		>
			<div className='h-screen pb-20 overflow-y-scroll'>
				<TextInput
					label='Park Name'
					placeholder={editform.Name}
					{...editform.getInputProps('Name')}
					size='xs'
					required
				/>
				<TextInput
					label='Address'
					placeholder={editform.Address}
					{...editform.getInputProps('Address')}
					size='xs'
				/>
				<NumberInput
					label='Acreage'
					placeholder={editform.Acreage}
					{...editform.getInputProps('Acreage')}
					size='xs'
					precision={2}
				/>
				<Select
					data={formClassifications}
					label='Classification'
					placeholder={editform.Classification}
					{...editform.getInputProps('Classification')}
					clearable
					size='xs'
				/>
				<Select
					data={formNpus}
					label='Neighborhood Planning Unit'
					placeholder={editform.NPU}
					{...editform.getInputProps('NPU')}
					clearable
					size='xs'
				/>
				<Select
					data={formDistricts}
					label='City Council District'
					placeholder={editform.Council_District}
					{...editform.getInputProps('Council_District')}
					clearable
					size='xs'
				/>
				<NumberInput
					label='Zip Code'
					placeholder={editform.Zip_Code}
					{...editform.getInputProps('Zip_Code')}
					size='xs'
				/>
				<NumberInput
					label='Latitude'
					placeholder={editform.latitude}
					{...editform.getInputProps('latitude')}
					size='xs'
					precision={6}
				/>
				<NumberInput
					label='Longitude'
					placeholder={editform.longitude}
					{...editform.getInputProps('longitude')}
					size='xs'
					precision={6}
				/>
				<div></div>
				<div className='flex flex-row flex-wrap p-2 justify-evenly'>
					<Checkbox
						label='Playground'
						{...editform.getInputProps('Playground', { type: 'checkbox' })}
						size='xs'
					/>
					<Checkbox
						label='Fields'
						{...editform.getInputProps('Fields', { type: 'checkbox' })}
						size='xs'
					/>
					<Checkbox
						label='Basketball'
						{...editform.getInputProps('Basketball', { type: 'checkbox' })}
						size='xs'
					/>
					<Checkbox
						label='Tennis'
						{...editform.getInputProps('Tennis', { type: 'checkbox' })}
						size='xs'
					/>
					<Checkbox
						label='Pavilion'
						{...editform.getInputProps('Pavilion', { type: 'checkbox' })}
						size='xs'
					/>
					<Checkbox
						label='Pool / Splash Pad'
						{...editform.getInputProps('Splash_pad', { type: 'checkbox' })}
						size='xs'
					/>
					<Checkbox
						label='Dog Park'
						{...editform.getInputProps('Dog_park', { type: 'checkbox' })}
						size='xs'
					/>
					<Checkbox
						label='Skate Park'
						{...editform.getInputProps('Skate_park', { type: 'checkbox' })}
						size='xs'
					/>
				</div>
				<Textarea
					label='Description'
					{...editform.getInputProps('description')}
					size='xs'
					autosize
				/>
				<TextInput
					label='Website Address'
					{...editform.getInputProps('website')}
					size='xs'
				/>
				<Checkbox
					mt='md'
					label='Favorite'
					description='(Shows on Home Page)'
					{...editform.getInputProps('favorite', { type: 'checkbox' })}
					size='xs'
				/>
				<div className='flex flex-row justify-center '>
					<Button
						className='w-auto px-2 my-2 text-white bg-blue-500 rounded-md hover:bg-blue-600'
						type='submit'
						loading={loading}
					>
						Submit
					</Button>
				</div>
			</div>
		</form>
	)
}

export default DrawerNew
