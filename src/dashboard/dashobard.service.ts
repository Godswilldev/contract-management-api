import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Contract } from "src/contract/models/contract.entity";
import { ResponseManager, StandardResponse } from "src/utils/responseManager";
import {
  ContractAmountsPerHolderNameDto,
  ContractsPerHolderNameDto,
} from "src/dashboard/models/dashboard.dto";

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Contract) private readonly contractRepository: Repository<Contract>,
  ) {}

  async GetAmmountPerHolderName(
    accountId: number,
  ): Promise<StandardResponse<ContractAmountsPerHolderNameDto[]>> {
    const contracts = await this.contractRepository.find({
      where: { accountId },
      relations: {
        components: { amount: true },
      },
    });

    const result: ContractAmountsPerHolderNameDto[] = [];

    for (const contract of contracts) {
      const existing = result.find((x) => x.holderName === contract.intendedAccountHolder);

      if (existing) {
        existing.amount += contract.components.reduce((acc, cur) => acc + cur.amount, 0);
      } else {
        result.push({
          holderName: contract.intendedAccountHolder,
          amount: contract.components.reduce((acc, cur) => acc + cur.amount, 0),
        });
      }
    }

    return ResponseManager.StandardResponse("success", 200, "results found", result);
  }

  async GetContractsPerHolderName(
    accountId: number,
  ): Promise<StandardResponse<ContractsPerHolderNameDto[]>> {
    const contracts = await this.contractRepository.find({
      where: { accountId },
      relations: {
        components: { amount: true },
      },
    });

    const result: ContractsPerHolderNameDto[] = [];

    for (const contract of contracts) {
      const existing = result.find((x) => x.holderName === contract.intendedAccountHolder);

      if (existing) {
        existing.count++;
      } else {
        result.push({
          holderName: contract.intendedAccountHolder,
          count: 1,
        });
      }
    }

    return ResponseManager.StandardResponse("success", 200, "Contracts found", result);
  }
}
