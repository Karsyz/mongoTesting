import { useEffect, useState } from 'react'
import './App.css'
import Cards from './Components/Cards'

export default function App() {
  
  interface ILoadedData {
    id: string;
    name: string;
    room: number;
  }

const [loadedData, setLoadedData] = useState<ILoadedData[]>([])
const [peepsShown, setPeepsShown] = useState(false)


useEffect(() => {
  fetch('http://localhost:3100')
    .then(res => res.json())
    .then(data => {
      console.log( data.data )
      setLoadedData( data.data )
    })
},[])

// function getData() {

//   fetch('http://localhost:3100')
//   .then(res => res.json())
//   .then(data => {
//     console.log( data.data )
//     setLoadedData( data.data )
//   })
// }

const capitalize = (str : string) => str.slice(0,1).toUpperCase() + str.slice(1).toLowerCase()

  return (
    <>
      
      <button
        type="button"
        className="rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600/80"
        onClick={()=>setPeepsShown(true)}
      >
        Get the Peeps
      </button>

      <div className='w-full flex flex-row justify-center'>
        <Cards 
          loadedData={loadedData} 
          capitalize={capitalize}
          peepsShown={peepsShown} 

        />
      </div>
      
      {/* <div>
        <h1 className="text-3xl font-bold text-slate-100">There's people in these here rooms...</h1>
        { peepsShown && loadedData.map( (obj) => {
          return (
            <p key={obj.id} className="text-xl font-italic text-slate-100">{capitalize(obj.name)} is in room {obj.room}</p>
          )
        }) }
      </div> */}
    </>
  )
}
