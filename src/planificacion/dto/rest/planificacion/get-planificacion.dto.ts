

import { IsDateString } from "class-validator";

export class GetPlanificacionDto {

    @IsDateString()
    fecha: string;
}
