import { IsDateString, IsNotEmpty, IsOptional } from "class-validator";


export class GetInfoCharts {
    @IsDateString()
    @IsNotEmpty()
    fechaInicio: string;

    @IsDateString()
    @IsOptional()
    fechaFin?: string;
}