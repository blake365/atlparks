import { useState } from 'react'
import { FileButton, Button, Group, Text } from '@mantine/core'

function PictureUpload() {
	const [file, setFile] = (useState < File) | (null > null)
	return (
		<>
			<Group position='center'>
				<FileButton onChange={setFile} accept='image/png,image/jpeg,image/webp'>
					{(props) => <Button {...props}>Upload image</Button>}
				</FileButton>
			</Group>
			{file && (
				<Text size='sm' align='center' mt='sm'>
					Picked file: {file.name}
				</Text>
			)}
		</>
	)
}

export default PictureUpload
