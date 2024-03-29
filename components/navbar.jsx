import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createStyles, Header, Container, Group, Burger, Paper, Transition, Text, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { supabase } from '../config/config'

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
    root: {
        position: 'relative',
        zIndex: 10,
        // backgroundColor: theme.colors.gray[1]

    },

    dropdown: {
        position: 'absolute',
        top: HEADER_HEIGHT,
        left: 0,
        right: 0,
        zIndex: 0,
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        borderTopWidth: 0,
        overflow: 'hidden',

        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
    },

    links: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    burger: {
        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    link: {
        display: 'block',
        lineHeight: 1,
        padding: '8px 12px',
        borderRadius: theme.radius.sm,
        textDecoration: 'none',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
        fontSize: theme.fontSizes.md,
        fontWeight: 600,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },

        [theme.fn.smallerThan('sm')]: {
            borderRadius: 0,
            padding: theme.spacing.md,
        },
    },

    linkActive: {
        '&, &:hover': {
            backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
            color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
        },
    },
}));


export function HeaderResponsive({ links })
{
    const [opened, { toggle, close }] = useDisclosure(false);
    const [active, setActive] = useState(null);
    const { classes, cx } = useStyles();

    const [user, setUser] = useState()

    useEffect(() =>
    {
        const fetchUser = async () =>
        {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            // console.log(user)
            return user
        }
        // fetchUser()
        fetchUser().then((data) =>
        {
            // console.log(data)
            setUser(data)
        })
    }, [])

    const items = links.map((link) =>
    {
        if (!user && link.label === 'Admin') {
            return
        } else {
            return (

                <Link
                    key={link.label}
                    href={link.link}
                    className={cx(classes.link, { [classes.linkActive]: active === link.link })}
                    onClick={() =>
                    {
                        setActive(link.link);
                        close()
                    }}
                >
                    {link.label}
                </Link>
            )
        }
    });

    return (
        <Header height={HEADER_HEIGHT} className={classes.root}>
            <Container className={classes.header} >
                <Link href='/' onClick={() => setActive(null)}>
                    <Text
                        color='blue'
                        sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
                        ta="center"
                        fz={30}
                        fw={700}>Atlanta Parks</Text>
                </Link>
                <Group spacing={5} className={classes.links}>
                    {items}
                    {user ? (<Button variant='outline' color='red' onClick={async () => { let { error } = await supabase.auth.signOut() }}>Logout</Button>) : ('')}
                </Group>

                <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />

                <Transition transition="pop-top-right" duration={200} mounted={opened}>
                    {(styles) => (
                        <Paper className={classes.dropdown} withBorder style={styles}>
                            {items}
                        </Paper>
                    )}
                </Transition>
            </Container>
        </Header>
    );
}