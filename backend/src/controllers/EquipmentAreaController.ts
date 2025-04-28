import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Route,
  Path,
  Tags,
  Put,
  Query,
  Response,
  Request,
  Security,
} from "tsoa";
import { EquipmentArea } from "../models/EquipmentArea";
import { EquipmentAreaService } from "../services/EquipmentAreaService";
import { ApiError } from "../utils/ApiError";
import { ExpressRequestWithUser } from "../middleware/authentication";
import { UpdateResult } from "typeorm";

@Route("equipment-areas")
@Tags("EquipmentArea")
export class EquipmentAreaController extends Controller {
  private equipmentAreaService: EquipmentAreaService;

  constructor() {
    super();
    this.equipmentAreaService = new EquipmentAreaService();
  }

  @Get()
  public async getEquipmentAreas(
    @Query() equipmentId?: string,
    @Query() areaId?: string
  ): Promise<EquipmentArea[]> {
    if (equipmentId) {
      return this.equipmentAreaService.findByEquipmentId(equipmentId);
    }

    if (areaId) {
      return this.equipmentAreaService.findByAreaId(areaId);
    }

    return this.equipmentAreaService.findAll();
  }

  @Get("{equipmentAreaId}")
  @Response<ApiError>(404, "Equipment area relationship not found")
  public async getEquipmentArea(
    @Path() equipmentAreaId: string
  ): Promise<EquipmentArea> {
    try {
      return await this.equipmentAreaService.findById(equipmentAreaId);
    } catch (error) {
      if (error instanceof ApiError) {
        this.setStatus(error.status);
        throw error;
      }
      throw error;
    }
  }

  @Post()
  @Security("jwt")
  @Response<ApiError>(400, "Invalid data")
  @Response<ApiError>(409, "Conflict")
  @Response<ApiError>(401, "Unauthorized")
  public async createEquipmentArea(
    @Body()
    requestBody: Pick<EquipmentArea, "equipmentId" | "areaId">,
    @Request() request: ExpressRequestWithUser
  ): Promise<EquipmentArea> {
    try {
      return await this.equipmentAreaService.create(requestBody, request);
    } catch (error) {
      if (error instanceof ApiError) {
        this.setStatus(error.status);
        throw error;
      }
      throw error;
    }
  }

  @Put("{equipmentAreaId}")
  @Security("jwt")
  @Response<ApiError>(404, "Equipment area relationship not found")
  @Response<ApiError>(400, "Invalid data")
  @Response<ApiError>(409, "Conflict")
  @Response<ApiError>(401, "Unauthorized")
  public async updateEquipmentArea(
    @Path() equipmentAreaId: string,
    @Body()
    requestBody: Partial<Pick<EquipmentArea, "equipmentId" | "areaId">>,
    @Request() request: ExpressRequestWithUser
  ): Promise<EquipmentArea> {
    try {
      return await this.equipmentAreaService.update(
        equipmentAreaId,
        requestBody,
        request
      );
    } catch (error) {
      if (error instanceof ApiError) {
        this.setStatus(error.status);
        throw error;
      }
      throw error;
    }
  }

  @Delete("{equipmentAreaId}")
  @Response<ApiError>(404, "Equipment area relationship not found")
  @Response<ApiError>(400, "Cannot remove the last area from an equipment")
  public async deleteEquipmentArea(
    @Path() equipmentAreaId: string
  ): Promise<UpdateResult> {
    try {
      return await this.equipmentAreaService.delete(equipmentAreaId);
    } catch (error) {
      if (error instanceof ApiError) {
        this.setStatus(error.status);
        throw error;
      }
      throw error;
    }
  }
}
