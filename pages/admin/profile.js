import { Stack, Text, Card } from '@mantine/core'
import Link from 'next/link'
// import { Card, Typography, Space } from '@supabase/ui'
import { supabase } from '../../config/config'
import { useEffect, useState } from 'react'

export default function Profile() {
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
			console.log(data)
			setUser(data)
		})
	}, [])

	return (
		<div style={{ maxWidth: '420px', margin: '96px auto' }}>
			<Card>
				<Stack>
					<Text>You're signed in</Text>
					<Text>Email: {user?.email}</Text>

					<Text>
						<pre>{JSON.stringify(user, null, 2)}</pre>
					</Text>
				</Stack>
			</Card>
		</div>
	)
}
