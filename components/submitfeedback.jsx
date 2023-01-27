import { useState, createRef } from 'react';
import { Button, Collapse, Text, Title, Textarea, Stack } from '@mantine/core';
import { supabase } from '../config/config';

import ReCAPTCHA from 'react-google-recaptcha';

//TODO: show user that it submitted successfully 

const SubmitFeedback = ({ id }) =>
{
    const [opened, setOpened] = useState(false);
    const [feedback, setFeedback] = useState('')
    const [loading, setLoading] = useState(false)
    const [validated, setValidated] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    async function onChange(captchaCode)
    {
        // console.log('Captcha value:', captchaCode);
        if (!captchaCode) {
            return;
        }
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                body: JSON.stringify({ captcha: captchaCode }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                // If the response is ok than show the success alert
                setValidated(true)
            } else {
                // Else throw an error with the message returned
                // from the API
                const error = await response.json();
                throw new Error(error.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async (e) =>
    {
        e.preventDefault()
        console.log('submit')
        setLoading(true)
        if (feedback !== '') {
            const { data, error } = await supabase
                .from('feedback')
                .insert([
                    { park: parseInt(id), text: feedback, status: 'new' },
                ])
            console.error(error)
        }
        setSubmitted(true)
        setLoading(false)
    }

    return (
        <>
            <Button onClick={() => setOpened((o) => !o)} variant='solid' my='sm'>
                Contribute Information
            </Button>

            <Collapse in={opened} m='sm'>
                <Title order={3}>Contribute information about this park</Title>
                <Text>Use the text box below to tell us something you know about this park or correct any bad information. All feedback is appreciated.</Text>
                <form onSubmit={handleSubmit}>
                    <Stack pt='sm'>
                        <Textarea
                            placeholder="Type Here"
                            radius="xs"
                            size="md"
                            minRows={4}
                            value={feedback}
                            onChange={event => setFeedback(event.target.value)}
                        />
                        <ReCAPTCHA
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE}
                            onChange={onChange}
                        />
                        <Button type='submit' w='50%' m='auto' loading={loading} disabled={!validated || submitted}>Submit</Button>
                    </Stack>
                </form>
            </Collapse>
        </>
    )
}


export default SubmitFeedback