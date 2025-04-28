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
import { AreaNeighbor } from "../models/AreaNeighbor";
import { AreaNeighborService } from "../services/AreaNeighborService";
import { InvalidDataError } from "../errors/InvalidDataError";
import { InvalidForeignKeyError } from "../errors/InvalidForeignKeyError";
import { AreaNeighborNotFoundError } from "../errors/AreaNeighborNotFoundError";
import { ExpressRequestWithUser } from "../middleware/authentication";

@Route("area-neighbors")
@Tags("AreaNeighbor")
export class AreaNeighborController extends Controller {
  private areaNeighborService: AreaNeighborService;

  constructor() {
    super();
    this.areaNeighborService = new AreaNeighborService();
  }

  @Get()
  public async getAreaNeighbors(
    @Query() areaId?: string
  ): Promise<AreaNeighbor[]> {
    if (areaId) {
      return this.areaNeighborService.findByAreaId(areaId);
    }
    return this.areaNeighborService.findAll();
  }

  @Get("{areaNeighborId}")
  @Response<AreaNeighborNotFoundError>(
    404,
    "Area neighbor relationship not found"
  )
  public async getAreaNeighbor(
    @Path() areaNeighborId: string
  ): Promise<AreaNeighbor> {
    try {
      return await this.areaNeighborService.findById(areaNeighborId);
    } catch (error) {
      if (error instanceof AreaNeighborNotFoundError) {
        this.setStatus(AreaNeighborNotFoundError.httpStatusCode);
        throw error;
      }
      throw error;
    }
  }

  @Post()
  @Security("jwt")
  @Response<InvalidDataError>(400, "Invalid data")
  @Response<InvalidForeignKeyError>(400, "Invalid foreign key")
  public async createAreaNeighbor(
    @Body()
    requestBody: Pick<AreaNeighbor, "areaId" | "neighborAreaId">,
    @Request() request: ExpressRequestWithUser
  ): Promise<AreaNeighbor> {
    try {
      return await this.areaNeighborService.create(requestBody, request);
    } catch (error) {
      if (error instanceof InvalidDataError) {
        this.setStatus(InvalidDataError.httpStatusCode);
        throw error;
      }
      if (error instanceof InvalidForeignKeyError) {
        this.setStatus(InvalidForeignKeyError.httpStatusCode);
        throw error;
      }
      throw error;
    }
  }

  @Put("{areaNeighborId}")
  @Security("jwt")
  @Response<AreaNeighborNotFoundError>(
    404,
    "Area neighbor relationship not found"
  )
  @Response<InvalidDataError>(400, "Invalid data")
  @Response<InvalidForeignKeyError>(400, "Invalid foreign key")
  public async updateAreaNeighbor(
    @Path() areaNeighborId: string,
    @Body()
    requestBody: Partial<Pick<AreaNeighbor, "areaId" | "neighborAreaId">>,
    @Request() request: ExpressRequestWithUser
  ): Promise<AreaNeighbor> {
    try {
      return await this.areaNeighborService.update(
        areaNeighborId,
        requestBody,
        request
      );
    } catch (error) {
      if (error instanceof AreaNeighborNotFoundError) {
        this.setStatus(AreaNeighborNotFoundError.httpStatusCode);
        throw error;
      }
      if (error instanceof InvalidDataError) {
        this.setStatus(InvalidDataError.httpStatusCode);
        throw error;
      }
      if (error instanceof InvalidForeignKeyError) {
        this.setStatus(InvalidForeignKeyError.httpStatusCode);
        throw error;
      }
      throw error;
    }
  }

  @Delete("{areaNeighborId}")
  @Security("jwt")
  @Response<AreaNeighborNotFoundError>(
    404,
    "Area neighbor relationship not found"
  )
  public async deleteAreaNeighbor(
    @Path() areaNeighborId: string
  ): Promise<void> {
    try {
      await this.areaNeighborService.delete(areaNeighborId);
      this.setStatus(204);
    } catch (error) {
      if (error instanceof AreaNeighborNotFoundError) {
        this.setStatus(AreaNeighborNotFoundError.httpStatusCode);
        throw error;
      }
      throw error;
    }
  }
}
