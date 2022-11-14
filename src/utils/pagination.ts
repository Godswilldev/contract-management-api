import { PaginationQueryDto } from "src/shared/global.dto";
import { PaginationMeta } from "src/shared/paginationMeta";

export class Pagination {
  constructor(private readonly paginationQueryDto: PaginationQueryDto) {}

  GetPaginationDbQuery(): { take: number; skip: number } {
    const { take, page } = this.paginationQueryDto;
    const queryParam = {
      take,
      skip: take * (page - 1),
    };

    if (!take || !page) {
      delete queryParam.take;
      delete queryParam.skip;
    }

    return queryParam;
  }

  GetPaginationResult(total: number, count: number): PaginationMeta {
    const { take, page } = this.paginationQueryDto;

    return {
      page: page ? page : 0,
      skipped: page && take ? take * (page - 1) : 0,
      count,
      total,
    };
  }
}
