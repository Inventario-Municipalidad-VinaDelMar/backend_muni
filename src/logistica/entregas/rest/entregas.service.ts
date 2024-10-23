import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateEntregasDto } from '../dto/create-entregas.dto';
import { UpdateEntregasDto } from '../dto/update-entregas.dto';
import { EntregasSocketService } from '../socket/entregas.socket.service';


@Injectable()
export class EntregasService {

  constructor(
    @Inject(forwardRef(() => EntregasSocketService))
    private readonly entregasSocketService: EntregasSocketService,
  ) { }

  create(createEntregasDto: CreateEntregasDto) {
    return 'This action adds a new entregas';
  }

  findAll() {
    return `This action returns all entregas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} entregas`;
  }

  update(id: number, updateEntregasDto: UpdateEntregasDto) {
    return `This action updates a #${id} entregas`;
  }

  remove(id: number) {
    return `This action removes a #${id} entregas`;
  }
}
