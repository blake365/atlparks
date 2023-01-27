import {
	TextInput,
	PasswordInput,
	Paper,
	Title,
	Container,
	Button,
} from '@mantine/core'

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
		},

		validate: {
			email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
			password: (val) =>
				val.length <= 6
					? 'Password should include at least 6 characters'
					: null,
		},
	})

	const login = async ({ email, password }) => {
		let { data, error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password,
		})

		// console.log(data, error)
		if (error) {
			return
		} else if (data.user.aud === 'authenticated') {
			router.push('/admin/profile')
		}
	}

	return (
		<Container size={420} my={40}>
			<Title
				align='center'
				sx={(theme) => ({
					fontFamily: `Greycliff CF, ${theme.fontFamily}`,
					fontWeight: 900,
				})}
			>
				Admin Login
			</Title>
			<form
				onSubmit={form.onSubmit((values) => {
					login(values)
				})}
			>
				<Paper withBorder shadow='md' p={30} mt={30} radius='md'>
					<TextInput
						required
						label='Email'
						placeholder='hello@mantine.dev'
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
						Sign in
					</Button>
				</Paper>
			</form>
		</Container>
	)
}
