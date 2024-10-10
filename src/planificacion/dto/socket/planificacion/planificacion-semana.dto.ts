import { IsDateString } from "class-validator";

export class PlanificacionSemanaDto {

  @IsDateString()
  inicio: string; // ej: 2024-10-07

  @IsDateString()  // ej: 2024-10-11
  fin: string;
}
