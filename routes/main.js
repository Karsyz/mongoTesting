const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");


// Index
router.get("/", homeController.getIndex);
router.get("/rooms", homeController.getRooms);
router.get("/vacantRooms", homeController.vacantRooms);
router.get("/occupiedRooms", homeController.occupiedRooms);

router.post("/createUser/:name", homeController.createUser);
// router.post("/createABunchOfUsers", homeController.createABunchOfUsers);
router.post("/createRoom", homeController.createRoom);

router.patch("/assignRoom/:user/:roomNum", homeController.assignRoom);
router.patch("/unassignRoom/:user", homeController.unassignRoom);
router.patch("/updateRooms", homeController.updateRooms);

module.exports = router;
