import { useEffect, useState } from 'react'
import './App.css'
import PeepsCards from './Components/PeepsCards'
import RoomsCards from './Components/RoomsCards'
import axios from "axios";

export default function App() {


const server = axios.create({
  baseURL: "http://localhost:3100/" 
});
  
  interface ILoadedData {
    id: string;
    name: string;
    room: number;
  }

  interface IRoomData {
    id: string;
    roomNumber: number;
    vacant: boolean;
  }

const [loadedData, setLoadedData] = useState<ILoadedData[]>([])
const [roomsData, setRoomsData] = useState<IRoomData[]>([])
const [peepsShown, setPeepsShown] = useState(true)
const [roomsShown, setRoomsShown] = useState(false)


useEffect(() => {
  fetch('http://localhost:3100')
    .then(res => res.json())
    .then(data => {
      // console.log( data.data )
      setLoadedData( data.data )
    })
},[])

// function getRandomTailwindColor() {
//   // gets a random standard tailwind color
//   const r : number = Math.floor( Math.random() * 256 ) 
//   const g : number = Math.floor( Math.random() * 256 ) 
//   const b : number = Math.floor( Math.random() * 256 ) 
//   return `rgba(${r},${g},${b},1)`
// }

function getRandomTailwindColor() {
  // gets a random standard tailwind color
  const r : number = Math.floor( Math.random() * 256 ) 
  const g : number = Math.floor( Math.random() * 256 ) 
  const b : number = Math.floor( Math.random() * 256 ) 

  // calculation for contrasting text
  const rt : number = r * 0.2126 
  const gt : number = g * 0.7152
  const bt : number = b * 0.0722

  return [`rgba(${r},${g},${b},1)`, `rgba(${rt},${gt},${bt},1)`]
}

const getAllRooms = () => {
  fetch('http://localhost:3100/rooms')
  .then(res => res.json())
  .then(data => {
    
    // add random color to object
    const roomObjects = data.data.map((e:any) => {
      let obj = e
      obj.randColor = getRandomTailwindColor()
      // console.log(obj)
      return obj
    })
    setRoomsData( roomObjects )
    // console.log( roomObjects  )
    })
}

const addARoom = async() => {
  let res = await server.post('/createRoom')
  console.log(res)
  getAllRooms()
}

const deleteARoom = async() => {
  let res = await server.delete('/deleteRoom')
  console.log(res)
  getAllRooms()
}

const capitalize = (str : string) => str.slice(0,1).toUpperCase() + str.slice(1).toLowerCase()

  return (
    <>
      <nav className='flex flex-row justify-center gap-4 m-6'>
        <button
          type="button"
          className="rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600/80"
          onClick={()=>setPeepsShown(e => !e)}
        >
          Get the Peeps
        </button>

        <button
          type="button"
          className="rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600/80"
          onClick={()=> {
            getAllRooms()
            setRoomsShown(e => !e)
          }} 
        >
          Get the Rooms
        </button>

        <button
          type="button"
          className="rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600/80"
          onClick={()=>addARoom()} 
        >
          Add a Room
        </button>

        <button
          type="button"
          className="rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600/80"
          onClick={()=>deleteARoom()} 
        >
          Delete a Room
        </button>

      </nav>

      <div className='flex flex-row justify-center'>
        <PeepsCards 
          loadedData={loadedData} 
          capitalize={capitalize}
          peepsShown={peepsShown} 
        />

      
      </div>
      <div className='flex flex-row justify-center'>
        <RoomsCards 
            roomsData={roomsData} 
            roomsShown={roomsShown} 
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
