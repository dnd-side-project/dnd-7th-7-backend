import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateRunningRouteDto } from './create-running-route.dto';

export class UpdateRunningRouteDto extends PickType(
  PartialType(CreateRunningRouteDto),
  ['review', 'recommendedTags', 'secureTags', 'files'],
) {}
