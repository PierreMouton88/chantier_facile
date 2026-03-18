import { Role } from '@prisma/client';
import { Exclude, Expose, Transform, plainToInstance } from 'class-transformer';
import { ProfileResponseDto } from '../../profile/dto/profile-response.dto';

@Exclude()
export class CompanySearchResultDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  role: Role;

  @Expose()
  @Transform(({ obj }) => {
    if (obj.profile) {
      const profile = plainToInstance(ProfileResponseDto, obj.profile, {
        excludeExtraneousValues: true,
      });
      const { is_newbie: _is_newbie, ...rest } = profile as any;
      return rest;
    }
    return undefined;
  })
  profile: Omit<ProfileResponseDto, 'is_newbie'>;

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
