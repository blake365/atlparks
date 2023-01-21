import { createStyles, Overlay, Container, Title, Button, Text } from '@mantine/core';

const useStyles = createStyles((theme) => ({
    hero: {
        position: 'relative',
        backgroundImage:
            "url('/hero.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%'
    },

    container: {
        height: 600,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        paddingBottom: theme.spacing.xl * 6,
        zIndex: 1,
        position: 'relative',

        [theme.fn.smallerThan('sm')]: {
            height: 500,
            paddingBottom: theme.spacing.xl * 3,
        },
    },

    title: {
        color: theme.white,
        fontSize: 60,
        fontWeight: 900,
        lineHeight: 1.1,

        [theme.fn.smallerThan('sm')]: {
            fontSize: 40,
            lineHeight: 1.2,
        },

        [theme.fn.smallerThan('xs')]: {
            fontSize: 28,
            lineHeight: 1.3,
        },
    },

    description: {
        color: theme.white,
        maxWidth: 600,

        [theme.fn.smallerThan('sm')]: {
            maxWidth: '100%',
            fontSize: theme.fontSizes.sm,
        },
    },

    control: {
        marginTop: theme.spacing.xl * 1.25,

        [theme.fn.smallerThan('sm')]: {
            width: '100%',
        },
    },
}));

export function HeroContentLeft()
{
    const { classes } = useStyles();

    return (
        <div className={classes.hero}>
            <Overlay
                gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
                opacity={1}
                zIndex={0}
            />
            <Container className={classes.container}>
                <Title className={classes.title}>Atlanta Parks Database</Title>
                <Text className={classes.description} size="xl" mt="xl">
                    Atlanta is home to so many great parks. Find the perfect spot to relax, enjoy nature, swim, run, shoot hoops, walk your dog, or experience any of the other great outdoor amenities the parks have to offer.
                </Text>

                <Button variant="gradient" size="md" radius="sm" className={classes.control}>
                    Find A Park
                </Button>
            </Container>
        </div>
    );
}