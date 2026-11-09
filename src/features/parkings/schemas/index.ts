export { SPOT_NUMBER_MAX_LENGTH, addSpotSchema, spotSizeSchema } from "./add-spot";
export type { AddSpotFormInput, AddSpotFormOutput } from "./add-spot";
export {
  PARKING_LOT_ADDRESS_MAX_LENGTH,
  PARKING_LOT_DESCRIPTION_MAX_LENGTH,
  PARKING_LOT_NAME_MAX_LENGTH,
  createParkingLotSchema,
  latitudeSchema,
  longitudeSchema,
} from "./create-parking-lot";
export type {
  CreateParkingLotFormInput,
  CreateParkingLotFormOutput,
} from "./create-parking-lot";
export { parkingLotIdParamsSchema } from "./params";
export type { ParkingLotIdParams } from "./params";
export {
  addSpotResponseSchema,
  availableSpotsResponseSchema,
  createParkingLotResponseSchema,
  locationSchema,
  parkingLotResponseSchema,
  parkingSpotResponseSchema,
  spotStatusSchema,
  spotTypeSchema,
} from "./responses";
