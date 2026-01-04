import express from "express"
import { allowRoles, authenticate } from "../authMiddleWare/authGuard.js";
import { adminDelete, adminFind, adminUpdate, createUser, deleteUser, getAllUsers, getUserById, loginUser, updateUser } from "../controller/user_ctr.js";
import { validateRegistration } from "../authMiddleWare/validation.js";

const router = express.Router()

router.get("/admin/getAllUsers", authenticate, allowRoles("admin", "owner"), getAllUsers);
router.post("/provider/login", allowRoles("provider"), loginUser);
router.post("/admin/login", allowRoles("admin"), loginUser);
router.post("/user/login", allowRoles("user"), loginUser);
router.post("/register", validateRegistration, createUser)
router.get("/admin/:id", authenticate, allowRoles("admin"), adminFind);
router.get("/provider/:id", authenticate, allowRoles("provider"), adminFind);
router.get("/user/:id", authenticate, allowRoles("user"), getUserById);

router.put("/provider/update/:id", authenticate, allowRoles("provider"), updateUser); // update methods should use a lessstrict version of validateRegistration where only email and password are compulsory and checks if email is in the right format.
router.put("/admin/update/:id", authenticate, allowRoles("admin"), adminUpdate);
router.put("/user/update/:id", authenticate, allowRoles("user"), updateUser);
router.delete("/admin/delete/:id", authenticate, allowRoles("admin"), adminDelete);
router.delete("/provider/delete/:id", authenticate, allowRoles("provider"), deleteUser);
router.delete("/user/delete/:id", authenticate, allowRoles("user"), deleteUser);

export default router