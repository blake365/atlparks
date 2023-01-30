import { Button, FileButton, Text, List } from '@mantine/core'

import { supabase } from '../config/config'
import Image from 'next/image'

import { useForm } from '@mantine/form'
import { useEffect, useState } from 'react'

// show already added photos
// upload photo button

function PhotoDrawer({ selected }) {
	const [loading, setLoading] = useState(false)
	const [pictures, setPictures] = useState([])

	const [file, setFile] = useState(null)

	const handleFileChange = (e) => {
		setFile(e.target.files[0])
	}
	// console.log(selected.ID)
	const fetchPictures = async () => {
		let { data: pictures, errors } = await supabase
			.from('pictures')
			.select()
			.eq('park_id', parseInt(selected.ID))
		console.log(errors)
		return pictures
	}

	useEffect(() => {
		fetchPictures().then((data) => setPictures(data))
	}, [])

	const handleFormSubmit = async (e) => {
		setLoading(true)
		e.preventDefault()

		console.log(file)
		// Upload the file to Supabase storage
		const response = await supabase.storage
			.from('parkpics')
			.upload(`${file.name}`, file, {
				cacheControl: '3600',
				upsert: false,
			})

		console.log(response)
		// Handle the response from the API
		if (!response.data) {
			console.error('Failed to upload photo', response.error)
			setLoading(false)

			return
		}
		// Extract the file URL from the response
		const fileUrl =
			'https://yzniefgixzvancbnfqbi.supabase.co/storage/v1/object/public/parkpics/' +
			file.name

		// Send a request to Supabase API to create a new record
		const result = await supabase
			.from('pictures')
			.insert({ url: fileUrl, park_id: selected.ID })

		// Handle the result from the API
		if (result.error) {
			console.error('Failed to create a record', result.error)
		} else {
			console.log('Record created successfully', result.data)
		}

		fetchPictures().then((data) => setPictures(data))
		setLoading(false)
	}

	return (
		<div className='overflow-y-scroll'>
			<Text>Park Photos</Text>
			<form onSubmit={handleFormSubmit}>
				<input type='file' onChange={handleFileChange} />
				<Button loading={loading} type='submit'>
					Upload
				</Button>
			</form>
			<div className='flex flex-row flex-wrap m-2 space-x-2 space-y-2'>
				{pictures.length > 0 ? '' : <div>Pictures have not been added.</div>}
				{pictures.map((image) => {
					return (
						<Image
							src={image.url}
							alt='default'
							width={150}
							height={150}
							key={image.id}
						/>
					)
				})}
			</div>
		</div>
	)
}

export default PhotoDrawer
