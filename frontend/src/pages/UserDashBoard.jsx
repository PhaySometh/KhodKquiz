import NavBarDashBoard from "../components/NavBarDashBoard"

export default function UserDashBoard(){
    return(
        <>
            <section className="flex h-full">
                {<NavBarDashBoard/>}
                <div className="w-full " >
                    <header className="relative z-10 px-5 flex flex-col justify-center items-end w-full h-12 border-b-1 border-gray-200 shadow-[0_2px_5 px_#7b7b7b]">
                    <button>
                        <svg className="border-1 rounded p-1 size-8 text-blue-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
                        </svg>
                    </button>
                    </header>

                    <div className="relative z-1 w-full flex flex-col items-center h-1/4 justify-center border-b-1"style={{backgroundColor : '#fcf1d8',borderColor: '#edaf00'}}>

                        <h3 className="text-3xl text-blue-950 font-semibold ">What are you learning today?</h3>

                        <label className="bg-white px-3 py-2 flex rounded-[20px] w-1/2 justify-between border-1 mt-5" style={{borderColor:'#4d2700'}}>
                            <svg  className="size-6 text-blue-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>

                            <input className="text-blue-950 w-full outline-none ml-2" placeholder="search for any languege"></input>

                            <svg className="size-6 text-blue-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
                            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>

                        </label>

                        
                    </div>
                </div>
            </section>
            
        
        </>
    )
}