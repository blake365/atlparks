import {
	TextInput,
	PasswordInput,
	Paper,
	Title,
	Container,
	Button,
} from '@mantine/core'
import { useState } from 'react'
import { useRouter } from 'next/router'

import { useForm } from '@mantine/form'

import { supabase } from '../../config/config'

export default function AdminLogin() {
	// const [email, setEmail] = useState('')
	// const [password, setPassword] = useState('')
	const router = useRouter()

	const form = useForm({
		initialValues: {
			email: '',
			password: '',
			secret: '',
		},

		validate: {
			email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
			password: (val) =>
				val.length <= 6
					? 'Password should include at least 6 characters'
					: null,
		},
	})

	const signup = async ({ email, password, secret }) => {
		if (secret === process.env.NEXT_PUBLIC_ADMIN_SECRET) {
			let { data, error } = await supabase.auth.signUp({
				email: email,
				password: password,
			})

			// console.log(data, error)
			if (error) {
				return
			} else if (data.user.aud === 'authenticated') {
				router.push('/admin/login')
			}
		}
	}

	return (
		<Container size={420} my={40}>
			<form
				onSubmit={form.onSubmit((values) => {
					signup(values)
				})}
			>
				<Paper withBorder shadow='md' p={30} mt={30} radius='md'>
					<TextInput
						required
						label='Secret'
						placeholder=''
						value={form.values.secret}
						onChange={(event) =>
							form.setFieldValue('secret', event.currentTarget.value)
						}
					/>
					<TextInput
						required
						label='Email'
						placeholder=''
						value={form.values.email}
						onChange={(event) =>
							form.setFieldValue('email', event.currentTarget.value)
						}
						error={form.errors.email && 'Invalid email'}
					/>

					<PasswordInput
						required
						label='Password'
						placeholder='Your password'
						value={form.values.password}
						onChange={(event) =>
							form.setFieldValue('password', event.currentTarget.value)
						}
						error={
							form.errors.password &&
							'Password should include at least 6 characters'
						}
					/>

					<Button fullWidth mt='xl' type='submit'>
						Sign Up
					</Button>
				</Paper>
			</form>
		</Container>
	)
}
