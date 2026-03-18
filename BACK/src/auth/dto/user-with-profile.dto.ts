import { Role } from '@prisma/client';
import { ProfileResponseDto } from '../../profile/dto/profile-response.dto';
import { Exclude, Expose, Transform, plainToInstance } from 'class-transformer';

@Exclude()
export class UserWithProfileDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  role: Role;

  @Expose()
  @Transform(({ obj }) => {
    if (obj.profile) {
      return plainToInstance(ProfileResponseDto, obj.profile, {
        excludeExtraneousValues: true,
      });
    }
    return undefined;
  })
  profile: ProfileResponseDto;

  @Expose()
  @Transform(({ obj }) => {
    if (obj.professions && Array.isArray(obj.professions)) {
      return obj.professions.map(
        (p: any) => p.profession?.profession_name ?? '',
      );
    }
    return [];
  })
  professions: string[];

  @Expose()
  @Transform(({ obj }) => {
    if (obj.addresses && Array.isArray(obj.addresses)) {
      return obj.addresses.map((a: any) => a.address);
    }
    return [];
  })
  addresses: {
    id: number;
    address_line_1: string;
    zip_code: string;
    city: string;
    country: string;
  }[];
}
