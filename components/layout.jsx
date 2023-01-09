import { HeaderResponsive } from './navbar'
import Footer from './footer'

export default function Layout({ children })
{
    return (
        <>
            <HeaderResponsive />
            <main>{children}</main>
            <Footer />
        </>
    )
}