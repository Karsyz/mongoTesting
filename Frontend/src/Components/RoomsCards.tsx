export default function Cards(props:any) {
  console.log(props.roomsData)

  return (
    <div className="w-full max-w-4xl m-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {props.roomsShown && props.roomsData.map((rdata:any) => (
        <div
          key={rdata._id}
          className="relative flex items-center space-x-6 rounded-lg border border-gray-300 bg-blue-100 px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
        >
          <div className="flex flex-row justify-center">
            <div 
            className="rounded-lg p-2 w-15 h-15 text-2xl text-gray-500" 
            style={{
              background: rdata.randColor[0],
              color: rdata.randColor[1]
            }}
            >
              {rdata.roomNumber}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <a href="#" className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              {/* <p className="text-lg font-medium text-gray-900">Room Number: {rdata.roomNumber}</p> */}
              <p className="truncate text-med text-gray-500">{rdata.vacant ? "Room is Vacant" : "Room is Occupied"}</p>
            </a>
          </div>
        </div>
        
      ))}
    </div>
  )
}
