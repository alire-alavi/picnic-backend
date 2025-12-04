import { IsString, IsOptional, IsUUID } from 'class-validator'

export class UpdateCategoryDto {
    @IsString()
    @IsOptional()
    name?: string

    @IsString()
    @IsOptional()
    slug?: string

    @IsUUID()
    @IsOptional()
    imageId?: string | null
}
