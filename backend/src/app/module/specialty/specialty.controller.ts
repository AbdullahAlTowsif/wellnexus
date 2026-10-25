/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { SpecialtyService } from "./specialty.service";

const createSpecialty = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        const result = await SpecialtyService.createSpecialty(payload);

        res.status(201).json({
            success: true,
            message: "Specialty created successfully!",
            data: result
        });
    } catch (error: any) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Failed to create specialty",
            error: error.message
        })
    }
}

const getAllSpecialties = async (req: Request, res: Response) => {
    try {
        const specialties = await SpecialtyService.getAllSpecialties();

        res.status(201).json({
            success: true,
            message: "Specialties fetched successfully!",
            data: specialties
        });
    } catch (error: any) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Failed to create specialty",
            error: error.message
        })
    }
}

const deleteSpecialty = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await SpecialtyService.deleteSpecialty(id as string);

        res.status(200).json({
            success: true,
            message: "Specialty deleted successfully!",
            data: result
        });

    } catch (error: any) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Failed to create specialty",
            error: error.message
        })
    }
}

export const SpecialtyController = {
    createSpecialty,
    getAllSpecialties,
    deleteSpecialty
}
