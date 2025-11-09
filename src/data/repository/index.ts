import BaseRepository from "./BaseRepository";
import { AddVehicleRepository } from "./AddVehicleRepository";

const CombinedRepository = AddVehicleRepository(BaseRepository);
const repository = new CombinedRepository();

export default repository;
