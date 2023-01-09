const Sidebar = () =>
{
    return (
        <aside className="fixed top-0 left-0 w-64 h-screen overflow-y-auto bg-gray-800">
            <div className="p-4">
                <h3 className="mb-2 text-2xl font-bold text-white">Sidebar</h3>
                <nav className="mb-4">
                    <a href="#" className="block px-4 py-2 text-gray-400 hover:text-white">Home</a>
                    <a href="#" className="block px-4 py-2 text-gray-400 hover:text-white">About</a>
                    <a href="#" className="block px-4 py-2 text-gray-400 hover:text-white">Contact</a>
                </nav>
            </div>
        </aside>
    )
}

export default Sidebar