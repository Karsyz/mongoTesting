const User = require("../models/User");
const Room = require("../models/Room");

module.exports = {
  getIndex: async (req, res) => {
    try {
      let message = "Here are all of the users in the database"
      const allUsers = await User.find()
  
      const userObjs = await Promise.all( allUsers.map( async e => {  // Promise.allSettled for debugging?
        const userObject = {
          id: e._id.toString(),
          name: e.name,
          room: e.room ? ( await Room.findOne({_id: e.room}) ).roomNumber : "Room Not Assigned"
        }
        return userObject
      }))
  
      res.status(200).json({
        ok: true,
        message: message,
        data: userObjs,
      });
      
    } catch (error) {
      console.error(error)
    }
  },


  createUser: async (req, res, next) => {
    const name = req.params.name
    
    // check if name exists already
    const nameExists = await User.findOne({name: name}) != null
    if( nameExists ) {
      return res.status(409).json({
        ok: false,
        message: `Username ${name} already exists.`,
    });
    }
    
    const user = new User({
      name: name,
      room: '',
    });
  
    const newSavedUser = await user.save()

    res.status(200).json({
        ok: true,
        message: `Username ${name} has been created in the database.`,
        data: newSavedUser,
    });
  },
  

  createRoom: async (req, res, next) => {
    // get array of existing rooms and sort high to low
    const existingRooms = await Room.find()
    console.log(existingRooms)
    const nextRoomNumber = existingRooms.length > 0 ? existingRooms.map(e => e.roomNumber).sort((a,b) => b - a )[0] + 1 : 101
    console.log(nextRoomNumber)

    const room = new Room({
      roomNumber: nextRoomNumber,
      vacant: true,
    });

    const newSavedRoom = await room.save()

    res.status(200).json({
      ok: true,
      message: `Room ${nextRoomNumber} has been created in the database.`,
      data: newSavedRoom,
  });
  },

  deleteRoom: async (req, res, next) => {
    // const roomNum = Number(req.params.roomNum)
    const existingRooms = await Room.find()
    const highestRoomNum = existingRooms.map(e => e.roomNumber).sort((a,b) => b - a )[0]
    const room = await Room.findOne({roomNumber: highestRoomNum})
    
    
    // unassign if assigned
    const userInRoom = await User.findOne({room: room.id})
    if(userInRoom) {
      userInRoom.room = ""
      await userInRoom.save()
    }
    console.log(userInRoom)
    
    
    // delete room from db
    const deletedRoom = await Room.findOneAndDelete({roomNumber: highestRoomNum})

    res.status(200).json({
      ok: true,
      message: `Room ${highestRoomNum} has been deleted in the database.`,
      data: deletedRoom,
    });
  },


  getRooms: async (req, res) => {
    let sayhello = "Here are all of the rooms in the database"
    const allRooms = await Room.find()
    // console.log(allRooms)

    res.status(200).json({
      ok: true,
      message: sayhello,
      data: allRooms,

    });
  },

  

  vacantRooms: async (req, res) => {
    try {
      const vacantRooms = await Room.find({vacant: true})

      res.status(200).json({
        ok: true,
        message: "Here are all of the vacant rooms",
        data: vacantRooms
      });
      
    } catch (error) {
      console.error(error)
    }
  }, 


  occupiedRooms: async (req, res) => {
    try {
      const occupiedRooms = await Room.find({vacant: false})

      res.status(200).json({
        ok: true,
        message: "Here are all of the occupied rooms",
        data: occupiedRooms
      });
      
    } catch (error) {
      console.error(error)
    }
  }, 

  // adds vacant property to object in Room collection
  updateRooms: async (req, res) => {
    try {
      const roomsWithoutVacantProp = await Room.find({vacant:{$exists: false}})
      
      const updated = Promise.allSettled( roomsWithoutVacantProp.map( async e => {
        return await Room.findByIdAndUpdate(e._id, {vacant: true}, {new: true})
      }))

      console.log(updated)

      res.status(200).json({
        ok: true,
        message: 'Added vacant prop to object in Room collection without the prop',
        data: updated
      });

    } catch (error) {
      console.error(error)
    }
  },

  assignRoom: async (req, res) => {

    async function getRandomVacantRoom() {
      // get vacant rooms
      const vacantRooms = await Room.find({vacant: true})
      // return random room from vacant rooms
      return vacantRooms[ Math.floor( Math.random() * (vacantRooms.length - 1) ) ].roomNumber 
    }

    try {
      const userName = req.params.user
      let roomNum
      
      if (req.params.roomNum !== 'random') {
        // check if desired room number is vacant
        const isVacant = ( await Room.findOne({roomNumber: Number(req.params.roomNum)}) ).vacant
        if (isVacant){
          roomNum = Number(req.params.roomNum)
        }else {
          return res.status(409).json({
            message: "The room is not vacant",
            });
        }
      }else {
        roomNum = await getRandomVacantRoom()
      }

      const roomId = ( await Room.findOne({roomNumber: roomNum}) )._id.toString()
      let message = `You have assigned ${roomNum} to ${userName}.`
      await User.findOneAndUpdate({name: userName}, {room: roomId})
      await Room.findOneAndUpdate({roomNumber: roomNum}, {vacant: false})
  
      res.status(200).json({
        ok: true,
        message: message,
        data: { 
          user: await User.findOne({name: userName}),
          room: await Room.findOne({roomNumber: roomNum}),
        }
      });
      
    } catch (error) {
      console.error(error)
    }
  },

  
  unassignRoom: async (req, res) => {
    try {
      // get the current user object
      const user = await User.findOne({name: req.params.user})
      // get the room object
      const roomId = user.room
      // get the room number
      const roomNum = ( await Room.findOne({_id: roomId}) ).roomNumber
      
      // set user room to "Room Not Assigned"
      await User.findOneAndUpdate({_id: user.id}, {room: ''})
      // set room vacant to true
      await Room.findOneAndUpdate({_id: roomId}, {vacant: true})

      console.log(user.name)
      let message = `You have unassigned room ${roomNum} for ${user.name} and ${roomNum} is set to vacant.`

      res.status(200).json({
        ok: true,
        message: message,
        data: { 
          user: await User.findOne({_id: user.id}),
          room: await Room.findOne({_id: roomId}),
        }
      });
      
    } catch (error) {
      console.error(error)
    }
  },


};