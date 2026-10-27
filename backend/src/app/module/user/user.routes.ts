import { Router } from "express";
import { UserController } from "./user.controller";
import { createDoctorZodSchema } from "./user.validation";
import { validateRequest } from "../../middleware/validateRequest";


const router = Router();

router.post("/doctor",

    //     (req: Request, res: Response, next: NextFunction) => {

    //     const parsedResult = createDoctorZodSchema.safeParse(req.body);

    //     if (!parsedResult.success) {
    //         next(parsedResult.error)
    //     }

    //     //sanitizing the data
    //     req.body = parsedResult.data;

    //     next()

    // }, 

    validateRequest(createDoctorZodSchema),

    UserController.createDoctor);
// router.post("/create-admin", UserController.createDoctor);
// router.post("/create-superadmin", UserController.createDoctor);

export const UserRoutes = router;