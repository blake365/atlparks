import { Stack, Text, Card, Container, Title } from '@mantine/core'
import Link from 'next/link'
import { supabase } from '../../config/config'
import { useEffect, useState } from 'react'
import Feedback from '../../components/feedback'
import ParkTable from '../../components/parktable'

/* TODO: dashboard design:
sidebar with parks list, feedback, picture upload pages
parks list with table of park details
edit interface for existing parks
add new park form

feedback page
show list of feedbacks
set feedbacks status
delete feedbacks

picture upload interface
upload form 
*/
export default function Dashboard() {
	const [user, setUser] = useState()

	useEffect(() => {
		const fetchUser = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser()
			// console.log(user)
			return user
		}
		// fetchUser()
		fetchUser().then((data) => {
			// console.log(data)
			setUser(data)
		})
	}, [])

	return (
		<div style={{ margin: 'auto' }}>
			<Container size='xl'>
				{user ? (
					<Stack>
						<ParkTable />
						<Feedback />
					</Stack>
				) : (
					<Text>You must be an admin and log in to access this page</Text>
				)}
			</Container>
		</div>
	)
}
