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

function DrawerContents({ selected }) {
	// console.log(selected)
	const editform = useForm({
		initialValues: {
			name: selected?.Name,
			address: selected?.Address,
			acreage: selected?.Acreage,
			zipcode: selected?.Zip_Code,
			npu: selected?.NPU,
			district: String(selected?.Council_District),
			latitude: selected?.latitude,
			longitude: selected?.longitude,
			classification: selected?.Classification,
			description: selected?.description,
			play: selected?.Playground,
			field: selected?.Fields,
			basketball: selected?.Basketball,
			tennis: selected?.Tennis,
			pavilion: selected?.Pavilion,
			pool: selected?.Splash_pad,
			dog: selected?.Dog_park,
			skate: selected?.skate_park,
			favorite: selected?.favorite,
		},
	})

	return (
		<form onSubmit={editform.onSubmit((values) => console.log(values))}>
			<TextInput
				label='Park Name'
				placeholder={selected?.Name}
				{...editform.getInputProps('name')}
				size='xs'
			/>
			<TextInput
				label='Address'
				placeholder={selected?.Address}
				{...editform.getInputProps('address')}
				size='xs'
			/>
			<NumberInput
				label='Acreage'
				placeholder={selected?.Acreage}
				{...editform.getInputProps('acreage')}
				size='xs'
				precision={2}
			/>
			<Select
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
				placeholder={selected?.Classification}
				label='Classification'
				{...editform.getInputProps('classification')}
				clearable
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
				placeholder={selected?.NPU}
				label='Neighborhood Planning Unit'
				{...editform.getInputProps('npu')}
				clearable
				size='xs'
			/>
			<Select
				data={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']}
				placeholder={selected?.Council_District}
				label='City Council District'
				{...editform.getInputProps('district')}
				clearable
				size='xs'
			/>
			<NumberInput
				label='Zip Code'
				placeholder={selected?.Zip_Code}
				{...editform.getInputProps('zipcode')}
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
					{...editform.getInputProps('play', { type: 'checkbox' })}
					size='xs'
					checked={selected.Playground}
				/>
				<Checkbox
					label='Fields'
					{...editform.getInputProps('field', { type: 'checkbox' })}
					size='xs'
					checked={selected.Fields}
				/>
				<Checkbox
					label='Basketball'
					{...editform.getInputProps('basketball', { type: 'checkbox' })}
					size='xs'
					checked={selected.Basketball}
				/>
				<Checkbox
					label='Tennis'
					{...editform.getInputProps('tennis', { type: 'checkbox' })}
					size='xs'
					checked={selected.Tennis}
				/>
				<Checkbox
					label='Pavilion'
					{...editform.getInputProps('pavilion', { type: 'checkbox' })}
					size='xs'
					checked={selected.Pavilion}
				/>
				<Checkbox
					label='Pool / Splash Pad'
					{...editform.getInputProps('pool', { type: 'checkbox' })}
					size='xs'
					checked={selected.Splash_pad}
				/>
				<Checkbox
					label='Dog Park'
					{...editform.getInputProps('dog', { type: 'checkbox' })}
					size='xs'
					checked={selected.Dog_park}
				/>
				<Checkbox
					label='Skate Park'
					{...editform.getInputProps('skate', { type: 'checkbox' })}
					size='xs'
					checked={selected.skate_park}
				/>
			</div>
			<Textarea
				label='Description'
				placeholder={selected?.description}
				{...editform.getInputProps('description')}
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
				>
					Submit
				</Button>
			</div>
		</form>
	)
}

export default DrawerContents
