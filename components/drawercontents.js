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

function DrawerContents({ selected }) {
	const [loading, setLoading] = useState(false)

	console.log(selected)
	const editform = useForm({
		initialValues: {
			Name: selected?.Name,
			Address: selected?.Address,
			Acreage: selected?.Acreage,
			Zip_Code: selected?.Zip_Code,
			NPU: selected?.NPU,
			Council_District: selected?.Council_District,
			latitude: selected?.latitude,
			longitude: selected?.longitude,
			Classification: selected?.Classification,
			description: selected?.description,
			Playground: selected?.Playground,
			Fields: selected?.Fields,
			Basketball: selected?.Basketball,
			Tennis: selected?.Tennis,
			Pavilion: selected?.Pavilion,
			Splash_pad: selected?.Splash_pad,
			Dog_park: selected?.Dog_park,
			Skate_park: selected?.Skate_park,
			favorite: selected?.favorite,
			website: selected?.website,
		},
	})

	const submitForm = async (values) => {
		setLoading(true)
		// values.Council_District = Number(values.Council_District)
		// console.log(selected.ID)
		// console.log(values)
		// console.log(values)
		const { status, data, error } = await supabase
			.from('parks')
			.update({
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
			.eq('ID', selected.ID)
			.select()

		console.log(error)
		console.log(status)
		// console.log(data)
		setLoading(false)
	}

	return (
		<form onSubmit={editform.onSubmit((values) => submitForm(values))}>
			<div className='h-screen pb-20 overflow-y-scroll'>
				<TextInput
					label='Park Name'
					placeholder={selected?.Name}
					{...editform.getInputProps('Name')}
					size='xs'
				/>
				<TextInput
					label='Address'
					placeholder={selected?.Address}
					{...editform.getInputProps('Address')}
					size='xs'
				/>
				<NumberInput
					label='Acreage'
					placeholder={selected?.Acreage}
					{...editform.getInputProps('Acreage')}
					size='xs'
					precision={2}
				/>
				<Select
					data={formClassifications}
					placeholder={selected?.Classification}
					label='Classification'
					{...editform.getInputProps('Classification')}
					clearable
					size='xs'
				/>
				<Select
					data={formNpus}
					placeholder={selected?.NPU}
					label='Neighborhood Planning Unit'
					{...editform.getInputProps('NPU')}
					clearable
					size='xs'
				/>
				<Select
					data={formDistricts}
					placeholder={selected?.Council_District}
					label='City Council District'
					{...editform.getInputProps('Council_District')}
					clearable
					size='xs'
				/>
				<NumberInput
					label='Zip Code'
					placeholder={selected?.Zip_Code}
					{...editform.getInputProps('Zip_Code')}
					size='xs'
				/>
				<NumberInput
					label='Latitude'
					placeholder={selected?.latitude}
					{...editform.getInputProps('latitude')}
					size='xs'
					precision={6}
				/>
				<NumberInput
					label='Longitude'
					placeholder={selected?.longitude}
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
						checked={selected?.Playground}
					/>
					<Checkbox
						label='Fields'
						{...editform.getInputProps('Fields', { type: 'checkbox' })}
						size='xs'
						checked={selected?.Fields}
					/>
					<Checkbox
						label='Basketball'
						{...editform.getInputProps('Basketball', { type: 'checkbox' })}
						size='xs'
						checked={selected?.Basketball}
					/>
					<Checkbox
						label='Tennis'
						{...editform.getInputProps('Tennis', { type: 'checkbox' })}
						size='xs'
						checked={selected?.Tennis}
					/>
					<Checkbox
						label='Pavilion'
						{...editform.getInputProps('Pavilion', { type: 'checkbox' })}
						size='xs'
						checked={selected?.Pavilion}
					/>
					<Checkbox
						label='Pool / Splash Pad'
						{...editform.getInputProps('Splash_pad', { type: 'checkbox' })}
						size='xs'
						checked={selected?.Splash_pad}
					/>
					<Checkbox
						label='Dog Park'
						{...editform.getInputProps('Dog_park', { type: 'checkbox' })}
						size='xs'
						checked={selected?.Dog_park}
					/>
					<Checkbox
						label='Skate Park'
						{...editform.getInputProps('Skate_park', { type: 'checkbox' })}
						size='xs'
						checked={selected?.Skate_park}
					/>
				</div>
				<Textarea
					label='Description'
					placeholder={selected?.description}
					{...editform.getInputProps('description')}
					size='xs'
					autosize
				/>
				<TextInput
					label='Website Address'
					placeholder={selected?.website}
					{...editform.getInputProps('website')}
					size='xs'
				/>
				<Checkbox
					mt='md'
					label='Favorite'
					description='(Shows on Home Page)'
					{...editform.getInputProps('favorite', { type: 'checkbox' })}
					size='xs'
					checked={selected.favorite}
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

export default DrawerContents
