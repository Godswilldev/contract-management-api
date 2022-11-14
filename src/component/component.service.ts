import { Guard } from "src/utils/guard";
import { Injectable } from "@nestjs/common";
import { UpdateResult, Repository } from "typeorm";
import { Pagination } from "src/utils/pagination";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationQueryDto } from "src/shared/global.dto";
import { Contract } from "src/contract/models/contract.entity";
import { Component } from "src/component/models/component.entity";
import { ResponseManager, StandardResponse } from "src/utils/responseManager";
import {
  ComponentQueryDto,
  ComponentUpdateDto,
  ComponentCreationDto,
} from "src/component/models/component.dto";

@Injectable()
export class ComponentService {
  constructor(
    @InjectRepository(Contract) private readonly contractRepository: Repository<Contract>,
    @InjectRepository(Component) private readonly componentRepository: Repository<Component>,
  ) {}

  async GetAll(
    contractId: number,
    accountId: number,
    paginationQueryDto: PaginationQueryDto,
  ): Promise<StandardResponse<ComponentQueryDto[]>> {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId, accountId },
    });

    Guard.AgainstNullOrUndefined(contract, "contract");

    const pagination = new Pagination(paginationQueryDto);

    const components = await this.componentRepository.find({
      where: { contract: { id: contractId, accountId } },
      ...pagination.GetPaginationDbQuery(),
    });

    const total = await this.componentRepository.count({
      where: { contract: { id: contractId, accountId } },
    });

    return ResponseManager.StandardResponse(
      "Success",
      200,
      "Successfully Retrieved All Components",
      components,
      pagination.GetPaginationResult(total, components.length),
    );
  }

  async Get(
    contractId: number,
    accountId: number,
    componentId: number,
  ): Promise<StandardResponse<ComponentQueryDto>> {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId, accountId },
    });

    Guard.AgainstNullOrUndefined(contract, "contract");

    const component = await this.componentRepository.findOne({
      where: { id: componentId, contract: { id: contractId, accountId } },
      relations: { contract: true },
    });

    Guard.AgainstNullOrUndefined(
      component,
      "component",
      ResponseManager.NotFoundResponse(`No component with id ${componentId} was found`, {
        componentId,
      }),
    );

    return ResponseManager.StandardResponse(
      "Success",
      200,
      "Successfully Retrieved Component",
      component,
    );
  }

  async Create(
    contractId: number,
    accountId: number,
    componentCreationDto: ComponentCreationDto,
  ): Promise<StandardResponse<ComponentQueryDto>> {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId, accountId },
    });

    Guard.AgainstNullOrUndefined(contract, "contract");

    const component = this.componentRepository.create({
      ...componentCreationDto,
      contract,
    });

    const newComponent = await this.componentRepository.save(component);

    return ResponseManager.StandardResponse(
      "success",
      201,
      "Component Created Successfully",
      newComponent,
    );
  }

  async Update(
    contractId: number,
    accountId: number,
    componentId: number,
    componentUpdateDto: ComponentUpdateDto,
  ): Promise<StandardResponse<UpdateResult>> {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId, accountId },
    });

    Guard.AgainstNullOrUndefined(contract, "contract");

    const component = await this.componentRepository.findOne({
      where: { id: componentId, contract: { id: contractId, accountId } },
    });

    Guard.AgainstNullOrUndefined(
      component,
      "component",
      ResponseManager.NotFoundResponse("No component found", { componentId }),
    );

    const componentUpdate = await this.componentRepository.update(
      { id: componentId, contract: { id: contractId, accountId } },
      { ...componentUpdateDto },
    );

    return ResponseManager.StandardResponse(
      "success",
      200,
      "Component Updated Successfully",
      componentUpdate,
    );
  }

  async Delete(
    contractId: number,
    accountId: number,
    componentId: number,
  ): Promise<StandardResponse<{}>> {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId, accountId },
    });

    Guard.AgainstNullOrUndefined(contract, "contract");

    const component = await this.componentRepository.findOne({
      where: { id: componentId, contract: { id: contractId, accountId } },
      relations: { contract: true },
    });

    Guard.AgainstNullOrUndefined(
      component,
      "component",
      ResponseManager.NotFoundResponse("No component found", { componentId }),
    );

    await this.componentRepository.remove(component);

    return ResponseManager.StandardResponse("success", 204, "Component Removed", {});
  }
}
