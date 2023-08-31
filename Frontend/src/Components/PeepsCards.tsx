export default function Cards(props:any) {
  return (
    <div className="w-full max-w-4xl m-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {props.peepsShown && props.loadedData.map((data:any) => (
        <div
          key={data.id}
          className="relative flex items-center space-x-6 rounded-lg border border-gray-300 bg-blue-100 px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
        >
          <div className="flex-shrink-0">
            <img className="h-20 w-20 rounded-full" src={`https://robohash.org/${data.name}?set=set2`} alt="" />
          </div>

          <div className="min-w-0 flex-1">
            <a href="#" className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-lg font-medium text-gray-900">Name: {props.capitalize(data.name)}</p>
              <p className="truncate text-med text-gray-500">Room: {data.room }</p>
            </a>
          </div>
        </div>
        
      ))}
    </div>
  )
}
