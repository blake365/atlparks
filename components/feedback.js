import { useEffect, useState } from 'react'
import {
	createStyles,
	Table,
	ScrollArea,
	Title,
	ActionIcon,
	Badge,
} from '@mantine/core'
import { supabase } from '../config/config'

import { IconTrash, IconEdit } from '@tabler/icons'

const useStyles = createStyles((theme) => ({
	header: {
		position: 'sticky',
		top: 0,
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

// TODO: add link to park page, add link to edit interface
// add ability to change status
// color code by status?
// delete button functionality, add are you sure modal

const badgeColor = (status) => {
	let color = 'blue'
	switch (status) {
		case 'new':
			color = 'blue'
			break
		case 'viewed':
			color = 'yellow'
			break
		case 'added':
			color = 'green'
			break
		case 'rejected':
			color = 'red'
			break

		default:
			break
	}

	return color
}

export default function Feedback() {
	const { classes, cx } = useStyles()
	const [scrolled, setScrolled] = useState(false)
	const [feedback, setFeedback] = useState([])

	useEffect(() => {
		const fetchFeedback = async () => {
			const { data, error } = await supabase.from('feedback').select(`id, 
                park, created_at, text, status,
                parks (
                Name
                )
            `)

			// console.log(data)
			if (error) {
				console.error(error)
			}

			return data
		}

		fetchFeedback().then((data) => {
			// console.log(data)
			setFeedback(data)
		})
	}, [])

	const rows = feedback.map((row) => (
		<tr key={row.id}>
			{/* <td>{row.park}</td> */}
			<td className='flex items-center'>
				{row.parks.Name}{' '}
				<ActionIcon color='green' variant='outline' size='sm' m='xs'>
					<IconEdit />
				</ActionIcon>
			</td>
			<td>{row.created_at.split('T')[0]}</td>
			<td>{row.text}</td>
			<td>
				<Badge color={badgeColor(row.status)}>{row.status}</Badge>
			</td>
			<td className=''>
				<ActionIcon color='red' variant='outline' size='sm'>
					<IconTrash />
				</ActionIcon>
			</td>
		</tr>
	))

	return (
		<div>
			<Title order={2}>User Feedback</Title>
			<ScrollArea
				sx={{ minHeight: 300 }}
				onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
			>
				<Table sx={{ minWidth: 700 }}>
					<thead
						className={cx(classes.header, { [classes.scrolled]: scrolled })}
					>
						<tr>
							{/* <th>Park ID</th> */}
							<th>Park Name</th>
							<th>Date Created</th>
							<th>Feedback</th>
							<th>Status</th>
							<th>Delete</th>
						</tr>
					</thead>
					<tbody>{rows}</tbody>
				</Table>
			</ScrollArea>
		</div>
	)
}
