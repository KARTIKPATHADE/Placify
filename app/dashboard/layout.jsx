import Header from './_components/Header'

const DashboardLayout = ({children}) => {
  return (
    <div className="min-h-screen bg-transparent flex flex-col text-stone-900 dark:text-stone-100 transition-colors duration-200 relative">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 animate-in fade-in duration-300">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout
